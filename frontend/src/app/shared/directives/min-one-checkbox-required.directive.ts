import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const minOneCheckboxRequired: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  let checked = 0;
  const singleplayer = control.get('singleplayer')?.value;
  const multiplayer = control.get('multiplayer')?.value;

  if (singleplayer === true || multiplayer === true) {
    return null;
  }

  return { minOneCheckboxRequired: true };
};
