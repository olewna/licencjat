import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  constructor(private AuthService: AuthService) {}

  public checkIfLogged(): void {
    this.AuthService.isLogged();
  }

  protected navbarCollapsed: boolean = true;

  public toggleNavbarCollapsing(): void {
    this.navbarCollapsed = !this.navbarCollapsed;
  }
}
