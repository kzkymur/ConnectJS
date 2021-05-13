import { Reducer } from 'redux';
import Action, { ActionTypes } from './actionTypes';
import { ConnectionType } from './types';
import NodeType from './nodeTypes';
import ReverseActionBranch, { OperationTypes } from './reverseActionBranch';
import Engine from './engine';

export interface State {
  nodes: NodeType[];
  nodeLatestId: number;
  connectionLatestId: number;
  connections: ConnectionType[];
  reverseActionBranch: ReverseActionBranch;
  curving: number;
  engines: Engine[];
}
export const initialState: State = {
  nodes: [],
  nodeLatestId: 0,
  connectionLatestId: 0,
  connections: [],
  reverseActionBranch: new ReverseActionBranch(),
  curving: 0.5,
  engines: [],
};

const reducer: Reducer<State, Action> = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case ActionTypes.add: {
      let latestId = state.nodeLatestId;
      let node = { ...action.payload.node };
      if (node.id === -1) {
        latestId++;
        node.id = latestId;
        node.name = 'node' + String(latestId);
      }
      state = {
        ...state,
        nodeLatestId: latestId,
        nodes: [ ...state.nodes, node ],
      };
      break;
    }
    case ActionTypes.delete: {
      const deletednode = state.nodes.filter(n => n.id === action.payload.id)[0];
      if (deletednode === undefined) return state;
      state = {
        ...state,
        nodes: state.nodes.filter(n => n.id !== action.payload.id),
      };
      break;
    }

    case ActionTypes.update: {
      const oldnode = state.nodes.filter(n => n.id === action.payload.node.id)[0];
      if (oldnode === undefined) return state;
      state = {
        ...state,
        nodes: state.nodes.map(c => c.id === action.payload.node.id ? action.payload.node : c),
      };
      break;
    }
    case ActionTypes.updateName: {
      const oldnode = state.nodes.filter(n => n.id === action.payload.id)[0];
      if (oldnode === undefined) return state;
      state = {
        ...state,
        nodes: state.nodes.map(c => c.id === action.payload.id ? {
          ...c,
          name: action.payload.name,
        } : c),
      };
      break;
    }
    case ActionTypes.updateSize: {
      const oldnode = state.nodes.filter(n => n.id === action.payload.id)[0];
      if (oldnode === undefined) return state;
      state = {
        ...state,
        nodes: state.nodes.map(n => n.id === action.payload.id ? {
          ...n,
          width: action.payload.width,
          height: action.payload.height,
        } : n),
      };
      break;
    }
    case ActionTypes.updatePos: {
      const oldnode = state.nodes.filter(n => n.id === action.payload.id)[0];
      if (oldnode === undefined) return state;
      state = {
        ...state,
        nodes: state.nodes.map(n => n.id === action.payload.id ? {
          ...n,
          top: action.payload.top,
          left: action.payload.left,
        } : n),
      };
      break;
    }

    case ActionTypes.addSocket: {
      state = {
        ...state,
        nodes: state.nodes.map(n => n.id === action.payload.nodeId ? {
          ...n,
          inputsLatestId: action.payload.isInput ? n.inputsLatestId + 1 : n.inputsLatestId,
          inputs: action.payload.isInput ? [...n.inputs, {
            id: n.inputsLatestId + 1,
            type: action.payload.type,
            name: action.payload.type,
            counterId: -1,
          }] : n.inputs,
          outputsLatestId: !action.payload.isInput ? n.outputsLatestId + 1 : n.outputsLatestId,
          outputs: !action.payload.isInput ? [...n.outputs, {
            id: n.outputsLatestId + 1,
            type: action.payload.type,
            name: action.payload.type,
            counterId: -1,
          }] : n.outputs,
        } : n),
      };
      break;
    }
    case ActionTypes.deleteSocket: {
      state = {
        ...state,
        nodes: state.nodes.map(n => n.id === action.payload.nodeId ? {
          ...n,
          inputs: action.payload.isInput ? n.inputs.filter(i => i.id !== action.payload.id) : n.inputs,
          outputs: !action.payload.isInput ? n.outputs.filter(o => o.id !== action.payload.id) : n.outputs,
        } : n),
      };
      break;
    }

    case ActionTypes.addConnection: {
      let latestId = state.connectionLatestId;
      let connection = { ...action.payload.connection, }
      if (connection.id === -1) {
        latestId++;
        connection.id = latestId;
      }
      state = {
        ...state,
        connections: [ ...state.connections, connection ],
        connectionLatestId: latestId,
      }
      break;
    }
    case ActionTypes.deleteConnection: {
      const deletedConnection = state.connections.filter(c => c.id === action.payload.id)[0];
      if (deletedConnection === undefined) return state;
      state = {
        ...state,
        connections: state.connections.filter(c => c.id !== action.payload.id),
      };
      break;
    }
    case ActionTypes.updateConnectionPos: {
      const oldCon = state.connections.filter(c => c.id === action.payload.id)[0];
      if (oldCon === undefined) return state;
      state = {
        ...state,
        connections: state.connections.map(c => c.id === action.payload.id ? {
          ...c,
          s: action.payload.s,
          e: action.payload.e,
        } : c),
      };
      break;
    }
    case ActionTypes.updateConnectionType: {
      const oldCon = state.connections.filter(c => c.id === action.payload.id)[0];
      if (oldCon === undefined) return state;
      state = {
        ...state,
        connections: state.connections.map(c => c.id === action.payload.id ? {
          ...c,
          type: action.payload.type,
        } : c),
      };
      break;
    }

    case ActionTypes.branch: {
      state = { ...state, reverseActionBranch: state.reverseActionBranch.operate(OperationTypes.branch) };
      break;
    }
    case ActionTypes.forward: {
      state = { ...state, reverseActionBranch: state.reverseActionBranch.operate(OperationTypes.forward) };
      break;
    }
    case ActionTypes.backward: {
      state = { ...state, reverseActionBranch: state.reverseActionBranch.operate(OperationTypes.backward) };
      break;
    }
    case ActionTypes.store: {
      state = { ...state, reverseActionBranch: state.reverseActionBranch.operate(OperationTypes.store, action.payload) };
      break;
    }

    default: return state; // 再描画しない〜〜
  }

  return { ...state, }
}
export default reducer;
