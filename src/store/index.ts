import { combineReducers, createStore } from 'redux';
import { glEditorReducer } from './reducer';

// const rootReducer = combineReducers({
// 	glEditor: glEditorReducer
// });
const rootReducer = glEditorReducer;

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer);

export default store;
