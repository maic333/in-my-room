import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material';
import { NotificationComponent } from './components/notification/notification.component';

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule
  ],
  declarations: [
    NotificationComponent
  ],
  exports: [
  ],
  entryComponents: [
    NotificationComponent
  ]
})
export class NotificationModule {
}
