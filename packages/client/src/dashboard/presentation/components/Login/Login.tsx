import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import useUser from '../../../application/services/useUser';

const LoginPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  height: 100vh;
`;

const LoginButton = styled.button`
  width: 400px;
  height: 100px;
  border: 1px solid blue;
  background-color: grey;
  cursor: pointer;
`;

// TODO: hybae
// 이미 로그인이 되어있는 경우, dashboard 페이지로 라우팅
const Login = () => {
  const { userInfo } = useUser();
  const navigate = useNavigate();

  if (userInfo !== null) {
    // navigate(`/dashboard`);
  }

  function handleClick() {
    window.location.href = 'http://dashboard42.com:3000/auth/42';
  }

  return (
    <LoginPage>
      <LoginButton onClick={() => handleClick()}>LOGIN</LoginButton>
    </LoginPage>
  );
};

export default Login;
