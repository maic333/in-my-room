import { Component, Input, ViewEncapsulation } from '@angular/core';
import { RoomChatMessage } from '../../types/chat-service-message';
import { MessageSide } from './types/message-side';

@Component({
  selector: 'app-message',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  @Input() message: RoomChatMessage;
  @Input() side: MessageSide = MessageSide.LEFT;
  @Input() continue: boolean = false;

  // provide constants to template
  MessageSide = MessageSide;

  get userInitials(): string {
    // get name parts
    const parts: string[] = this.message.user.name.split(' ');

    if (parts.length > 1) {
      return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
    } else {
      return parts[0].charAt(0).toUpperCase() + parts[0].charAt(1).toUpperCase();
    }
  }

  // #TODO centralize this
  get userColor() {
    const s = 40;
    const l = 50;

    let hash = 0;
    for (let i = 0; i < this.message.user.name.length; i++) {
      hash = this.message.user.name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const h = hash % 360;
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
}
