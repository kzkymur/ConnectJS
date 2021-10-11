import React from 'react';
import { keys } from 'ts-transformer-keys';
import { ResizableNode } from '@/store/main/node';
import { Modes } from './types';

type CanvasArgs = { number: number; };
export class Class extends ResizableNode<void, CanvasArgs> {
  readonly mode: typeof Modes.canvas = Modes.canvas;
  constructor () {
    super(() => {}, keys<CanvasArgs>());
    this.inputs = [{
      type: 1,
      id: 1,
      name: 'canvas',
    }];
    this.function = args => { console.log(args.number); }
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
