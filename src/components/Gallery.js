import React, {useState} from 'react';

import '../App.css';
import QRLoader from './QRCodeLoader';
import share from '../assets/share.svg';
import book1 from '../assets/book1.jpg';
import book2 from '../assets/book2.jpg';
import book3 from '../assets/book3.jpg';
import book4 from '../assets/book4.jpg';
import book5 from '../assets/book5.jpg';
import book6 from '../assets/book6.jpg';
import book7 from '../assets/book7.jpg';
import book8 from '../assets/book8.jpg';

const dataObj = [{
  title: 'The Psycology Of Money',
  name: 'book1',
  link: book1
}, {
  title: 'Milk & Honey',
  name: 'book2',
  link: book2
}, {
  title: 'The First New Universe',
  name: 'book3',
  link: book3
}, {
  title: 'All The Letters I Should Have Sent',
  name: 'book4',
  link: book4
}, {
  title: 'Your Soul Is A River',
  name: 'book5',
  link: book5
}, {
  title: 'This Is For The Women Who Don\'t Give A Fuck',
  name: 'book6',
  link: book6
}, {
  title: 'The Passion Within',
  name: 'book7',
  link: book7
}, {
  title: 'Your Heart Is The Sea',
  name: 'book8',
  link: book8
}]

function ImageGallery() {
  const regexpNum = /^[0-9\b]+$/;

  const [showModal, setShowModal] = useState(false);
  const [showMobileInput, setShowMobileInput] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [data, setData] = useState({
    name: '',
    title: ''
  });
  const [qrCode, setQRCode] = useState('');
  const [ws, setWS] = useState(null);
  const [error, setError] = useState('');
  
  const authenticateToSendMessage = async (name, title) => {
    const wss = new WebSocket('ws://localhost:3001/auth/');
    setShowModal(true);
    setData({name, title});
    wss.onopen = () => {
      setWS(wss);
    };
    wss.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if (data.qr) {
        setQRCode(data.qr);
      } else if (data.success) {
        setShowMobileInput(true);
      } else if (data.msg_success) {
        setShowModal(false);
      }
    }
  }

  const sendMessage = (name, title) => {
    if (mobileNumber && mobileNumber.length === 10) {
      const tempObj = {...data, mobile: mobileNumber};
      const txt = JSON.stringify(tempObj);
      ws.send(txt);
    } else {
      setError('Please enter a valid mobile number');
    }
  }

  return (
    <div className="gallery-container">
      {dataObj.map(item => <div className="image-container" key={item.title}>
        <img src={share} className="share-icon" alt="share icon" onClick={() => authenticateToSendMessage(item.name, item.title)} />
        <img src={item.link} className="gallery-image" alt="book" />
        <p>{item.title}</p>
      </div>)}
      {(showModal && <div id="myModal" className="modal">
        <div className="modal-content">
          <div className="qrcode-container">
            {qrCode ? 
              <>
                {(!showMobileInput && <>
                  <p className="modal-text">Please scan this QR from yours whatsapp to send message</p>
                  <p className="modal-sub-text">WhatsApp > Settings > WhatsApp Web/Desktop > Scan QR Code</p>
                  <img src={qrCode} alt="qr code" />
                </>) || null}
                {(showMobileInput && <>
                  <p className="modal-text">Please enter the number you want to send message to: </p>
                  <div className="input-wrapper">
                    <input type="text" value={mobileNumber} className="common-input" onChange={(e) => setMobileNumber(e.target.value)} maxLength={10} required />
                    <button className="send-button" onClick={sendMessage}>SEND</button>
                  </div>
                </>) || null}
              </>
              : 
              <QRLoader />
            }
          </div>
        </div>
      </div>) || null}
    </div>
  );
}

export default ImageGallery;
