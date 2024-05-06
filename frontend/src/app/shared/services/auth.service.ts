import { Injectable } from '@angular/core';
import { LoggedUser } from '../models/User.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) {}

  public currentUser: BehaviorSubject<LoggedUser | null> =
    new BehaviorSubject<LoggedUser | null>(null);
  private currentToken: string = '';

  public isLogged(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  public getToken(): string {
    return this.currentToken;
  }

  public getUser(): string {
    return this.currentUser.getValue()!.name;
  }

  public getUserId(): string {
    return this.currentUser.getValue()!._id;
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
          this.router.navigate(['home']);
        },
      });
    }
  }

  private updateLocalStorage(): void {
    localStorage.setItem('token', this.currentToken);
    localStorage.setItem('user', JSON.stringify(this.currentUser.getValue()));
  }
}
