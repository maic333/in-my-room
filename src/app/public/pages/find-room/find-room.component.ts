import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '../../../core/services/helper/form-helper.service';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../../../shared/notification/services/notification.service';
import { throwError } from 'rxjs';
import { RoomDataService } from '../../../core/services/data/room.data.service';
import { Room } from '../../../core/models/room';
import { Router } from '@angular/router';

@Component({
  selector: 'app-find-room',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './find-room.component.html',
  styleUrls: ['./find-room.component.scss']
})
export class FindRoomComponent implements OnInit {
  joinRoomForm: FormGroup;
  createRoomForm: FormGroup;

  constructor(
    private roomDataService: RoomDataService,
    private formBuilder: FormBuilder,
    private formHelper: FormHelperService,
    private notificationService: NotificationService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.joinRoomForm = this.formBuilder.group(
      {
        roomId: [
          null,
          [
            Validators.required,
            Validators.minLength(36),
            Validators.maxLength(36)
          ]
        ]
      }
    );
    this.createRoomForm = this.formBuilder.group(
      {
        name: [
          null,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(36)
          ]
        ]
      }
    );
  }

  joinRoom(form: FormGroup) {
    if (!this.formHelper.validateForm(form)) {
      return;
    }

    const dirtyFields: any = this.formHelper.getFields(form);

    // #TODO
  }

  createRoom(form: FormGroup) {
    if (!this.formHelper.validateForm(form)) {
      return;
    }

    const dirtyFields: any = this.formHelper.getFields(form);

    this.roomDataService.createRoom(dirtyFields)
      .pipe(
        catchError((err) => {
          this.notificationService.showError({
            message: 'Could not create room'
          });
          return throwError(err);
        })
      )
      .subscribe((room: Room) => {
        this.notificationService.showSuccess({
          message: `Created a new room: ${room.name} (${room.id})`
        });

        // redirect to room page
        this.router.navigate(['/rooms', room.id]);
      });
  }
}
