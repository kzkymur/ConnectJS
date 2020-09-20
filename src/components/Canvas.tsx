import React from 'react';

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
