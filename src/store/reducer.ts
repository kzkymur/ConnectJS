import { Reducer } from 'redux';
import { ActionTypes, GUIAction } from './actionTypes';
import { Contents, Connection } from './types';

interface ReverseActions {
  prev?: Element;
  next?: Element;
}
interface Element {
  action: GUIAction;
  prev: ReverseActions;
  next: ReverseActions;
}

interface State {
	contents: Contents;
	latestId: number;
	cpIdsList: number[][];
	connections: Connection[];
	reverseActions: ReverseActions;
	curving: number;
}
const initialState: State = {
	contents: [],
	latestId: 0,
	cpIdsList: [[]],
	connections: [],
  reverseActions: {},
	curving: 0.5,
};

type GUIReducerType = Reducer<State, GUIAction>;
export const GUIReducer: GUIReducerType = (state = initialState, action: GUIAction) => {
	console.log(action);
	switch (action.type) {
		case ActionTypes.add: {
	    const latestId = state.latestId + 1;
			return {
				...state,
				latestId: latestId,
				contents: [
					...state.contents,
					{
						id: latestId,
						mode: action.payload.mode,
						name: 'node'+String(latestId),
						width: '160px',
						height: '120px',
						top: String(40 + 20 * Math.random()) + '%',
						left: String(40 + 20 * Math.random()) + '%',
						outputs: [],
						inputs: [],
					}
				],
			}
		}
		case ActionTypes.delete:{
			return {
				...state,
				contents: state.contents.filter(c => c.id !== action.payload.id),
				cpIdsList: [state.cpIdsList[0].filter(id => id !== action.payload.id)],
			}
		}
		case ActionTypes.update:{
			return {
				...state,
				contents: state.contents.map(c => c.id === action.payload.content.id ? action.payload.content : c),
			}
		}

		case ActionTypes.undo:{
      return state;
		}
		case ActionTypes.redo:{
      return state;
		}

		case ActionTypes.openCP: {
			if(state.cpIdsList[0].indexOf(action.payload.id)>-1) {
				return state;
			} else {
				return {
					...state,
					cpIdsList: [state.cpIdsList[0].concat([action.payload.id])],
				}
			}
		}
		case ActionTypes.closeCP: {
			return {
				...state,
				cpIdsList: [state.cpIdsList[0].filter((_,i) => i !== action.payload.index)],
			}
		}
		case ActionTypes.closeAllCP: {
			return {
				...state,
				cpIdsList: [[]],
			}
		}

		case ActionTypes.addConnection: {
			return {
				...state,
				connections: [
					...state.connections,
					{ ...action.payload }
				],
			}
		}
    default: return state; // 描画しない〜〜
	}
}
