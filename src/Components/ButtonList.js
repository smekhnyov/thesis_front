import './ButtonList.css';
import { ButtonGroup } from '@mui/material';
import { TelegramButton } from '.';
import PropTypes from 'prop-types';

const ButtonList = ({ buttons, onBack }) => (
  <ButtonGroup orientation="vertical" size="large" className="button-list">
    {buttons.map(({ label, onClick }, index) => (
      <TelegramButton key={index} variant="contained" onClick={onClick}>
        {label}
      </TelegramButton>
    ))}
    {onBack && (
      <TelegramButton variant="contained" onClick={onBack}>
        Back
      </TelegramButton>
    )}
  </ButtonGroup>
);

ButtonList.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    })
  ).isRequired,
  onBack: PropTypes.func,
};

export default ButtonList;