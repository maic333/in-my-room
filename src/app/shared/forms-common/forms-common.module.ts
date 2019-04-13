import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import formsCommonComponents from './components';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  declarations: [
    ...formsCommonComponents
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    ...formsCommonComponents
  ],
  entryComponents: [
  ]
})
export class FormsCommonModule {
}
