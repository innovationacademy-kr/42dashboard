import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashBoardPage from './dashboard/presentation/pages/DashBoardPage';
import Login from './dashboard/presentation/pages/Login';
import { createTheme, ThemeProvider } from '@mui/material';
import {
  getControlMode,
  setControlMode,
} from './dashboard/application/services/useMode';
import { Interceptor } from './dashboard/infrastructure/http/axios/axios.instance';
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

document.addEventListener('keyup', (event) => {
  const keyName = event.keyCode;
  if (keyName === 27 && getControlMode() === 'fullscreen') {
    setControlMode('view');
    window.location.reload();
  }
});

function App() {
  return (
    <div className="App">
      <Interceptor>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<DashBoardPage />} />
        </Routes>
      </Interceptor>
    </div>
  );
}

export default App;
