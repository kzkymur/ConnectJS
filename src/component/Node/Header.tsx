import React from 'react';
import { useDispatch } from 'react-redux';
import { updateNameAction } from '@/store/node/actions';
import NameBox from '../atom/NameBox';
import style from '@/style/Node/Header.scss';

type Props = {
  id: number;
  name: string;
  deleteFunc: ()=>void;
}

const Header: React.FC<Props> = props => {
  const dispatch = useDispatch();
  const nameUpdate = (name: string) => dispatch(updateNameAction(props.id, name));

  return (
    <div className={style.container}>
      <NameBox className={style.nameBox}
        name={props.name}
        updateFunc={nameUpdate}/>
      <button className={style.button}
        onClick={props.deleteFunc}>×</button>
    </div>
  )
}

export default Header;
