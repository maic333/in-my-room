import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { AuthDataService } from '../data/auth.data.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private authDataService: AuthDataService,
  ) {
  }

  /* tslint:disable-next-line no-any */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request)
      .pipe(
        /* tslint:disable-next-line no-any */
        catchError((error: HttpErrorResponse | any) => {

          // for 401 response status, clear the Auth Data
          if (error.status === 401) {
            this.authDataService.logout();

            // redirect to Login page
            this.router.navigate(['/']);
          }

          return throwError(error);

        })
      );
  }
}
