import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeSelectComponent } from './episode-select.component';

describe('EpisodeSelectComponent', () => {
  let component: EpisodeSelectComponent;
  let fixture: ComponentFixture<EpisodeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpisodeSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpisodeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
