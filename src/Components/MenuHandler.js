import React, { useState } from 'react';
import { ButtonList } from '.';
import { fetchTables, fetchColumns, fetchData } from '../api';
import { backButton } from '@telegram-apps/sdk-react';
import DataTable from './DataTable';
import PropTypes from 'prop-types';

const MenuHandler = ({ activeTab }) => {
  const [menuStack, setMenuStack] = useState(['main']);
  const [items, setItems] = useState([]);
  const [tableData, setTableData] = useState(null);
  const [dataTitle, setDataTitle] = useState('');

  const handleSelect = async () => {
    try {
      const data = await fetchTables();
      setItems(data);
      setMenuStack((prevStack) => [...prevStack, 'selectItems']);
      console.log('Items fetched:', data);
      backButton.show();
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleSelectTable = async (item) => {
    try {
      const data = await fetchColumns(item);
      const updatedData = ['all', ...data];
      setItems(updatedData);
      setMenuStack((prevStack) => [...prevStack, `item-${item}`]);
      console.log('Items fetched:', data);
      backButton.show();
    } catch (error) {
      console.error('Error fetching sub-items:', error);
    }
  };

  const handleSelectColumn = async (column) => {
    try {
      const tableEntry = menuStack.find((entry) => entry.startsWith('item-'));
      const tableName = tableEntry ? tableEntry.split('-')[1] : null;
      if (!tableName) {
        throw new Error('Table not selected');
      }
      // Ожидаем JSON-объект вида { columns: [...], rows: [...] }
      const response = await fetchData(tableName, column);
      console.log('Data fetched:', response);
      // Здесь response.columns – массив названий столбцов
      // А response.rows – сами данные
      // Преобразуем rows к массиву объектов
      const data = response.rows.map(row => {
        const obj = {};
        response.columns.forEach((col, index) => (obj[col] = row[index]));
        return obj;
      });
      setTableData(data);
      setDataTitle(`${tableName} - ${column}`);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInsert = async () => {
    try {
      const data = await fetchTables();
      setItems(data);
      setMenuStack((prevStack) => [...prevStack, 'insertSelect']);
      console.log('Tables for INSERT fetched:', data);
      backButton.show();
    } catch (error) {
      console.error('Error fetching tables for INSERT:', error);
    }
  };

  const handleBackClick = () => {
    // Если мы на уровне таблицы с данными, сбрасываем tableData и возвращаем меню
    if (tableData) {
      setTableData(null);
      return;
    }
    setMenuStack((prevStack) => {
      if (prevStack.length > 1) {
        const newStack = prevStack.slice(0, -1);
        if (newStack.length === 1) backButton.hide();
        return newStack;
      }
      return prevStack;
    });
    setItems([]);
  };

  backButton.onClick(handleBackClick);

  const mainMenu = [
    { label: 'SELECT', onClick: handleSelect },
    { label: 'INSERT', onClick: handleInsert },
    { label: 'UPDATE' },
    { label: 'DELETE' },
  ];

  // Если есть данные таблицы, отображаем компонент DataTable
  if (activeTab === 'tab1' && tableData) {
    // Динамически создаем описание колонок на основе ключей первой строки, если данные присутствуют
    const columns =
      tableData.length > 0
        ? Object.keys(tableData[0]).map((key) => ({
          id: key,
          label: key,
          numeric: false,
        }))
        : [];
    return <DataTable title={dataTitle} columns={columns} rows={tableData} />;
  }

  return (
    <div>
      {activeTab === 'tab1' &&
        (items.length > 0 ? (
          menuStack.length === 2 ? (
            <ButtonList
              buttons={items.map((item) => ({
                label: item,
                onClick: () => handleSelectTable(item),
              }))}
            />
          ) : (
            <ButtonList
              buttons={items.map((item) => ({
                label: item,
                onClick: () => handleSelectColumn(item),
              }))}
            />
          )
        ) : (
          <ButtonList buttons={mainMenu} />
        ))}
      {activeTab === 'tab2' && (
        <ButtonList
          buttons={[
            { label: '1' },
            { label: '2' },
            { label: '3' },
            { label: '4' },
          ]}
        />
      )}
    </div>
  );
};

MenuHandler.propTypes = {
  activeTab: PropTypes.string.isRequired,
};

export default MenuHandler;