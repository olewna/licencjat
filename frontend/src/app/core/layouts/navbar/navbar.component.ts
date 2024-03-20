import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { LoggedUser } from 'src/app/shared/models/User.model';

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

  protected currentUser: LoggedUser | null = null;

  public ngOnInit(): void {
    this.authService.loadCurrentUser();
    this.authService.currentUser.subscribe({
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
  public goToFood(): void {
    this.router.navigate(['food']);
    this.navbarCollapsed = true;
  }
  public goToMusic(): void {
    this.router.navigate(['music']);
    this.navbarCollapsed = true;
  }
  public goToGames(): void {
    this.router.navigate(['games']);
    this.navbarCollapsed = true;
  }

  public goToAccount(): void {
    this.router.navigate(['account', this.currentUser?._id]);
    this.navbarCollapsed = true;
  }
}
