import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticheViewComponent } from './statistiche-view.component';

describe('StatisticheViewComponent', () => {
  let component: StatisticheViewComponent;
  let fixture: ComponentFixture<StatisticheViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticheViewComponent]
    });
    fixture = TestBed.createComponent(StatisticheViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
