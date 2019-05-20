import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthDataService } from '../data/auth.data.service';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(
    private authDataService: AuthDataService
  ) {
  }

  /* tslint:disable-next-line no-any */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // it is recommended to use the 'clone' method when changing the request object
    const clonedRequest = request.clone({
      // set HTTP headers to be applied on request
      setHeaders: this.getHeaders(request),
      // normalize HTTP request's URL
      url: this.normalizeUrl(request.url)
    });

    return next.handle(clonedRequest);
  }

  /**
   * GetHTTP headers to be set on given HTTP request
   */

  /* tslint:disable-next-line no-any */
  private getHeaders(request: HttpRequest<any>) {
    const headers = {};

    // set Transaction-Id header
    headers['Transaction-Id'] = uuid();

    const contentTypeHeader = request.headers.get('Content-Type');
    const contentDispositionHeader = request.headers.get('Content-Disposition');

    // set Content-Type if not present
    if (
      !contentTypeHeader &&
      // let the browser set the Content-Type header for file uploads
      !contentDispositionHeader
    ) {
      headers['Content-Type'] = 'application/json';
    }

    // get access token and, if existing, set the Authorization Header
    const accessToken = this.authDataService.getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return headers;
  }

  /**
   * Set API prefix if necessary
   * @param {string} url
   * @returns {string}
   */
  private normalizeUrl(url: string): string {
    if (
      url.indexOf('http://') >= 0 ||
      url.indexOf('https://') >= 0
    ) {
      return url;
    } else {
      return `${environment.apiUrl}/${url}`;
    }
  }
}
