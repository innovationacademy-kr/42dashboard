import axios from 'axios';

export const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URI}`,
  withCredentials: true,
  timeout: 300000,
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  },
});
