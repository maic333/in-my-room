import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // amount of time (in ms) to wait before automatically closing the snackbar
  duration = 4500;

  constructor(
  ) {
  }

  /**
   * Show a notification on page
   */
  private showNotification(message: string, duration: number, theme: string) {
    // #TODO
    console.log(`${theme}: ${message}`);
  }

  /**
   * Show a Success Notification
   */
  showSuccess(message: string, duration: number = this.duration) {
    return this.showNotification(message, duration, 'success');
  }

  /**
   * Show an Error Notification
   */
  showError(message: string, duration: number = this.duration) {
    return this.showNotification(message, duration, 'error');
  }

  /**
   * Show an Error Notification displaying the translated error message corresponding to the API Error received
   * @param apiError API error object
   * @param {object} translateData
   * @param {number} duration
   * @returns {Subscription}
   */
  showApiError(apiError, translateData = {}, duration = this.duration) {
    // #TODO
    this.showNotification(`API Error: ${apiError.toString()}`, duration, 'error');
  }

  dismiss(notificationId) {
    // #TODO
  }

  dismissAll() {
    // #TODO
  }
}

