import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleSiNoComponent } from './modale-si-no.component';

describe('ModaleSiNoComponent', () => {
  let component: ModaleSiNoComponent;
  let fixture: ComponentFixture<ModaleSiNoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModaleSiNoComponent]
    });
    fixture = TestBed.createComponent(ModaleSiNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
