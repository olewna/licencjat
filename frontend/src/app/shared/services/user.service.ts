import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  public registerUser(user: User): Observable<User> {
    return this.httpClient.post<User>('api/users/register', user);
  }

  public loginUser(user: User): Observable<{ userToken: string; user: User }> {
    return this.httpClient.post<{ userToken: string; user: User }>(
      'api/users/login',
      user
    );
  }

  public checkSession(token: string): Observable<User> {
    return this.httpClient.get<User>('api/users');
  }
}
