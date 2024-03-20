import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggedUser, User } from 'src/app/shared/models/User.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}
  protected user: User | null = null;
  protected loggedUser: LoggedUser | null = null;
  protected loading: boolean = true;
  protected theSameUser: boolean = true;
  protected id: string = '';

  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      console.log(this.id);
      this.loadUser();
    });
  }

  private loadUser(): void {
    this.authService.getUser().subscribe({
      next: (val) => {
        this.loggedUser = val;
      },
    });
    if (this.loggedUser?._id !== this.id) {
      this.userService.getUserById(this.id).subscribe({
        next: (value) => {
          this.user = value;
          this.theSameUser = false;
          this.loading = false;
        },
      });
    } else {
      this.user = this.loggedUser;
      this.loading = false;
      this.theSameUser = true;
    }
  }

  public thisUserIsLogged(): boolean {
    return this.theSameUser;
  }

  protected logout(): void {
    this.authService.setCurrentUser(null, '');
    this.router.navigate(['home']);
  }
}
