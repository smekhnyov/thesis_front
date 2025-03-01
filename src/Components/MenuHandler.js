import React from 'react';
import DataTable from './DataTable';
import MainMenu from '../Screens/MainMenu';
import TableMenu from '../Screens/TableMenu';
import InsertForm from '../Screens/InsertForm';
import useMenu from '../hooks/useMenu';
import PropTypes from 'prop-types';
import ButtonList from './ButtonList';

const MenuHandler = ({ activeTab }) => {
  const {
    menuStack,
    items,
    tableData,
    dataTitle,
    insertColumns,
    insertTable,
    handleSelect,
    handleSelectTable,
    handleSelectColumn,
    handleInsert,
    handleInsertTable,
    handleInsertSubmit,
    handleBackClick,
  } = useMenu();

  const mainMenu = [
    { label: 'SELECT', onClick: handleSelect },
    { label: 'INSERT', onClick: handleInsert },
    { label: 'UPDATE' },
    { label: 'DELETE' },
  ];

  // Отрисовка таблицы данных для SELECT
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

  // Отрисовка формы INSERT, если получены колонки для вставки
  if (activeTab === 'tab1' && insertColumns) {
    return (
      <InsertForm
        table={insertTable}
        columns={insertColumns}
        onSubmit={handleInsertSubmit}
        onBack={handleBackClick}
      />
    );
  }

  return (
    <div>
      {activeTab === 'tab1' && (
        <>
          {items.length > 0 ? (
            // Если мы в потоке INSERT, используем handleInsertTable
            menuStack.includes('insertSelect') ? (
              <TableMenu items={items} onSelect={handleInsertTable} />
            ) : (
              // Для SELECT-ветки
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
        <ButtonList
          buttons={[
            { label: '1' },
            { label: '2' },
            { label: '3' },
            { label: '4' }
          ]}
        />
      )}
    </div>
  );
};

MenuHandler.propTypes = {
  activeTab: PropTypes.string.isRequired
};

export default MenuHandler;