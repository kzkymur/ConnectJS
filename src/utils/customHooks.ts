import { MutableRefObject, useEffect, useMemo, useState } from 'react'; 
import { Obj } from '../utils'; 

export type IdRef<Handler, Source extends Obj> = Source & { ref: MutableRefObject<Handler>; }
export function useIdRef <Handler, Source extends Obj>(sourceObjs: Source[]): (IdRef<Handler, Source>)[] {
  const [idRefs, setIdRefs] = useState<(IdRef<Handler, Obj>)[]>([]);

  useEffect(()=>{
    let newIdRefs = [...idRefs];
    let updateFlag = false;

    sourceObjs.forEach(so => {
      if (!idRefs.some(e => e.id === so.id)) { 
        updateFlag = true;
        newIdRefs.push({ id: so.id, ref: { current: ({} as Handler) }});
      }
    })

    idRefs.forEach(ir => {
      if (!sourceObjs.some(e => e.id === ir.id)) {
        updateFlag = true;
        newIdRefs = newIdRefs.filter(idRef => idRef.id !== ir.id);
      }
    })

    if (updateFlag) setIdRefs(newIdRefs);

  }, [sourceObjs]);

  const sourceRefs = useMemo(
    ()=>sourceObjs.map(s => Object.assign(s, idRefs.filter(ir => ir.id === s.id)[0])),
    [sourceObjs, idRefs]);

  return sourceRefs;
}

export function usePropsFactory <Props extends Obj, T extends Obj> (sourceObjs: T[], factory: (obj: T) => Props): Props[] {
  const [props, setProps] = useState<Props[]>([]);

  useEffect(()=>{
    let newProps = [...props];
    let updateFlag = false;

    sourceObjs.forEach(so => {
      if (!props.some(e => e.id === so.id)) { 
        updateFlag = true;
        newProps.push(factory(so));
      }
    })

    props.forEach(p => {
      if (!sourceObjs.some(e => e.id === p.id)) {
        updateFlag = true;
        newProps = newProps.filter(np => np.id !== p.id);
      }
    })

    if (updateFlag) setProps(newProps);
  }, [sourceObjs]);

  return props;
}
