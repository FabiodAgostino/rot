import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerModaleStatisticheComponent } from './container-modale-statistiche.component';

describe('ContainerModaleStatisticheComponent', () => {
  let component: ContainerModaleStatisticheComponent;
  let fixture: ComponentFixture<ContainerModaleStatisticheComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContainerModaleStatisticheComponent]
    });
    fixture = TestBed.createComponent(ContainerModaleStatisticheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
