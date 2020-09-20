import { ActionTypes } from './actionTypes';
import { GlEditorActionTypes, EditorModeType, glEditor } from './types';

export const addAction = (mode: EditorModeType): GlEditorActionTypes => {
	return {
		type: ActionTypes.add,
		payload: {
			mode: mode,
		},
	};
};
export const deleteAction = (baseId: number): GlEditorActionTypes => {
	return {
		type: ActionTypes.delete,
		payload: {
			id: baseId,
		},
	};
};
export const updateAction = (glEditor: glEditor): GlEditorActionTypes => {
	return {
		type: ActionTypes.update,
		payload: {
			glEditor: glEditor,
		},
	};
};
export const undoAction = (): GlEditorActionTypes => {
	return { type: ActionTypes.undo, }
}
export const redoAction = (): GlEditorActionTypes => {
	return { type: ActionTypes.redo, }
}

export const openCPAction = (baseId: number): GlEditorActionTypes => {
	return {
		type: ActionTypes.openCP,
		payload: {
			id: baseId,
		}
	}
}
export const closeCPAction = (index: number): GlEditorActionTypes => {
	return {
		type: ActionTypes.closeCP,
		payload: {
			index: index,
		}
	}
}
export const closeAllCPAction = (): GlEditorActionTypes => {
	return { type: ActionTypes.closeAllCP, }
}

