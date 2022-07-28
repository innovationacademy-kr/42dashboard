import { Box, CssBaseline, Typography } from '@mui/material';
import { createQueryForTable } from '../../infrastructure/http/graphql/createQuery';
import AppBar from '../components/AppBar/AppBar';
import ProfileMenu from '../components/AppBar/ProfileMenu/ProfileMenu';
import Board from '../components/Board/Board';
import Logo from '../components/Logo/logo';
import MainArea from '../components/MainArea/MainArea';
import ModeDial from '../components/ModeDial/ModeDial';
import SideBar from '../components/SideBar/SideBar';
import { TableStickerContent } from '../components/Table/Table';
import * as axios from '../../infrastructure/http/axios/axios.custom';
import useUser from '../../application/services/useUser';
import { useNavigate } from 'react-router';

// TODO: hybae
// userData가 null일 때 처리 추가
// userInfo API를 통해 데이터 받아올 경우, userData set
// 그 외의 경우, 로그인 페이지로 라우팅
function DashBoardPage() {
  const { userInfo, setUser } = useUser();
  const navigate = useNavigate();

  if (userInfo === null) {
    axios
      .axiosGetUserInfo()
      .then((response: any) => response.data)
      .then((data) => setUser(data))
      .catch((error) => {
        navigate(`/`);
      });
  }

  const appBarTitle = (
    <Typography
      variant="h6"
      component="a"
      href="/"
      sx={{
        mr: 2,
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
        color: 'inherit',
        textDecoration: 'none',
      }}
      noWrap
    >
      42Dash
    </Typography>
  );

  const profile = { name: 'kilee', size: 48 };

  const profileMenuItems = [
    {
      label: '마이페이지',
      onClick: () => {
        console.log('Click');
      },
    },
    {
      label: '로그아웃',
      onClick: () => {
        console.log('로그아웃');
      },
    },
  ];

  const profileMenu = (
    <ProfileMenu menuItems={profileMenuItems} profile={profile} />
  );

  const tableProps = {
    columnGroups: [
      { id: 'user', colSpan: 3, label: '기본 정보' },
      { id: 'personal', colSpan: 2, label: '개인 정보' },
    ],
    columns: [
      { id: 'intraNo', label: '인트라 No.' },
      { id: 'name', label: '이름' },
      { id: 'grade', label: '기수' },
      { id: 'age', label: '나이' },
      { id: 'gender', label: '성별' },
    ],
    queryData: {
      query: createQueryForTable(
        ['personalData'],
        ['intra_no', 'name', 'grade', 'userPersonalInformation {age, gender}'],
      ),
      filters: {
        personalData: {
          entityName: 'userPersonalInformation',
          column: null,
          operator: null,
          givenValue: null,
          latest: true,
        },
      },
    },
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar>
        <Logo />
        <div style={{ flexGrow: 1 }}></div>
        {profileMenu}
      </AppBar>
      <SideBar />
      <MainArea>
        <TableStickerContent {...tableProps} />
        <Board />
      </MainArea>
      <ModeDial />
    </Box>
  );
}

export default DashBoardPage;
