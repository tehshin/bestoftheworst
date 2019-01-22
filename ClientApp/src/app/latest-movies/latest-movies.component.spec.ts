import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestMoviesComponent } from './latest-movies.component';

describe('LatestEpisodesComponent', () => {
  let component: LatestMoviesComponent;
  let fixture: ComponentFixture<LatestMoviesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestMoviesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
