import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthDataService } from '../data/auth.data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authDataService: AuthDataService
  ) {
  }

  /**
   * User must be authenticated
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // check for access token existence
    const accessToken = this.authDataService.getAccessToken();
    if (accessToken) {
      return true;
    }

    // user is not logged in; redirect to login page
    this.router.navigate(['/']);

    return false;
  }

}
