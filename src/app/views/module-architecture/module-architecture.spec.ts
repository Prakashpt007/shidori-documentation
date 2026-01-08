import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleArchitecture } from './module-architecture';

describe('ModuleArchitecture', () => {
  let component: ModuleArchitecture;
  let fixture: ComponentFixture<ModuleArchitecture>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleArchitecture]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleArchitecture);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
