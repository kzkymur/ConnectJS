import React from 'react';
import { keys } from 'ts-transformer-keys';
import { ResizableNode } from '@/store/main/node';
import { Modes } from './types';

type CanvasArgs = { number: number; };
type CanvasTo = {};
export class Class extends ResizableNode<CanvasTo, CanvasArgs> {
  readonly mode: typeof Modes.canvas = Modes.canvas;
  constructor () {
    super(keys<CanvasArgs>(), keys<CanvasTo>());
    this.function = args => { console.log(args.number); return {} }
  }
}

type Props = {
  render: (gl: WebGLRenderingContext)	 => void;
};

const Canvas: React.FC<Props> = props => {
  const canvasRef = React.useRef(null);

  const getContext = (): WebGLRenderingContext => {
    const canvas: any = canvasRef.current;
    return canvas.getContext('webgl');
  };

  React.useEffect(() => {
    const gl: WebGLRenderingContext = getContext();
    props.render(gl);
  })

  return (
    <canvas ref={canvasRef} />
  );
}

export default Canvas;
