import React from 'react';
import { useDispatch } from 'react-redux';
import { EditorModeType } from '../store/types';
import { addAction } from '../store/actions';
import AddWindowForm from './AddWindow';
import style from '@/style/Header.css';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const addRequest = (emt: EditorModeType) => dispatch(addAction(emt));
  return (
    <div className={style.header}>
      <AddWindowForm addRequest={addRequest}/>
    </div>
  )
}

export default Header;

