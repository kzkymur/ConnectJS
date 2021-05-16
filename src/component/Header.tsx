import React from 'react';
import { useDispatch } from 'react-redux';
import { ModeType } from '@/content/types';
import { addAction } from '@/utils/actions';
import AddWindowForm from './AddWindow';
import style from '@/style/Header.css';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const addRequest = (m: ModeType) => dispatch(addAction(m));
  return (
    <div className={style.header}>
      <AddWindowForm addRequest={addRequest}/>
    </div>
  )
}

export default Header;
