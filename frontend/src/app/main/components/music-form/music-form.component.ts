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
import { ActivatedRoute, Router } from '@angular/router';
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
    private comboService: ComboService,
    private route: ActivatedRoute
  ) {}
  protected musicForm!: FormGroup<MusicForm>;
  protected services: string[] = ['spotify', 'youtube', 'soundcloud', 'other'];
  protected responseMsg: string = '';
  protected isAddMode: boolean = true;
  protected id: string = '';
  protected showModal: boolean = false;

  public ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

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

    if (!this.isAddMode) {
      this.comboService.getMusicById(this.id).subscribe({
        next: (music) => {
          const { service, ...rest } = music;
          const services = this.services.map((x) => {
            if (service.includes(x)) {
              return { name: x, checked: true };
            } else {
              return { name: x, checked: false };
            }
          });
          const editMusic = { ...rest };
          this.musicForm.patchValue(editMusic);
          this.musicForm.controls.service.patchValue(services);
        },
      });
    }
  }

  protected getServices(): FormArray<FormGroup<Service>> {
    return this.musicForm.controls.service as FormArray<FormGroup<Service>>;
  }

  public onSubmit(): void {
    if (this.isAddMode) {
      this.createMusic();
    } else {
      this.updateMusic();
    }
  }

  private createMusic(): void {
    this.comboService.addMusic(this.musicForm.value as MusicRequest).subscribe({
      next: (val: Music) => {
        this.musicForm.reset();
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

  private updateMusic(): void {
    this.comboService
      .updateMusic(this.id, this.musicForm.value as MusicRequest)
      .subscribe({
        next: (val: Music) => {
          this.musicForm.reset();
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

  public goToMusic(): void {
    this.router.navigate(['music']);
  }
}
