import { FormControl } from '@angular/forms';

export interface UserLogin {
  readonly name: FormControl<string>;
  readonly password: FormControl<string>;
}
