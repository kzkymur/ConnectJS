import { Reducer } from 'redux';
import { ActionTypes, GUIAction } from './actionTypes';
import { Contents, Connection } from './types';
import ReverseActionBranch, { OperationTypes, OperationType } from './reverseActionBranch';

interface State {
  contents: Contents;
  latestId: number;
  cpIdsList: number[][];
  connections: Connection[];
  reverseActionBranch: ReverseActionBranch;
  curving: number;
}
const initialState: State = {
  contents: [],
  latestId: 0,
  cpIdsList: [[]],
  connections: [],
  reverseActionBranch: new ReverseActionBranch(),
  curving: 0.5,
};

type GUIReducerType = Reducer<State, GUIAction>;
export const guiReducer: GUIReducerType = (state = initialState, action) => {
  return reducerLogic(state, action, OperationTypes.branch);
}

type ReducerLogic = (state: State, action: GUIAction, operationType: OperationType) => State;
const reducerLogic: ReducerLogic = (state, action, operationType) => {
  console.log(action);
  let reverseAction: GUIAction;
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
        cpIdsList: [state.cpIdsList[0].filter(id => id !== action.payload.id)],
      };
      reverseAction = {
        type: ActionTypes.add,
        payload: { content: deletedContent },
      };
      break;
    }
    case ActionTypes.update: {
      const updatedContent = state.contents.filter(c => c.id === action.payload.content.id)[0];
      if (updatedContent === undefined) return state;
      state = {
        ...state,
        contents: state.contents.map(c => c.id === action.payload.content.id ? action.payload.content : c),
      };
      reverseAction = {
        type: ActionTypes.update,
        payload: { content: updatedContent },
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

    case ActionTypes.openCP: {
      if(state.cpIdsList[0].indexOf(action.payload.id)>-1) {
        return state;
      } else {
        return {
          ...state,
          cpIdsList: [state.cpIdsList[0].concat([action.payload.id])],
        }
      }
    }
    case ActionTypes.closeCP: {
      return {
        ...state,
        cpIdsList: [state.cpIdsList[0].filter((_,i) => i !== action.payload.index)],
      }
    }
    case ActionTypes.closeAllCP: {
      return {
        ...state,
        cpIdsList: [[]],
      }
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
    default: return state; // 再描画しない〜〜
  }
  return {
    ...state,
    reverseActionBranch: state.reverseActionBranch.operate(reverseAction, operationType),
  }
}
