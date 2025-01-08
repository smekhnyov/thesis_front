import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const TelegramButton = styled(Button)({
  backgroundColor: 'var(--tg-theme-button-color)', // Цвет фона кнопки
  color: 'var(--tg-theme-text-color)', // Цвет текста кнопки
  '&:hover': {
    backgroundColor: 'var(--tg-theme-button-hover-bg-color)', // Цвет фона при наведении
  },
});

export default TelegramButton;
