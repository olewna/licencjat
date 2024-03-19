import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoggedUser, User } from '../models/User.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  public registerUser(user: LoggedUser): Observable<LoggedUser> {
    return this.httpClient.post<LoggedUser>('api/users/register', user);
  }

  public loginUser(
    user: LoggedUser
  ): Observable<{ userToken: string; user: LoggedUser }> {
    return this.httpClient.post<{ userToken: string; user: LoggedUser }>(
      'api/users/login',
      user
    );
  }

  public checkSession(token: string): Observable<LoggedUser> {
    return this.httpClient.get<LoggedUser>('api/users');
  }

  public getUserById(id: string): Observable<User> {
    return this.httpClient.get<User>('api/users/user/' + id);
  }
}
