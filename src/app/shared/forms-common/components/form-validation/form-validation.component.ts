import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ControlContainer, FormControl } from '@angular/forms';
import get = require('lodash/get');

@Component({
  selector: 'app-form-validation',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './form-validation.component.html',
  styleUrls: ['./form-validation.component.scss']
})
export class FormValidationComponent {
  @Input() control: FormControl;
  @Input() controlContainer: ControlContainer;

  /**
   * Condition for displaying a custom form control's validation errors
   * @returns {boolean}
   */
  get displayErrors() {
    // form submitted?
    const formSubmitted = get(this.controlContainer, 'formDirective.submitted', false);

    // form control touched?
    const controlTouched = get(this.control, 'touched', false);

    // form control invalid?
    const controlInvalid = get(this.control, 'invalid', false);

    return controlInvalid && (formSubmitted || controlTouched);
  }

  /**
   * Collect error messages to be displayed for a form control
   * @return {any}
   */
  get messages(): string[] {
    const errors = [];

    const fieldErrors = get(this.control, 'errors', {});
    for (const errorName in fieldErrors) {
      errors.push({
        name: errorName,
        info: fieldErrors[errorName]
      });
    }

    return errors.map((error) => this.getErrorMessage(error));
  }

  /**
   * Get the message to be displayed for an error
   * @param error
   * @return {string}
   */
  private getErrorMessage(error: {name, info}): string {
    const errorInfo = get(error, 'info', {});

    switch (error.name) {
      case 'required':
        return 'Field is required';
      case 'emailValidator':
        return 'Must be a valid email address';
      case 'minlength':
        return `Too short: ${errorInfo.actualLength}/${errorInfo.requiredLength}`;
      case 'passwordConfirm':
        return 'Passwords must match';
      case 'uniqueEmail':
        return 'E-mail already exists';

      default:
        return 'Field is invalid';
    }
  }
}
