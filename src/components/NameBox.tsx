import React, { useState, useEffect } from 'react';
import style from '@/style/NameBox.css';

type Props = {
  className?: string;
  name: string;
  updateFunc: (name: string) => void;
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLInputElement>) => void;
}
const NameBox: React.FC<Props> = props => {
  let ref = React.useRef<HTMLInputElement>(null);
  const [name, setName] = useState(props.name);
  const [isFocusing, setIsFocusing] = useState(false);
  const supportEnterBlur = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (ref.current !== null) {
        ref.current.blur();
        setIsFocusing(false);
      }
    }
  }
  const nameUpdate = () => {
    if (ref.current === null) return;
    if (name !== '') {
      if (name !== props.name) props.updateFunc(name);
    } else {
      ref.current.value = props.name;
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFocusing(true);
    setName(e.target.value);
  }
  useEffect(()=>{
    if (ref.current !== null) {
      ref.current.value = props.name;
      if (!isFocusing) {
        setName(props.name);
        ref.current.blur();
      }
    }
  })
  return (
    <input className={`${style.nameBox} ${props.className}`}
      type='text'
      ref={ref} 
      value={name} 
      onKeyPress={supportEnterBlur} 
      onBlur={nameUpdate} 
      onChange={handleChange}
      onClick={props.onClick}
      onFocus={props.onFocus}
      onMouseDown={props.onMouseDown}
      onMouseMove={props.onMouseMove}
      onMouseUp={props.onMouseUp}
    />
  )
}

export default NameBox;

