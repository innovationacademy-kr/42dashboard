import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashBoardPage from './dashboard/presentation/pages/DashBoardPage';
import Login from './dashboard/presentation/components/Login/Login';
import useUser from './dashboard/application/services/useUser';

function App() {
  const { user } = useUser();
  if (user === null) {
    // TODO(hybae)
    // user 정보 요청하여 저장하는 로직
  }
  const toRoute = user === null ? <Login /> : <DashBoardPage />;
  console.log(toRoute);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={toRoute} />
        <Route path="/dashboard" element={<DashBoardPage />} />
      </Routes>
    </div>
  );
}

export default App;
