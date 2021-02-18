export const NodeModeNames = {
  Code: 'CODE',
  Canvas: 'CANVAS',
} as const;
interface CodeMode { name: typeof NodeModeNames.Code }
interface CanvasMode { name: typeof NodeModeNames.Canvas } 
export type NodeMode = CodeMode | CanvasMode;

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

interface Node {
  id: number;
  name: string;
  mode: NodeMode;
  width: string,
  height: string,
  top: string,
  left: string,
  outputs: OutputInfo[],
  inputs: InputInfo[],
}
interface Canvas extends Node {

};
interface Processor extends Node {

};
export type Content = Canvas | Processor;

export type Contents = Content[];

export type Connection = {
  type: OutputType,
  iBaseId: number,
  iChannel: number,
  oBaseId: number,
  oChannel: number,
}
