import { Reducer } from 'redux';
import Action, { ActionTypes } from './actionTypes';
import { Contents, Connection } from './types';
import ReverseActionBranch, { OperationTypes, OperationType } from './reverseActionBranch';

interface State {
  contents: Contents;
  latestId: number;
  connections: Connection[];
  reverseActionBranch: ReverseActionBranch;
  curving: number;
}
const initialState: State = {
  contents: [],
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
      let content = action.payload.content;
      if (content.id === -1) {
        latestId += 1;
        content = {
          ...content,
          id: latestId,
          name: 'node' + String(latestId),
        };
      }
      state = {
        ...state,
        latestId: latestId,
        contents: [
          ...state.contents,
          content
        ],
      };
      reverseAction = {
        type: ActionTypes.delete,
        payload: { id: content.id },
      };
      break;
    }
    case ActionTypes.delete: {
      const deletedContent = state.contents.filter(c => c.id === action.payload.id)[0];
      if (deletedContent === undefined) return state;
      state = {
        ...state,
        contents: state.contents.filter(c => c.id !== action.payload.id),
      };
      reverseAction = {
        type: ActionTypes.add,
        payload: { content: deletedContent },
      };
      break;
    }

    case ActionTypes.update: {
      const oldContent = state.contents.filter(c => c.id === action.payload.content.id)[0];
      if (oldContent === undefined) return state;
      state = {
        ...state,
        contents: state.contents.map(c => c.id === action.payload.content.id ? action.payload.content : c),
      };
      reverseAction = {
        type: ActionTypes.update,
        payload: { content: oldContent },
      };
      break;
    }
    case ActionTypes.updateName: {
      const oldContent = state.contents.filter(c => c.id === action.payload.id)[0];
      if (oldContent === undefined) return state;
      state = {
        ...state,
        contents: state.contents.map(c => c.id === action.payload.id ? {
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
      const oldContent = state.contents.filter(c => c.id === action.payload.id)[0];
      if (oldContent === undefined) return state;
      state = {
        ...state,
        contents: state.contents.map(c => c.id === action.payload.id ? {
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
      const oldContent = state.contents.filter(c => c.id === action.payload.id)[0];
      if (oldContent === undefined) return state;
      state = {
        ...state,
        contents: state.contents.map(c => c.id === action.payload.id ? {
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
