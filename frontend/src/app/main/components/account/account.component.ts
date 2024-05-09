import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { LoggedUser, User } from 'src/app/shared/models/User.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ComboService } from 'src/app/shared/services/combo.service';
import { UserService } from 'src/app/shared/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

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
    private userService: UserService,
    private comboService: ComboService
  ) {}
  protected user: User | null = null;
  protected loggedUser: LoggedUser | null = null;
  protected loading: boolean = true;
  protected theSameUser: boolean = false;
  protected id: string = '';
  protected favCombo: any[] = [];
  protected favouritePage: number = 0;
  protected showDeleteModal: boolean = false;
  protected responseModal: boolean = false;
  protected responseModalMsg: string = '';

  public ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.loadUser();
    });
  }

  private loadUser(): void {
    this.authService.currentUser.subscribe({
      next: (val) => {
        this.loggedUser = val;
        if (this.loggedUser?._id === this.id) {
          this.theSameUser = true;
        }
      },
    });
    if (this.loggedUser?._id !== this.id) {
      this.theSameUser = false;
      this.userService.getUserById(this.id).subscribe({
        next: (value) => {
          this.user = value;
          this.getFavouriteCombos(value);
        },
      });
    } else {
      this.user = this.loggedUser;

      this.getFavouriteCombos(this.user);
    }
  }

  private getFavouriteCombos(value: User): void {
    if (value.favouriteCombos.length > 0) {
      const favFood = this.comboService.getFoodById(
        value?.favouriteCombos[this.favouritePage].foodId
      );
      const favGame = this.comboService.getGameById(
        value?.favouriteCombos[this.favouritePage].gameId
      );
      const favMusic = this.comboService.getMusicById(
        value?.favouriteCombos[this.favouritePage].musicId
      );
      forkJoin([favFood, favMusic, favGame]).subscribe({
        next: ([food, music, game]) => {
          this.favCombo = [food, music, game];
          this.loading = false;
        },
      });
    } else {
      this.loading = false;
    }
  }

  public nextFavouriteCombo(): void {
    if (this.user!.favouriteCombos.length > this.favouritePage) {
      this.favouritePage += 1;
      this.getFavouriteCombos(this.user!);
    }
  }
  public previousFavouriteCombo(): void {
    if (this.favouritePage > 0) {
      this.favouritePage -= 1;
      this.getFavouriteCombos(this.user!);
    }
  }

  public thisUserIsLogged(): boolean {
    return this.theSameUser;
  }

  protected logout(): void {
    this.authService.setCurrentUser(null, '');
    this.router.navigate(['home']);
  }

  public goToUpdateForm(): void {
    console.log('go to form');
    this.router.navigate(['account', 'edit', this.id]);
  }

  public showModal(): void {
    this.showDeleteModal = true;
  }

  public cancel(): void {
    this.showDeleteModal = false;
  }

  public confirm(): void {
    this.userService.deleteUser(this.id).subscribe({
      next: (val: string) => {
        this.showDeleteModal = false;
        this.responseModalMsg = val;
        this.responseModal = true;
        this.authService.setCurrentUser(null, '');
      },
      error: (err: HttpErrorResponse) => {
        this.showDeleteModal = false;
        this.responseModal = true;
        this.responseModalMsg = 'Could not delete account.';
        console.log(err);
      },
    });
  }

  public closeReponseModal(): void {
    this.router.navigate(['home']);
  }
}
