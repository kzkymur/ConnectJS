import { ActionTypes } from './actionTypes';
import { GlEditorActionTypes, glEditors, Connection } from './types';

interface State {
	glEditors: glEditors;
	latestId: number;
	cpIdsList: number[][];
	connections: Connection[];
	preState?: State;
	nextState?: State;
	curving: number;
}
const initialState: State = {
	glEditors: [],
	cpIdsList: [[]],
	connections: [],
	latestId: 0,
	curving: 0.5,
};

export const glEditorReducer = (state = initialState, action: GlEditorActionTypes) => {
	const latestId = state.latestId + 1;
	console.log(action);
	switch (action.type) {
		case ActionTypes.add:{
			return {
				...state,
				latestId: latestId,
				glEditors: [
					...state.glEditors,
					{
						baseId: latestId,
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
				preState: state,
				nextState: undefined,
			}
		}
		case ActionTypes.delete:{
			return {
				...state,
				glEditors: state.glEditors.filter(gle => gle.baseId !== action.payload.id),
				cpIdsList: [state.cpIdsList[0].filter(id => id !== action.payload.id)],
				preState: state,
				nextState: undefined,
			}
		}
		case ActionTypes.update:{
			return {
				...state,
				glEditors: state.glEditors.map(gle => gle.baseId === action.payload.glEditor.baseId ? action.payload.glEditor : gle),
				preState: state,
				nextState: undefined,
			}
		}
		case ActionTypes.undo:{
			if (state.preState === undefined) return state;
			return {
				...state.preState,
				nextState: state,
			};
		}
		case ActionTypes.redo:{
			if (state.nextState === undefined) return state;
			return {
				...state.nextState,
			};
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
		default:
			return state; // 描画しない〜〜
	}
}

