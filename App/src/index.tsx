import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { CreateNewSession } from './pages/CreateNewSession';
import { Play } from './pages/Play';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Join } from './pages/Join';
initializeIcons();


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<CreateNewSession />} />
          <Route path="play/:sessionId" element={<Play />} />
          <Route path="join/:sessionId" element={<Join />} />
        </Route>
      </Routes>
    </BrowserRouter>

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
