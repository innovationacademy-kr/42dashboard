import { Box, CssBaseline, Paper } from '@mui/material';
import AppBar from '../components/AppBar/AppBar';
import ProfileMenu from '../components/AppBar/ProfileMenu/ProfileMenu';
import Board from '../components/Board/Board';
import Logo from '../components/Logo/logo';
import MainArea from '../components/MainArea/MainArea';
import SideBar from '../components/SideBar/SideBar';
import * as axios from '../../infrastructure/http/axios/axios.custom';
import useUser from '../../application/services/useUser';
import { useNavigate } from 'react-router';
import Footer from '../components/Footer/Footer';
import ModificationDialog from '../components/Dialog/ModificationDialog';
import { useEffect, useState } from 'react';
import UserType from '../../domain/user/user.type';

// TODO: hybae
// userData가 null일 때 처리 추가
// userInfo API를 통해 데이터 받아올 경우, userData set
// 그 외의 경우, 로그인 페이지로 라우팅
function DashBoardPage() {
  const { setUser, getUser } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getUser().then((data: UserType | null) => {
      if (data === null) {
        axios
          .axiosGetUserInfo()
          .then((response: any) => response.data)
          .then((data) => setUser(data))
          .catch((error) => {
            // navigate(`/`);
          });
      }
    });
  }, []);

  function delCookie(key: string) {
    const now = new Date();
    document.cookie = key + '=; path=/; expires=' + now.toUTCString() + ';';
  }

  const profile = { name: 'kilee', size: 48 };

  const profileMenuItems = [
    {
      label: '수정하기',
      onClick: () => {
        setOpen(true);
      },
    },
    {
      label: '마이페이지',
      onClick: () => {
        console.log('Click');
      },
    },
    {
      label: '로그아웃',
      onClick: () => {
        axios
          .axiosLogout()
          .then((response: any) => {
            setUser(null);
            delCookie('access_token');
            navigate('/');
          })
          .catch((error) => console.log(error));
      },
    },
  ];

  const profileMenu = (
    <ProfileMenu menuItems={profileMenuItems} profile={profile} />
  );

  return (
    <Paper sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <AppBar>
        <Logo />
        <div style={{ flexGrow: 1 }} />
        {profileMenu}
      </AppBar>
      <SideBar />
      <MainArea>
        <Board />
        <Footer />
      </MainArea>
      <ModificationDialog open={open} setOpen={setOpen} />
    </Paper>
  );
}

export default DashBoardPage;
