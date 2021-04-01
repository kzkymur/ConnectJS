import { MutableRefObject, useEffect, useState } from 'react'; 
import { getIndex } from '../utils'; 

export type Obj = { id: number; }
export type IdRef<Handler> = Obj & { ref: MutableRefObject<Handler>; }

export function useIdRef <Handler>(sourceObjs: Obj[]): IdRef<Handler>[] {
  const [idRefs, setIdRefs] = useState<IdRef<Handler>[]>([]);
  useEffect(()=>{ 
    let newIdRefs = [...idRefs];
    let updateFlag = false;
    for (const so of sourceObjs) {
      const i = getIndex(newIdRefs, so.id);
      if (i === -1) { 
        updateFlag = true;
        newIdRefs = [...idRefs, { id: so.id, ref: { current: ({} as Handler) }}];
      }
    }
    for (const ir of newIdRefs) {
      const i = getIndex(sourceObjs, ir.id);
      if (i === -1) {
        updateFlag = true;
        newIdRefs = idRefs.filter(idRef=>idRef.id!==ir.id);
      }
    }
    if (updateFlag) setIdRefs(newIdRefs);
    console.log(sourceObjs);
    console.log(newIdRefs);
  }, [sourceObjs]);
  return idRefs;
}
