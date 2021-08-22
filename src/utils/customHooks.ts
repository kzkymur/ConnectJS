import { MutableRefObject, useEffect, useState } from 'react'; 
import { Obj } from '../utils'; 

export type IdRef<Handler, Source extends Obj> = Source & { ref: MutableRefObject<Handler>; }
export function useIdRef <Handler, Source extends Obj>(sourceObjs: Source[]): (IdRef<Handler, Source>)[] {
  const [idRefs, setIdRefs] = useState<(IdRef<Handler, Source>)[]>([]);

  useEffect(()=>{
    let newIdRefs = [...idRefs];
    let updateFlag = false;

    sourceObjs.forEach(so => {
      if (!idRefs.some(e => e.id === so.id)) { 
        updateFlag = true;
        newIdRefs.push(Object.assign(so, { ref: { current: ({} as Handler) }}));
      }
    })

    newIdRefs.forEach(ir => {
      if (!sourceObjs.some(e => e.id === ir.id)) {
        updateFlag = true;
        newIdRefs = newIdRefs.filter(idRef=>idRef.id!==ir.id);
      }
    })

    if (updateFlag) setIdRefs(newIdRefs);

  }, [sourceObjs]);

  return idRefs;
}

export function usePropsFactory <Props, T> (sourceObjs: T[], factory: (obj: T) => Props): Props[] {
  const [props, setProps] = useState<Props[]>([]);
  const [oldSources, setOldSources] = useState<Object[]>([]);

  useEffect(()=>{
    let newProps = [...props];
    let updateFlag = false;

    sourceObjs.forEach((so, i) => {
      if (oldSources[i]!==so) { 
        updateFlag = true;
        newProps.splice(i, 1, factory(so));
      }
    })

    if (updateFlag) {
      setProps(newProps);
      setOldSources(sourceObjs);
    }
  }, [sourceObjs]);

  return props;
}
