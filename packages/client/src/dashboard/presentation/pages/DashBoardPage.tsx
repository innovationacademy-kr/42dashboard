import { Box, CssBaseline, Typography } from '@mui/material';
import createQuery from '../../infrastructure/http/graphql/createQuery';
import AppBar from '../components/AppBar/AppBar';
import ProfileMenu from '../components/AppBar/ProfileMenu/ProfileMenu';
import BarChart from '../components/Charts/BarChart';
import LineChart from '../components/Charts/LineChart';
import PieChart from '../components/Charts/PieChart';
import MainArea from '../components/MainArea/MainArea';
import ModeDial from '../components/ModeDial/ModeDial';
import SideBar from '../components/SideBar/SideBar';

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

  const weMadeQuery = createQuery(
    ['filtersGrade', 'filtersMan', 'filtersWoman'],
    ['man', 'woman'],
    [
      ['filtersGrade', 'filtersMan'],
      ['filtersGrade', 'filtersWoman'],
      ['filtersMan'],
      ['filtersWoman'],
    ],
  );
  const queryData = {
    query: weMadeQuery,
    filters: {
      filtersMan: {
        entityName: 'userPersonalInformation',
        column: 'gender',
        operator: '=',
        givenValue: '남',
        latest: true,
      },
      filtersWoman: {
        entityName: 'userPersonalInformation',
        column: 'gender',
        operator: '=',
        givenValue: '여',
        latest: true,
      },
      filtersGrade: {
        entityName: 'user',
        column: 'grade',
        operator: '=',
        givenValue: '2기',
        latest: true,
      },
    },
  };

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
        <PieChart labels={['man', 'woman']} queryData={queryData} />
        <LineChart labels={['man', 'woman']} queryData={queryData} />
        <BarChart labels={['man', 'woman']} queryData={queryData} />
      </MainArea>
      <ModeDial />
    </Box>
  );
}

export default DashBoardPage;
