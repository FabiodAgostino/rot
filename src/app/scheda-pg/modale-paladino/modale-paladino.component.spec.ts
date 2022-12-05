import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalePaladinoComponent } from './modale-paladino.component';

describe('ModalePaladinoComponent', () => {
  let component: ModalePaladinoComponent;
  let fixture: ComponentFixture<ModalePaladinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalePaladinoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalePaladinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
