import { MutableRefObject, useRef } from 'react'; 
import { getIndex } from '../utils'; 

export type Obj = { id: number; }
export type IdRef<Handler> = Obj & { ref: MutableRefObject<Handler>; }

const addIR = <H>(idRefs: IdRef<H>[], id: number) => [...idRefs, {id: id, ref: useRef({} as H)}];
const removeIR = <H>(idRefs: IdRef<H>[] ,id: number) => idRefs.filter(idRef=>idRef.id!==id);

export const updateIdRefs = <Handler>(idRefs: IdRef<Handler>[], sourceObjs: Obj[], updateFunc: (idRefs: IdRef<Handler>[])=>void) => {
  let newIdRefs = [...idRefs];
  let flag = false;
  sourceObjs.forEach(c=>{
    const i = getIndex(newIdRefs, c.id);
    if (i === -1) { flag = true; newIdRefs = addIR<Handler>(idRefs, c.id); }
  });
  newIdRefs.forEach(bir=>{
    const i = getIndex(sourceObjs, bir.id);
    if (i === -1) { flag = true; newIdRefs = removeIR<Handler>(idRefs, bir.id); }
  });
  if (flag) updateFunc(newIdRefs);
}
