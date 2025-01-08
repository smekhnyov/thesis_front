import './App.css';
import { useState } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import Grid from '@mui/material/Grid2'
import ButtonGroup from '@mui/material/ButtonGroup';
import TelegramButton from './Components/TelegramButton';
// import NavBar from './Components/NavBar'

function App() {
  const [activeTab, setActiveTab] = useState('tab1');

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="App">
      <div className="tab-content">
        {activeTab === 'tab1' && (
          <ButtonGroup orientation="vertical" size='large' className='sql-grid'>
            <TelegramButton variant='contained'>SELECT</TelegramButton>
            <TelegramButton variant='contained'>INSERT</TelegramButton>
            <TelegramButton variant='contained'>UPDATE</TelegramButton>
            <TelegramButton variant='contained'>DELETE</TelegramButton>
          </ButtonGroup>
        )}
        {activeTab === 'tab2' && (
          <ButtonGroup orientation="vertical">
            <TelegramButton variant='contained'>1</TelegramButton>
            <TelegramButton variant='contained'>2</TelegramButton>
            <TelegramButton variant='contained'>3</TelegramButton>
            <TelegramButton variant='contained'>4</TelegramButton>
          </ButtonGroup>
        )}
      </div>
      <BottomNavigation
        showLabels
        value={activeTab}
        onChange={handleChange}
        className="tab-bar"
        sx={{
          borderRadius: '12px',
          background: 'var(--tg-theme-button-color)',
          color: 'var(--tg-theme-text-color)',
          zIndex: '1000',
        }}
      >
        <BottomNavigationAction
          label="Action"
          value='tab1'
          sx={{
            borderRadius: '12px',
            background: 'var(--tg-theme-button-color)',
            color: 'var(--tg-theme-bg-color)',
            '&:hover': { backgroundColor: 'var(--tg-theme-bg-color)', color: 'var(--tg-theme-button-color)' },
            '&.Mui-selected': { backgroundColor: 'var(--tg-theme-bg-color)', color: 'var(--tg-theme-text-color)' },
          }} />
        <BottomNavigationAction
          label="Settings"
          value='tab2'
          sx={{
            borderRadius: '12px',
            background: 'var(--tg-theme-button-color)',
            color: 'var(--tg-theme-bg-color)',
            '&:hover': { backgroundColor: 'var(--tg-theme-bg-color)', color: 'var(--tg-theme-button-color)' },
            '&.Mui-selected': { backgroundColor: 'var(--tg-theme-bg-color)', color: 'var(--tg-theme-text-color)' },
          }} />
      </BottomNavigation>
    </div>
  );
}

export default App;
