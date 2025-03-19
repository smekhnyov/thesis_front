import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Snackbar,
    Alert,
    List,
    ListItemText,
    ListItemButton,
} from '@mui/material';
import { TelegramButton, RecordTable } from '../Components/';
import { fetchPrimaryKey, fetchDataById, deleteData } from '../hooks/api';
import styled from '@mui/material/styles/styled';

const TelegramListItemButton = styled(ListItemButton)({
    backgroundColor: 'var(--tg-theme-button-color)', // Цвет фона кнопки
    color: 'var(--tg-theme-text-color)', // Цвет текста кнопки
    borderRadius: '4px',
    '&:hover': {
        backgroundColor: 'var(--tg-theme-button-hover-bg-color)', // Цвет фона при наведении
    },
});

const DeleteForm = ({ table, onSubmit, onBack }) => {
    const [primaryKeyValues, setPrimaryKeyValues] = useState([]);
    const [selectedKeyValue, setSelectedKeyValue] = useState(null);
    const [recordData, setRecordData] = useState(null);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Загружаем значения первичного ключа
    useEffect(() => {
        const fetchPrimaryKeyValues = async () => {
            try {
                const response = await fetchPrimaryKey(table);
                if (response.status === 'success') {
                    const sortedPrimaryKeyValues = response.primary_key_values.sort((a, b) => a - b);
                    setPrimaryKeyValues(sortedPrimaryKeyValues);
                } else {
                    setError('Ошибка загрузки значений первичного ключа.');
                    setOpen(true);
                }
            } catch (err) {
                setError(`Ошибка: ${err.message}`);
                setOpen(true);
            } finally {
                setLoading(false);
            }
        };
        fetchPrimaryKeyValues();
    }, [table]);

    // Загружаем данные записи по выбранному ключу
    useEffect(() => {
        if (selectedKeyValue) {
            const fetchRecordData = async () => {
                try {
                    const response = await fetchDataById(table, selectedKeyValue);
                    if (response.status === 'success') {
                        setRecordData(response.data);
                    } else {
                        setError('Ошибка загрузки данных записи.');
                        setOpen(true);
                    }
                } catch (err) {
                    setError(`Ошибка: ${err.message}`);
                    setOpen(true);
                }
            };
            fetchRecordData();
        }
    }, [selectedKeyValue, table]);

    const handleDelete = async () => {
        try {
            await deleteData(table, selectedKeyValue);
            onSubmit(selectedKeyValue);
        } catch (err) {
            let serverMessage =
                err.response && err.response.data && err.response.data.message
                    ? err.response.data.message
                    : err.message || 'Неизвестная ошибка';
    
            setError(`Ошибка при удалении данных: ${serverMessage}`);
            setOpen(true);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
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
                    <h2>Выберите значение первичного ключа для удаления</h2>
                    <List>
                        {primaryKeyValues.map((value) => (
                            <TelegramListItemButton key={value} onClick={() => setSelectedKeyValue(value)}>
                                <ListItemText primary={value} />
                            </TelegramListItemButton>
                        ))}
                    </List>
                </Box>
            ) : recordData ? (
                <Box
                    component="div"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        marginTop: "0"
                    }}
                >
                    <RecordTable title={`Данные записи с ключом ${selectedKeyValue}`} recordData={recordData} />
                    <h3>Вы уверены, что хотите удалить эту запись?</h3>
                    <div>
                        <TelegramButton onClick={handleDelete} style={{ marginRight: '10px' }}>
                            Удалить
                        </TelegramButton>
                        {onBack && (
                            <TelegramButton onClick={onBack}>
                                Назад
                            </TelegramButton>
                        )}
                    </div>
                </Box>
            ) : (
                <div>Загрузка данных записи...</div>
            )}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </>
    );
};

DeleteForm.propTypes = {
    table: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onBack: PropTypes.func,
};

export default DeleteForm;