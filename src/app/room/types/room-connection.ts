import { Observable } from 'rxjs';
import { ChatHistoryMessage, NewParticipantMessage, ServerMessage } from './chat-service-message';

export interface RoomConnection {
  roomId: string;
  close: () => void;
  sendMessage: (message: string) => void;
  _socket: WebSocket;
  chatHistory$: Observable<ChatHistoryMessage>;
  message$: Observable<ServerMessage>;
  newParticipant$: Observable<NewParticipantMessage>;
}
