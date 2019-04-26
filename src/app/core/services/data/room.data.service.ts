import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../../models/room';

@Injectable({
  providedIn: 'root'
})
export class RoomDataService {

  constructor(
    private http: HttpClient,
  ) {
  }

  createRoom(data: {name: string}): Observable<Room> {
    return this.http.post('rooms', data) as Observable<Room>;
  }

  joinRoom(roomId: string): Observable<Room> {
    return this.http.post(`rooms/${roomId}/join`, null) as Observable<Room>;
  }

  getRoom(roomId: string): Observable<Room> {
    return this.http.get(`rooms/${roomId}`) as Observable<Room>;
  }
}
