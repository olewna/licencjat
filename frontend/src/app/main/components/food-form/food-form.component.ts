import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import {
  FoodForm,
  FoodRequest,
} from 'src/app/shared/form.models/FoodForm.model';
import { Food } from 'src/app/shared/models/Food.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ComboService } from 'src/app/shared/services/combo.service';
import { LoggedUser } from '../../../shared/models/User.model';

@Component({
  selector: 'app-food-form',
  templateUrl: './food-form.component.html',
  styleUrls: ['./food-form.component.scss'],
})
export class FoodFormComponent implements OnInit {
  public constructor(
    private formbuilder: NonNullableFormBuilder,
    private comboService: ComboService,
    private authService: AuthService
  ) {}
  protected foodForm!: FormGroup<FoodForm>;
  protected loggedUserId: string = '';

  public ngOnInit(): void {
    this.authService.currentUser.subscribe({
      next: (val: LoggedUser | null) => {
        if (val) {
          this.loggedUserId = val._id;
        }
      },
    });

    this.foodForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      company: ['', [Validators.required]],
      owner: [false],
      vegetarian: [false],
      image: [''],
    });

    this.foodForm.get('owner')?.valueChanges.subscribe({
      next: (val) => {
        if (!val) {
          this.foodForm.controls['company'].setValidators([
            Validators.required,
          ]);
          this.foodForm.controls['telephone'].setValidators([
            Validators.required,
          ]);
        } else {
          this.foodForm.controls['company'].clearValidators();
          this.foodForm.controls['telephone'].clearValidators();
        }
        this.foodForm.controls['company'].updateValueAndValidity();
        this.foodForm.controls['telephone'].updateValueAndValidity();
      },
    });
  }

  public onSubmit(form: any): void {
    console.log(form.value);
    this.comboService
      .addFood(this.foodForm.value as FoodRequest, this.loggedUserId)
      .subscribe({
        next: (val: Food) => {
          this.foodForm.reset();
          this.foodForm.get('company')!.enable();
          this.foodForm.get('telephone')!.enable();
        },
        error: (err: HttpErrorResponse) => {
          console.log(err.error.message);
        },
      });
  }

  public onOwnerChange() {
    const ownerControl = this.foodForm.get('owner');
    if (ownerControl!.value) {
      this.foodForm.get('company')!.disable();
      this.foodForm.get('telephone')!.disable();
    } else {
      this.foodForm.get('company')!.enable();
      this.foodForm.get('telephone')!.enable();
    }
  }

  public getImageUrl(): string {
    return this.foodForm.get('image')!.value;
  }

  protected setImageUrl(url: string): void {
    this.foodForm.get('image')?.setValue(url);
  }

  public deleteImage(): void {
    this.foodForm.get('image')?.setValue('');
  }
}
