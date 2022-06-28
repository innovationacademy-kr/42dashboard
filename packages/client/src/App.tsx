<<<<<<< HEAD
import './App.css';
import Board from './dashboard/presentation/components/Board/Board';

function App() {
  return <Board />;
=======
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
>>>>>>> 2edffff (feat(client,App.tsx,index.tsx): 브라우저라우터 적용)
}

export default App;
