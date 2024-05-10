import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const minOneCheckboxRequired: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const singleplayer: boolean = control.get('singleplayer')?.value;
  const multiplayer: boolean = control.get('multiplayer')?.value;

  if (singleplayer === true || multiplayer === true) {
    return null;
  }

  return { minOneCheckboxRequired: true };
};
