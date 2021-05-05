import { Middleware } from 'redux';

const logger: Middleware = store => next => action => {
  console.log(store.getState());
  next(action);
  console.log(store.getState());
};

export default logger;
