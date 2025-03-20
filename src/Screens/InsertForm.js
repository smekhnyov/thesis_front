import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    TextField,
    Checkbox,
    FormControlLabel,
    MenuItem
} from '@mui/material';
import { TelegramButton } from '../Components';
import { insertData, fetchColumnTypes } from '../hooks/api';

const InsertForm = ({ table, onSubmit, onBack, onError }) => {
    const [columns, setColumns] = useState([]);
    const [formValues, setFormValues] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(true);

    // Загружаем метаданные колонок таблицы
    useEffect(() => {
        const fetchColumnsData = async () => {
            try {
                const response = await fetchColumnTypes(table);
                if (response.status === 'success') {
                    setColumns(response.columns);
                    const initValues = response.columns.reduce((acc, col) => {
                        // Для булевого поля устанавливаем false по умолчанию
                        if (col.type === 'boolean') {
                            acc[col.name] = col.default || false;
                        } else {
                            // Изначально устанавливаем default (если есть), иначе пустую строку
                            acc[col.name] = col.default !== undefined ? col.default : '';
                        }
                        return acc;
                    }, {});
                    setFormValues(initValues);
                } else {
                    onError('Ошибка загрузки схемы таблицы.');
                }
            } catch (err) {
                onError(`Ошибка: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchColumnsData();
    }, [table, onError]);

    // Валидация отдельного поля
    const validateField = (col, value) => {
        // Проверка NOT NULL
        if (col.is_nullable === 'NO' && (value === '' || value === null || (typeof value === "string" && value.includes("nextval")) || (typeof value === 'string' && value.trim() === ''))) {
            // Пропускаем проверку, если default включает nextval (автоинкремент)
            if (col.default && col.default.includes('nextval')) {
                return '';
            }
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
        // Дополнительная проверка уникальности может быть реализована на сервере через col.unique
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

        // Если пользователь не ввёл значение, и если есть default, то подставить его
        const finalData = {};
        for (const col of columns) {
            let value = formValues[col.name];
            // Пропускаем поле, если оно пустое и default включает nextval (автоинкремент)
            if ((value === '' || value === null) && col.default && col.default.includes('nextval')) {
                continue;
            }
            if ((value === '' || value === null) && col.default !== undefined) {
                value = col.default;
            }
            finalData[col.name] = value;
        }

        const dataDict = {
            table,
            data: finalData
        };

        try {
            await insertData(dataDict);
            onSubmit(dataDict);
        } catch (err) {
            let serverMessage =
                err.response && err.response.data && err.response.data.message
                    ? err.response.data.message
                    : err.message || 'Неизвестная ошибка';

            if (serverMessage.includes("invalid input syntax for type integer:")) {
                serverMessage = "Некорректное значение для числового поля. Проверьте введённые данные.";
            }

            onError(`Ошибка при отправке данных: ${serverMessage}`);
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Insert into {table}</h2>
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
                                    '& .MuiFormLabel-root': {
                                        color: 'var(--tg-theme-text-color)'
                                    },
                                    '& label.Mui-focused': {
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
                                            borderColor: 'var(--tg-theme-text-color)',
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
    );
};

InsertForm.propTypes = {
    table: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onBack: PropTypes.func,
    onError: PropTypes.func.isRequired,
};

export default InsertForm;