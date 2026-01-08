import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopmentApiResponse } from './development-api-response';

describe('DevelopmentApiResponse', () => {
  let component: DevelopmentApiResponse;
  let fixture: ComponentFixture<DevelopmentApiResponse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevelopmentApiResponse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevelopmentApiResponse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
