import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashBoardPage from './dashboard/presentation/pages/DashBoardPage';
import Login from './dashboard/presentation/pages/Login';
import { createTheme, ThemeProvider } from '@mui/material';

const Colors = {
  cyan: '#65C2C2',
  magenta: '#EA6390',
  yellow: '#F7C667',
  blue: '#6492C1',
  white: '#FFF',
  grey100: '#F5F5F5',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    common: {},
    primary: {
      main: Colors.cyan,
    },
    secondary: {
      main: Colors.magenta,
    },
    // error: {},
    warning: {
      main: Colors.yellow,
    },
    info: {
      main: Colors.blue,
    },
    // success: {},
    background: {
      paper: '#f2f2f2',
      default: '#fff',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: Colors.white,
          boxShadow: 'none',
          borderBottom: '1px solid #e5e5e5',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: Colors.white,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: Colors.grey100,
        },
      },
    },
  },
});

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<DashBoardPage />} />
      </Routes>
    </div>
  );
}

export default App;
