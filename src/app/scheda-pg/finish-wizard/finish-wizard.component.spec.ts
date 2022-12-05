import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishWizardComponent } from './finish-wizard.component';

describe('FinishWizardComponent', () => {
  let component: FinishWizardComponent;
  let fixture: ComponentFixture<FinishWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishWizardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
