import React from 'react';
import { EditorModeNames, EditorModeType } from '../store/types'

type Props = {
	addRequest: (emt: EditorModeType) => void;
}
type RefEMN = {
	ref: React.RefObject<HTMLInputElement>;
	editorMode: EditorModeType;
}

const AddWindowForm: React.FC<Props> = ({addRequest}) => {
	let refEMNs: RefEMN[] = [];
	for (let editorMode of Object.values(EditorModeNames)){ 
		refEMNs.push({ 
			ref: React.createRef(),
			editorMode: { name: editorMode }
		})
	}

	const handleClick = (): void => {
		for (let refEMN of refEMNs) {
			if(refEMN.ref.current !== null){
				if(refEMN.ref.current.checked){
					addRequest(refEMN.editorMode);
				}
			} else {
				console.log("Error at WindowForm");
			}
		}
	}

	return (
		<React.Fragment>
		{refEMNs.map((refEMN: RefEMN)=>{
			let name = refEMN.editorMode.name;
			return (
				<React.Fragment>
					<input type="radio" name="windowForm" ref={refEMN.ref} id={name}/>
					<label htmlFor={name}>{name}</label>
				</React.Fragment>
			)
		})}
		<button onClick={handleClick}>Add</button>
	</React.Fragment>
	);
};

export default AddWindowForm;
