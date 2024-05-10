import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { FormGroup } from '@angular/forms';
import { UserEditForm } from 'src/app/shared/form.models/UserEditForm.model';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserEdit } from 'src/app/shared/models/User.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss'],
})
export class AccountFormComponent implements OnInit {
  public constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private authService: AuthService
  ) {}

  protected userForm: FormGroup<UserEditForm> = this.userService.userForm;
  protected id: string = '';
  protected responseMsg: string = '';
  protected showModal: boolean = false;

  public ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.userService.getUserById(this.id).subscribe({
      next: (user: User) => {
        const { name, email, image }: User = user;
        this.userForm.patchValue({ name, email, image });
      },
      error: (err: HttpErrorResponse) => {
        this.responseMsg = 'Could not find user!';
        console.error(err);
      },
    });
  }

  public onSubmit(): void {
    this.userService
      .updateUser(this.id, this.userForm.value as UserEdit)
      .subscribe({
        next: () => {
          this.showModal = true;
          this.userForm.reset();
        },
        error: (err: HttpErrorResponse) => {
          this.responseMsg = 'Could not update user!';
          console.error(err);
        },
      });
  }

  public getImageUrl(): string {
    return this.userForm.get('image')!.value!;
  }

  protected setImageUrl(url: string): void {
    this.userForm.get('image')?.setValue(url);
  }

  public deleteImage(): void {
    this.userForm.get('image')?.setValue('');
  }

  public goBack(): void {
    this.location.back();
  }

  public afterUpdate(): void {
    this.authService.setCurrentUser(null, '');
    this.router.navigate(['home']);
  }
}
