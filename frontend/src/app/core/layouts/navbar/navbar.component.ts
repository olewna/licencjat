import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  constructor(private AuthService: AuthService, private router: Router) {}
  protected navbarCollapsed: boolean = true;
  public toggleNavbarCollapsing(): void {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  public goToLogin(): void {
    this.router.navigate(['login']);
    this.navbarCollapsed = true;
  }
}
