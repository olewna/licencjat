import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import {
  FoodForm,
  FoodRequest,
} from 'src/app/shared/form.models/FoodForm.model';
import { Food } from 'src/app/shared/models/Food.model';
import { ComboService } from 'src/app/shared/services/combo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-food-form',
  templateUrl: './food-form.component.html',
  styleUrls: ['./food-form.component.scss'],
})
export class FoodFormComponent implements OnInit {
  public constructor(
    private formbuilder: NonNullableFormBuilder,
    private comboService: ComboService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  protected foodForm!: FormGroup<FoodForm>;
  protected responseMsg: string = '';
  protected isAddMode: boolean = true;
  protected id: string = '';
  protected showModal: boolean = false;

  public ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.foodForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      telephone: ['', [Validators.required]],
      company: ['', [Validators.required]],
      owner: [false],
      vegetarian: [false],
      image: [''],
    });

    this.foodForm.get('owner')?.valueChanges.subscribe({
      next: (val: boolean) => {
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

    if (!this.isAddMode) {
      this.comboService.getFoodById(this.id).subscribe({
        next: (food: Food) => {
          const { owner, company, telephone, ...rest }: Food = food;
          if (company || telephone) {
            this.foodForm.patchValue({ owner: false });
            this.foodForm.patchValue({ company, telephone });
          } else {
            this.foodForm.patchValue({ owner: true });
          }
          this.foodForm.patchValue(rest);
          this.onOwnerChange();
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.responseMsg = 'Cound not find item...';
        },
      });
    }
  }

  public onSubmit(): void {
    if (this.isAddMode) {
      this.createFood();
    } else {
      this.updateFood();
    }
  }

  private createFood(): void {
    this.comboService.addFood(this.foodForm.value as FoodRequest).subscribe({
      next: () => {
        this.foodForm.reset();
        this.foodForm.get('company')!.enable();
        this.foodForm.get('telephone')!.enable();
        this.responseMsg = 'Added successfully!';
        setTimeout(() => {
          this.responseMsg = '';
        }, 5000);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.error);
        this.responseMsg = 'Something went wrong...';
        setTimeout(() => {
          this.responseMsg = '';
        }, 5000);
      },
    });
  }

  private updateFood(): void {
    this.comboService
      .updateFood(this.id, this.foodForm.value as FoodRequest)
      .subscribe({
        next: () => {
          this.foodForm.reset();
          this.foodForm.get('company')!.enable();
          this.foodForm.get('telephone')!.enable();
          this.showModal = true;
        },
        error: (err: HttpErrorResponse) => {
          console.error(err.error);
          this.responseMsg = 'Something went wrong...';
          setTimeout(() => {
            this.responseMsg = '';
          }, 5000);
        },
      });
  }

  public onOwnerChange(): void {
    if (this.foodForm.get('owner')!.value) {
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

  public goBack(): void {
    this.location.back();
  }

  public goToGames(): void {
    this.router.navigate(['games', 'form']);
  }

  public goToMusic(): void {
    this.router.navigate(['music', 'form']);
  }

  public goToFood(): void {
    this.router.navigate(['food']);
  }
}
