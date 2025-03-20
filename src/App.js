import './App.css';
import { useState } from 'react';
import { NavBar } from './Components';
import MenuHandler from './Components/MenuHandler';
import { Snackbar, Alert } from '@mui/material';

function App() {
  const [activeTab, setActiveTab] = useState('tab1');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

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
        <MenuHandler activeTab={activeTab} onError={handleError} />
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