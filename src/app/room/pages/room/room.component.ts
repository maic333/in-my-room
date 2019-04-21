import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NotificationService } from '../../../shared/notification/services/notification.service';
import { RoomDataService } from '../../../core/services/data/room.data.service';
import { ActivatedRoute } from '@angular/router';
import { Room } from '../../../core/models/room';
import { switchMap } from 'rxjs/operators';
import { User } from '../../../core/models/user';
import { AuthDataService } from '../../../core/services/data/auth.data.service';
import { ChatHistoryMessage, ChatMessageType, ServerMessage } from '../../types/chat-service-message';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-room',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  user: User;
  room: Room;

  private socket: WebSocket;

  constructor(
    private roomDataService: RoomDataService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private authDataService: AuthDataService
  ) {
  }

  ngOnInit() {
    // load authenticated user data
    this.user = this.authDataService.getAuthenticatedUser();

    // load room data
    this.loadRoom();
  }

  private loadRoom() {
    this.route.params
      .pipe(
        switchMap((params: {roomId: string}) => {
          return this.roomDataService.getRoom(params.roomId);
        })
      )
      .subscribe((room) => {
        this.room = room;

        this.loadChat();
      });
  }

  private loadChat() {
    try {
      const socket = new WebSocket(
        `${environment.wsUrl}?token=${this.authDataService.getAccessToken()}&roomId=${this.room.id}`
      );

      socket.onmessage = (event: MessageEvent) => {
        try {
          const message: ServerMessage | ChatHistoryMessage = JSON.parse(event.data);

          if (message.type === ChatMessageType.SERVER_MESSAGE) {
            // #TODO
            this.notificationService.showSuccess({
              message: `new message: ${message.toString()}`
            });
          }

          if (message.type === ChatMessageType.CHAT_HISTORY) {
            // #TODO
            this.notificationService.showSuccess({
              message: `got the chat history: ${message.toString()}`
            });
          }
        } catch (e) {
          // do nothing
        }
      };
    } catch (e) {
      console.error(e);
    }
  }

  sendMessage(message: string) {
    // #TODO websockets
    this.notificationService.showSuccess({
      message: `${this.user.name}: ${message}`
    });
  }
}
