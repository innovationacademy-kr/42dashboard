import styled from '@emotion/styled';

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

const Login = () => {
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
