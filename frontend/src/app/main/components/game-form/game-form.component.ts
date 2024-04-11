import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { minOneCheckboxRequired } from 'src/app/shared/directives/min-one-checkbox-required.directive';
import {
  GameForm,
  GameRequest,
} from 'src/app/shared/form.models/GameForm.model';
import { Game } from 'src/app/shared/models/Game.model';
import { ComboService } from 'src/app/shared/services/combo.service';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.scss'],
})
export class GameFormComponent implements OnInit {
  public constructor(
    private formbuilder: NonNullableFormBuilder,
    private router: Router,
    private location: Location,
    private comboService: ComboService
  ) {}
  protected gameForm!: FormGroup<GameForm>;

  public ngOnInit(): void {
    this.gameForm = this.formbuilder.group(
      {
        name: ['', [Validators.required]],
        type: ['', [Validators.required]],
        price: ['', [Validators.required]],
        multiplayer: [false],
        singleplayer: [false],
        logoUrl: [''],
      },
      {
        validators: [minOneCheckboxRequired],
      }
    );
  }

  public onSubmit(): void {
    console.log(this.gameForm.value);
    // this.comboService.addGame(this.gameForm.value as GameRequest).subscribe({
    //   next: (val: Game) => {
    //     this.gameForm.reset();
    //   },
    //   error: (err: HttpErrorResponse) => {
    //     console.log(err.error.message);
    //   }
    // })
  }

  public getImageUrl(): string {
    return this.gameForm.get('logoUrl')!.value;
  }

  protected setImageUrl(url: string): void {
    this.gameForm.get('logoUrl')?.setValue(url);
  }

  public deleteImage(): void {
    this.gameForm.get('logoUrl')?.setValue('');
  }

  public goBack(): void {
    this.location.back();
  }

  public goToFood(): void {
    this.router.navigate(['food', 'form']);
  }

  public goToMusic(): void {
    this.router.navigate(['music', 'form']);
  }
}
