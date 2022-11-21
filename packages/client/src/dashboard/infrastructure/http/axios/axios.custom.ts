import * as axios from './axios.instance';
import PresetType from '../../../domain/preset/preset.type';

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

const updateDataURL = '/update/data';

export const axiosUpdateData = async () => {
  try {
    const response = await axios.instance.get(updateDataURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const logoutURL = '/auth/logout';

export const axiosLogout = async () => {
  try {
    const response = await axios.instance.post(logoutURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const getErrorURL = '/auth/getError';

export const axiosGetError = async () => {
  try {
    const response = await axios.instance.get(getErrorURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const getOnePresetURL = `${process.env.REACT_APP_GET_ONE_PRESET}/`;

export const axiosGetOnePreset = async (id: string) => {
  try {
    const response = await axios.instance.get(getOnePresetURL + id);
    return response;
  } catch (error) {
    throw error;
  }
};

const getAllPresetURL = `${process.env.REACT_APP_GET_ALL_PRESET}`;

export const axiosGetAllPreset = async () => {
  try {
    const response = await axios.instance.get(getAllPresetURL);
    return response;
  } catch (error) {
    throw error;
  }
};

const updatePresetURL = `${process.env.REACT_APP_UPDATE_ONE_PRESET}/`;

export const axiosUpdatePreset = async (id: string, preset: PresetType) => {
  try {
    await axios.instance.put(updatePresetURL + id, preset);
  } catch (error) {
    throw error;
  }
};

const addPresetURL = `${process.env.REACT_APP_ADD_PRESET}`;

export const axiosAddPreset = async (preset: PresetType) => {
  try {
    await axios.instance.post(addPresetURL, preset);
  } catch (error) {
    throw error;
  }
};

const deletePresetURL = `${process.env.REACT_APP_DELETE_ONE_PRESET}/`;

export const axiosDeletePreset = async (id: string) => {
  try {
    await axios.instance.delete(deletePresetURL + id);
  } catch (error) {
    throw error;
  }
};
