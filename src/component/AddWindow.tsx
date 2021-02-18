import React from 'react';
import { NodeModeNames, NodeMode } from '../store/types'

type Props = {
  addRequest: (emt: NodeMode) => void;
}
type RefNM = {
  ref: React.RefObject<HTMLInputElement>;
  nodeMode: NodeMode;
}

const AddWindowForm: React.FC<Props> = ({addRequest}) => {
  let refNMs: RefNM[] = [];
  for (let nodeMode of Object.values(NodeModeNames)){ 
    refNMs.push({ 
      ref: React.createRef(),
      nodeMode: { name: nodeMode }
    })
  }

  const handleClick = (): void => {
    for (let refNM of refNMs) {
      if(refNM.ref.current !== null){
        if(refNM.ref.current.checked){
          addRequest(refNM.nodeMode);
        }
      } else {
        console.log("Error at WindowForm");
      }
    }
  }

  return (
    <React.Fragment>
      {refNMs.map((refNM: RefNM, i: number)=>{
        let name = refNM.nodeMode.name;
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
