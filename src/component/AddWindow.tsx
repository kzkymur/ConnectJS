import React from 'react';
import { ModeType, Modes } from '@/content/types';

type Props = {
  addRequest: (emt: ModeType) => void;
}
type RefNM = {
  ref: React.RefObject<HTMLInputElement>;
  mode: ModeType;
}

const AddWindowForm: React.FC<Props> = ({addRequest}) => {
  let refNMs: RefNM[] = [];
  for (let mode of Object.values(Modes)){ 
    refNMs.push({ 
      ref: React.createRef(),
      mode,
    })
  }

  const handleClick = (): void => {
    for (let refNM of refNMs) {
      if(refNM.ref.current !== null){
        if(refNM.ref.current.checked){
          addRequest(refNM.mode);
        }
      } else {
        console.log("Error at WindowForm");
      }
    }
  }

  return (
    <React.Fragment>
      {refNMs.map((refNM, i)=>{
        let name = refNM.mode;
        return (
          <React.Fragment key={i}>
            <input type="radio" name="windowForm" ref={refNM.ref} id={name}/>
            <label htmlFor={name}>{name}</label>
          </React.Fragment>
        )
      })}
      <button onClick={handleClick}>Add</button>
    </React.Fragment>
  );
};

export default AddWindowForm;
