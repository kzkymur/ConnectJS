import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import {useDispatch} from 'react-redux';
import { isMovable, isResizable, Sockets, } from '@/store/main/node';
import { ConnectionType, NewConnectionInfo, connectionInfoStatus } from '@/store/main/types';
import { Handler as ConnectionHandler } from '@/component/Connection';
import { ConnectionInfo } from '@/component/MainBoard';
import { Handler as IOsHandler } from './IOs';
import { updatePosAction, updateConnectionPosAction, addConnectionAction } from '@/store/main/actions';
import { multAction } from '@/store/ui/actions';
import Vector, { subtract, multiply, hadamard, signFilter } from '@/utils/vector';
import { minBaseWidth, minBaseHeight, } from '@/config';
import { px, px2n } from '@/utils';
import { deleteAction, updatePosSizeAction } from '@/utils/actions';
import { border as pxBoder, optionalbarHeight as pxOptBarHeight } from '@/style/Node.scss';
import {MultArray} from '@/store/ui/actionTypes';
import ContentType from '@/content/types';
const border = px2n(pxBoder);
const optBarHeight = px2n(pxOptBarHeight);

export const useFunctions = (
  node: ContentType,
  inputConnections: ConnectionInfo[],
  outputConnections: ConnectionInfo[],
  ref: MutableRefObject<HTMLDivElement>,
  mainRef: MutableRefObject<HTMLDivElement>,
  iosRef: MutableRefObject<IOsHandler>,
  newConnectionRef: MutableRefObject<ConnectionHandler>,
  newConnectionInfoRef: MutableRefObject<NewConnectionInfo>
) => {
  const dispatch = useDispatch();
  const getPos = useCallback(() => ({ x: ref.current.offsetLeft, y: ref.current.offsetTop }), [ref]);
  const getSize = useCallback(() => ({ x: ref.current.offsetWidth, y: ref.current.offsetHeight }), [ref]);
  const updatePosStyle = useCallback((v: Vector) => {
    const bcr = ref.current.getBoundingClientRect();
    v = { x: v.x+bcr.left, y: v.y+bcr.top, };
    if (px(v.x) == ref.current.style.left && px(v.y) == ref.current.style.top) return false;
    ref.current.style.left = px(v.x), ref.current.style.top = px(v.y);
    return true;
  }, [ref])
  const updateSizeStyle = useCallback((v: Vector) => {
    const updated = { x: 1, y: 1 };
    v = { x: Math.max(v.x+px2n(ref.current.style.width), minBaseWidth), y: Math.max(v.y+px2n(ref.current.style.height), minBaseHeight) };
    if (v.x === minBaseWidth) updated.x = 0;
    if (v.y === minBaseHeight) updated.y = 0;
    mainRef.current.style.height = px(calcMainHeight(v.y, node.inputs, node.outputs));
    ref.current.style.zIndex = String(-1 * v.x * v.y);
    ref.current.style.width = px(v.x), ref.current.style.height = px(v.y);
    return updated;
  }, [mainRef, ref]);
  const getJointPos = useCallback((isInput: boolean, key: string) => iosRef.current.getJointPos(isInput, key), [iosRef]);
  // const getAllJointPos = useCallback((isInput: boolean) => iosRef.current.getAllJointPos(isInput), [iosRef]);

  const updateSize = useCallback((top: string, left: string, width: string, height: string) => {
    const actions: MultArray = [ updatePosSizeAction(node.id, top, left, width, height), ];
    inputConnections.forEach(c => actions.push(updateConnectionPosAction(c.id, c.s, getJointPos(true, c.toSocketKey))));
    outputConnections.forEach(c => actions.push(updateConnectionPosAction(c.id, getJointPos(false, c.fromSocketKey), c.e)));
    dispatch(multAction(actions));
  }, [inputConnections, outputConnections, getJointPos]);

  const updatePos = useCallback((top: string, left: string) => {
    const actions = [ updatePosAction(node.id, top, left), ];
    inputConnections.forEach(c => actions.push(updateConnectionPosAction(c.id, c.s, getJointPos(true, c.toSocketKey))));
    outputConnections.forEach(c => actions.push(updateConnectionPosAction(c.id, getJointPos(false, c.fromSocketKey), c.e)));
    dispatch(multAction(actions));
  }, [inputConnections, outputConnections, getJointPos]);

  const posChange = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    let s = { x: e.clientX, y: e.clientY };
    const mousemove = (e: MouseEvent) => {
      const m = { x: e.clientX, y: e.clientY, };
      const sm = subtract(m, s); s = m;
      updatePosStyle(sm);
      inputConnections.forEach(ic => { ic.ref.current.changeViewWithDiff(false, sm); });
      outputConnections.forEach(oc => { oc.ref.current.changeViewWithDiff(true, sm); });
    }
    const isPosUpdate = () => {
      const { x, y } = getPos();
      const top = px(y), left = px(x);
      if (isMovable(node) && (left !== node.left || top !== node.top)) {
        updatePos(top, left);
        return true;
      }
      return false;
    }
    const mouseup = () => {
      isPosUpdate();
      window.removeEventListener('mousemove', mousemove);
      window.removeEventListener('mouseup', mouseup);
    }
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
  }, [getPos, updatePos, updatePosStyle, inputConnections, outputConnections]);

  const sizeChange = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const bcr = e.currentTarget.getBoundingClientRect();
    const c = { x: bcr.x + bcr.width / 2, y: bcr.y + bcr.height / 2 };
    let s = { x: e.clientX, y: e.clientY };
    const cs = subtract(s, c), signs = signFilter(cs), revX = { x: -1, y: 1 };
    const mousemove = (e: MouseEvent) => {
      const m = { x: e.clientX, y: e.clientY };
      const sm = subtract(m, s), d = hadamard(sm, signs); s = m;
      const f = updateSizeStyle(multiply(d, 2));
      updatePosStyle(multiply(hadamard(d, f),-1));
      inputConnections.forEach(ic => { ic.ref.current.changeViewWithDiff(false, hadamard(hadamard(revX, d), f)); });
      outputConnections.forEach(oc => { oc.ref.current.changeViewWithDiff(true, hadamard(d, f)); });
    }
    const updateSizeState = () => {
      const v = getSize();
      const width = px(v.x), height = px(calcMainHeight(v.y, node.inputs, node.outputs));
      const pos = getPos();
      if (isResizable(node) && (node.width !== width || node.height !== height)) updateSize(px(pos.y), px(pos.x), width, height);
    }
    const mouseup = () => {
      updateSizeState();
      window.removeEventListener('mousemove', mousemove);
      window.removeEventListener('mouseup', mouseup);
    }
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
  }, [getPos, getSize, updatePosStyle, updateSizeStyle, updateSize, inputConnections, outputConnections]);

  const onBorderRef = useRef(true);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const bcr = e.currentTarget.getBoundingClientRect();
    const m = {x: e.clientX, y: e.clientY };
    const left = bcr.x, right = bcr.x + bcr.width, top = bcr.y, bottom = bcr.y + bcr.height;
    const isLeftSide = left - border < m.x && m.x < left + border, isRightSide = right - border < m.x && m.x < right + border;
    const isUpperSide = top - border < m.y && m.y < top + border, isLowerSide = bottom - border < m.y && m.y < bottom + border;
    let cursor;
    if (isResizable(node) && (isLeftSide || isRightSide || isUpperSide || isLowerSide)) {
      cursor = (isLeftSide && isUpperSide) || (isRightSide && isLowerSide) ? 'nwse' :
        (isLeftSide && isLowerSide) || (isRightSide && isUpperSide) ? 'nesw' :
        isLeftSide || isRightSide ? 'ew' : 'ns';
      cursor = `${cursor}-resize`;
      onBorderRef.current = true;
    } else {
      cursor = 'default';
      onBorderRef.current = false;
    }
    e.currentTarget.style.cursor = cursor;
  }, [node]);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMovable(node)) return;
    if (onBorderRef.current && isResizable(node)) sizeChange(e);
    else posChange(e);
  }, [node, posChange, sizeChange]);

  const operateNewConnection = useCallback((isInput: boolean, key: string) => () => {
    newConnectionInfoRef.current.id = -1;
    const v = getJointPos(isInput, key);
    if (isInput) {
      newConnectionInfoRef.current = {
        ...incompleteConnection,
        to: node,
        toSocketKey: key,
        e: v,
      };
    } else {
      isInput = false;
      newConnectionInfoRef.current = {
        ...incompleteConnection,
        fromNodeId: node.id,
        fromSocketKey: key,
        s: v,
      };
    }
    const mousemove = (e: MouseEvent) => {
      const eClient = { x: e.clientX, y: e.clientY, };
      if (isInput) newConnectionRef.current.changeView(eClient, v);
      else newConnectionRef.current.changeView(v, eClient);
    }
    const mouseup = () => {
      const zeroV = { x: 0, y:0 };
      newConnectionRef.current.changeView(zeroV, zeroV);
      window.removeEventListener('mousemove', mousemove);
      window.addEventListener('mouseup', mouseup);
    }
    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
  }, [getJointPos, newConnectionRef]);

  const registerNewConnection = useCallback((isInput: boolean, key: string) => () => {
    let ncir = newConnectionInfoRef.current as any as ConnectionType;
    const v = getJointPos(isInput, key);
    if (isInput) {
      if (ncir.fromNodeId === undefined) throw new Error("From node is not registered");
      ncir = {
        ...ncir,
        to: node,
        toSocketKey: key,
        e: v,
      };
    } else {
      if (ncir.to === undefined) throw new Error("To node is not registered");
      ncir = {
        ...ncir,
        fromNodeId: node.id,
        fromSocketKey: key,
        s: v,
      };
    }
    dispatch(addConnectionAction(ncir));
  }, [newConnectionInfoRef, getJointPos, node.id]);

  const deleteFunc = useCallback(() => {
    dispatch(deleteAction(node.id, [ ...inputConnections.map(c=>c.id), ...outputConnections.map(c=>c.id), ])); }, [node.id, inputConnections, outputConnections]);

  return {
    onMouseDown,
    onMouseMove,
    operateNewConnection,
    registerNewConnection,
    deleteFunc,
  };
}

export const useStyleEffect = (node: ContentType, ref: MutableRefObject<HTMLDivElement>, mainRef: MutableRefObject<HTMLDivElement>) => {
  useEffect(()=>{
    const elm = ref.current;
    elm.style.opacity = '1';
  })

  if (isMovable(node)) useEffect(()=>{
    const elm = ref.current;
    const { top, left } = node;
    elm.style.top = top;
    elm.style.left = left;
  }, [node.top, node.left]);

  if (isResizable(node)) useEffect(()=>{
    const elm = ref.current;
    const { width, height } = node;
    elm.style.width = px(px2n(width) - border * 2);
    mainRef.current.style.height = px(px2n(height) - border * 2 + 2);
    elm.style.height = px(px2n(height) + optBarHeight * (Math.max(objectLength(node.inputs), objectLength(node.outputs))+1) - border * 2 + 2);
  }, [node.width, node.height]);
}

const calcMainHeight = (height: number, inputs: Sockets, outputs: Sockets): number => (height - optBarHeight * (Math.max(objectLength(inputs), objectLength(outputs))+1));
const objectLength = (obj: Object) => Object.keys(obj).length;
const incompleteConnection = { id: -1, type: 1, status: connectionInfoStatus.incomplete, };
