import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeGroupComponent } from './episode-group.component';

describe('EpisodeGroupComponent', () => {
  let component: EpisodeGroupComponent;
  let fixture: ComponentFixture<EpisodeGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpisodeGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpisodeGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
