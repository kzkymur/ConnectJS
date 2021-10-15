import { Reducer } from 'redux';
import Action, { ActionTypes } from './actionTypes';
import ReverseActionBranch, { OperationTypes } from './reverseActionBranch';

export interface State {
  reverseActionBranch: ReverseActionBranch;
}
export const initialState: State = {
  reverseActionBranch: new ReverseActionBranch(),
};

const reducer: Reducer<State, Action> = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
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
