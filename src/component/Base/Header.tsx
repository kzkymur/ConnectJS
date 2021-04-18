import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteAction, updateNameAction } from '@/store/node/actions';
import NameBox from '../atom/NameBox';
import style from '@/style/Base/Header.scss';

type Props = {
  id: number;
  name: string;
}

const Header: React.FC<Props> = props => {
  const dispatch = useDispatch();
  const del = () => dispatch(deleteAction(props.id));
  const nameUpdate = (name: string) => dispatch(updateNameAction(props.id, name));

  return (
    <div className={style.container}>
      <NameBox className={style.nameBox}
        name={props.name}
        updateFunc={nameUpdate}/>
      <button className={style.button}
        onClick={del}>×</button>
    </div>
  )
}

export default Header;
