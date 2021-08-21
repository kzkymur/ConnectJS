import { combineReducers, createStore, applyMiddleware } from 'redux';
import mainReducer from './main/reducer';
import panelReducer from './panel/reducer';
import middlewares from './middleware';

const rootReducer = combineReducers({
	mainReducer,
  panelReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;
