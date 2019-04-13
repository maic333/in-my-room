import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../helper/storage.service';
import { tap } from 'rxjs/operators';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthDataService {
  // cache the access token
  accessToken: string;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
  }

  login(data: {name: string}): Observable<{accessToken: string, user: User}> {
    return this.http.post('login', data)
      .pipe(
        tap((resData: {accessToken: string, user: User}) => {
          // cache userId in memory
          this.accessToken = resData.accessToken;
          // ...and in local storage
          this.storageService.set('access_token', resData.accessToken);
        })
      );
  }

  logout() {
    // remove userId from cache
    this.accessToken = null;
    this.storageService.remove('access_token');
  }

  getAccessToken(): string | null {
    // get from in-memory cache
    if (this.accessToken) {
      return this.accessToken;
    }

    // get from local storage
    const accessToken = this.storageService.get('access_token');
    if (accessToken) {
      this.accessToken = accessToken;
      return accessToken;
    }

    return null;
  }
}
