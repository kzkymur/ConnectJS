import React from 'react';
import { ModeType, Modes } from '@/content/types';

type Props = {
  addRequest: (emt: ModeType) => void;
}
type RefEMN = {
  ref: React.RefObject<HTMLInputElement>;
  mode: ModeType;
}

export const WindowForm: React.FC<Props> = ({addRequest}) => {
  let refEMNs: RefEMN[] = [];
  for (let mode of Object.values(Modes)){ 
    refEMNs.push({ 
      ref: React.useRef(null),
      mode,
    })
  }

  const handleClick = (): void => {
    for (let refEMN of refEMNs) {
      if(refEMN.ref.current){
        if(refEMN.ref.current.value){
          addRequest(refEMN.mode);
        }
      } else {
        console.log("Error at WindowForm");
      }
    }
  }

  return (
    <React.Fragment>
      {refEMNs.map((refEMN)=>{
        let name = refEMN.mode;
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

