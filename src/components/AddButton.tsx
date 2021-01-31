import React from 'react';
import { EditorModeNames, EditorModeType } from '../store/types';

type Props = {
  addRequest: (emt: EditorModeType) => void;
}
type RefEMN = {
  ref: React.RefObject<HTMLInputElement>;
  editorMode: EditorModeType;
}

export const WindowForm: React.FC<Props> = ({addRequest}) => {
  let refEMNs: RefEMN[] = [];
  let i: number = -1;
  for (let editorMode of Object.values(EditorModeNames)){ 
    refEMNs.push({ 
      ref: React.useRef(null),
      editorMode: { name: editorMode }
    })
  }

  const handleClick = (): void => {
    for (let refEMN of refEMNs) {
      if(refEMN.ref.current){
        if(refEMN.ref.current.value){
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
        i++;
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

