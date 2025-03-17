import React, { useEffect } from 'react';
import MainMenu from '../Screens/MainMenu';
import TableMenu from '../Screens/TableMenu';
import InsertForm from '../Screens/InsertForm';
import UpdateForm from '../Screens/UpdateForm';
import useMenu from '../hooks/useMenu';
import PropTypes from 'prop-types';
import { ButtonList, DataTable } from './';

const MenuHandler = ({ activeTab }) => {
  const {
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
  } = useMenu();

  useEffect(() => {
    if (activeTab === 'tab1') {
      resetMenu();
    }
  }, [activeTab, resetMenu]);

  const mainMenu = [
    { label: 'SELECT', onClick: handleSelect },
    { label: 'INSERT', onClick: handleInsert },
    { label: 'UPDATE', onClick: handleUpdate },
    { label: 'DELETE' },
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
      />
    );
  }

  if (activeTab === 'tab1' && updateTable) {
    return (
      <UpdateForm
        table={updateTable}
        onSubmit={handleUpdateSubmit}
        onBack={handleBackClick}
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