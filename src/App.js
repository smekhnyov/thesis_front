import './App.css';
import { useState, useEffect } from 'react';
import { NavBar } from './Components';
import MenuHandler from './Components/MenuHandler';
import { Snackbar, Alert } from '@mui/material';

function App() {
  const [activeTab, setActiveTab] = useState('tab1');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [initialTable, setInitialTable] = useState(null); // Таблица для автоматического открытия
  const [initialColumn, setInitialColumn] = useState(null); // Столбец для автоматического открытия

  // Обработка параметров URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    const table = params.get('table');
    const column = params.get('column');

    if (action === 'select' && table) {
      setActiveTab('tab1'); // Переключаемся на вкладку SELECT
      setInitialTable(table); // Устанавливаем таблицу для открытия
      setInitialColumn(column); // Устанавливаем столбец для открытия
    }
  }, []);

  const handleChange = (event, newValue) => {
    if (activeTab === newValue) {
      // Если нажата та же вкладка, сбрасываем состояние меню
      setActiveTab('');
      setTimeout(() => setActiveTab(newValue), 0); // Переключаем обратно на ту же вкладку
    } else {
      setActiveTab(newValue);
    }
  };

  const handleError = (message) => {
    setError(message);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <div className="App">
      <div className="tab-content">
        <MenuHandler
          activeTab={activeTab}
          onError={handleError}
          initialTable={initialTable} // Передаем таблицу для автоматического открытия
          initialColumn={initialColumn} // Передаем столбец для автоматического открытия
        />
      </div>
      <NavBar activeTab={activeTab} onChange={handleChange} />
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;