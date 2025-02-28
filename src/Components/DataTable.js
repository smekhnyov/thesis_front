import React, { useState, useMemo } from 'react';
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

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const sortedRows = useMemo(() => {
        return rows.slice().sort(getComparator(order, orderBy));
    }, [rows, order, orderBy]);

    const paginatedRows = useMemo(() => {
        return sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [sortedRows, page, rowsPerPage]);

    return (
        <Paper
            sx={{
                width: '100%',
                mb: 2,
                backgroundColor: 'var(--tg-theme-bg-color)',
                color: 'var(--tg-theme-text-color)',
                border: '1px solid var(--tg-theme-button-color)',
                borderRadius: '10px',
                padding: 2,
            }}
        >
            <Toolbar
                sx={{
                    backgroundColor: 'var(--tg-theme-button-color)',
                    color: 'var(--tg-theme-text-color)',
                    borderRadius: '10px'
                }}
            >
                <Typography variant="h6" component="div">
                    {title}
                </Typography>
            </Toolbar>
            <TableContainer>
                <Table sx={{ minWidth: 750 }} size="small">
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell
                                    key={col.id}
                                    align={col.numeric ? 'right' : 'left'}
                                    sortDirection={orderBy === col.id ? order : false}
                                    sx={{ borderColor: 'var(--tg-theme-button-color)' }}
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
                                        sx={{ borderColor: 'var(--tg-theme-button-color)', color: 'var(--tg-theme-text-color)' }}
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
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
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