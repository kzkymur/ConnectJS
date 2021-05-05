import { combineReducers, createStore, applyMiddleware } from 'redux';
import nodeReducer from './node/reducer';
import panelReducer from './panel/reducer';
import middlewares from './middleware';

const rootReducer = combineReducers({
	nodeReducer,
  panelReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;
