import { combineReducers, createStore } from 'redux';
import nodeReducer from './node/reducer';

const rootReducer = combineReducers({
	nodeReducer,
});
// const rootReducer = guiReducer;

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer);

export default store;
