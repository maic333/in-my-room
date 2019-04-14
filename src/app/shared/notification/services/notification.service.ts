import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { NotificationConfig, NotificationDuration, NotificationType } from '../types';
import { NotificationComponent } from '../components/notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private snackbar: MatSnackBar,
  ) {
  }

  /**
   * Show a notification on page
   */
  private showNotification(config: NotificationConfig, duration: number = NotificationDuration.QUICK) {
    // show snackbar
    this.snackbar.openFromComponent(NotificationComponent, {
      data: {
        config
      },
      verticalPosition: 'bottom',
      duration: duration
    });
  }

  /**
   * Show a Success Notification
   */
  showSuccess(config: NotificationConfig, duration: number = NotificationDuration.QUICK) {
    config.type = NotificationType.SUCCESS;
    return this.showNotification(config, duration);
  }

  /**
   * Show an Error Notification
   */
  showError(config: NotificationConfig, duration: number = NotificationDuration.QUICK) {
    config.type = NotificationType.ERROR;
    return this.showNotification(config, duration);
  }

  /**
   * Show an Info Notification
   */
  showInfo(config: NotificationConfig, duration: number = NotificationDuration.QUICK) {
    config.type = NotificationType.INFO;
    return this.showNotification(config, duration);
  }

  /**
   * Show an Error Notification displaying the error message corresponding to the API Error received
   */
  showApiError(apiError, config: NotificationConfig, duration: number = NotificationDuration.QUICK) {
    // #TODO
    config.message = apiError.toString();
    config.type = NotificationType.ERROR;

    return this.showNotification(config, duration);
  }
}

