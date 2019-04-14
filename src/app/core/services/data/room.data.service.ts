import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../helper/storage.service';
import { Room } from '../../models/room';

@Injectable({
  providedIn: 'root'
})
export class RoomDataService {

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
  }

  createRoom(data: {name: string}): Observable<Room> {
    return this.http.post('rooms', data);
  }
}
