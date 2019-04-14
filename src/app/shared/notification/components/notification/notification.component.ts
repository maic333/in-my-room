import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material';
import { NotificationAction, NotificationConfig, NotificationType } from '../../types';

@Component({
  selector: 'app-notification',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent {
  config: NotificationConfig;

  constructor(
    public snackBarRef: MatSnackBarRef<NotificationComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: {config: NotificationConfig}
  ) {
    this.config = data.config;

    // 'dismissable' option defaults to true
    this.config.dismissable = (typeof this.config.dismissable === 'boolean') ? this.config.dismissable : true;
  }

  get icon(): string {
    switch (this.config.type) {
      case NotificationType.SUCCESS:
        return 'successCircle';
      case NotificationType.ERROR:
        return 'errorCircle';
      case NotificationType.INFO:
        return 'infoCircle';

      default:
        return '';
    }
  }

  onActionClick(action: NotificationAction) {
    // execute action callback
    action.func.apply(null, [this.snackBarRef.dismiss.bind(this.snackBarRef)]);
  }

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
