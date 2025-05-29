import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('ping')
  handlePing(client: Socket): void {
    client.emit('pong', 'pong');
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any) {
    console.log('Got a message from client:', payload);
  }

  sendNotification(message: string) {
    this.server.emit('response', message);
  }
}
