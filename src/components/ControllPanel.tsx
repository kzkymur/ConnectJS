import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { glEditor, EditorModeNames, InputInfo, OutputInfo, OutputTypes, OutputType } from '../store/types';
import { updateAction, closeCPAction, closeAllCPAction } from '../store/actions';
import NameBox from './NameBox';
import './ControllPanel.css';

type Props = {
	properties: glEditor[],
	index: number,
	setIndex: (i: number) => void,
}

const ControlPanel: React.FC<Props> = props => {
	const dispatch = useDispatch();
	const index = props.index;
	const updateFunc = (gle: glEditor) => dispatch(updateAction(gle));
	useEffect(()=>{
	}) 

	const nameUpdate = (name: string) => {
		const newBaseStyle: glEditor = {
			...props.properties[index],
			name: name,
		};
		updateFunc(newBaseStyle);
	}
	const closeAllFunc = () => dispatch(closeAllCPAction());
	const createChangeIndexFunc = (newIndex: number) => {
		const changeIndexFunc = (e: React.MouseEvent<HTMLInputElement>) => {
			if (index!==newIndex) {
				e.preventDefault();
				props.setIndex(newIndex);
			}
		}
		return changeIndexFunc;
	}
	const createCloseFunc = (closeIndex: number) => {
		const closeFunc = () => {
			dispatch(closeCPAction(closeIndex));
			if (closeIndex===index) {
				props.setIndex(0);
			} else if (closeIndex < index) {
				props.setIndex(index-1);
			}
		}
		return closeFunc;
	}

	let defaultOutputType: OutputType;
	switch (props.properties[index].mode.name) {
		case EditorModeNames.Canvas: {
			defaultOutputType = OutputTypes.Framebuffer;
			break;
		}
		default: {
			defaultOutputType = OutputTypes.Number;
		}
	}
	const addInput = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const inputInfo: InputInfo = {
			type: defaultOutputType,
			name: 'value',
		}
		const newProperty: glEditor = {
			...props.properties[index],
			inputs: [...props.properties[index].inputs, inputInfo]
		};
		updateFunc(newProperty);
	}
	const addOutput = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const outputInfo: OutputInfo = {
			type: defaultOutputType,
			name: 'value',
			isConnected: false,
		}
		const newProperty: glEditor = {
			...props.properties[index],
			outputs: [...props.properties[index].outputs, outputInfo]
		};
		updateFunc(newProperty);
	}

	let i = -1;
	return (
		<div className={'controllPanel'}>
			<div className={'headerContainer'}>
				{props.properties.map(property=>{
					i++;
					return(
						<div className={`cpTabContainer ${i===index ? 'activeCPTabContainer' : undefined}`}>
							<NameBox className={'nameBoxInCP'}
								name={property.name}
								updateFunc={nameUpdate}
								onMouseDown={createChangeIndexFunc(i)}/>
							<button className={'closeCPButton'}onClick={createCloseFunc(i)}>×</button>
						</div>
					)
				})}
			</div>
				<div className={'inputContainer'}>
					<button onClick={addInput}>Add</button>
						{props.properties[index].inputs.map((input)=>{
							i++;
							return <input className={'ioElm'}type='text'value={i}/>
						})}
				</div>
				<div className={'inputContainer'}>
					<button onClick={addOutput}>Add</button>
						{props.properties[index].outputs.map((output)=>{
							i++;
							return <input className={'ioElm'}type='text'value={i}/>
						})}
				</div>
		</div>
	)
}

export default ControlPanel;

