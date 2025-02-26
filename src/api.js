import axios from 'axios';

export const fetchTables = async () => {
  const response = await axios.get('https://smekhnyov.ru/table');
  return response.data;
};

export const fetchColumns = async (table) => {
  const response = await axios.get(`https://smekhnyov.ru/column/${table}`);
  return response.data;
};

export const fetchData = async (table, column) => {
  const response = await axios.get(`https://smekhnyov.ru/data/${table}/${column}`);
  return response.data;
};