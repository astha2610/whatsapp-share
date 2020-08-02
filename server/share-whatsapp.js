import fs from 'fs';
import {resolve} from 'path';
import { WAClient } from '@adiwajshing/baileys';
import { MessageType, Mimetype } from '@adiwajshing/baileys';
import QRCode from 'qrcode';

const cwd = process.cwd();

let client = null;

const connectWithoutAuth = (ws) => {
  client
    .connectSlim()
    .then (() => {
      // const creds = client.base64EncodedAuthInfo(); // contains all the keys you need to restore a session
      // fs.writeFileSync('./auth_info.json', JSON.stringify(creds, null, '\t')); // save JSON to file
      // console.log('client.userMetaData = ', client.userMetaData);
      ws.send(JSON.stringify({success: true, userInfo: client.userMetaData}));
    })
    .catch ((err) => {
      console.log('Connect without auth error: ', err);
    });
}

// const connectWithAuth = (ws) => {
//   client
//     .connect('./auth_info.json')
//     .then (() => {
//       ws.send(JSON.stringify({success: true}));
//     })
//     .catch ((err) => {
//       console.log('Connect with auth error: ', err);
//     });
// }

export const wsAuthenticateAndSend = (ws) => {
  client = new WAClient();
  if (!client.authInfo || (client.authInfo && !client.authInfo.clientID)) {
    connectWithoutAuth(ws);
  }
  // else {
  //   connectWithAuth(ws);
  // }
  client.onReadyForPhoneAuthentication = async ([ref, publicKey, clientID]) => {
    const str = ref + ',' + publicKey + ',' + clientID;
    const qrStr = await QRCode.toDataURL(str);
    ws.send(JSON.stringify({qr: qrStr}));
  }
}

export const sendMessage = async(ws, mobileNumber, name, title) => {
  const id = `91${mobileNumber}@s.whatsapp.net`; // the WhatsApp ID
  const exists = await client.isOnWhatsApp(id);
  if (exists) {
    const img2Path = resolve(cwd, 'src/assets', `${name}.jpg`);
    const buffer = fs.readFileSync(img2Path); // load some gif
    const options = {mimetype: Mimetype.jpeg, caption: `${title}`}; // some metadata & caption
    client.sendMessage(id, buffer, MessageType.image, options);
    ws.send(JSON.stringify({msg_success: true}));
    // client.close();
  } else {
    ws.send(JSON.stringify({msg_success: false, error_msg: `User (${mobileNumber}) does not use WhatsApp`}));
  }
}

export const logout = (res) => {
  client.logout();
  res.send({
    success: true
  })
}
