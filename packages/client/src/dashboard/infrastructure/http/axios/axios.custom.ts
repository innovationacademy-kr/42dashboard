import * as axios from './axios.instance';

// login api의 url
const loginURL = '/auth/42';

export const axiosLogin = async () => {
  try {
    const response = await axios.instance.get(loginURL);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};
