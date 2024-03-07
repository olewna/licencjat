import { Injectable } from '@angular/core';
import { User } from '../models/User.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  private currentUser: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  private currentToken: string = '';

  public getUser(): Observable<User | null> {
    return this.currentUser;
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
    this.currentUser.next(JSON.parse(localStorage.getItem('user')!) || null);
    this.currentToken = localStorage.getItem('token')! || '';
  }

  private updateLocalStorage(): void {
    localStorage.setItem('token', this.currentToken);
    localStorage.setItem('user', JSON.stringify(this.currentUser.getValue()));
  }
}
