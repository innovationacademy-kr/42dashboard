import { Box, CssBaseline } from '@mui/material';
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
import {
  getControlMode,
  setControlMode,
} from '../../application/services/useMode';

// TODO: hybae
// userData가 null일 때 처리 추가
// userInfo API를 통해 데이터 받아올 경우, userData set
// 그 외의 경우, 로그인 페이지로 라우팅
function DashBoardPage() {
  const { setUser, getUser, userInfo } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('view');
  const controlMode = getControlMode();

  useEffect(() => {
    setMode(controlMode);
    getUser().then((data: UserType | null) => {
      if (data === null) {
        axios
          .axiosGetUserInfo()
          .then((response: any) => response.data)
          .then((data) => setUser(data))
          .catch((error) => {
            navigate(`/`);
          });
      } else {
        axios
          .axiosGetError()
          .then((data) => console.log('SUCCESS'))
          .catch((error) => {
            let alertMsg = '';
            const errorMessages = error.response.data.data;
            for (let i = 0; i < errorMessages.length; i += 1) {
              if (typeof errorMessages[i].rowIdx === typeof 1) {
                alertMsg += `${errorMessages[i].colIdx}${errorMessages[i].rowIdx} 인덱스의 값이 ${errorMessages[i].value} 입니다\n`;
              } else {
                const colIdx = errorMessages[i].colIdx.split(',');
                const rowIdx = errorMessages[i].rowIdx.split(',');
                const value = errorMessages[i].value.split(',');
                const count = colIdx.length;
                console.log(colIdx);
                for (let j = 0; j < count; j += 1) {
                  alertMsg += `${colIdx[j]}${rowIdx[j]} 인덱스의 값이 ${value[j]} 입니다\n`;
                }
              }
              alertMsg += `${errorMessages[i].message}\n\n`;
            }
            alert(alertMsg);
          });
      }
    });
  }, []);
  useEffect(() => {
    console.log(`mode change to ${controlMode}`);
    setMode(controlMode);
  }, [controlMode]);

  function delCookie(key: string) {
    const now = new Date();
    document.cookie = key + '=; path=/; expires=' + now.toUTCString() + ';';
  }

  const profile = {
    name: userInfo?.intraName || 'null',
    size: 48,
  };

  const profileMenuItems = [
    {
      label: '수정하기',
      onClick: () => {
        setOpen(true);
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
          .catch((error) => {
            if (error.response.status === 401) {
              setUser(null);
              delCookie('access_token');
              navigate('/');
            }
          });
      },
    },
  ];

  console.log(mode);

  const profileMenu = (
    <ProfileMenu menuItems={profileMenuItems} profile={profile} />
  );

  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      {mode !== 'fullscreen' && (
        <AppBar>
          <Logo />
          <div style={{ flexGrow: 1 }} />
          {profileMenu}
        </AppBar>
      )}
      {mode !== 'fullscreen' && <SideBar />}
      {mode === 'fullscreen' ? (
        <Board />
      ) : (
        <MainArea>
          <Board />
          <Footer />
        </MainArea>
      )}

      <ModificationDialog open={open} setOpen={setOpen} />
    </div>
  );
}

export default DashBoardPage;
