import React from 'react';
// import WebSocket from 'ws';

import './App.css';
import Header from './components/Header';
import ImageGallery from './components/Gallery';

function App() {
  return (
    <div className="app">
      <Header />
      <ImageGallery />
    </div>
  );
}

export default App;
