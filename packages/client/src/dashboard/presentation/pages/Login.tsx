import styled from '@emotion/styled';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../../application/services/useUser';
import UserType from '../../domain/user/user.type';
import { ReactComponent as DashLogo } from '../../../assets/images/logo.svg';

const LoginPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const LoginButton = styled.button`
  width: 400px;
  height: 80px;
  border-radius: 1rem;
  background-color: darkgrey;
  cursor: pointer;
  font-size: 2rem;
  transition: all 0.7s;
  color: black;
  margin: 2rem;
  &:hover {
    background-color: grey;
    color: white;
    font-size: 3rem;
  }
`;

// TODO: hybae
// 이미 로그인이 되어있는 경우, dashboard 페이지로 라우팅
function Login() {
  const { getUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    getUser().then((data: UserType | null) => {
      if (data !== null) {
        navigate('/dashboard');
      }
    });
  }, []);

  function handleClick() {
    window.location.href = `${process.env.REACT_APP_API_URI}${process.env.REACT_APP_AUTH}`;
  }

  return (
    <LoginPage>
      <DashLogo width="550px"></DashLogo>
      <LoginButton onClick={() => handleClick()}>LOGIN</LoginButton>
    </LoginPage>
  );
}

export default Login;
