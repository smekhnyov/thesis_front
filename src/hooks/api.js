import axios from 'axios';

// const SERVER_URL = 'https://smekhnyov.ru';
const SERVER_URL = 'http://127.0.0.1:5000';


export const fetchTables = async () => {
    try {
        const response = await axios.get(`${SERVER_URL}/table`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tables:', error);
        return { status: 'error', message: error.message };
    }
};

export const fetchColumns = async (table) => {
    try {
        const response = await axios.get(`${SERVER_URL}/column/${table}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching columns:', error);
        return { status: 'error', message: error.message };
    }
};

export const fetchColumnTypes = async (table) => {
    try {
        const response = await axios.get(`${SERVER_URL}/column_types/${table}`);
        console.log('fetchColumnTypes response:', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching column types:', error);
        return { status: 'error', message: error.message };
    }
};

export const fetchData = async (table, column) => {
    try {
        const response = await axios.get(`${SERVER_URL}/data/${table}/${column}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return { status: 'error', message: error.message };
    }
};

export const fetchPrimaryKey = async (table) => {
    try {
        const response = await axios.get(`${SERVER_URL}/primary_keys/${table}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching primary key:', error);
        return { status: 'error', message: error.message };
    }
};

export const fetchDataById = async (table, id) => {
    try {
        const response = await axios.get(`${SERVER_URL}/data/${table}`, {
            params: { id }
        });
        if (response.data.status === 'error') {
            throw new Error(response.data.message);
        }
        const { columns, rows } = response.data;
        if (rows.length === 0) {
            throw new Error('No data found for the given ID');
        }
        const data = rows[0];
        const formattedData = columns.reduce((acc, col, index) => {
            acc[col] = data[index];
            return acc;
        }, {});
        return { status: 'success', data: formattedData };
    } catch (error) {
        console.error('Error fetching data by ID:', error);
        return { status: 'error', message: error.message };
    }
};

export const insertData = async (dataDict) => {
    try {
        const response = await axios.post(`${SERVER_URL}/insert`, dataDict);
        return response.data;
    } catch (error) {
        console.error('Error inserting data:', error);
        throw error;
    }
};

export const updateData = async (dataDict) => {
    try {
        const response = await axios.post(`${SERVER_URL}/update`, dataDict);
        return response.data;
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
};

export const deleteData = async (table, keyValue) => {
    try {
        const response = await axios.delete(`${SERVER_URL}/delete`, {
            data: { table, key_value: keyValue },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
};