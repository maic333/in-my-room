import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS,
  MatButtonModule,
  MatCardModule,
  MatProgressSpinnerModule
} from '@angular/material';
import commonSharedComponents from './components';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule
  ],
  declarations: [
    ...commonSharedComponents
  ],
  providers: [
    {
      provide: MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS,
      useValue: {
        _forceAnimations: true
      }
    }
  ],
  exports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,
    ...commonSharedComponents
  ],
  entryComponents: [
  ]
})
export class CommonSharedModule {
}
