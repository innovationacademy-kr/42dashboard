import { Box, CssBaseline, Typography } from '@mui/material';
import AppBar from '../components/AppBar/AppBar';
import Profile from '../components/AppBar/Profile/Profile';
import ProfileMenu, {
  ProfileMenuItemProps,
} from '../components/AppBar/ProfileMenu/ProfileMenu';
import Board from '../components/Board/Board';
import MainArea from '../components/MainArea/MainArea';
import SideBar from '../components/SideBar/SideBar';

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
    AppBarTitle
  </Typography>
);

const profile = { name: 'kilee' };

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

function DashBoardPage() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        title="42Dash"
        leftChildren={[appBarTitle]}
        rightChildren={[profileMenu]}
      />
      <SideBar />
      <MainArea>
        <Board />
      </MainArea>
    </Box>
  );
}

export default DashBoardPage;
