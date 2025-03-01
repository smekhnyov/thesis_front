import React from 'react';
import { ButtonList } from '../Components/';
 
const TableMenu = ({ items, onSelect }) => {
  return (
    <ButtonList
      buttons={items.map(item => ({
        label: item,
        onClick: () => onSelect(item)
      }))}
    />
  );
};
 
export default TableMenu;