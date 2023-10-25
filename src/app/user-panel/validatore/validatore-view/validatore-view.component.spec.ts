import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatoreViewComponent } from './validatore-view.component';

describe('ValidatoreViewComponent', () => {
  let component: ValidatoreViewComponent;
  let fixture: ComponentFixture<ValidatoreViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidatoreViewComponent]
    });
    fixture = TestBed.createComponent(ValidatoreViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
