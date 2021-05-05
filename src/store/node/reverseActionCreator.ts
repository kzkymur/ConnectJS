import Action, { ActionTypes } from './actionTypes';
import { State } from './reducer';

const reverseActionCreator: (state: State, action: Action) => Action[] = (state, action) => {
  switch (action.type) {
    case ActionTypes.add: {
      let latestId = state.baseLatestId;
      let base = { ...action.payload.base };
      if (base.id === -1) {
        latestId++;
        base.id = latestId;
        base.name = 'node' + String(latestId);
      }
      return [{
        type: ActionTypes.delete,
        payload: { id: base.id },
      }];
    }
    case ActionTypes.delete: {
      const deletedBase = state.bases.filter(b => b.id === action.payload.id)[0];
      if (deletedBase === undefined) return [];
      return [{
        type: ActionTypes.add,
        payload: { base: deletedBase },
      }];
    }

    case ActionTypes.update: {
      const oldBase = state.bases.filter(b => b.id === action.payload.base.id)[0];
      if (oldBase === undefined) return [];
      return [{
        type: ActionTypes.update,
        payload: { base: oldBase },
      }];
    }
    case ActionTypes.updateName: {
      const oldBase = state.bases.filter(b => b.id === action.payload.id)[0];
      if (oldBase === undefined) return [];
      return [{
        type: ActionTypes.updateName,
        payload: { id: action.payload.id, name: oldBase.name },
      }];
    }
    case ActionTypes.updateSize: {
      const oldBase = state.bases.filter(b => b.id === action.payload.id)[0];
      if (oldBase === undefined) return [];
      return [{
        type: ActionTypes.updateSize,
        payload: {
          id: action.payload.id, 
          width: oldBase.width,
          height: oldBase.height,
        },
      }];
    }
    case ActionTypes.updatePos: {
      const oldBase = state.bases.filter(b => b.id === action.payload.id)[0];
      if (oldBase === undefined) return [];
      return [{
        type: ActionTypes.updatePos,
        payload: {
          id: action.payload.id,
          top: oldBase.top,
          left: oldBase.left,
        },
      }];
    }

    case ActionTypes.addSocket: {
      const base = state.bases.filter(b=>b.id===action.payload.baseId)[0];
      return [{
        type: ActionTypes.deleteSocket,
        payload: {
          baseId: action.payload.baseId,
          isInput: action.payload.isInput,
          id: action.payload.isInput ? base.inputsLatestId : base.outputsLatestId,
        },
      }];
    }
    case ActionTypes.deleteSocket: {
      const base = state.bases.filter(b=>b.id===action.payload.baseId)[0];
      const deletedSocket = action.payload.isInput ? base.inputs.filter(i => i.id === action.payload.id)[0] : base.outputs.filter(o => o.id === action.payload.id)[0];
      return [{
        type: ActionTypes.addSocket,
        payload: {
          baseId: action.payload.baseId,
          isInput: action.payload.isInput,
          type: deletedSocket.type,
        },
      }];
    }

    case ActionTypes.addConnection: {
      let latestId = state.connectionLatestId;
      let connection = { ...action.payload, }
      if (connection.id === -1) {
        latestId++;
        connection.id = latestId;
      }
      return [{
        type: ActionTypes.deleteConnection,
        payload: { id: connection.id, },
      }];
    }
    case ActionTypes.deleteConnection: {
      const deletedConnection = state.connections.filter(c => c.id === action.payload.id)[0];
      if (deletedConnection === undefined) return [];
      return [{
        type: ActionTypes.addConnection,
        payload: deletedConnection, 
      }];
    }
    case ActionTypes.updateConnectionPos: {
      const oldCon = state.connections.filter(c => c.id === action.payload.id)[0];
      if (oldCon === undefined) return [];
      return [{
        type: ActionTypes.updateConnectionPos,
        payload: { id: action.payload.id, s: oldCon.s, e: oldCon.e },
      }];
    }
    case ActionTypes.updateConnectionType: {
      const oldCon = state.connections.filter(c => c.id === action.payload.id)[0];
      if (oldCon === undefined) return [];
      return [{
        type: ActionTypes.updateConnectionType,
        payload: { id: action.payload.id, type: oldCon.type },
      }];
    }

    default: return [];
  }
}

export default reverseActionCreator;
