import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  MusicForm,
  MusicRequest,
  Service,
} from 'src/app/shared/form.models/MusicForm.model';
import { Music } from 'src/app/shared/models/Music.model';
import { ComboService } from 'src/app/shared/services/combo.service';

@Component({
  selector: 'app-music-form',
  templateUrl: './music-form.component.html',
  styleUrls: ['./music-form.component.scss'],
})
export class MusicFormComponent implements OnInit {
  public constructor(
    private formbuilder: NonNullableFormBuilder,
    private router: Router,
    private location: Location,
    private comboService: ComboService
  ) {}
  protected musicForm!: FormGroup<MusicForm>;
  protected services: string[] = ['spotify', 'youtube', 'soundcloud', 'other'];
  protected responseMsg: string = '';

  public ngOnInit(): void {
    this.musicForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      author: ['', [Validators.required]],
      length: ['', [Validators.required]],
      service: new FormArray<FormGroup<Service>>([]),
      image: [''],
    });

    this.services.forEach((x: string) => {
      const newItem: FormGroup<Service> = this.formbuilder.group({
        name: [x],
        checked: [false],
      });
      this.musicForm.controls.service.push(newItem);
    });
  }

  protected getServices(): FormArray<FormGroup<Service>> {
    return this.musicForm.controls.service as FormArray<FormGroup<Service>>;
  }

  public onSubmit(): void {
    // console.log(this.musicForm.value);
    this.comboService.addMusic(this.musicForm.value as MusicRequest).subscribe({
      next: (val: Music) => {
        this.musicForm.reset();
        this.responseMsg = 'Added successfully!';
        setTimeout(() => {
          this.responseMsg = '';
        }, 5000);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error.message);
        this.responseMsg = 'Something went wrong...';
        setTimeout(() => {
          this.responseMsg = '';
        }, 5000);
      },
    });
  }

  public getImageUrl(): string {
    return this.musicForm.get('image')!.value;
  }

  protected setImageUrl(url: string): void {
    this.musicForm.get('image')?.setValue(url);
  }

  public deleteImage(): void {
    this.musicForm.get('image')?.setValue('');
  }

  public goBack(): void {
    this.location.back();
  }

  public goToFood(): void {
    this.router.navigate(['food', 'form']);
  }

  public goToGames(): void {
    this.router.navigate(['games', 'form']);
  }
}
