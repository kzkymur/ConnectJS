import { combineReducers, createStore, applyMiddleware } from 'redux';
import mainReducer from './main/reducer';
import middlewares from './middleware';

const rootReducer = combineReducers({
	mainReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;
