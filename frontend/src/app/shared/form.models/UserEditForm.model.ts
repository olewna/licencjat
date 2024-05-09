import { FormControl } from '@angular/forms';

export interface UserEditForm {
  readonly name: FormControl<string | null>;
  readonly email: FormControl<string | null>;
  readonly password: FormControl<string | null>;
  readonly image: FormControl<string | null>;
}
