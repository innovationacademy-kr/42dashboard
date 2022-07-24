import { Box, CssBaseline, Typography } from '@mui/material';
import createQuery from '../../infrastructure/http/graphql/createQuery';
import AppBar from '../components/AppBar/AppBar';
import ProfileMenu from '../components/AppBar/ProfileMenu/ProfileMenu';
import Board from '../components/Board/Board';
import Section from '../components/Board/Section';
import BarChart from '../components/Charts/BarChart';
import LineChart from '../components/Charts/LineChart';
import PieChart from '../components/Charts/PieChart';
import MainArea from '../components/MainArea/MainArea';
import ModeDial from '../components/ModeDial/ModeDial';
import SideBar from '../components/SideBar/SideBar';

// TODO: hybae
// userData가 null일 때, setUserData
function DashBoardPage() {
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

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar>
        {appBarTitle}
        <div style={{ flexGrow: 1 }}></div>
        {profileMenu}
      </AppBar>
      <SideBar />
      <MainArea>
        <Board />
      </MainArea>
      <ModeDial />
    </Box>
  );
}

export default DashBoardPage;
