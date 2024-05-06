import { FormArray, FormControl, FormGroup } from '@angular/forms';

export interface MusicForm {
  readonly name: FormControl<string>;
  readonly type: FormControl<string>;
  readonly length: FormControl<string>;
  readonly author: FormControl<string>;
  readonly service: FormArray<FormGroup<Service>>;
  readonly image: FormControl<string>;
}

export interface Service {
  readonly name: FormControl<string>;
  readonly checked: FormControl<boolean>;
}

export interface MusicRequest {
  readonly name: string;
  readonly type: string;
  readonly length: string;
  readonly author: string;
  readonly service: string[];
  readonly image: string;
}
