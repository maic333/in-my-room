import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import set = require('lodash/set');
import isEmpty = require('lodash/isEmpty');
import forEach = require('lodash/forEach');
import { NotificationService } from '../../../shared/notification/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class FormHelperService {

  constructor(
    private notificationService: NotificationService
  ) {
  }

  /**
   * Explore a form
   * @param form
   * @param func function to be executed on form controls
   */
  /* tslint:disable-next-line no-any */
  exploreForm(form: FormGroup, func: (control: FormControl, controlPath: any[]) => void) {
    /* tslint:disable-next-line no-any */
    function exploreElement(formElement: FormControl | FormGroup | FormArray, formElementPath: any[] = []) {
      if (formElement instanceof FormGroup) {
        // this is a form group
        /* tslint:disable-next-line no-any */
        forEach(formElement.controls, (control: any, controlName: string) => {
          exploreElement(control, [...formElementPath, controlName]);
        });
      } else if (formElement instanceof FormArray) {
        // this is a form array
        /* tslint:disable-next-line no-any */
        forEach(formElement.controls, (control: any, controlIndex: number) => {
          exploreElement(control, [...formElementPath, controlIndex]);
        });
      } else {
        // this is a form control
        // execute function
        func(formElement, formElementPath);
      }
    }

    /* tslint:disable-next-line no-any */
    forEach(form.controls, (control: any, controlName: string) => {
      exploreElement(control, [controlName]);
    });
  }

  /**
   * Get all fields of a form, with their values
   */
  /* tslint:disable-next-line no-any */
  getFields(form: FormGroup, condition: (control: FormControl) => boolean = null): any {
    const fields = {};

    this.exploreForm(
      form,
      /* tslint:disable-next-line no-any */
      (control: FormControl, controlPath: any[]) => {
        // generate control path string
        const controlPathStr = controlPath.join('.');

        // any condition provided?
        if (typeof condition === 'function') {
          // collect data only if condition is validated
          if (condition(control)) {
            set(fields, controlPathStr, control.value);
          }
        } else {
          set(fields, controlPathStr, control.value);
        }
      }
    );

    return fields;
  }

  /**
   * Extract the "dirty" fields of a Form
   */
  /* tslint:disable-next-line no-any */
  getDirtyFields(form: FormGroup): any {
    return this.getFields(
      form,
      (control: FormControl) => control.dirty
    );
  }

  /**
   * Mark all the fields of a form group as being dirty
   */
  markFormGroupAsDirty(form: FormGroup) {
    this.exploreForm(
      form,
      (control: FormControl) => {
        control.markAsDirty();
      }
    );
  }

  /**
   * Extract the "dirty" fields from a set of Forms, merging all of them into a single object
   * @param {FormGroup[]} forms
   */
  mergeDirtyFields(forms: FormGroup[]) {
    let dirtyFields = {};

    forEach(forms, (form: FormGroup) => {
      // get the dirty fields of each form
      dirtyFields = { ...dirtyFields, ...this.getDirtyFields(form) };
    });

    return dirtyFields;
  }

  /**
   * Merge all the fields from a set of Forms into a single object
   */
  mergeFields(forms: FormGroup[]) {
    let fields = {};

    forEach(forms, (form: FormGroup) => {
      // get the fields of each form
      const formFields = this.getFields(form);

      fields = { ...fields, ...formFields };
    });

    return fields;
  }

  /**
   * Check a set of forms and verify if they are all valid
   * @param {FormGroup[]} forms
   * @returns {boolean}
   */
  isFormsSetValid(forms: FormGroup[]) {
    let isValid = true;

    forEach(forms, (form: FormGroup) => {
      isValid = isValid && form.valid;
    });

    return isValid;
  }

  /**
   * Check if a form is modified and valid, otherwise display a meaningful error
   * @param form
   * @param notify Whether to notify user if the form is invalid
   * @returns {boolean}
   */
  validateForm(form, notify: boolean = false) {
    // get dirty fields
    const dirtyFields = this.getDirtyFields(form);

    if (!form.valid) {
      if (notify) {
        this.notificationService.showError({
          message: 'Some fields are invalid'
        });
      }

      return false;
    }

    if (isEmpty(dirtyFields)) {
      if (notify) {
        this.notificationService.showSuccess({
          message: 'There are no changes'
        });
      }

      return false;
    }

    return true;
  }
}
