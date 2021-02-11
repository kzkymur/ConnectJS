import React from 'react';
import { glEditor } from '../../store/types';
import NameBox from '../atom/NameBox';
import style from '@/style/Base/Header.scss';

type Props = {
  property: glEditor;
  updateFunc: (gle: glEditor) => void;
  delete: () => void;
}

const Header: React.FC<Props> = props => {
  const property = props.property;
  const nameUpdate = (name: string) => {
    const newBaseStyle: glEditor = {
      ...property,
      name: name,
    };
    props.updateFunc(newBaseStyle);
  }

  return (
    <div className={style.container}>
      <NameBox className={style.nameBox}
        name={property.name}
        updateFunc={nameUpdate}/>
      <button className={style.button}
        onClick={props.delete}>×</button>
    </div>
  )
}

export default Header;

