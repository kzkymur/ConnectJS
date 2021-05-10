import React from 'react';
import { NodeModeType, NodeModes } from '@/store/node/nodeTypes';

type Props = {
  addRequest: (emt: NodeModeType) => void;
}
type RefEMN = {
  ref: React.RefObject<HTMLInputElement>;
  nodeMode: NodeModeType;
}

export const WindowForm: React.FC<Props> = ({addRequest}) => {
  let refEMNs: RefEMN[] = [];
  for (let nodeMode of Object.values(NodeModes)){ 
    refEMNs.push({ 
      ref: React.useRef(null),
      nodeMode,
    })
  }

  const handleClick = (): void => {
    for (let refEMN of refEMNs) {
      if(refEMN.ref.current){
        if(refEMN.ref.current.value){
          addRequest(refEMN.nodeMode);
        }
      } else {
        console.log("Error at WindowForm");
      }
    }
  }

  return (
    <React.Fragment>
      {refEMNs.map((refEMN)=>{
        let name = refEMN.nodeMode;
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

