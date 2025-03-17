import { useState, useCallback } from 'react';
import { fetchTables, fetchColumns, fetchData } from './api';
import { backButton } from '@telegram-apps/sdk-react';

const useMenu = () => {
  const [menuStack, setMenuStack] = useState(['main']);
  const [items, setItems] = useState([]);
  const [tableData, setTableData] = useState(null);
  const [dataTitle, setDataTitle] = useState('');
  const [insertColumns, setInsertColumns] = useState(null);
  const [insertTable, setInsertTable] = useState(null);
  const [updateTable, setUpdateTable] = useState(null);

  const handleSelect = useCallback(async () => {
    try {
      const data = await fetchTables();
      setItems(data);
      setMenuStack(prev => [...prev, 'selectItems']);
      console.log('Items fetched:', data);
      backButton.show();
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }, []);

  const handleSelectTable = useCallback(async (item) => {
    try {
      const data = await fetchColumns(item);
      const updatedData = ['all', ...data];
      setItems(updatedData);
      setMenuStack(prev => [...prev, `item-${item}`]);
      console.log('Sub-items fetched:', data);
      backButton.show();
    } catch (error) {
      console.error('Error fetching sub-items:', error);
    }
  }, []);

  const handleSelectColumn = useCallback(async (column) => {
    try {
      const tableEntry = menuStack.find((entry) => entry.startsWith('item-'));
      const tableName = tableEntry ? tableEntry.split('-')[1] : null;
      if (!tableName) {
        throw new Error('Table not selected');
      }
      const response = await fetchData(tableName, column);
      console.log('Data fetched:', response);
      const data = response.rows.map(row => {
        const obj = {};
        response.columns.forEach((col, index) => {
          obj[col] = row[index];
        });
        return obj;
      });
      setTableData(data);
      setDataTitle(`${tableName} - ${column}`);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [menuStack]);

  const handleInsert = useCallback(async () => {
    try {
      const data = await fetchTables();
      setItems(data);
      setMenuStack(prev => [...prev, 'insertSelect']);
      console.log('Tables for INSERT fetched:', data);
      backButton.show();
    } catch (error) {
      console.error('Error fetching tables for INSERT:', error);
    }
  }, []);

  const handleInsertTable = useCallback(async (table) => {
    try {
      const columns = await fetchColumns(table);
      setInsertColumns(columns);
      setInsertTable(table);
      setMenuStack(prev => [...prev, 'insertForm']);
      console.log('Insert columns fetched:', columns);
    } catch (error) {
      console.error('Error fetching columns for INSERT:', error);
    }
  }, []);

  const handleInsertSubmit = useCallback(async ({ table, data }) => {
    try {
      console.log(`Insert into ${table}: `, data);
      setInsertColumns(null);
      setInsertTable(null);
      setMenuStack(['main']);
      setItems([]);
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  }, []);

  const handleUpdate = useCallback(async () => {
    try {
      const data = await fetchTables();
      setItems(data);
      setMenuStack(prev => [...prev, 'updateSelect']);
      console.log('Tables for UPDATE fetched:', data);
      backButton.show();
    } catch (error) {
      console.error('Error fetching tables for UPDATE:', error);
    }
  }, []);

  const handleUpdateTable = useCallback(async (table) => {
    setUpdateTable(table);
    setMenuStack(prev => [...prev, 'updateForm']);
  }, []);

  const handleUpdateSubmit = useCallback(async ({ table, data }) => {
    try {
      console.log(`Update ${table}: `, data);
      setUpdateTable(null);
      setMenuStack(['main']);
      setItems([]);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }, []);

  const handleBackClick = useCallback(() => {
    if (tableData) {
      setTableData(null);
      return;
    }
    if (insertColumns) {
      setInsertColumns(null);
      setInsertTable(null);
      return;
    }
    if (updateTable) {
      setUpdateTable(null);
      return;
    }
    setMenuStack(prevStack => {
      if (prevStack.length > 1) {
        const newStack = prevStack.slice(0, -1);
        if (newStack.length === 1) backButton.hide();
        return newStack;
      }
      return prevStack;
    });
    setItems([]);
  }, [tableData, insertColumns, updateTable]);

  const resetMenu = useCallback(() => {
    setMenuStack(['main']);
    setItems([]);
    setTableData(null);
    setDataTitle('');
    setInsertColumns(null);
    setInsertTable(null);
    setUpdateTable(null);
  }, []);

  backButton.onClick(handleBackClick);

  return {
    menuStack,
    items,
    tableData,
    dataTitle,
    insertColumns,
    insertTable,
    updateTable,
    handleSelect,
    handleSelectTable,
    handleSelectColumn,
    handleInsert,
    handleInsertTable,
    handleInsertSubmit,
    handleUpdate,
    handleUpdateTable,
    handleUpdateSubmit,
    handleBackClick,
    resetMenu,
  };
};

export default useMenu;