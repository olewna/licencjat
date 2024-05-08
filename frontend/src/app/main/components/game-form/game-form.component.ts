import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    private comboService: ComboService,
    private route: ActivatedRoute
  ) {}

  protected gameForm!: FormGroup<GameForm>;
  protected responseMsg: string = '';
  protected isAddMode: boolean = true;
  protected id: string = '';
  protected showModal: boolean = false;

  public ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

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

    if (!this.isAddMode) {
      this.comboService.getGameById(this.id).subscribe({
        next: (game) => {
          this.gameForm.patchValue(game);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
          this.responseMsg = 'Could not find item...';
        },
      });
    }
  }

  public onSubmit(): void {
    if (this.isAddMode) {
      this.createGame();
    } else {
      this.updateGame();
    }
  }

  private createGame(): void {
    this.comboService.addGame(this.gameForm.value as GameRequest).subscribe({
      next: (val: Game) => {
        this.gameForm.reset();
        this.responseMsg = 'Added successfully!';
        setTimeout(() => {
          this.responseMsg = '';
        }, 5000);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error);
        this.responseMsg = 'Something went wrong...';
        setTimeout(() => {
          this.responseMsg = '';
        }, 5000);
      },
    });
  }

  private updateGame(): void {
    this.comboService
      .updateGame(this.id, this.gameForm.value as GameRequest)
      .subscribe({
        next: (game: Game) => {
          this.gameForm.reset();
          this.showModal = true;
        },
        error: (err: HttpErrorResponse) => {
          console.log(err.error);
          this.responseMsg = 'Something went wrong...';
          setTimeout(() => {
            this.responseMsg = '';
          }, 5000);
        },
      });
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

  public goToGames(): void {
    this.router.navigate(['games']);
  }
}
