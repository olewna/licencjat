import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicFormComponent } from './music-form.component';
import { MainModule } from '../../main.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('MusicFormComponent', () => {
  let component: MusicFormComponent;
  let fixture: ComponentFixture<MusicFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MusicFormComponent],
      imports: [MainModule, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: '123' } },
          },
        },
      ],
    });
    fixture = TestBed.createComponent(MusicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
