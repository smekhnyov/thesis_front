import { ButtonGroup } from '@mui/material';
import { TelegramButton } from '.';

const ButtonList = ({ buttons, onBack }) => (
    <ButtonGroup orientation="vertical" size="large" className="sql-grid">
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

export default ButtonList;