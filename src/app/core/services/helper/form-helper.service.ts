import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { NotificationService } from './notification.service';

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
  exploreForm(form: FormGroup, func: (control: FormControl, controlPath: any[]) => void) {
    function exploreElement(formElement: FormControl | FormGroup | FormArray, formElementPath: any[] = []) {
      if (formElement instanceof FormGroup) {
        // this is a form group
        const formGroup = formElement as FormGroup;
        _.forEach(formGroup.controls, (control: any, controlName: string) => {
          exploreElement(control, [...formElementPath, controlName]);
        });
      } else if (formElement instanceof FormArray) {
        // this is a form array
        const formArray = formElement as FormArray;
        _.forEach(formArray.controls, (control: any, controlIndex: number) => {
          exploreElement(control, [...formElementPath, controlIndex]);
        });
      } else {
        // this is a form control
        const formControl = formElement as FormControl;
        // execute function
        func(formControl, formElementPath);
      }
    }

    _.forEach(form.controls, (control: any, controlName: string) => {
      exploreElement(control, [controlName]);
    });
  }

  /**
   * Get all fields of a form, with their values
   * @param {FormGroup} form
   * @returns {any}
   */
  getFields(form: FormGroup, condition: (control: FormControl) => boolean = null): any {
    const fields = {};

    this.exploreForm(
      form,
      (control: FormControl, controlPath: any[]) => {
        // generate control path string
        const controlPathStr = controlPath.join('.');

        // any condition provided?
        if (_.isFunction(condition)) {
          // collect data only if condition is validated
          if (condition(control)) {
            _.set(fields, controlPathStr, control.value);
          }
        } else {
          _.set(fields, controlPathStr, control.value);
        }
      }
    );

    return fields;
  }

  /**
   * Extract the "dirty" fields of a Form
   * @param {FormGroup} form
   * @returns {any}
   */
  getDirtyFields(form: FormGroup) {
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

    _.forEach(forms, (form: FormGroup) => {
      // get the dirty fields of each form
      dirtyFields = {...dirtyFields, ...this.getDirtyFields(form)};
    });

    return dirtyFields;
  }

  /**
   * Merge all the fields from a set of Forms into a single object
   * @param {FormGroup[]} forms
   * @returns {any}
   */
  mergeFields(forms: FormGroup[]) {
    let fields = {};

    _.forEach(forms, (form: FormGroup) => {
      // get the fields of each form
      const formFields = this.getFields(form);

      fields = {...fields, ...formFields};
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

    _.forEach(forms, (form: FormGroup) => {
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
    const dirtyFields: any = this.getDirtyFields(form);

    if (!form.valid) {
      if (notify) {
        this.notificationService.showError('Some fields are invalid');
      }

      return false;
    }

    if (_.isEmpty(dirtyFields)) {
      if (notify) {
        this.notificationService.showSuccess('There are no changes');
      }

      return false;
    }

    return true;
  }
}

