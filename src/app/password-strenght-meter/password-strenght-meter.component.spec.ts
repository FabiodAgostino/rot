import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordStrenghtMeterComponent } from './password-strenght-meter.component';

describe('PasswordStrenghtMeterComponent', () => {
  let component: PasswordStrenghtMeterComponent;
  let fixture: ComponentFixture<PasswordStrenghtMeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordStrenghtMeterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordStrenghtMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
