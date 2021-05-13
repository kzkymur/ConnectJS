import Action, { ActionTypes } from './actionTypes';
import { State } from './reducer';

const reverseActionCreator: (state: State, action: Action) => Action[] = (state, action) => {
  switch (action.type) {
    case ActionTypes.add: {
      let latestId = state.nodeLatestId;
      let node = { ...action.payload.node };
      if (node.id === -1) {
        latestId++;
        node.id = latestId;
        node.name = 'node' + String(latestId);
      }
      return [{
        type: ActionTypes.delete,
        payload: { id: node.id },
      }];
    }
    case ActionTypes.delete: {
      const deletedNode = state.nodes.filter(n => n.id === action.payload.id)[0];
      if (deletedNode === undefined) return [];
      return [{
        type: ActionTypes.add,
        payload: { node: deletedNode },
      }];
    }

    case ActionTypes.update: {
      const oldNode = state.nodes.filter(n => n.id === action.payload.node.id)[0];
      if (oldNode === undefined) return [];
      return [{
        type: ActionTypes.update,
        payload: { node: oldNode },
      }];
    }
    case ActionTypes.updateName: {
      const oldNode = state.nodes.filter(n => n.id === action.payload.id)[0];
      if (oldNode === undefined) return [];
      return [{
        type: ActionTypes.updateName,
        payload: { id: action.payload.id, name: oldNode.name },
      }];
    }
    case ActionTypes.updateSize: {
      const oldNode = state.nodes.filter(n => n.id === action.payload.id)[0];
      if (oldNode === undefined) return [];
      return [{
        type: ActionTypes.updateSize,
        payload: {
          id: action.payload.id, 
          width: oldNode.width,
          height: oldNode.height,
        },
      }];
    }
    case ActionTypes.updatePos: {
      const oldNode = state.nodes.filter(n => n.id === action.payload.id)[0];
      if (oldNode === undefined) return [];
      return [{
        type: ActionTypes.updatePos,
        payload: {
          id: action.payload.id,
          top: oldNode.top,
          left: oldNode.left,
        },
      }];
    }

    case ActionTypes.addSocket: {
      const node = state.nodes.filter(n=>n.id===action.payload.nodeId)[0];
      return [{
        type: ActionTypes.deleteSocket,
        payload: {
          nodeId: action.payload.nodeId,
          isInput: action.payload.isInput,
          id: action.payload.isInput ? node.inputsLatestId : node.outputsLatestId,
        },
      }];
    }
    case ActionTypes.deleteSocket: {
      const node = state.nodes.filter(n=>n.id===action.payload.nodeId)[0];
      const deletedSocket = action.payload.isInput ? node.inputs.filter(i => i.id === action.payload.id)[0] : node.outputs.filter(o => o.id === action.payload.id)[0];
      return [{
        type: ActionTypes.addSocket,
        payload: {
          nodeId: action.payload.nodeId,
          isInput: action.payload.isInput,
          type: deletedSocket.type,
        },
      }];
    }

    case ActionTypes.addConnection: {
      let latestId = state.connectionLatestId;
      let connection = { ...action.payload.connection, }
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
        payload: { connection: deletedConnection}, 
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

    case ActionTypes.addEngine: {
      const latestId = state.nodeLatestId + 1;
      const engine = { ...action.payload.engine };
      if (engine.id === -1) engine.id = latestId;
      return [{
        type: ActionTypes.deleteEngine,
        payload: { id: engine.id },
      }];
    }
    case ActionTypes.deleteEngine: {
      const deletedEngine = state.engines.filter(e => e.id === action.payload.id)[0];
      if (deletedEngine === undefined) return [];
      return [{
        type: ActionTypes.addEngine,
        payload: { engine: deletedEngine },
      }];
    }

    default: return [];
  }
}

export default reverseActionCreator;
