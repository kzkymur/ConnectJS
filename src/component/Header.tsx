import React from 'react';
import { useDispatch } from 'react-redux';
import { NodeModeType } from '@/store/node/nodeTypes';
import { addAction } from '@/utils/actions';
import AddWindowForm from './AddWindow';
import style from '@/style/Header.css';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const addRequest = (nm: NodeModeType) => dispatch(addAction(nm));
  return (
    <div className={style.header}>
      <AddWindowForm addRequest={addRequest}/>
    </div>
  )
}

export default Header;

