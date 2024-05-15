import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicComponent } from './music.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { MainModule } from '../../main.module';
import { AuthService } from 'src/app/shared/services/auth.service';

describe('MusicComponent', () => {
  let component: MusicComponent;
  let fixture: ComponentFixture<MusicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MusicComponent],
      imports: [HttpClientTestingModule, CommonModule, MainModule],
      providers: [
        {
          provide: AuthService,
          useValue: {
            isLogged: () => {
              return true;
            },
          },
        },
      ],
    });
    fixture = TestBed.createComponent(MusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
