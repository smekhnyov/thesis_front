import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Snackbar,
    Alert,
    TextField,
    Checkbox,
    FormControlLabel,
    MenuItem,
    List,
    ListItemText,
    ListItemButton,
} from '@mui/material';
import { TelegramButton } from '../Components/';
import { updateData, fetchColumnTypes, fetchDataById, fetchPrimaryKey } from '../hooks/api';
import styled from '@mui/material/styles/styled';

const TelegramListItemButton = styled(ListItemButton)({
    backgroundColor: 'var(--tg-theme-button-color)', // Цвет фона кнопки
    color: 'var(--tg-theme-text-color)', // Цвет текста кнопки
    borderRadius: '4px',
    '&:hover': {
        backgroundColor: 'var(--tg-theme-button-hover-bg-color)', // Цвет фона при наведении
    },
});

const UpdateForm = ({ table, onSubmit, onBack }) => {
    const [columns, setColumns] = useState([]);
    const [primaryKeyValues, setPrimaryKeyValues] = useState([]);
    const [selectedKeyValue, setSelectedKeyValue] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Загружаем метаданные колонок таблицы
    useEffect(() => {
        const fetchColumnsData = async () => {
            try {
                const response = await fetchColumnTypes(table);
                if (response.status === 'success') {
                    setColumns(response.columns);
                    const initValues = response.columns.reduce((acc, col) => {
                        acc[col.name] = '';
                        return acc;
                    }, {});
                    setFormValues(initValues);

                    // Fetch primary key values
                    const primaryKeyResponse = await fetchPrimaryKey(table);
                    if (primaryKeyResponse.status === 'success') {
                        // Сортируем значения первичного ключа числовым порядком
                        const sortedPrimaryKeyValues = primaryKeyResponse.primary_key_values.sort((a, b) => a - b);
                        setPrimaryKeyValues(sortedPrimaryKeyValues);
                    } else {
                        setError('Ошибка загрузки значений первичного ключа.');
                        setOpen(true);
                    }
                } else {
                    setError('Ошибка загрузки схемы таблицы.');
                    setOpen(true);
                }
            } catch (err) {
                setError(`Ошибка: ${err.message}`);
                setOpen(true);
            } finally {
                setLoading(false);
            }
        };
        fetchColumnsData();
    }, [table]);

    // Fetch data for the selected primary key value
    useEffect(() => {
        if (selectedKeyValue) {
            const fetchDataForKey = async () => {
                try {
                    const response = await fetchDataById(table, selectedKeyValue); // Передаем selectedKeyValue
                    if (response.status === 'success') {
                        const formattedData = Object.keys(response.data).reduce((acc, key) => {
                            let value = response.data[key];
                            if (columns.find(col => col.name === key && (col.type === 'date' || col.type === 'timestamp'))) {
                                value = new Date(value).toISOString().split('T')[0]; // Форматируем дату в yyyy-MM-dd
                            }
                            acc[key] = value;
                            return acc;
                        }, {});
                        setFormValues(formattedData);
                    } else {
                        setError('Ошибка загрузки данных по ключу.');
                        setOpen(true);
                    }
                } catch (err) {
                    setError(`Ошибка: ${err.message}`);
                    setOpen(true);
                }
            };
            fetchDataForKey();
        }
    }, [selectedKeyValue, table, columns]);

    // Валидация отдельного поля
    const validateField = (col, value) => {
        // Проверка NOT NULL
        if (col.is_nullable === 'NO' && (value === '' || value === null || (typeof value === 'string' && value.trim() === ''))) {
            return `Поле "${col.name}" не может быть пустым.`;
        }
        // Проверка числовых типов
        if (col.type && (col.type.includes('int') || col.type === 'numeric')) {
            if (value !== '' && isNaN(Number(value))) {
                return `Поле "${col.name}" должно быть числом.`;
            }
        }
        // Проверка булевого типа
        if (col.type === 'boolean') {
            return '';
        }
        // Проверка даты
        if (col.type === 'date' || col.type === 'timestamp') {
            if (value && isNaN(Date.parse(value))) {
                return `Поле "${col.name}" должно быть корректной датой.`;
            }
        }
        // Проверка длины для текстовых полей
        if ((col.type === 'character varying' || col.type === 'text') &&
            col.character_maximum_length && value) {
            if (value.length > col.character_maximum_length) {
                return `Поле "${col.name}" не должно превышать ${col.character_maximum_length} символов.`;
            }
        }
        // Проверка внешнего ключа (если есть список опций, значение должно существовать в списке)
        if (col.foreign_keys && col.options && value) {
            if (!col.options.find(option => option.value === value)) {
                return `Выберите корректное значение для поля "${col.name}".`;
            }
        }
        return '';
    };

    // Обработка изменения значения для текстовых полей и select
    const handleChange = (e, field) => {
        setFormValues({ ...formValues, [field]: e.target.value });
        if (fieldErrors[field]) {
            setFieldErrors({ ...fieldErrors, [field]: '' });
        }
    };

    // Обработка для checkbox (булевых значений)
    const handleCheckboxChange = (e, field) => {
        setFormValues({ ...formValues, [field]: e.target.checked });
        if (fieldErrors[field]) {
            setFieldErrors({ ...fieldErrors, [field]: '' });
        }
    };

    const handleBlur = (e, col) => {
        const value = e.target.value;
        const errorMsg = validateField(col, value);
        setFieldErrors(prev => ({ ...prev, [col.name]: errorMsg }));
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {};

        // Валидация всех полей
        for (const col of columns) {
            const value = formValues[col.name];
            const errorMsg = validateField(col, value);
            if (errorMsg) {
                errors[col.name] = errorMsg;
            }
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        } else {
            setFieldErrors({});
        }

        const dataDict = {
            table,
            data: formValues,
            condition: selectedKeyValue
        };

        try {
            await updateData(dataDict);
            onSubmit(dataDict);
        } catch (err) {
            let serverMessage =
                err.response && err.response.data && err.response.data.message
                    ? err.response.data.message
                    : err.message || 'Неизвестная ошибка';

            setError(`Ошибка при обновлении данных: ${serverMessage}`);
            setOpen(true);
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <>
            {!selectedKeyValue ? (
                <Box
                    component="div"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        marginTop: "auto"
                    }}
                >
                    <h2>Выберите значение первичного ключа для обновления</h2>
                    <List>
                        {primaryKeyValues.map((value) => (
                            <TelegramListItemButton key={value} onClick={() => setSelectedKeyValue(value)}>
                                <ListItemText primary={value} />
                            </TelegramListItemButton>
                        ))}
                    </List>
                </Box>
            ) : (
                <form onSubmit={handleSubmit}>
                    <h2>Update {table}</h2>
                    <Box
                        component="div"
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 250px)' },
                            gap: 2,
                            justifyContent: 'center'
                        }}
                    >
                        {columns.map((col) => {
                            // Для булевого поля отрисовываем CheckBox
                            if (col.type && col.type.toLowerCase() === 'boolean') {
                                return (
                                    <FormControlLabel
                                        key={col.name}
                                        control={
                                            <Checkbox
                                                checked={formValues[col.name] === true}
                                                onChange={(e) => handleCheckboxChange(e, col.name)}
                                                color="primary"
                                            />
                                        }
                                        label={col.name}
                                        sx={{
                                            color: 'var(--tg-theme-text-color)',
                                            width: '250px'
                                        }}
                                    />
                                );
                            } else if (col.foreign_keys && col.options && Array.isArray(col.options)) {
                                return (
                                    <TextField
                                        key={col.name}
                                        label={col.name}
                                        select
                                        value={formValues[col.name]}
                                        onChange={(e) => handleChange(e, col.name)}
                                        onBlur={(e) => handleBlur(e, col)}
                                        margin="normal"
                                        variant="outlined"
                                        error={Boolean(fieldErrors[col.name])}
                                        helperText={fieldErrors[col.name] || (col.default ? `Default: ${col.default}` : '')}
                                        sx={{
                                            width: '250px',
                                            '& label.Mui': {
                                                color: 'var(--tg-theme-text-color)'
                                            },
                                            '& .MuiInputBase-input': {
                                                color: 'var(--tg-theme-text-color)'
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'var(--tg-theme-text-color)'
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'var(--tg-theme-text-color)'
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'var(--tg-theme-text-color)'
                                                }
                                            }
                                        }}
                                    >
                                        {col.options.map((option) => (
                                            <MenuItem key={option.value} value={option.value} sx={{ color: 'var(--tg-theme-text-color)', background: 'var(--tg-theme-bg-color)' }}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                );
                            } else {
                                // Определяем тип поля для TextField
                                let inputType = 'text';
                                if (col.type && (col.type.includes('integer') || col.type === 'numeric')) {
                                    inputType = 'number';
                                } else if (col.type === 'date' || col.type === 'timestamp') {
                                    inputType = 'date';
                                }
                                return (
                                    <TextField
                                        key={col.name}
                                        label={col.name}
                                        type={inputType}
                                        value={formValues[col.name]}
                                        onChange={(e) => handleChange(e, col.name)}
                                        onBlur={(e) => handleBlur(e, col)}
                                        margin="normal"
                                        variant="outlined"
                                        error={Boolean(fieldErrors[col.name])}
                                        helperText={fieldErrors[col.name]}
                                        InputLabelProps={inputType === 'date' ? { shrink: true } : {}}
                                        sx={{
                                            width: '250px',
                                            '& label.Mui': {
                                                color: 'var(--tg-theme-text-color)',
                                            },
                                            '& .MuiInputBase-input': {
                                                color: 'var(--tg-theme-text-color)',
                                            },
                                            '& label.Mui-focused': {
                                                color: 'var(--tg-theme-text-color)',
                                            },
                                            '& .MuiFormLabel-root': {
                                                color: 'var(--tg-theme-text-color)',
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'var(--tg-theme-text-color)',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: 'var(--tg-theme-text-color)',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: 'var(--tg-theme-text-color)',
                                                },
                                            },
                                        }}
                                        placeholder={col.default ? `Default: ${col.default}` : ''}
                                    />
                                );
                            }
                        })}
                    </Box>
                    <div style={{ marginTop: 16, textAlign: 'center' }}>
                        <TelegramButton type="submit">Submit</TelegramButton>
                        {onBack && (
                            <TelegramButton onClick={onBack} style={{ marginLeft: '10px' }}>
                                Back
                            </TelegramButton>
                        )}
                    </div>
                </form>
            )}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
};

UpdateForm.propTypes = {
    table: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onBack: PropTypes.func,
};

export default UpdateForm;