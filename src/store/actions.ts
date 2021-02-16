import { ActionTypes } from './actionTypes';
import { EditorModeType, glEditor, Connection } from './types';
import { GlEditorActionTypes } from './actionTypes';

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

export const addConnectionAction = (param: Connection): GlEditorActionTypes => {
  return { 
    type: ActionTypes.addConnection, 
    payload: param	
  }
}
export const updateConnectionAction = (param: Connection): GlEditorActionTypes => {
  return { 
    type: ActionTypes.updateConnection, 
    payload: param	
  }
}
export const deleteConnectionAction = (index: number): GlEditorActionTypes => {
  return {
    type: ActionTypes.deleteConnection,
    payload: {
      index: index,
    }
  }
}
