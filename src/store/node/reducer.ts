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
  let reverseAction: Action;
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
      reverseAction = {
        type: ActionTypes.delete,
        payload: { id: base.id },
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
      reverseAction = {
        type: ActionTypes.add,
        payload: { base: deletedBase },
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
      reverseAction = {
        type: ActionTypes.update,
        payload: { base: oldBase },
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
      reverseAction = {
        type: ActionTypes.updateName,
        payload: { id: action.payload.id, name: oldBase.name },
      };
      break;
    }
    case ActionTypes.updateSize: {
      const oldBase = state.bases.filter(b => b.id === action.payload.id)[0];
      if (oldBase === undefined) return state;
      state = {
        ...state,
        bases: state.bases.map(c => c.id === action.payload.id ? {
          ...c,
          width: action.payload.width,
          height: action.payload.height,
        } : c),
      };
      reverseAction = {
        type: ActionTypes.updateSize,
        payload: { 
          id: action.payload.id, 
          width: oldBase.width,
          height: oldBase.height,
        },
      };
      break;
    }
    case ActionTypes.updatePos: {
      const oldBase = state.bases.filter(b => b.id === action.payload.id)[0];
      if (oldBase === undefined) return state;
      state = {
        ...state,
        bases: state.bases.map(c => c.id === action.payload.id ? {
          ...c,
          top: action.payload.top,
          left: action.payload.left,
        } : c),
      };
      reverseAction = {
        type: ActionTypes.updatePos,
        payload: {
          id: action.payload.id,
          top: oldBase.top,
          left: oldBase.left,
        },
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
      const base = state.bases.filter(b=>b.id===action.payload.baseId)[0];
      reverseAction = {
        type: ActionTypes.deleteSocket,
        payload: {
          baseId: action.payload.baseId,
          isInput: action.payload.isInput,
          id: action.payload.isInput ? base.inputsLatestId : base.outputsLatestId,
        },
      };
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
      reverseAction = {
        type: ActionTypes.addSocket,
        payload: {
          baseId: action.payload.baseId,
          isInput: action.payload.isInput,
          type: deletedSocket.type,
        },
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
      reverseAction = {
        type: ActionTypes.deleteConnection,
        payload: { id: latestId, },
      };
      break;
    }
    case ActionTypes.deleteConnection: {
      const deletedConnection = state.connections.filter(c => c.id === action.payload.id)[0];
      if (deletedConnection === undefined) return state;
      state = {
        ...state,
        connections: state.connections.filter(c => c.id !== action.payload.id),
      };
      reverseAction = {
        type: ActionTypes.addConnection,
        payload: deletedConnection, 
      };
      break;
    }

    case ActionTypes.undo:{
      const reverseElement = state.reverseActionBranch.current.prev;
      if (reverseElement===undefined) return state;
      return state = reducerLogic(state, reverseElement.action, OperationTypes.backward);
    }
    case ActionTypes.redo:{
      const reverseElement = state.reverseActionBranch.current.next;
      if (reverseElement===undefined) return state;
      return state = reducerLogic(state, reverseElement.action, OperationTypes.forward);
    }

    default: return state; // 再描画しない〜〜
  }
  return {
    ...state,
    reverseActionBranch: state.reverseActionBranch.operate(reverseAction, operationType),
  }
}
