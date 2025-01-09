import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';

function NavBar({ activeTab, onChange }) {
  return (
    <BottomNavigation
      showLabels
      value={activeTab}
      onChange={onChange}
      className="tab-bar"
      sx={{
        borderRadius: '25px',
        background: 'var(--tg-theme-button-color)',
        color: 'var(--tg-theme-text-color)',
      }}
    >
      <BottomNavigationAction
        label="Action"
        value="tab1"
        icon={<HomeIcon />}
        sx={{
          borderRadius: '20px',
          background: 'var(--tg-theme-button-color)',
          color: 'var(--tg-theme-bg-color)',
          '&:hover': {
            backgroundColor: 'var(--tg-theme-bg-color)',
            color: 'var(--tg-theme-button-color)',
            borderRadius: '20px',
          },
          '&.Mui-selected': {
            backgroundColor: 'var(--tg-theme-bg-color)',
            color: 'var(--tg-theme-text-color)',
            borderRadius: '20px',
          },
        }}
      />
      <BottomNavigationAction
        label="Settings"
        value="tab2"
        icon={<SettingsIcon />}
        sx={{
          borderRadius: '20px',
          background: 'var(--tg-theme-button-color)',
          color: 'var(--tg-theme-bg-color)',
          '&:hover': {
            backgroundColor: 'var(--tg-theme-bg-color)',
            color: 'var(--tg-theme-button-color)',
            borderRadius: '20px',
          },
          '&.Mui-selected': {
            backgroundColor: 'var(--tg-theme-bg-color)',
            color: 'var(--tg-theme-text-color)',
            borderRadius: '20px',
          },
        }}
      />
    </BottomNavigation>
  );
}

export default NavBar;
