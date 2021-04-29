import { combineReducers, createStore } from 'redux';
import nodeReducer from './node/reducer';
import panelReducer from './panel/reducer';

const rootReducer = combineReducers({
	nodeReducer,
  panelReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer);

export default store;
