import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Room } from '../../../core/models/room';

@Component({
  selector: 'app-room-header',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './room-header.component.html',
  styleUrls: ['./room-header.component.scss']
})
export class RoomHeaderComponent {
  @Input() room: Room;
}
