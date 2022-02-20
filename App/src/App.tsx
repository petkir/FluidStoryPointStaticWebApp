import React from 'react';
import { Outlet } from 'react-router-dom';

import './App.css';
import { User } from './components/User';




function App() {
  return (
    <div className="App">
      <div className="Header">
        <div>
          <h1>ADCD 2022 Fluid Story Pocker Sample</h1>
        </div>

        <User />

      </div>
      <div className="content">
        <Outlet />
      </div>

    </div>
  );
}

export default App;
