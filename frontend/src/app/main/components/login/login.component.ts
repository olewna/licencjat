import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { passwordConfirmValidator } from 'src/app/shared/directives/password-confirm-directive';
import { UserRegister } from 'src/app/shared/form.models/UserRegister.model';
import { User } from 'src/app/shared/models/User.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public constructor(
    private formbuilder: NonNullableFormBuilder,
    private userService: UserService
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
  }

  protected userRegisterForm!: FormGroup<UserRegister>;
  protected loginMode: boolean = true;
  protected errorMsg: string = '';

  public onSubmit(): void {
    this.userService.createUser(this.userRegisterForm.value as User).subscribe({
      next: (value) => {
        this.userRegisterForm.reset();
        console.log(value);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = err.error.message;
        setTimeout(() => {
          this.errorMsg = '';
        }, 3000);
      },
    });
  }

  public changeMode(): void {
    this.loginMode = !this.loginMode;
  }
}
