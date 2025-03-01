import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import TelegramButton from '../Components/TelegramButton';

const InsertForm = ({ table, columns, onSubmit, onBack }) => {
    const initialValues = columns.reduce((acc, col) => {
        acc[col] = '';
        return acc;
    }, {});
    const [formValues, setFormValues] = useState(initialValues);

    const handleChange = (e, field) => {
        setFormValues({ ...formValues, [field]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ table, data: formValues });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Insert into {table}</h2>
            {columns.map((col) => (
                <TextField
                    key={col}
                    label={col}
                    value={formValues[col]}
                    onChange={(e) => handleChange(e, col)}
                    margin="normal"
                    fullWidth
                    sx={{ 
                        color: 'var(--tg-theme-text-color)',
                    }}
                />
            ))}
            <TelegramButton type="submit">Submit</TelegramButton>
            {onBack && (
                <TelegramButton onClick={onBack} style={{ marginLeft: '10px' }}>
                    Back
                </TelegramButton>
            )}
        </form>
    );
};

InsertForm.propTypes = {
    table: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSubmit: PropTypes.func.isRequired,
    onBack: PropTypes.func,
};

export default InsertForm;