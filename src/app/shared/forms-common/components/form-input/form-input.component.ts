import { Component, Input, ViewEncapsulation, Output, EventEmitter, Optional, Host, SkipSelf, OnInit } from '@angular/core';
import { ControlContainer, FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss']
})
export class FormInputComponent implements OnInit {
  @Input() control: FormControl;
  @Input() type: string = 'text';
  @Input() placeholder: string;
  @Input() autocompleteMode: string = 'off';
  @Input() required: boolean = false;
  @Input() readonly: boolean = false;
  @Input() controlContainer: ControlContainer;

  @Output() changed = new EventEmitter<any>();

  constructor(
    @Optional() @Host() @SkipSelf() controlContainer: ControlContainer
  ) {
    this.controlContainer = this.controlContainer || controlContainer;
  }

  ngOnInit() {
    this.formatValue();
  }

  private formatValue() {
    if (
      this.type === 'number' &&
      typeof this.control.value === 'string' &&
      this.control.value.length > 0
    ) {
      // convert string value to number
      this.control.setValue(
        Number(this.control.value)
      );
    }
  }

  /**
   * Function triggered when the input value is changed
   */
  onChange() {
    this.formatValue();

    // emit the current value
    return this.changed.emit(this.control.value);
  }
}
