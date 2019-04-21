import { Component, Input, ViewEncapsulation, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormHelperService } from '../../../core/services/helper/form-helper.service';

@Component({
  selector: 'app-send-message-form',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './send-message-form.component.html',
  styleUrls: ['./send-message-form.component.scss']
})
export class SendMessageFormComponent implements OnInit {
  @Input() control: FormControl;

  @Output() sendMessage = new EventEmitter<string>();

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private formHelper: FormHelperService
  ) {
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.form = this.formBuilder.group(
      {
        message: [
          null
        ]
      }
    );
  }

  onSendMessage(form: FormGroup) {
    if (!this.formHelper.validateForm(form)) {
      return;
    }

    const dirtyFields: any = this.formHelper.getFields(form);

    this.sendMessage.emit(dirtyFields.message);

    // reset form
    form.reset();
  }
}
