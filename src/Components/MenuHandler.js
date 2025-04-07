import React, { useEffect, useState } from 'react';
import MainMenu from '../Screens/MainMenu';
import TableMenu from '../Screens/TableMenu';
import InsertForm from '../Screens/InsertForm';
import UpdateForm from '../Screens/UpdateForm';
import DeleteForm from '../Screens/DeleteForm';
import CustomForm from '../Screens/CustomForm';
import useMenu from '../hooks/useMenu';
import PropTypes from 'prop-types';
import { DataTable } from './';
import { Box, Typography, Switch, FormControlLabel } from '@mui/material';

const MenuHandler = ({ activeTab, onError, initialTable, initialColumn }) => {
  const {
    menuStack,
    items,
    tableData,
    dataTitle,
    insertColumns,
    insertTable,
    updateTable,
    deleteTable,
    handleSelect,
    handleSelectTable,
    handleSelectColumn,
    handleInsert,
    handleInsertTable,
    handleInsertSubmit,
    handleUpdate,
    handleUpdateTable,
    handleUpdateSubmit,
    handleDelete,
    handleDeleteTable,
    handleDeleteSubmit,
    handleBackClick,
    handleCustom,
    resetMenu,
  } = useMenu();

  const [autoCopyJson, setAutoCopyJson] = useState(false);
  const [isTableOpened, setIsTableOpened] = useState(false); // Флаг для предотвращения повторного открытия

  // Логика для автоматического открытия SELECT таблицы
  useEffect(() => {
    const openInitialTable = async () => {
      if (activeTab === 'tab1' && initialTable && !isTableOpened) {
        try {
          await handleSelect(); // Загружаем список таблиц
          await handleSelectTable(initialTable); // Загружаем список столбцов таблицы
          await handleSelectColumn(initialColumn && initialColumn !== '' ? initialColumn : 'all', initialTable);
          setIsTableOpened(true); // Устанавливаем флаг, чтобы предотвратить повторное открытие
        } catch (error) {
          onError(`Ошибка при открытии таблицы ${initialTable}: ${error.message}`);
        }
      }
    };

    openInitialTable();
  }, [activeTab, initialTable, initialColumn, isTableOpened, handleSelect, handleSelectTable, handleSelectColumn, onError]);

  useEffect(() => {
    if (activeTab === 'tab1') {
      resetMenu();
    }
  }, [activeTab, resetMenu]);

  const handleAutoCopyJsonChange = (event) => {
    setAutoCopyJson(event.target.checked);
  };

  // Копирование данных таблицы в JSON при открытии
  useEffect(() => {
    if (autoCopyJson && tableData) {
      const jsonData = JSON.stringify(tableData, null, 2);
      navigator.clipboard.writeText(jsonData).catch((err) => {
        onError(`Ошибка копирования данных: ${err.message}`);
      });
    }
  }, [autoCopyJson, tableData, onError]);

  const mainMenu = [
    { label: 'SELECT', onClick: handleSelect },
    { label: 'INSERT', onClick: handleInsert },
    { label: 'UPDATE', onClick: handleUpdate },
    { label: 'DELETE', onClick: handleDelete },
    { label: 'CUSTOM', onClick: handleCustom },
  ];

  if (activeTab === 'tab1' && tableData) {
    const columns = tableData.length > 0
      ? Object.keys(tableData[0]).map(key => ({
          id: key,
          label: key,
          numeric: false
        }))
      : [];
    return <DataTable title={dataTitle} columns={columns} rows={tableData} />;
  }

  if (activeTab === 'tab1' && insertColumns) {
    return (
      <InsertForm
        table={insertTable}
        columns={insertColumns}
        onSubmit={handleInsertSubmit}
        onBack={handleBackClick}
        onError={onError}
      />
    );
  }

  if (activeTab === 'tab1' && updateTable) {
    return (
      <UpdateForm
        table={updateTable}
        onSubmit={handleUpdateSubmit}
        onBack={handleBackClick}
        onError={onError}
      />
    );
  }

  if (activeTab === 'tab1' && deleteTable) {
    return (
      <DeleteForm
        table={deleteTable.table}
        onSubmit={(keyValue) => handleDeleteSubmit(deleteTable.table, keyValue)}
        onBack={handleBackClick}
        onError={onError}
      />
    );
  }

  if (activeTab === 'tab1' && menuStack.includes('customCommand')) {
    return (
      <CustomForm
        onBack={handleBackClick}
        onError={onError}
      />
    );
  }

  return (
    <div>
      {activeTab === 'tab1' && (
        <>
          {items.length > 0 ? (
            menuStack.includes('insertSelect') ? (
              <TableMenu items={items} onSelect={handleInsertTable} />
            ) : menuStack.includes('updateSelect') ? (
              <TableMenu items={items} onSelect={handleUpdateTable} />
            ) : menuStack.includes('deleteSelect') ? (
              <TableMenu items={items} onSelect={handleDeleteTable} />
            ) : menuStack.includes('customCommand') ? (
              <CustomForm onBack={handleBackClick} onError={onError} />
            ) : (
              menuStack.length === 2 ? (
                <TableMenu items={items} onSelect={handleSelectTable} />
              ) : (
                <TableMenu items={items} onSelect={handleSelectColumn} />
              )
            )
          ) : (
            <MainMenu mainMenu={mainMenu} />
          )}
        </>
      )}
      {activeTab === 'tab2' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            padding: 4,
          }}
        >
          <Typography variant="h6">Настройки</Typography>
          <Box sx={{ width: 300, border: 1, borderColor: 'var(--tg-theme-button-color)', borderRadius: 1, padding: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={autoCopyJson}
                  onChange={handleAutoCopyJsonChange}
                  color="primary"
                />
              }
              label="Автокопирование данных при открытии таблицы"
            />
          </Box>
        </Box>
      )}
    </div>
  );
};
MenuHandler.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onError: PropTypes.func.isRequired,
  initialTable: PropTypes.string, // Таблица для автоматического открытия
  initialColumn: PropTypes.string, // Столбец для автоматического открытия
};

export default MenuHandler;