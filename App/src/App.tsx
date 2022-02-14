import React from 'react';
import { Outlet } from 'react-router-dom';

import './App.css';
import { User } from './components/User';
import { Play } from './pages/Play';



function App() {
  return (
    <div className="App">
      
      <h1>ADCD 2022 Fluid Story Pocker Sample</h1>
      <User/>
      <div className="content">
        <Outlet />
      </div>
   
    </div>
  );
}

export default App;
