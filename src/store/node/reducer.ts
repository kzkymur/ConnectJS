import { Reducer } from 'redux';
import Action, { ActionTypes } from './actionTypes';
import { BaseType, ConnectionType } from './types';
import ReverseActionBranch, { OperationTypes } from './reverseActionBranch';

export interface State {
  bases: BaseType[];
  baseLatestId: number;
  connectionLatestId: number;
  connections: ConnectionType[];
  reverseActionBranch: ReverseActionBranch;
  curving: number;
}
export const initialState: State = {
  bases: [],
  baseLatestId: 0,
  connectionLatestId: 0,
  connections: [],
  reverseActionBranch: new ReverseActionBranch(),
  curving: 0.5,
};

const reducer: Reducer<State, Action> = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case ActionTypes.add: {
      let latestId = state.baseLatestId;
      let base = { ...action.payload.base };
      if (base.id === -1) {
        latestId++;
        base.id = latestId;
        base.name = 'node' + String(latestId);
      }
      state = {
        ...state,
        baseLatestId: latestId,
        bases: [ ...state.bases, base ],
      };
      break;
    }
    case ActionTypes.delete: {
      const deletedBase = state.bases.filter(b => b.id === action.payload.id)[0];
      if (deletedBase === undefined) return state;
      state = {
        ...state,
        bases: state.bases.filter(b => b.id !== action.payload.id),
      };
      break;
    }

    case ActionTypes.update: {
      const oldBase = state.bases.filter(b => b.id === action.payload.base.id)[0];
      if (oldBase === undefined) return state;
      state = {
        ...state,
        bases: state.bases.map(c => c.id === action.payload.base.id ? action.payload.base : c),
      };
      break;
    }
    case ActionTypes.updateName: {
      const oldBase = state.bases.filter(b => b.id === action.payload.id)[0];
      if (oldBase === undefined) return state;
      state = {
        ...state,
        bases: state.bases.map(c => c.id === action.payload.id ? {
          ...c,
          name: action.payload.name,
        } : c),
      };
      break;
    }
    case ActionTypes.updateSize: {
      const oldBase = state.bases.filter(b => b.id === action.payload.id)[0];
      if (oldBase === undefined) return state;
      state = {
        ...state,
        bases: state.bases.map(b => b.id === action.payload.id ? {
          ...b,
          width: action.payload.width,
          height: action.payload.height,
        } : b),
      };
      break;
    }
    case ActionTypes.updatePos: {
      const oldBase = state.bases.filter(b => b.id === action.payload.id)[0];
      if (oldBase === undefined) return state;
      state = {
        ...state,
        bases: state.bases.map(b => b.id === action.payload.id ? {
          ...b,
          top: action.payload.top,
          left: action.payload.left,
        } : b),
      };
      break;
    }

    case ActionTypes.addSocket: {
      state = {
        ...state,
        bases: state.bases.map(b => b.id === action.payload.baseId ? {
          ...b,
          inputsLatestId: action.payload.isInput ? b.inputsLatestId + 1 : b.inputsLatestId,
          inputs: action.payload.isInput ? [...b.inputs, {
            id: b.inputsLatestId + 1,
            type: action.payload.type,
            name: action.payload.type,
            counterId: -1,
          }] : b.inputs,
          outputsLatestId: !action.payload.isInput ? b.outputsLatestId + 1 : b.outputsLatestId,
          outputs: !action.payload.isInput ? [...b.outputs, {
            id: b.outputsLatestId + 1,
            type: action.payload.type,
            name: action.payload.type,
            counterId: -1,
          }] : b.outputs,
        } : b),
      };
      break;
    }
    case ActionTypes.deleteSocket: {
      state = {
        ...state,
        bases: state.bases.map(b => b.id === action.payload.baseId ? {
          ...b,
          inputs: action.payload.isInput ? b.inputs.filter(i => i.id !== action.payload.id) : b.inputs,
          outputs: !action.payload.isInput ? b.outputs.filter(o => o.id !== action.payload.id) : b.outputs,
        } : b),
      };
      break;
    }

    case ActionTypes.addConnection: {
      let latestId = state.connectionLatestId;
      let connection = { ...action.payload, }
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
      console.log(action.payload);
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
