import { FormControl } from '@angular/forms';

export interface UserRegister {
  readonly name: FormControl<string>;
  readonly type: FormControl<string>;
  readonly password: FormControl<string>;
  readonly confirmPassword: FormControl<string>;
  readonly email: FormControl<string>;
}
