import { Injectable } from '@angular/core';
import { LoggedUser } from '../models/User.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtHelper: JwtHelperService
  ) {}

  private currentUser: BehaviorSubject<LoggedUser | null> =
    new BehaviorSubject<LoggedUser | null>(null);
  private currentToken: string = '';

  public getUser(): Observable<LoggedUser | null> {
    return this.currentUser;
  }

  public isLogged(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  public getToken(): string {
    return this.currentToken;
  }

  public setCurrentUser(user: LoggedUser | null, token: string): void {
    this.currentToken = token;
    this.currentUser.next(user);
    this.updateLocalStorage();
  }

  public loadCurrentUser(): void {
    this.currentToken = localStorage.getItem('token')! || '';
    if (this.currentToken) {
      this.userService.checkSession(this.currentToken).subscribe({
        next: (val) => {
          this.setCurrentUser(val, this.currentToken);
        },
        error: (err) => {
          this.setCurrentUser(null, '');
        },
      });
    }
  }

  private updateLocalStorage(): void {
    localStorage.setItem('token', this.currentToken);
    localStorage.setItem('user', JSON.stringify(this.currentUser.getValue()));
  }
}
