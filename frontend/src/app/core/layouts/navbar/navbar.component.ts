import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/User.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  protected navbarCollapsed: boolean = true;
  public toggleNavbarCollapsing(): void {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  protected currentUser: User | null = null;

  public ngOnInit(): void {
    this.authService.loadCurrentUser();
    this.authService.getUser().subscribe({
      next: (value) => {
        this.currentUser = value;
      },
    });
  }

  public isLogged(): boolean {
    return !!this.currentUser;
  }

  public goToLogin(): void {
    this.router.navigate(['login']);
    this.navbarCollapsed = true;
  }

  public goToHome(): void {
    this.router.navigate(['home']);
    this.navbarCollapsed = true;
  }
}
