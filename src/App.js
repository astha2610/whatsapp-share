import React, {useState} from 'react';
// import WebSocket from 'ws';

import './App.css';
import Header from './components/Header';
import ImageGallery from './components/Gallery';

function App() {
  const [userInfo, setUserInfo] = useState(null);

  const updateUserInfo = (info) => {
    setUserInfo(info);
  }

  return (
    <div className="app">
      <Header userInfo={userInfo} updateUserInfo={updateUserInfo} />
      <ImageGallery userInfo={userInfo} updateUserInfo={updateUserInfo} />
    </div>
  );
}

export default App;
