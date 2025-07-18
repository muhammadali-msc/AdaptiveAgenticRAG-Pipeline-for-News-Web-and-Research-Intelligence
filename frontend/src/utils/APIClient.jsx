import axios from 'axios';
import { useAuth } from '../components/AuthContext';

export const BASE_URL = 'http://localhost:8000';

export const getAPI = async (url, accessToken, tokenType) => {
  const options = {
  params: {

  },
  headers: {
    Authorization: `${tokenType} ${accessToken}`
  }
 };
  try {
    const { data } = await axios.get(`${BASE_URL}/${url}`, options);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const postAPI = async (url, payload, accessToken, tokenType) => {
  const options = {
  params: {

  },
  headers: {
    Authorization: `${tokenType} ${accessToken}`
  }
};
  console.log("POST API------------------------", tokenType, accessToken)
  try {

    const { data } = await axios.post(`${BASE_URL}/${url}`, payload, options);
    return data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.detail) {
      const errorMessage = error.response.data.detail;
      console.error(`Error posting data: ${errorMessage}`);
      alert(`Error posting data: ${errorMessage}`);
    }
    throw error;
  }
};

export const putAPI = async (url, payload, accessToken, tokenType) => {
  const options = {
    params: {},
    headers: {
      Authorization: `${tokenType} ${accessToken}`
    }
  };

  console.log("PUT API------------------------", tokenType, accessToken);

  try {
    const { data } = await axios.put(`${BASE_URL}/${url}`, payload, options);
    return data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.detail) {
      const errorMessage = error.response.data.detail;
      console.error(`Error updating data: ${errorMessage}`);
      alert(`Error updating data: ${errorMessage}`);
    }
    throw error;
  }
};
