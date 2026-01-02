import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserJourney } from './user-journey';

describe('UserJourney', () => {
  let component: UserJourney;
  let fixture: ComponentFixture<UserJourney>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserJourney]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserJourney);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
