import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import WebSocket from 'ws';
import http from 'http';
import {wsAuthenticateAndSend, sendMessage, logout} from './share-whatsapp';

const app = express();
app.use(cors());

const server = http.createServer(app);

const port = process.env.PORT || 3001;

const wss = new WebSocket.Server({server: server, path: '/auth/'});

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.mobile) {
      sendMessage(ws, data.mobile, data.name || '', data.title || '');
    }
  });
  wsAuthenticateAndSend(ws);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/logout/', (req, res) => {
  logout(res);
})

server.listen(port, () => console.log(`Listening on port ${port}`));
