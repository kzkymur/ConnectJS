import { combineReducers, createStore, applyMiddleware } from 'redux';
import mainReducer from './main/reducer';
import uiReducer from './ui';
import middlewares from './middleware';

const rootReducer = combineReducers({
	mainReducer,
  uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;
