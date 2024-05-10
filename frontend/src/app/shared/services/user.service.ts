import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Combo, LoggedUser, User, UserEdit } from '../models/User.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserEditForm } from '../form.models/UserEditForm.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public constructor(private httpClient: HttpClient) {}

  public userForm: FormGroup<UserEditForm> = new FormGroup<UserEditForm>({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    email: new FormControl<string>('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    image: new FormControl<string>(''),
  });

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

  public checkSession(): Observable<LoggedUser> {
    return this.httpClient.get<LoggedUser>('api/users');
  }

  public getUserById(id: string): Observable<User> {
    return this.httpClient.get<User>('api/users/user/' + id);
  }

  public getTodayCombo(id: string): Observable<Combo> {
    return this.httpClient.get<Combo>(`api/users/combo/${id}`);
  }

  public saveTodayCombo(id: string, combo: Combo): Observable<Combo> {
    return this.httpClient.post<Combo>(`api/users/combo/${id}`, combo);
  }

  public updateOneElementInCombo(
    id: string,
    body: { type: string; id: string }
  ): Observable<Combo> {
    return this.httpClient.put<Combo>(`api/users/combo/${id}`, body);
  }

  public checkIfComboIsFavourite(id: string, body: Combo): Observable<boolean> {
    return this.httpClient.put<boolean>(
      `api/users/combo/${id}/favourite`,
      body
    );
  }

  public addToFavourite(id: string, body: Combo): Observable<Combo> {
    return this.httpClient.post<Combo>(`api/users/combo/${id}/favourite`, body);
  }

  public deleteFromFavourite(id: string, body: Combo): Observable<Combo> {
    return this.httpClient.put<Combo>(
      `api/users/combo/${id}/favourite/delete`,
      body
    );
  }

  public deleteUser(id: string): Observable<string> {
    return this.httpClient.delete<string>(`api/users/` + id);
  }

  public updateUser(id: string, user: UserEdit): Observable<User> {
    return this.httpClient.patch<User>(`api/users/` + id, { user });
  }
}
