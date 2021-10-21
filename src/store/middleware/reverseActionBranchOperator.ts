import { Middleware, Dispatch, } from 'redux';
import { RootState } from '..';
import { ActionTypes as NodeActionTypes, isMainActionTypes } from '../main/actionTypes';
import { ActionTypes as UIActionTypes } from '../ui/actionTypes';
import { Action } from '../types';
import { branchAction, forwardAction, backwardAction, storeAction } from '../ui/actions';
import reverseActionCreator from '../main/reverseActionCreator';

const reverseActionBranchOperator: Middleware<Dispatch, RootState> = store => next => (action: Action) => {
  const state = store.getState();
  const reccurent = (action: Action) => {
    switch (action.type) {
      case UIActionTypes.mult: {
        action.payload.forEach(a=>reccurent(a));
        break;
      }
      case UIActionTypes.undo: {
        state.uiReducer.reverseActionBranch.current.prev!.actions.forEach(a => reccurent(a));
        break;
      }
      case UIActionTypes.redo: {
        state.uiReducer.reverseActionBranch.current.next!.actions.forEach(a => reccurent(a));
        break;
      }
      default: {
        if (!isMainActionTypes(action)) break;
        const r = reverseActionCreator(state.mainReducer, action);
        next(storeAction(r));
        next(action);
      }
    }
  }

  reccurent(action);

  switch (action.type) {
    case UIActionTypes.undo: {
      next(backwardAction());
      break;
    }
    case UIActionTypes.redo: {
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
