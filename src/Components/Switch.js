import React from 'react';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { styled } from '@mui/material';

const StyledSwitch = styled(Switch)(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 1,
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: 'var(--tg-theme-button-text-color)', // Цвет текста на кнопке (активное состояние)
        '& + .MuiSwitch-track': {
          backgroundColor: 'var(--tg-theme-button-color)', // Цвет кнопки (активное состояние)
          opacity: 1,
          border: 0,
        },
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '& .MuiSwitch-thumb': {
      width: 24,
      height: 24,
      color: 'var(--tg-theme-button-text-color)', // Цвет текста на кнопке
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: 'var(--tg-theme-hint-color)', // Цвет подсказок (неактивное состояние)
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));


function SwitchLabel({ label, checked, onChange }) {
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <StyledSwitch
            checked={checked}
            onChange={onChange}
            name="checked"
            inputProps={{ 'aria-label': label }}
          />
        }
        label={label}
      />
    </FormGroup>
  );
}

export default SwitchLabel;