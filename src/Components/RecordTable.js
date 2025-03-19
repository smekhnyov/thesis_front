import React from 'react';
import PropTypes from 'prop-types';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';

const RecordTable = ({ title, recordData }) => {
    return (
        <Paper
            sx={{
                width: 'auto',
                mb: 2,
                backgroundColor: 'var(--tg-theme-bg-color)',
                color: 'var(--tg-theme-text-color)',
                border: '1px solid var(--tg-theme-button-color)',
                borderRadius: '10px',
                padding: 2,
                overflowX: 'auto',
                marginTop: '0',
            }}
        >
            <Typography
                variant="h6"
                component="div"
                sx={{
                    backgroundColor: 'var(--tg-theme-button-color)',
                    color: 'var(--tg-theme-text-color)',
                    borderRadius: '10px',
                    padding: '8px 16px',
                    marginBottom: '16px',
                }}
            >
                {title}
            </Typography>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    borderColor: 'var(--tg-theme-button-color)',
                                    color: 'var(--tg-theme-text-color)',
                                }}
                            >
                                Поле
                            </TableCell>
                            <TableCell
                                sx={{
                                    borderColor: 'var(--tg-theme-button-color)',
                                    color: 'var(--tg-theme-text-color)',
                                }}
                            >
                                Значение
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(recordData).map(([key, value]) => (
                            <TableRow hover key={key}>
                                <TableCell
                                    sx={{
                                        borderColor: 'var(--tg-theme-button-color)',
                                        color: 'var(--tg-theme-text-color)',
                                    }}
                                >
                                    {key}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        borderColor: 'var(--tg-theme-button-color)',
                                        color: 'var(--tg-theme-text-color)',
                                    }}
                                >
                                    {value}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

RecordTable.propTypes = {
    title: PropTypes.string.isRequired,
    recordData: PropTypes.object.isRequired,
};

export default RecordTable;