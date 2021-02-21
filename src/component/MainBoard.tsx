import React, { useRef, useState, useEffect } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { deleteAction, addConnectionAction } from '@/store/node/actions';
import { openCPAction } from '@/store/panel/actions';
import { Content, Connection, OutputTypes } from '@/store/node/types';
import Base from './Base';
import ControllPanel from './ControllPanel';
import style from '@/style/MainBoard.css';

type BaseIdRefType = {
  id: number;
  ref: React.RefObject<HTMLDivElement>;
}
type ConnectionMoveBuffer = {
  isInput: boolean;
  id: number;
  channel: number;
  pos: number[];
}

const MainBoard: React.FC = () => {
  const props = useSelector((state: RootState) => state.nodeReducer);
  const cpIdsList = useSelector((state: RootState) => state.panelReducer.cpIdsList);
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
  const getIndex = (objs: BaseIdRefType[]|Content[], id: number): number => {
    let i = -1;
    for (let baseIdRef of objs) {
      i++;
      if (baseIdRef.id === id) return i;
    }
    return -1;
  }
  const addBIR = (id: number) => [...baseIdRefs, {id: id, ref: React.createRef<HTMLDivElement>()}];
  const removeBIR = (id: number) => baseIdRefs.filter(bmi=>bmi.id!==id);
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
          id: id,
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
        oBaseId: connectionMoveBuffer.id, oChannel: connectionMoveBuffer.channel,
      } : {
        type: OutputTypes.Number,
        iBaseId: connectionMoveBuffer.id, iChannel: connectionMoveBuffer.channel,
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
  useEffect(()=>{ 
    window.addEventListener('mousemove', moving); 
    window.addEventListener('mouseup', endMoving); 
    return () =>  { 
      window.removeEventListener('mousemove', moving); 
      window.removeEventListener('mouseup', endMoving); 
    }
  });

  // controlPanel系
  const createOpenCP = (id: number) => {
    const openCP = () => {
      const currentIndex = cpIdsList[0].indexOf(id);
      if (currentIndex === -1) {
        openCPFunc(id);
        createSetCPIndex(0)(cpIdsList[0].length);
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
    props.contents.forEach(c=>{
      const i = getIndex(newBaseIdRefs, c.id);
      if (i === -1) { flag = true; newBaseIdRefs = addBIR(c.id); }
    });
    newBaseIdRefs.forEach(bir=>{
      const i = getIndex(props.contents, bir.id);
      if (i === -1) { flag = true; newBaseIdRefs = removeBIR(bir.id); }
    });
    if (flag) setBaseIdRefs(newBaseIdRefs);
  }, [props.contents]);
  useEffect(()=>{
    for (const i in cpIdsList) {
      if (cpIndexes[i] === undefined) {
        return setCPIndexes([...cpIndexes, 0]);
      }
    }
  }, [cpIdsList]);

  // svg系
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
        const editor = props.contents.filter(c=>c.id === baseIdRef.id)[0];
        if (editor===undefined) return null;
        const {cscm, cac} = createCreateFuncs(editor.id);
        const baseProps = {
          property: editor, 
          fRef: baseIdRef.ref,
          startMoving: createStartMoving(editor.id),
          createStartConnectionMoving: cscm,
          createAddConnection: cac,
          delete: createDeleteFunc(editor.id),
          openCP: createOpenCP(editor.id),
        }
        return <Base key={editor.id}{...baseProps}/>
      })}
      {cpIdsList.map((ids: number[], i)=>{
        if(ids[0]===undefined) return;
        let properties: Content[] = [];
        ids.forEach(id=>{
          let c = props.contents.filter(c=>c.id===id)[0];
          properties.push(c);
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

