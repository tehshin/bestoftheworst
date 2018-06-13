import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieImageInputComponent } from './movie-image-input.component';

describe('MovieImageInputComponent', () => {
  let component: MovieImageInputComponent;
  let fixture: ComponentFixture<MovieImageInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovieImageInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieImageInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
