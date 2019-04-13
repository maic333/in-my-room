import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  localStorage: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.localStorage = localStorage;
    } else {
      // mock localStorage
      this.localStorage = {
        setItem: (key: string, value: any) => null,
        getItem: (key: string) => null,
        remove: (key: string) => null,
      };
    }
  }

  set(key: string, value: any) {
    this.localStorage.setItem(key, JSON.stringify(value));
  }

  get(key: string): any {
    try {
      return JSON.parse(this.localStorage.getItem(key));
    } catch (e) {
      return null;
    }
  }

  remove(key: string) {
    this.localStorage.removeItem(key);
  }
}
