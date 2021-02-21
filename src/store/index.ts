import { combineReducers, createStore } from 'redux';
import { guiReducer } from './reducer';

// const rootReducer = combineReducers({
// 	glEditor: glEditorReducer
// });
const rootReducer = guiReducer;

export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer);

export default store;
