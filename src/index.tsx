import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SnakeGame from './SnakeGame';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <div className="flex justify-center items-center w-full h-screen">
      <SnakeGame />
    </div>
  </React.StrictMode>
);

