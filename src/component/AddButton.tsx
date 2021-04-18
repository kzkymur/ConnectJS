import React from 'react';
import { NodeModeNames, NodeMode } from '@/store/node/types';

type Props = {
  addRequest: (emt: NodeMode) => void;
}
type RefEMN = {
  ref: React.RefObject<HTMLInputElement>;
  nodeMode: NodeMode;
}

export const WindowForm: React.FC<Props> = ({addRequest}) => {
  let refEMNs: RefEMN[] = [];
  let i: number = -1;
  for (let nodeMode of Object.values(NodeModeNames)){ 
    refEMNs.push({ 
      ref: React.useRef(null),
      nodeMode: { name: nodeMode }
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
      {refEMNs.map((refEMN: RefEMN)=>{
        i++;
        let name = refEMN.nodeMode.name;
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

