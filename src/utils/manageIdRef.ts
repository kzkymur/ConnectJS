import { MutableRefObject, useEffect, useState } from 'react'; 
import { Obj, getIndex } from '../utils'; 

export type IdRef<Handler> = Obj & { ref: MutableRefObject<Handler>; }

export default function useIdRef <Handler, Source extends Obj>(sourceObjs: Source[]): (Source & IdRef<Handler>)[] {
  const [idRefs, setIdRefs] = useState<(IdRef<Handler> & Source)[]>([]);
  useEffect(()=>{ 
    let newIdRefs = [...idRefs];
    let updateFlag = false;
    for (const so of sourceObjs) {
      const i = getIndex(newIdRefs, so.id);
      if (i === -1) { 
        updateFlag = true;
        newIdRefs = [...idRefs, { ...so, ref: { current: ({} as Handler) }}];
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
  }, [sourceObjs]);
  return idRefs;
}
