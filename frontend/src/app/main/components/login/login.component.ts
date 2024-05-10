import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { passwordConfirmValidator } from 'src/app/shared/directives/password-confirm-directive';
import { UserRegister } from 'src/app/shared/form.models/UserRegister.model';
import { UserLogin } from 'src/app/shared/form.models/UserLogin.model';
import { LoggedUser, UserResponse } from 'src/app/shared/models/User.model';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public constructor(
    private formbuilder: NonNullableFormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.userRegisterForm = this.formbuilder.group(
      {
        name: ['', [Validators.required, Validators.minLength(5)]],
        type: ['user'],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [passwordConfirmValidator],
      }
    );

    this.userLoginForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  protected userLoginForm!: FormGroup<UserLogin>;
  protected userRegisterForm!: FormGroup<UserRegister>;
  protected loginMode: boolean = true;
  protected errorMsg: string = '';

  public onSubmit(): void {
    if (this.loginMode) {
      this.userService
        .loginUser(this.userLoginForm.value as LoggedUser)
        .subscribe({
          next: (value: UserResponse) => {
            const { userToken, user }: UserResponse = value;
            this.authService.setCurrentUser(user, userToken);
            this.router.navigate(['home']);
          },
          error: (err: HttpErrorResponse) => {
            this.errorMsg = err.error.message;
            setTimeout(() => {
              this.errorMsg = '';
            }, 3000);
          },
        });
    } else {
      this.userService
        .registerUser(this.userRegisterForm.value as LoggedUser)
        .subscribe({
          next: () => {
            this.userRegisterForm.reset();
            this.loginMode = true;
          },
          error: (err: HttpErrorResponse) => {
            this.errorMsg = err.error.message;
            setTimeout(() => {
              this.errorMsg = '';
            }, 3000);
          },
        });
    }
  }

  public changeMode(mode: string): void {
    if (mode === 'login') {
      this.loginMode = true;
    } else {
      this.loginMode = false;
    }
  }
}
