import { Middleware } from 'redux';
import { ActionTypes as NodeActionTypes } from '../node/actionTypes';
import { closeCPByIdAction } from '../panel/actions';

const closePanel: Middleware = store => next => action => {
  if (action.type === NodeActionTypes.delete) {
    next(closeCPByIdAction(action.payload.id));
  }
  next(action);
};

export default closePanel;
