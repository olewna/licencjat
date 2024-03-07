import { Injectable } from '@angular/core';
import { User } from '../models/User.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  private currentUser: User | null = null;
  private currentToken: string = '';

  public getUser(): User | null {
    return this.currentUser;
  }

  public getToken(): string {
    return this.currentToken;
  }

  public setCurrentUser(user: User | null, token: string): void {
    this.currentToken = token;
    this.currentUser = user;
    this.updateLocalStorage();
  }

  public loadCurrentUser(): void {
    this.currentUser = JSON.parse(localStorage.getItem('user')!) || null;
    this.currentToken = localStorage.getItem('token')! || '';
  }

  private updateLocalStorage(): void {
    localStorage.setItem('token', this.currentToken);
    localStorage.setItem('user', JSON.stringify(this.currentUser));
  }
}
