import * as axios from './axios.instance';

// login api의 url
const getUserInfoURL = '/auth/userInfo';

export const axiosGetUserInfo = async () => {
  try {
    const response = await axios.instance.get(getUserInfoURL);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};
