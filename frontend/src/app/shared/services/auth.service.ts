import { Injectable } from '@angular/core';
import { User } from '../models/User.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private userService: UserService) {}

  private currentUser: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  private currentToken: string = '';

  public getUser(): Observable<User | null> {
    return this.currentUser;
  }

  public isLogged(): boolean {
    return this.currentUser.getValue() !== null;
  }

  public getToken(): string {
    return this.currentToken;
  }

  public setCurrentUser(user: User | null, token: string): void {
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
