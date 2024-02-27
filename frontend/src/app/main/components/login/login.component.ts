import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  protected loginMode: boolean = true;

  public changeMode(): void {
    this.loginMode = !this.loginMode;
  }
}
