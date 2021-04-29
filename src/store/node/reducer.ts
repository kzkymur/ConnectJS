import { Reducer } from 'redux';
import Action, { ActionTypes } from './actionTypes';
import { BaseType, ConnectionType } from './types';
import ReverseActionBranch, { OperationTypes, OperationType } from './reverseActionBranch';

interface State {
  bases: BaseType[];
  baseLatestId: number;
  connectionLatestId: number;
  connections: ConnectionType[];
  reverseActionBranch: ReverseActionBranch;
  curving: number;
}
const initialState: State = {
  bases: [],
  baseLatestId: 0,
  connectionLatestId: 0,
  connections: [],
  reverseActionBranch: new ReverseActionBranch(),
  curving: 0.5,
};

type ReducerType = Reducer<State, Action>;
const reducer: ReducerType = (state = initialState, action) => {
  return reducerLogic(state, action, OperationTypes.branch);
}
export default reducer;

type ReducerLogic = (state: State, action: Action, operationType: OperationType) => State;
const reducerLogic: ReducerLogic = (state, action, operationType) => {
  console.log(action);
  if (action.type===ActionTypes.mult) for (const a of action.payload.actions) console.log(a);
  let reverseActions: Action[];
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
      reverseActions = [{
        type: ActionTypes.delete,
        payload: { id: base.id },
      }];
      break;
    }
    case ActionTypes.delete: {
      const deletedBase = state.bases.filter(b => b.id === action.payload.id)[0];
      const deletedConnections = state.connections.filter(c => c.iBaseId === action.payload.id || c.oBaseId === action.payload.id);
      if (deletedBase === undefined) return state;
      state = {
        ...state,
        bases: state.bases.filter(b => b.id !== action.payload.id),
        connections: state.connections.filter(c => c.iBaseId !== action.payload.id && c.oBaseId !== action.payload.id),
      };
      reverseActions = [{
        type: ActionTypes.add,
        payload: { base: deletedBase },
      }];
      deletedConnections.forEach(c => { reverseActions.push({
        type: ActionTypes.addConnection,
        payload: { ...c },
      }) })
      break;
    }

    case ActionTypes.update: {
      const oldBase = state.bases.filter(b => b.id === action.payload.base.id)[0];
      if (oldBase === undefined) return state;
      state = {
        ...state,
        bases: state.bases.map(c => c.id === action.payload.base.id ? action.payload.base : c),
      };
      reverseActions = [{
        type: ActionTypes.update,
        payload: { base: oldBase },
      }];
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
      reverseActions = [{
        type: ActionTypes.updateName,
        payload: { id: action.payload.id, name: oldBase.name },
      }];
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
          top: action.payload.top,
          left: action.payload.left,
        } : b),
      };
      reverseActions = [{
        type: ActionTypes.updateSize,
        payload: {
          id: action.payload.id, 
          width: oldBase.width,
          height: oldBase.height,
          top: oldBase.top,
          left: oldBase.left,
        },
      }];
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
      reverseActions = [{
        type: ActionTypes.updatePos,
        payload: {
          id: action.payload.id,
          top: oldBase.top,
          left: oldBase.left,
        },
      }];
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
      const base = state.bases.filter(b=>b.id===action.payload.baseId)[0];
      reverseActions = [{
        type: ActionTypes.deleteSocket,
        payload: {
          baseId: action.payload.baseId,
          isInput: action.payload.isInput,
          id: action.payload.isInput ? base.inputsLatestId : base.outputsLatestId,
        },
      }];
      break;
    }
    case ActionTypes.deleteSocket: {
      const base = state.bases.filter(b=>b.id===action.payload.baseId)[0];
      const deletedSocket = action.payload.isInput ? base.inputs.filter(i => i.id === action.payload.id)[0] : base.outputs.filter(o => o.id === action.payload.id)[0];
      state = {
        ...state,
        bases: state.bases.map(b => b.id === action.payload.baseId ? {
          ...b,
          inputs: action.payload.isInput ? b.inputs.filter(i => i.id !== action.payload.id) : b.inputs,
          outputs: !action.payload.isInput ? b.outputs.filter(o => o.id !== action.payload.id) : b.outputs,
        } : b),
      };
      reverseActions = [{
        type: ActionTypes.addSocket,
        payload: {
          baseId: action.payload.baseId,
          isInput: action.payload.isInput,
          type: deletedSocket.type,
        },
      }];
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
      reverseActions = [{
        type: ActionTypes.deleteConnection,
        payload: { id: connection.id, },
      }];
      break;
    }
    case ActionTypes.deleteConnection: {
      const deletedConnection = state.connections.filter(c => c.id === action.payload.id)[0];
      if (deletedConnection === undefined) return state;
      state = {
        ...state,
        connections: state.connections.filter(c => c.id !== action.payload.id),
      };
      reverseActions = [{
        type: ActionTypes.addConnection,
        payload: deletedConnection, 
      }];
      break;
    }
    case ActionTypes.updateConnectionPos: {
      const oldCon = state.connections.filter(c => c.id === action.payload.id)[0];
      if (oldCon === undefined) return state;
      state = {
        ...state,
        bases: state.bases.map(c => c.id === action.payload.id ? {
          ...c,
          s: action.payload.s,
          e: action.payload.e,
        } : c),
      };
      reverseActions = [{
        type: ActionTypes.updateConnectionPos,
        payload: { id: action.payload.id, s: oldCon.s, e: oldCon.e },
      }];
      break;
    }
    case ActionTypes.updateConnectionType: {
      const oldCon = state.connections.filter(c => c.id === action.payload.id)[0];
      if (oldCon === undefined) return state;
      state = {
        ...state,
        bases: state.bases.map(c => c.id === action.payload.id ? {
          ...c,
          type: action.payload.type,
        } : c),
      };
      reverseActions = [{
        type: ActionTypes.updateConnectionType,
        payload: { id: action.payload.id, type: oldCon.type },
      }];
      break;
    }

    case ActionTypes.undo: {
      const reverseElement = state.reverseActionBranch.current.prev;
      if (reverseElement===undefined) return state;
      return { ...reverseElement.actions.reduce((a, s, i) => reducerLogic(a, s, reverseElement.actions.length === i+1 ? OperationTypes.backward : OperationTypes.store), state) };
    }
    case ActionTypes.redo: {
      const reverseElement = state.reverseActionBranch.current.next;
      if (reverseElement===undefined) return state;
      return { ...reverseElement.actions.reduce((a, s, i) => reducerLogic(a, s, reverseElement.actions.length === i+1 ? OperationTypes.forward : OperationTypes.store), state) };
    }

    default: return state; // 再描画しない〜〜
  }

  return {
    ...state,
    reverseActionBranch: state.reverseActionBranch.operate(reverseActions, operationType),
  }
}
