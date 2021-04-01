import { Reducer } from 'redux';
import Action, { ActionTypes } from './actionTypes';
import { BaseType, ConnectionType } from './types';
import ReverseActionBranch, { OperationTypes, OperationType } from './reverseActionBranch';

interface State {
  bases: BaseType[];
  latestId: number;
  connections: ConnectionType[];
  reverseActionBranch: ReverseActionBranch;
  curving: number;
}
const initialState: State = {
  bases: [],
  latestId: 0,
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
      let latestId = state.latestId;
      let base = action.payload.base;
      if (base.id === -1) {
        latestId += 1;
        base = {
          ...base,
          id: latestId,
          name: 'node' + String(latestId),
        };
      }
      state = {
        ...state,
        latestId: latestId,
        bases: [
          ...state.bases,
          base
        ],
      };
      reverseAction = {
        type: ActionTypes.delete,
        payload: { id: base.id },
      };
      break;
    }
    case ActionTypes.delete: {
      const deletedContent = state.bases.filter(c => c.id === action.payload.id)[0];
      if (deletedContent === undefined) return state;
      state = {
        ...state,
        bases: state.bases.filter(c => c.id !== action.payload.id),
      };
      reverseAction = {
        type: ActionTypes.add,
        payload: { base: deletedContent },
      };
      break;
    }

    case ActionTypes.update: {
      const oldContent = state.bases.filter(c => c.id === action.payload.base.id)[0];
      if (oldContent === undefined) return state;
      state = {
        ...state,
        bases: state.bases.map(c => c.id === action.payload.base.id ? action.payload.base : c),
      };
      reverseAction = {
        type: ActionTypes.update,
        payload: { base: oldContent },
      };
      break;
    }
    case ActionTypes.updateName: {
      const oldContent = state.bases.filter(c => c.id === action.payload.id)[0];
      if (oldContent === undefined) return state;
      state = {
        ...state,
        bases: state.bases.map(c => c.id === action.payload.id ? {
          ...c,
          name: action.payload.name,
        } : c),
      };
      reverseAction = {
        type: ActionTypes.updateName,
        payload: { id: action.payload.id, name: oldContent.name },
      };
      break;
    }
    case ActionTypes.updateSize: {
      const oldContent = state.bases.filter(c => c.id === action.payload.id)[0];
      if (oldContent === undefined) return state;
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
          width: oldContent.width,
          height: oldContent.height,
        },
      };
      break;
    }
    case ActionTypes.updatePos: {
      const oldContent = state.bases.filter(c => c.id === action.payload.id)[0];
      if (oldContent === undefined) return state;
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
          top: oldContent.top,
          left: oldContent.left,
        },
      };
      break;
    }

    case ActionTypes.addConnection: {
      return {
        ...state,
        connections: [
          ...state.connections,
          { ...action.payload }
        ],
      }
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
