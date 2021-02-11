import React, { useRef, useState, useEffect } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { deleteAction, openCPAction, addConnectionAction } from '../store/actions';
import { glEditor, Connection, OutputTypes } from '../store/types';
import Base from './Base';
import ControllPanel from './ControllPanel';
import style from '@/style/MainBoard.css';

type BaseIdRefType = {
  baseId: number;
  ref: React.RefObject<HTMLDivElement>;
}
type ConnectionMoveBuffer = {
  isInput: boolean;
  baseId: number;
  channel: number;
  pos: number[];
}

const MainBoard: React.FC = () => {
  const props = useSelector((state: RootState) => state);
  const [baseIdRefs, setBaseIdRefs] = useState<BaseIdRefType[]>([]);
  const [cpIndexes, setCPIndexes] = useState<number[]>([]);

  const [startPos, setStartPos] = useState<number[]>([]);
  const [movingRef, setMovingRef] = useState<undefined | React.RefObject<HTMLDivElement>>();
  const [connectionMoveRef] = useState(useRef<SVGPathElement>(null));
  const [connectionMoveBuffer, setConnectionMoveBuffer] = useState<undefined | ConnectionMoveBuffer>();

  const dispatch = useDispatch();
  const openCPFunc = (id: number) => dispatch(openCPAction(id));
  const addConnection = (c: Connection) => dispatch(addConnectionAction(c));


  // refのsetup
  const getIndex = (objs: BaseIdRefType[]|glEditor[], id: number): number => {
    let i = -1;
    for (let baseIdRef of objs) {
      i++;
      if (baseIdRef.baseId === id) return i;
    }
    return -1;
  }
  const addBIR = (id: number) => [...baseIdRefs, {baseId: id, ref: React.createRef<HTMLDivElement>()}];
  const removeBIR = (id: number) => baseIdRefs.filter(bmi=>bmi.baseId!==id);
  // const removeBMI = (id: number) => {
  //   const newBMIs = baseIdRefs.filter(bmi=>bmi.id!==id);
  //   setBaseIdRefs([...newBMIs])
  // }
  const createDeleteFunc = (id: number) => () => dispatch(deleteAction(id));

  // Drag操作系
  const createStartMoving = (id: number) => {
    const startMoving = (startPosX: number, startPosY: number) => {
      const movingNodeIndex = getIndex(baseIdRefs, id);
      setMovingRef(baseIdRefs[movingNodeIndex].ref);
      setStartPos([startPosX, startPosY]);
    }
    return startMoving;
  }
  const createCreateFuncs = (id: number) => {
    const createStartConnectionMoving = (isInput: boolean, channel: number, isConnected: boolean) => {
      const startConnectionMoving = (e: React.MouseEvent<HTMLDivElement>) => {
        let newConnectionMoveBuffer = {
          isInput: isInput,
          baseId: id,
          channel: channel,
        }
        if (isConnected) {
          // すでに繋がれている状態の場合、固定点が始点でなくなる為注意
          // setConnectionMoveBuffer(newConnectionMoveBuffer);
        } else {
          const joint = e.currentTarget;
          const jointRect = joint.getBoundingClientRect();
          setConnectionMoveBuffer({
            ...newConnectionMoveBuffer,
            pos: [jointRect.left + joint.offsetWidth / 2, jointRect.top + joint.offsetHeight / 2]
          });
        }
      }
      return startConnectionMoving;
    }
    const createAddConnection = (isInput: boolean, channel: number) => {
      if (connectionMoveBuffer === undefined ) return ()=>{};
      if (connectionMoveBuffer.isInput === isInput) return ()=>{};
      const newConnection: Connection = isInput ? {
        type: OutputTypes.Number,
        iBaseId: id, iChannel: channel,
        oBaseId: connectionMoveBuffer.baseId, oChannel: connectionMoveBuffer.channel,
      } : {
        type: OutputTypes.Number,
        iBaseId: connectionMoveBuffer.baseId, iChannel: connectionMoveBuffer.channel,
        oBaseId: id, oChannel: channel,
      }
      return ()=>addConnection(newConnection);
    }
    return {cscm: createStartConnectionMoving, cac: createAddConnection};
  }
  const moving = (e: MouseEvent) => {
    const ref = movingRef;
    if (ref !== undefined) {
      const elm = ref.current;
      if (elm === null) return; 
      elm.style.left = (e.clientX - startPos[0]) + 'px';
      elm.style.top = (e.clientY - startPos[1]) + 'px';
    } else if (connectionMoveBuffer !== undefined) {
      const elm = connectionMoveRef.current;
      if (elm === null) return;
      const {pos, isInput} = connectionMoveBuffer;
      let Sx, Sy, Ex, Ey;
      if (isInput) {
        Sx = e.clientX; Sy = e.clientY; Ex = pos[0]; Ey = pos[1];
      } else {
        Sx = pos[0]; Sy = pos[1]; Ex = e.clientX; Ey = e.clientY; 
      }
      const dList = calcDList(Sx, Sy, Ex, Ey);
      elm.attributes[1].value = dList.join(' ');
    }
  }
  const calcDList = (Sx: number, Sy: number, Ex: number, Ey: number) => {
    let dList :(number | string)[] = ['M']; dList[3] = 'Q'; dList[8] = 'T';
    dList[1] = Sx; dList[2] = Sy; dList[9] = Ex; dList[10] = Ey;
    dList[4] = Math.abs((Ex-Sx)*props.curving)+Sx; dList[5] = Sy;
    dList[6] = (Sx + Ex) / 2; dList[7] = (Sy + Ey) / 2;
    return dList;
  }
  const endMoving = () => { 
    if (movingRef !== undefined) {
      setMovingRef( undefined);
    } else if (connectionMoveBuffer !== undefined) {
      setConnectionMoveBuffer(undefined);
    }
  }


  // controlPanel系
  const createOpenCP = (id: number) => {
    const openCP = () => {
      const currentIndex = props.cpIdsList[0].indexOf(id);
      if (currentIndex === -1) {
        openCPFunc(id);
        createSetCPIndex(0)(props.cpIdsList[0].length);
      } else if (currentIndex !== cpIndexes[0]){
        createSetCPIndex(0)(currentIndex);
      }
    }
    return openCP;
  }
  const createSetCPIndex = (cpIndex: number) => {
    const setCPIndex = (newIndex: number) => {setCPIndexes( cpIndexes.map( (oldIndex, i) => i === cpIndex ? newIndex : oldIndex ))}
    return setCPIndex
  }


  // 状態確認系
  useEffect(()=>{
    let newBaseIdRefs = [...baseIdRefs];
    let flag = false;
    props.glEditors.forEach(gle=>{
      const i = getIndex(newBaseIdRefs, gle.baseId);
      if (i === -1) { flag = true; newBaseIdRefs = addBIR(gle.baseId); }
    });
    newBaseIdRefs.forEach(bir=>{
      const i = getIndex(props.glEditors, bir.baseId);
      if (i === -1) { flag = true; newBaseIdRefs = removeBIR(bir.baseId); }
    });
    if (flag) setBaseIdRefs(newBaseIdRefs);
  }, [props.glEditors]);
  useEffect(()=>{
    for (const i in props.cpIdsList) {
      if (cpIndexes[i] === undefined) {
        return setCPIndexes([...cpIndexes, 0]);
      }
    }
  }, [props.cpIdsList]);

  useEffect(()=>{ 
    window.addEventListener('mousemove', moving); 
    window.addEventListener('mouseup', endMoving); 
    return () =>  { 
      window.removeEventListener('mousemove', moving); 
      window.removeEventListener('mouseup', endMoving); 
    }
  });
  let element;
  if (connectionMoveBuffer !== undefined) {
    console.log(connectionMoveBuffer);
    const [posX, posY] = connectionMoveBuffer.pos;
    const dList = ['M', posX, posY, 'Q', posX, posY, posX, posY, 'T', posX, posY];
    element = <path className={style.connectionLine} ref={connectionMoveRef} d={dList.join(' ')} />;
  }
  return (
    <div className={style.mainBoard}>
      {baseIdRefs.map((baseIdRef: BaseIdRefType)=>{
        const editor = props.glEditors.filter(gle=>gle.baseId === baseIdRef.baseId)[0];
        if (editor===undefined) return null;
        const {cscm, cac} = createCreateFuncs(editor.baseId);
        const baseProps = {
          property: editor, 
          fRef: baseIdRef.ref,
          startMoving: createStartMoving(editor.baseId),
          createStartConnectionMoving: cscm,
          createAddConnection: cac,
          delete: createDeleteFunc(editor.baseId),
          openCP: createOpenCP(editor.baseId),
        }
        return <Base key={editor.baseId}{...baseProps}/>
      })}
      {props.cpIdsList.map((ids: number[], i)=>{
        if(ids[0]===undefined) return;
        let properties: glEditor[] = [];
        ids.forEach(id=>{
          let gle = props.glEditors.filter(gle=>gle.baseId===id)[0];
          properties.push(gle);
        })
        const cpProps = { 
          properties: properties, 
          index: cpIndexes[i],
          setIndex: createSetCPIndex(i),
        }
        return <ControllPanel {...cpProps} key={i}/>
      })}
      <svg className={style.connectionPanel}>
        {props.connections.map((c, i)=>{
          const inputJoint = document.getElementById(`iJoint-${c.iBaseId}-${c.iChannel}`);
          const outputJoint = document.getElementById(`oJoint-${c.oBaseId}-${c.oChannel}`);
          if (inputJoint === null || outputJoint === null ) return;

          const inputRect = inputJoint.getBoundingClientRect();
          const outputRect = outputJoint.getBoundingClientRect();
          const iX = inputRect.left + inputJoint.offsetWidth / 2, iY = inputRect.top + inputJoint.offsetHeight / 2;
          const oX = outputRect.left + outputJoint.offsetWidth / 2, oY = outputRect.top + outputJoint.offsetHeight / 2;
          return <path className={style.connectionLine} 
            d={calcDList(oX, oY, iX, iY).join(' ')} key={i}/>	
        })}
        {element}
      </svg>
    </div>
  )
}

export default MainBoard;

