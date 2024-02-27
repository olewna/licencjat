import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRegister } from '../form.models/UserRegister.model';
import { User } from '../models/User.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  public createUser(user: User): Observable<User> {
    return this.httpClient.post<User>('users', user);
  }
}
