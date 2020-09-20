import { Action } from 'redux';
import { ActionTypes } from './actionTypes';

export const EditorModeNames = {
	Code: 'CODE',
	Canvas: 'CANVAS',
} as const;
interface CodeMode { name: typeof EditorModeNames.Code }
interface CanvasMode { name: typeof EditorModeNames.Canvas }
export type EditorModeType = CodeMode | CanvasMode;

export const OutputTypes = {
	Number: 'NUMBER',
	NumberList: 'NUMBER_LIST',
	Framebuffer: 'FRAMEBUFFER',
} as const;
export type OutputType = typeof OutputTypes.Number | typeof OutputTypes.NumberList | typeof OutputTypes.Framebuffer;
export interface OutputInfo {
	type: OutputType,
	name: string,
	value?: number | number[],
	isConnected: boolean,
}
export interface InputInfo {
	type: OutputType,
	name: string,
	oBaseId?: number,
	oChannel?: number,
}

interface Base {
	baseId: number;
	name: string;
	mode: EditorModeType;
	width: string,
	height: string,
	top: string,
	left: string,
	outputs: OutputInfo[],
	inputs: InputInfo[],
}
interface Canvas extends Base {

};
interface Processor extends Base {

};
export type glEditor = Canvas | Processor;

export type glEditors = glEditor[];

export type Connection = {
	type: OutputType,
	iX: number,
	iY: number,
	oX: number,
	oY: number,
}


// Actionの型定義
interface Add extends Action {
	type: typeof ActionTypes.add;
	payload: { mode: EditorModeType; }
}
interface Delete extends Action {
	type: typeof ActionTypes.delete;
	payload: { id: number; }
}
interface Update extends Action {
	type: typeof ActionTypes.update;
	payload: { glEditor: glEditor; }
}
interface Undo extends Action { type: typeof ActionTypes.undo; }
interface Redo extends Action { type: typeof ActionTypes.redo; }
interface OpenCP extends Action {
	type: typeof ActionTypes.openCP;
	payload: { id: number; }
}
interface CloseCP extends Action {
	type: typeof ActionTypes.closeCP;
	payload: { index: number; }
}
interface CloseAllCP extends Action { type: typeof ActionTypes.closeAllCP; }
export type GlEditorActionTypes = Add | Delete | Update | Undo | Redo | OpenCP | CloseCP | CloseAllCP;

