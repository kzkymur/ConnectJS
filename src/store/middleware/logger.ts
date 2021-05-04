import { Middleware } from 'redux';

const closePanel: Middleware = store => next => action => {
  console.log(store.getState());
  next(action);
  console.log(store.getState());
};

export default closePanel;
