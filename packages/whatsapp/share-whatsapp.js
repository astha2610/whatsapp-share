import fs from 'fs';
import {resolve} from 'path';
import { WAClient } from '@adiwajshing/baileys';
import { MessageType, Mimetype } from '@adiwajshing/baileys';
import QRCode from 'qrcode';

const cwd = process.cwd();

const client = new WAClient();

export const authenticateAndSend = async (res, fileIds) => {
  client.onReadyForPhoneAuthentication = async ([ref, publicKey, clientID]) => {
    const str = ref + ',' + publicKey + ',' + clientID;
    const url = await QRCode.toDataURL(str);
    res.send({
      data: url
    });
  }
  await client
    .connect()
    .then (() => {
      const id = '919632367315@s.whatsapp.net'; // the WhatsApp ID 
      const img2Path = resolve(cwd, 'src/Media', 'myPartner.jpeg');
      const buffer = fs.readFileSync(img2Path); // load some gif
      const options = {mimetype: Mimetype.jpeg, caption: "Hello, Welcome to myPartner!"} // some metadata & caption
      client.sendMessage(id, buffer, MessageType.image, options);
    })
    .catch (err => console.log("unexpected error: " + err) );
}
