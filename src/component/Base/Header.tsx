import React from 'react';
import { Content } from '../../store/types';
import NameBox from '../atom/NameBox';
import style from '@/style/Base/Header.scss';

type Props = {
  property: Content;
  updateFunc: (content: Content) => void;
  delete: () => void;
}

const Header: React.FC<Props> = props => {
  const property = props.property;
  const nameUpdate = (name: string) => {
    const newBaseStyle: Content = {
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

