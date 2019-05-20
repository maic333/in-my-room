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
  // cache authenticated user data
  user: User;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
  }

  login(data: { name: string }): Observable<{accessToken: string, user: User}> {
    return this.http.post('login', data)
      .pipe(
        tap((resData: {accessToken: string, user: User}) => {
          // cache access token in memory
          this.accessToken = resData.accessToken;
          // ...and in local storage
          this.storageService.set('access_token', resData.accessToken);

          // cache user data in memory
          this.user = resData.user;
          // ...and in local storage
          this.storageService.set('user', resData.user);
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

  getAuthenticatedUser(): User | null {
    // get from in-memory cache
    if (this.user) {
      return this.user;
    }

    // get from local storage
    const user = this.storageService.get('user') as User;
    if (user) {
      this.user = user;
      return user;
    }

    return null;
  }
}
