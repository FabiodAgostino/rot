import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalValidatoreComponent } from './modal-validatore.component';

describe('ModalValidatoreComponent', () => {
  let component: ModalValidatoreComponent;
  let fixture: ComponentFixture<ModalValidatoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalValidatoreComponent]
    });
    fixture = TestBed.createComponent(ModalValidatoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
