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
  iBaseId: number,
  iChannel: number,
  oBaseId: number,
  oChannel: number,
}
