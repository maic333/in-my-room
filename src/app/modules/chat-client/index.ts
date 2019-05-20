import { ChatMessage, ChatMessageType } from './types/chat-message';
import { from, Observable } from 'rxjs';
import { WebsocketAgileClient } from 'websocket-agile-client/dist';
import { ClientConfig } from 'websocket-agile-client/dist/types/client-config';
import { PromiseExecutor } from 'websocket-agile-client/dist/types';

export class ChatClient {
  // WAC Client
  private wac: WebsocketAgileClient;

  constructor(config: ClientConfig) {
    // initialize the WAC
    this.wac = new WebsocketAgileClient(config);

    // register the message handler
    this.wac.handleMessage = this.handleMessage;
  }

  /**
   * Connect to the server
   */
  public connect(): Observable<void> {
    return from(this.wac.connect());
  }

  /**
   * Authenticate in chat
   */
  public authenticate(token: string): Observable<string> {
    const chatMessage: ChatMessage = {
      type: ChatMessageType.AUTH_REQUEST,
      body: { token }
    };

    // send the message
    return from(this.wac.sendMessage(JSON.stringify(chatMessage)));
  }

  /**
   * Send message in room
   */
  public sendMessage(roomId: string, message: string): Observable<string> {
    const chatMessage: ChatMessage = {
      type: ChatMessageType.CHAT_ROOM_MESSAGE,
      body: { roomId, message }
    };

    // send the message
    return from(this.wac.sendMessage(JSON.stringify(chatMessage)));
  }

  /**
   * Handle messages
   */
  private handleMessage(message: string, executor: PromiseExecutor<string>) {
    try {
      const chatMessage: ChatMessage = JSON.parse(message);
      const messageBody = chatMessage.body || {};

      switch (chatMessage.type) {
        case ChatMessageType.NEW_MESSAGE_IN_ROOM:
          // #TODO
          break;

        case ChatMessageType.ROOM_CHAT_HISTORY:
          // #TODO
          break;

        case ChatMessageType.NEW_ROOM_PARTICIPANT:
          // #TODO
          break;

        case ChatMessageType.PARTICIPANT_LEFT_ROOM:
          // #TODO
          break;

        default:
          executor.reject('Unknown message type');
          break;
      }
    } catch (e) {
      executor.reject('Wrong message format');
    }
  }
}
