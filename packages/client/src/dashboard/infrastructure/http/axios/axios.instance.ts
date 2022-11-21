import axios from 'axios';
import useUser from '../../../application/services/useUser';

export const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URI}`,
  withCredentials: true,
  timeout: 300000,
  validateStatus: function (status) {
    return status >= 200 && status < 300;
  },
});

const Interceptor = ({ children }: any) => {
  const { setUser } = useUser();

  instance.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      console.log(error.response.status);
      if (error.response?.status === 401) {
        await setUser(null);
        window.location.href = '/';
      }
    },
  );
  return children;
};

export { Interceptor };
