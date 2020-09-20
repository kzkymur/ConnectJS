import React, { useState, useEffect } from 'react'; import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../store';
import { openCPAction } from '../store/actions';
import { glEditor, Connection } from '../store/types';
import Base from './Base';
import ControllPanel from './ControllPanel';
import './MainBoard.css';

type BaseMetaInfoType = {
	id: number;
	ref: React.RefObject<HTMLDivElement>;
}
type ConnectionMoveBuffer = {
	isInput: boolean;
	baseId: number;
	channel: number;
	pos?: number[];
}
type Props = RootState;

const MainBoard: React.FC<Props> = props => {
	const [outputs, setOutputs] = useState<number | number[]>([]);
	const [baseMetaInfos, setBaseMetaInfos] = useState<BaseMetaInfoType[]>([]);
	const [movingRef, setMovingRef] = useState<undefined | React.RefObject<HTMLDivElement>>();
	const [startPos, setStartPos] = useState<number[]>([]);
	const [cpIndexes, setCPIndexes] = useState<number[]>([]);
	const [connectionMoveBuffer, setConnectionMoveBuffer] = useState<undefined | ConnectionMoveBuffer>();
	const [connectionMoveRef, setConnectionMoveRef] = useState(React.createRef<SVGPathElement>());

	// refのsetup
	const getIndexOfBMIs = (bmis: BaseMetaInfoType[], id: number): number => {
		let i = -1;
		for (let baseMetaInfo of bmis) {
			i++;
			if (baseMetaInfo.id === id) return i;
		}
		return -1;
	}
	const addBMI = (id: number) => {
		const newBMI: BaseMetaInfoType = {
			id: id,
			ref: React.createRef<HTMLDivElement>(),
		}
		const newBMIs = [...baseMetaInfos, newBMI];
		setBaseMetaInfos(newBMIs);
	}
	const removeBMI = (id: number) => {
		const newBMIs = baseMetaInfos.filter(bmi=>bmi.id!==id);
		setBaseMetaInfos([...newBMIs])
	}

	// Drag操作系
	const createStartMoving = (id: number) => {
		const startMoving = (startPosX: number, startPosY: number) => {
			const movingNodeIndex = getIndexOfBMIs(baseMetaInfos, id);
			setMovingRef(baseMetaInfos[movingNodeIndex].ref);
			setStartPos([startPosX, startPosY]);
		}
		return startMoving;
	}
	const createCreateStartConnectionMoving = (id: number) => {
		const createStartConnectionMoving = (isInput: boolean, channel: number, isConnected: boolean) => {
			const startConnectionMoving = (e: React.MouseEvent<HTMLDivElement>) => {
				let connectionMoveBuffer = {
					isInput: isInput,
					baseId: id,
					channel: channel,
				}
				if (isConnected) {
					setConnectionMoveBuffer(connectionMoveBuffer);
				} else {
					const joint = e.currentTarget;
					const jointRect = joint.getBoundingClientRect();
					setConnectionMoveBuffer({
							...connectionMoveBuffer,
							pos: [jointRect.left + joint.offsetWidth / 2, jointRect.top + joint.offsetHeight / 2]
						});
				}
			}
			return startConnectionMoving;
		}
		return createStartConnectionMoving;
	}
	const createConnectJoints = (isInput: boolean) => {
		const connectJoints = () => {
			
		}
	}
	const moving = (e: MouseEvent) => {
		const ref = movingRef;
		if (ref !== undefined) {
			const elm = ref.current;
			if (elm === null) return; 
			elm.style.left = (e.clientX - startPos[0]) + 'px';
			elm.style.top = (e.clientY - startPos[1]) + 'px';
		} else if (connectionMoveBuffer !== undefined) {
			if (connectionMoveBuffer.pos !== undefined) {
				const elm = connectionMoveRef.current;
				if (elm === null) return;
				const {pos, isInput} = connectionMoveBuffer;
				let Sx, Sy, Ex, Ey;
				if (isInput) {
					Sx = e.clientX; Sy = e.clientY; Ex = pos[0]; Ey = pos[1];
				} else {
					Sx = pos[0]; Sy = pos[1]; Ex = e.clientX; Ey = e.clientY; 
				}
				const dList = calcDList(Sx, Sy, Ex, Ey);
				elm.attributes[1].value = dList.join(' ');
			} else {

			}
		}
	}
	
	const calcDList = (Sx: number, Sy: number, Ex: number, Ey: number) => {
		let dList :(number | string)[] = ['M']; dList[3] = 'Q'; dList[8] = 'T';
		dList[1] = Sx; dList[2] = Sy; dList[9] = Ex; dList[10] = Ey;
		dList[4] = Math.abs((Ex-Sx)*props.curving)+Sx; dList[5] = Sy;
		dList[6] = (Sx + Ex) / 2; dList[7] = (Sy + Ey) / 2;
		return dList;
	}
	const endMoving = () => { 
		if (movingRef !== undefined) {
			setMovingRef( undefined);
		} else if (connectionMoveBuffer !== undefined) {
			setConnectionMoveBuffer(undefined);
		}
	}

	// controlPanel系
	const createOpenCP = (id: number) => {
		const openCP = () => {
			const currentIndex = props.cpIdsList[0].indexOf(id);
			if (currentIndex === -1) {
				props.openCP(id);
				createSetCPIndex(0)(props.cpIdsList[0].length);
			} else if (currentIndex !== cpIndexes[0]){
				createSetCPIndex(0)(currentIndex);
			}
		}
		return openCP;
	}
	const createSetCPIndex = (cpIndex: number) => {
		const setCPIndex = (newIndex: number) => {setCPIndexes( cpIndexes.map( (oldIndex, i) => i === cpIndex ? newIndex : oldIndex ))}
		return setCPIndex
	}

	shouldComponentUpdate (nextProps: RootState) {
		for (let gle of nextProps.glEditors) {
			const i = getIndexOfBMIs(baseMetaInfos, gle.baseId);
			if (i === -1) {
				addBMI(gle.baseId);
				return false;
			}
			baseMetaInfos.splice(i, 1);
		}
		if (baseMetaInfos.length !== 0) {
			removeBMI(baseMetaInfos[0].id);
			return false;
		}
		for (let i in props.cpIdsList) {
			if (cpIndexes[i] === undefined) {
				setCPIndexes([...cpIndexes, 0]);
				return false;
			}
		}
		return true;
	}
	componentWillMount () { shouldComponentUpdate(props) }
	useEffect(()=>{ 
		window.addEventListener('mousemove', moving); 
		window.addEventListener('mouseup', endMoving); 
		return () =>  { 
			window.removeEventListener('mousemove', moving); 
			window.removeEventListener('mouseup', endMoving); 
		}
	});
	console.log(props);
	let element;
	if (connectionMoveBuffer !== undefined ) {
		if(connectionMoveBuffer.pos !== undefined) {
			const [posX, posY] = connectionMoveBuffer.pos;
			const dList = ['M', posX, posY, 'Q', posX, posY, posX, posY, 'T', posX, posY];
			element = <path className={'connection-line'} ref={connectionMoveRef} d={dList.join(' ')} />;
		}
	}
	return (
		<div className={'mainBoard'}>
			{props.glEditors.map((editor: glEditor)=>{
				const i = getIndexOfBMIs(baseMetaInfos, editor.baseId);
				const baseMetaInfo = baseMetaInfos.splice(i, 1)[0];
				const props = {
					property: editor, 
					fRef: baseMetaInfo.ref,
					startMoving: createStartMoving(editor.baseId),
					createStartConnectionMoving: createCreateStartConnectionMoving(editor.baseId),
					openCP: createOpenCP(editor.baseId),
				}
				return <Base key={editor.baseId}{...props}/>
			})}
			{props.cpIdsList.map((ids: number[], i)=>{
				if(ids[0]===undefined) return;
				let properties: glEditor[] = [];
				ids.forEach(id=>{
					let gle = props.glEditors.filter(gle=>gle.baseId===id)[0];
					properties.push(gle);
				})
				const props = { 
					properties: properties, 
					index: cpIndexes[i],
					setIndex: createSetCPIndex(i),
				}
				return <ControllPanel {...props}/>
			})}
			<svg className="connection-panel">
				{props.connections.map(c=>{
					return <path className={'connection-line'} 
					d={calcDList(c.iX, c.iY, c.oX, c.oY).join(' ')}/>	
				})}
				{element}
			</svg>
		</div>
	)
}

// const mapStateToProps = (state: RootState) => state; 
// const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
// 	return { openCP: (id: number) => dispatch(openCPAction(id)) };
// };
// export default connect(mapStateToProps, mapDispatchToProps)(MainBoard);
export default MainBoard;
