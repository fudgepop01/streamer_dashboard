import fetch from 'node-fetch';
import consts from '../config/consts';
import qs from 'querystring'
import WebSocket from 'ws';

export const fetchToken = async () => {
  const params = {
    bot: true,
    channel_id: consts.channelId
  }


  const req = await fetch(consts.baseUrl + '/user/jwtkey?' + qs.stringify(params), {
    headers: {
      "Authorization": `Bearer ${consts.accessToken}`
    }
  })

  switch (req.status) {
    case 200: 
      console.log("Authentication Successful: JWT key successfully generated!")
      break;
    case 400: 
      console.log('Code 400:\nbad request');
      return;
    case 403: 
      console.log('Code 403:\nApplication not authorized to generate a JWT token for this user.');
      return;
    case 404: 
      console.log(`Code 404:\nThe channel, ${consts.channelId}, does not exist.`);
      return;
  }

  return await req.text();
}

export const connectToWebSocket = async (token) => {
  const ws = new WebSocket("wss://nd2.picarto.tv/socket?token=" + token);
  return ws;
}