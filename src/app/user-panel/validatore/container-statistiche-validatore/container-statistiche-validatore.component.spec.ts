import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerStatisticheValidatoreComponent } from './container-statistiche-validatore.component';

describe('ContainerStatisticheValidatoreComponent', () => {
  let component: ContainerStatisticheValidatoreComponent;
  let fixture: ComponentFixture<ContainerStatisticheValidatoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContainerStatisticheValidatoreComponent]
    });
    fixture = TestBed.createComponent(ContainerStatisticheValidatoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
