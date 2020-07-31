import fs from 'fs';
import {resolve} from 'path';
import { WAClient } from '@adiwajshing/baileys';
import { MessageType, Mimetype } from '@adiwajshing/baileys';
import QRCode from 'qrcode';

const cwd = process.cwd();

const client = new WAClient();

export const wsAuthenticateAndSend = (ws) => {

  client.onReadyForPhoneAuthentication = async ([ref, publicKey, clientID]) => {
    const str = ref + ',' + publicKey + ',' + clientID;
    const qrStr = await QRCode.toDataURL(str);
    ws.send(JSON.stringify({qr: qrStr}));
  }
  
  client
    .connect()
    .then (() => {
      ws.send(JSON.stringify({success: true}));
    })
    .catch (err => console.log("unexpected error: " + err) );
}

export const sendMessage = (ws, mobileNumber, name, title) => {
  const id = `91${mobileNumber}@s.whatsapp.net`; // the WhatsApp ID 
  const img2Path = resolve(cwd, 'src/assets', `${name}.jpg`);
  const buffer = fs.readFileSync(img2Path); // load some gif
  const options = {mimetype: Mimetype.jpeg, caption: `${title}`}; // some metadata & caption
  client.sendMessage(id, buffer, MessageType.image, options);
  ws.send(JSON.stringify({msg_success: true}));
}

export const authenticateAndSend = async (res, name, title) => {
  client.onReadyForPhoneAuthentication = async ([ref, publicKey, clientID]) => {
    const str = ref + ',' + publicKey + ',' + clientID;
    const url = await QRCode.toDataURL(str);
    res.send({
      data: url
    });
  }
  // client.loadAuthInfoFromBrowser = (authInfo) => {
  //   console.log('authInfo = ', authInfo);
  // }
  // client.connect() 
  // .then (([user, chats, contacts, unread]) => {
  //   console.log('CONNECTED');
  //   console.log('contacts = ', contacts);
  //   res.send({
  //     data: contacts
  //   });
  // })
  // client
  //   .connectSlim() // connect first
  //   .then (([user, chats, contacts, unread]) => {
  //     console.log('CONNECTED');
  //     console.log('contacts = ', contacts);
  //     const creds = client.base64EncodedAuthInfo () // contains all the keys you need to restore a session
  //     fs.writeFileSync('./auth_info.json', JSON.stringify(creds, null, '\t')) // save JSON to file
  //   })
  await client
    .connect()
    .then (() => {
      const id = '918056043140@s.whatsapp.net'; // the WhatsApp ID 
      const img2Path = resolve(cwd, 'src/assets', `${name}.jpg`);
      const buffer = fs.readFileSync(img2Path); // load some gif
      const options = {mimetype: Mimetype.jpeg, caption: `${title}`} // some metadata & caption
      client.sendMessage(id, buffer, MessageType.image, options);
    })
    .catch (err => console.log("unexpected error: " + err) );
}
