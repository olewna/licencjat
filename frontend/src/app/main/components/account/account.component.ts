import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/User.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  public ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (value) => {
        this.loggedUser = value;
        this.user = value;
      },
    });
  }

  protected logout(): void {
    this.authService.setCurrentUser(null, '');
    this.router.navigate(['home']);
  }

  protected loggedUser: User | null = null;
  protected user: User | null = null;
}
