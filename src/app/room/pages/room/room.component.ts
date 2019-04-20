import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormHelperService } from '../../../core/services/helper/form-helper.service';
import { NotificationService } from '../../../shared/notification/services/notification.service';
import { RoomDataService } from '../../../core/services/data/room.data.service';
import { ActivatedRoute } from '@angular/router';
import { Room } from '../../../core/models/room';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-room',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  chatForm: FormGroup;

  room: Room;

  constructor(
    private roomDataService: RoomDataService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private formHelper: FormHelperService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    this.loadRoom();
    this.initForm();
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
      });
  }

  private initForm() {
    this.chatForm = this.formBuilder.group(
      {
        message: [
          null
        ]
      }
    );
  }

  sendMessage(form: FormGroup) {
    if (!this.formHelper.validateForm(form)) {
      return;
    }

    const dirtyFields: any = this.formHelper.getFields(form);

    // #TODO
  }
}
