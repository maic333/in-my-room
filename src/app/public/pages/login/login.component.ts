import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthDataService } from '../../../core/services/data/auth.data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormHelperService } from '../../../core/services/helper/form-helper.service';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../../../core/services/helper/notification.service';
import { throwError } from 'rxjs';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-login',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private authDataService: AuthDataService,
    private formBuilder: FormBuilder,
    private formHelper: FormHelperService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.form = this.formBuilder.group(
      {
        name: [
          null,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(36)
          ]
        ]
      }
    );
  }

  login(form: FormGroup) {
    if (!this.formHelper.validateForm(form)) {
      return;
    }

    const dirtyFields: any = this.formHelper.getFields(form);

    this.authDataService.login(dirtyFields)
      .pipe(
        catchError((err) => {
          this.notificationService.showError('Login failed');
          return throwError(err);
        })
      )
      .subscribe((data: {user: User}) => {
        this.notificationService.showSuccess(`Welcome, ${data.user.name}!`);
      });
  }
}
