import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ChatHistoryMessage, ChatMessage, ChatMessageType, ClientMessage, NewParticipantMessage, ServerMessage } from '../types/chat-service-message';
import { AuthDataService } from '../../core/services/data/auth.data.service';
import { RoomConnection } from '../types/room-connection';
import { Subject } from 'rxjs';

@Injectable()
export class ChatService {

  constructor(
    private authDataService: AuthDataService
  ) {
  }

  connectToRoom(roomId: string): RoomConnection {
    // create subject for chat history
    const chatHistory$ = new Subject<ChatHistoryMessage>();
    // create subject for chat messages
    const chatMessage$ = new Subject<ServerMessage>();
    // create subject for new participants
    const newParticipant$ = new Subject<NewParticipantMessage>();

    // get auth token
    const authToken = this.authDataService.getAccessToken();

    // create socket for given room
    const socket = new WebSocket(
      `${environment.wsUrl}?token=${authToken}&roomId=${roomId}`
    );

    socket.onmessage = (event: MessageEvent) => {
      try {
        const message: ChatMessage = JSON.parse(event.data);

        if (message.type === ChatMessageType.SERVER_MESSAGE) {
          // emit the message
          chatMessage$.next(message);
        }

        if (message.type === ChatMessageType.CHAT_HISTORY) {
          // emit the chat history
          chatHistory$.next(message);
        }

        if (message.type === ChatMessageType.NEW_PARTICIPANT) {
          // emit the new participant info
          newParticipant$.next(message);
        }
      } catch (e) {
        // do nothing
      }
    };

    return {
      roomId: roomId,
      _socket: socket,
      chatHistory$: chatHistory$.asObservable(),
      message$: chatMessage$.asObservable(),
      newParticipant$: newParticipant$.asObservable(),
      close: () => {
        socket.close();
      },
      sendMessage: (message: string) => {
        // create the message object
        const messageObj: ClientMessage = {
          type: ChatMessageType.CLIENT_MESSAGE,
          message
        };

        // write the message on the socket
        socket.send(JSON.stringify(messageObj));
      }
    } as RoomConnection;
  }
}
