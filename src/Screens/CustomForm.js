import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, TextField, Typography } from '@mui/material';
import { TelegramButton } from '../Components/';
import { fetchCustomCommand } from '../hooks/api';
import DataTable from '../Components/DataTable';

const CustomForm = ({ onBack, onError }) => {
  const [command, setCommand] = useState('');
  const [result, setResult] = useState(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleSubmit(); // Execute the command
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Check if the event exists before calling preventDefault
    try {
      const response = await fetchCustomCommand(command);
      setResult(response.result); // Extract the "result" object from the response
    } catch (error) {
      onError(`Ошибка выполнения команды: ${error.message}`);
    }
  };

  const isSelectQuery = (command) => {
    return command.trim().toUpperCase().startsWith('SELECT') && result?.columns && result?.rows;
  };


  const mapColumns = (columns) => {
    return columns.map((col) => ({
      id: col,
      label: col,
      numeric: false,
    }));
  };

  const mapRows = (columns, rows) => {
    return rows.map((row) =>
      columns.reduce((acc, col, index) => {
        acc[col] = row[index];
        return acc;
      }, {})
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        marginTop: 1,
        backgroundColor: 'var(--tg-theme-bg-color)',
      }}
    >
      <Paper
        sx={{
          width: '100%',
          maxWidth: '800px', // Limit the form width
          maxHeight: '90vh', // Prevent the form from exceeding 90% of the viewport height
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--tg-theme-bg-color)',
          color: 'var(--tg-theme-text-color)',
          padding: 4,
          boxShadow: 'none',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            marginBottom: 2,
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'var(--tg-theme-text-color)',
          }}
        >
          Введите кастомную команду
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Команда"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown} // Add this line
            variant="outlined"
            margin="normal"
            multiline
            sx={{
              '& .MuiInputBase-input': { color: 'var(--tg-theme-text-color)' },
              '& .MuiInputLabel-root': { color: 'var(--tg-theme-text-color)' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'var(--tg-theme-text-color)' },
                '&:hover fieldset': { borderColor: 'var(--tg-theme-button-color)' },
                '&.Mui-focused fieldset': { borderColor: 'var(--tg-theme-button-color)' },
              },
            }}
          />
          <Box
            sx={{
              display: 'inline-block',
              marginTop: 2,
            }}
          >
            <TelegramButton type="submit" style={{ marginRight: '10px' }}>
              Выполнить
            </TelegramButton>
            {onBack && (
              <TelegramButton onClick={onBack} style={{ marginLeft: '10px' }}>
                Назад
              </TelegramButton>
            )}
          </Box>
        </form>
        {result && (
          <Box
            sx={{
              marginTop: 4,
              width: '100%',
              maxHeight: '60vh', // Limit the height of the result box
              backgroundColor: 'var(--tg-theme-bg-color)',
              color: 'var(--tg-theme-text-color)',
              padding: 2,
            }}
          >
            {isSelectQuery(command) ? (
              <DataTable
                title="Результаты SELECT"
                columns={mapColumns(result.columns)}
                rows={mapRows(result.columns, result.rows)}
              />
            ) : (
              <Box>
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                  Результат:
                </Typography>
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

CustomForm.propTypes = {
  onBack: PropTypes.func,
  onError: PropTypes.func.isRequired,
};

export default CustomForm;