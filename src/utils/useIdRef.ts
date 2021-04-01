import { MutableRefObject, useEffect, useState } from 'react'; 
import { Obj, getIndex } from '../utils'; 

export type IdRef<Handler> = Obj & { ref: MutableRefObject<Handler>; }

export default function useIdRef <Handler>(sourceObjs: Obj[]): (IdRef<Handler>)[] {
  const [idRefs, setIdRefs] = useState<(IdRef<Handler>)[]>([]);
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
  }, [sourceObjs]);
  return idRefs;
}

type MSAIR = <Source extends Obj, Handler>(sources: Source[], idRefs: IdRef<Handler>[]) => (Source & IdRef<Handler>)[];
export const mergeSourceAndIdRefs: MSAIR = (S, I) => S.filter(s=>getIndex(I, s.id)!==-1).map(s=>({...s, ref: I[getIndex(I, s.id)].ref}));
