import axios from 'axios';

const SERVER_URL = 'https://smekhnyov.ru';
// const SERVER_URL = 'http://127.0.0.1:5000';


export const fetchTables = async () => {
    const response = await axios.get(`${SERVER_URL}/table`);
    return response.data;
};

export const fetchColumns = async (table) => {
    const response = await axios.get(`${SERVER_URL}/column/${table}`);
    return response.data;
}
;
export const fetchColumnTypes = async (table) => {
    const response = await axios.get(`${SERVER_URL}/column_types/${table}`);
    console.log('fetchColumnTypes response:', response);
    return response.data;
};

export const fetchData = async (table, column) => {
    const response = await axios.get(`${SERVER_URL}/data/${table}/${column}`);
    return response.data;
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