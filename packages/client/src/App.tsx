import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashBoardPage from './dashboard/presentation/pages/DashBoardPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<DashBoardPage />} />
      </Routes>
    </div>
  );
}

export default App;
