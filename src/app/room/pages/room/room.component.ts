import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NotificationService } from '../../../shared/notification/services/notification.service';
import { RoomDataService } from '../../../core/services/data/room.data.service';
import { ActivatedRoute } from '@angular/router';
import { Room } from '../../../core/models/room';
import { switchMap } from 'rxjs/operators';
import { User } from '../../../core/models/user';
import { AuthDataService } from '../../../core/services/data/auth.data.service';
import { ChatHistoryMessage, NewParticipantMessage, RoomChatMessage, ServerMessage } from '../../types/chat-service-message';
import { ChatService } from '../../services/chat.service';
import { RoomConnection } from '../../types/room-connection';
import { MessageSide } from '../../components/message/types/message-side';

@Component({
  selector: 'app-room',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {
  user: User;
  room: Room;

  // provide constants to template
  MessageSide = MessageSide;

  @ViewChild('messages') messagesElem: ElementRef;

  private roomConnection: RoomConnection;
  private chatMessages: RoomChatMessage[] = [];

  constructor(
    private roomDataService: RoomDataService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private chatService: ChatService,
    private authDataService: AuthDataService
  ) {
  }

  ngOnInit() {
    // load authenticated user data
    this.user = this.authDataService.getAuthenticatedUser();

    // load room data
    this.loadRoom();
  }

  ngOnDestroy() {
    // close connection
    this.roomConnection.close();
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

  private scrollToChatBottom() {
    // wait for bindings to take effect and build the DOM
    setTimeout(() => {
      // scroll to the bottom of chat
      this.messagesElem.nativeElement.scrollTop = this.messagesElem.nativeElement.scrollHeight;
    });
  }

  private loadChat() {
    this.roomConnection = this.chatService.connectToRoom(this.room.id);

    // subscribe to the chat history stream
    this.roomConnection.chatHistory$
      .subscribe((chatHistory: ChatHistoryMessage) => {
        // initialize chat messages (history)
        this.chatMessages = chatHistory.messages;

        this.scrollToChatBottom();
      });

    // subscribe to the chat messages stream
    this.roomConnection.message$
      .subscribe((message: ServerMessage) => {
        // add newly received message to the chat
        this.chatMessages.push(message.message);
        // sort messages by datetime
        // #TODO think for a better solution!?
        this.chatMessages.sort((a, b) => {
          // we've got ISO format, so we can directly compare the strings
          return (a.datetime < b.datetime) ? -1 : 1;
        });
      });

    // subscribe to the new participants stream
    this.roomConnection.newParticipant$
      .subscribe((message: NewParticipantMessage) => {
        this.notificationService.showSuccess({
          message: `${message.user.name} joined the room`
        });
      });
  }

  sendMessage(message: string) {
    if (this.roomConnection) {
      this.roomConnection.sendMessage(message);
    }
  }
}
