import React from 'react';
import { useDispatch } from 'react-redux';
import { NodeMode } from '@/store/node/types';
import { addAction } from '@/utils/actions';
import AddWindowForm from './AddWindow';
import style from '@/style/Header.css';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const addRequest = (nm: NodeMode) => dispatch(addAction(nm));
  return (
    <div className={style.header}>
      <AddWindowForm addRequest={addRequest}/>
    </div>
  )
}

export default Header;

