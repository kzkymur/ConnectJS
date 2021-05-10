import React from 'react';
import { NodeModeType, NodeModes } from '@/store/node/nodeTypes'

type Props = {
  addRequest: (emt: NodeModeType) => void;
}
type RefNM = {
  ref: React.RefObject<HTMLInputElement>;
  nodeMode: NodeModeType;
}

const AddWindowForm: React.FC<Props> = ({addRequest}) => {
  let refNMs: RefNM[] = [];
  for (let nodeMode of Object.values(NodeModes)){ 
    refNMs.push({ 
      ref: React.createRef(),
      nodeMode,
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
      {refNMs.map((refNM, i)=>{
        let name = refNM.nodeMode;
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
