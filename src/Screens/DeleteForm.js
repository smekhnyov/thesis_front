import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Grid,
} from '@mui/material';
import { TelegramButton, RecordTable } from '../Components/';
import { fetchPrimaryKey, fetchDataById, deleteData } from '../hooks/api';

const DeleteForm = ({ table, onSubmit, onBack, onError }) => {
    const [primaryKeyValues, setPrimaryKeyValues] = useState([]);
    const [selectedKeyValue, setSelectedKeyValue] = useState(null);
    const [recordData, setRecordData] = useState(null);
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
                    onError('Ошибка загрузки значений первичного ключа.');
                }
            } catch (err) {
                onError(`Ошибка: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchPrimaryKeyValues();
    }, [table, onError]);

    // Загружаем данные записи по выбранному ключу
    useEffect(() => {
        if (selectedKeyValue) {
            const fetchRecordData = async () => {
                try {
                    const response = await fetchDataById(table, selectedKeyValue);
                    if (response.status === 'success') {
                        setRecordData(response.data);
                    } else {
                        onError('Ошибка загрузки данных записи.');
                    }
                } catch (err) {
                    onError(`Ошибка: ${err.message}`);
                }
            };
            fetchRecordData();
        }
    }, [selectedKeyValue, table, onError]);

    const handleDelete = async () => {
        try {
            await deleteData(table, selectedKeyValue);
            onSubmit(selectedKeyValue);
        } catch (err) {
            let serverMessage =
                err.response && err.response.data && err.response.data.message
                    ? err.response.data.message
                    : err.message || 'Неизвестная ошибка';

            onError(`Ошибка при удалении данных: ${serverMessage}`);
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
                        marginTop: "0"
                    }}
                >
                    <h2>Выберите значение первичного ключа для удаления</h2>
                    <Grid container spacing={0.5} justifyContent="center">
                        {primaryKeyValues.map((value) => (
                            <Grid item key={value}>
                                <TelegramButton onClick={() => setSelectedKeyValue(value)}>
                                    {value}
                                </TelegramButton>
                            </Grid>
                        ))}
                    </Grid>
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
        </>
    );
};

DeleteForm.propTypes = {
    table: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onBack: PropTypes.func,
    onError: PropTypes.func.isRequired,
};

export default DeleteForm;