import { Middleware, Dispatch, } from 'redux';
import { RootState } from '..';
import NodeAction, { ActionTypes as NodeActionTypes } from '../main/actionTypes';
import { branchAction, forwardAction, backwardAction, storeAction } from '../main/actions';
import reverseActionCreator from '../main/reverseActionCreator';

const reverseActionBranchOperator: Middleware<Dispatch, RootState> = store => next => (action: NodeAction) => {
  const state = store.getState().mainReducer;
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

  if (action.type === NodeActionTypes.rerender) next(action);
  else reccurent(action);

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

  console.log("End: "+action.type);
};


export default reverseActionBranchOperator;
