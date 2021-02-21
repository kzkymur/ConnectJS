import { Reducer } from 'redux';
import Action, { ActionTypes } from './actionTypes';

interface State {
  cpIdsList: number[][];
}
const initialState: State = {
  cpIdsList: [[]],
};

type ReducerType = Reducer<State, Action>;
const reducer: ReducerType = (state = initialState, action) => {
  return reducerLogic(state, action);
}
export default reducer;

type ReducerLogic = (state: State, action: Action) => State;
const reducerLogic: ReducerLogic = (state, action) => {
  console.log(action);
  switch (action.type) {
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

    case ActionTypes.closeCPById: {
      return {
        ...state,
        cpIdsList: [state.cpIdsList[0].filter(id => id !== action.payload.id)],
      } 
    }

    default: return state;
  }
}
