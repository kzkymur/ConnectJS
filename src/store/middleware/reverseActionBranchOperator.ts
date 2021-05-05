import { Middleware } from 'redux';
import { State } from '../node/reducer';
import NodeAction, { ActionTypes as NodeActionTypes } from '../node/actionTypes';
import { branchAction, forwardAction, backwardAction, storeAction } from '../node/actions';
import reverseActionCreator from '../node/reverseActionCreator';

const reverseActionBranchOperator: Middleware = store => next => (action: NodeAction) => {
  const state: State = store.getState().nodeReducer;
  const reccurent = (action: NodeAction) => {
    switch (action.type) {
      case NodeActionTypes.mult: {
        action.payload.forEach(a=>reccurent(a));
        break;
      }
      case NodeActionTypes.undo: {
        state.reverseActionBranch.current.prev!.actions.forEach(a=>reccurent(a));
        break;
      }
      case NodeActionTypes.redo: {
        state.reverseActionBranch.current.next!.actions.forEach(a=>reccurent(a));
        break;
      }
      default: {
        const r = reverseActionCreator(state, action);
        next(storeAction(r));
        next(action);
      }
    }
  }

  reccurent(action);
  switch (action.type) {
    case NodeActionTypes.undo: {
      next(backwardAction());
      break;
    }
    case NodeActionTypes.redo: {
      next(forwardAction());
      break;
    }
    default: {
      next(branchAction());
    }
  }
};


export default reverseActionBranchOperator;
