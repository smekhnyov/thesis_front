import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    Toolbar,
    Typography,
} from '@mui/material';
import { TelegramButton } from './';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

const DataTable = ({ title, columns, rows }) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState(columns[0]?.id || '');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const calculateRowsPerPage = () => {
            const navbarHeight = 60; // Замените на фактическую высоту вашего navbar
            const rowHeight = 48; // Высота строки таблицы (может потребоваться корректировка)
            const availableHeight = window.innerHeight - navbarHeight;
            const calculatedRowsPerPage = Math.floor(availableHeight / rowHeight);
            setRowsPerPage(calculatedRowsPerPage);
        };

        calculateRowsPerPage();
        window.addEventListener('resize', calculateRowsPerPage);

        return () => {
            window.removeEventListener('resize', calculateRowsPerPage);
        };
    }, []);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const sortedRows = useMemo(() => {
        return rows.slice().sort(getComparator(order, orderBy));
    }, [rows, order, orderBy]);

    const paginatedRows = useMemo(() => {
        return sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [sortedRows, page, rowsPerPage]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(rows, null, 2));
            console.log('Table data copied to clipboard');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

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
                overflowX: 'auto', // Добавлено для горизонтальной прокрутки
                marginTop: '0',
            }}
        >
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'var(--tg-theme-button-color)',
                    color: 'var(--tg-theme-text-color)',
                    borderRadius: '10px',
                    padding: '0 16px',
                }}
            >
                <Typography variant="h6" component="div">
                    {title}
                </Typography>
                <TelegramButton onClick={handleCopy} sx={{marginLeft: '20px'}}>Copy JSON</TelegramButton>
            </Toolbar>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell
                                    key={col.id}
                                    align={col.numeric ? 'right' : 'left'}
                                    sortDirection={orderBy === col.id ? order : false}
                                    sx={{ 
                                        borderColor: 'var(--tg-theme-button-color)',
                                        width: 'auto' // Автоматическая ширина для ячеек заголовка
                                    }}
                                >
                                    <TableSortLabel
                                        active={orderBy === col.id}
                                        direction={orderBy === col.id ? order : 'asc'}
                                        onClick={(e) => handleRequestSort(e, col.id)}
                                        sx={{
                                            color: 'var(--tg-theme-text-color)',
                                            '&:hover, &.Mui-active': {
                                                color: 'var(--tg-theme-button-color)',
                                            },
                                            '& .MuiTableSortLabel-icon': {
                                                color: 'var(--tg-theme-button-color)',
                                                stroke: 'var(--tg-theme-button-color)',
                                            },
                                        }}
                                    >
                                        {col.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedRows.map((row, rowIndex) => (
                            <TableRow hover key={rowIndex}>
                                {columns.map((col) => (
                                    <TableCell
                                        key={col.id}
                                        align={col.numeric ? 'right' : 'left'}
                                        sx={{ 
                                            borderColor: 'var(--tg-theme-button-color)', 
                                            color: 'var(--tg-theme-text-color)',
                                            width: 'auto' // Автоматическая ширина для ячеек данных
                                        }}
                                    >
                                        {row[col.id]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[rowsPerPage]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                sx={{
                    backgroundColor: 'var(--tg-theme-bg-color)',
                    color: 'var(--tg-theme-text-color)',
                    '& .MuiTablePagination-input': {
                        color: 'var(--tg-theme-text-color)',
                        stroke: 'var(--tg-theme-text-color)',
                    },
                }}
            />
        </Paper>
    );
};

DataTable.propTypes = {
    title: PropTypes.string,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            numeric: PropTypes.bool,
        })
    ).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired,
};

DataTable.defaultProps = {
    title: '',
};

export default DataTable;