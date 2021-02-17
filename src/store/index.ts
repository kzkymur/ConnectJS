import { combineReducers, createStore } from 'redux';
import { GUIReducer } from './reducer';

// const rootReducer = combineReducers({
// 	glEditor: glEditorReducer
// });
const rootReducer = GUIReducer;

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer);

export default store;
