import React from 'react';
import { useDispatch } from 'react-redux';
import { undoAction, redoAction } from '@/store/node/actions';

interface keybindCombo {
  condition: (e: KeyboardEvent) => boolean;
  consequent: () => void;
}
const Keybind: React.FC = () => {
  const dispatch = useDispatch();
  const undo = () => dispatch(undoAction());
  const redo = () => dispatch(redoAction());
  const keybindCombos: keybindCombo[] = [{
    condition: e=>((e.ctrlKey || e.metaKey) && e.key==='z' && (!e.shiftKey)),
      consequent: undo,
  }, {
    condition: e=>((e.ctrlKey || e.metaKey) && ((e.shiftKey && e.key==='z') || e.key==='y')),
      consequent: redo,
  }];
  const keybind = (e: KeyboardEvent) => {
    if (e.repeat) return;
    for ( let keybindCombo of keybindCombos) {
      if(keybindCombo.condition(e)) return keybindCombo.consequent();
    }
  }
  const bind = () => { window.addEventListener('keydown', keybind); }
  const unbind = () => { window.removeEventListener('keydown', keybind); }
  React.useEffect(()=>{
    bind();
    return unbind;
  })
  return ( <React.Fragment></React.Fragment> ) 
}

export default Keybind;
