import axios from 'axios';

export const instance = axios.create({
  baseURL: 'http://dashboard42.com:3000',
  timeout: 5000,
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  },
});
