import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashBoardPage from './dashboard/presentation/pages/DashBoardPage';
import Login from './dashboard/presentation/components/Login/Login';

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
