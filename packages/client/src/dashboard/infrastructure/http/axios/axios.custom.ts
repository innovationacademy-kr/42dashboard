import * as axios from './axios.instance';

// login api의 url
const getUserInfoURL = '/auth/userInfo';

export const axiosGetUserInfo = async () => {
  try {
    const response = await axios.instance.get(getUserInfoURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const updateDataURL = '/updata/data';

export const axiosUpdateData = async () => {
  try {
    const response = await axios.instance.get(updateDataURL);
    return response;
  } catch (error) {
    throw error;
  }
};
