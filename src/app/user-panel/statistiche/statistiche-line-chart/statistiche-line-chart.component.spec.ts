import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticheLineChartComponent } from './statistiche-line-chart.component';

describe('StatisticheLineChartComponent', () => {
  let component: StatisticheLineChartComponent;
  let fixture: ComponentFixture<StatisticheLineChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticheLineChartComponent]
    });
    fixture = TestBed.createComponent(StatisticheLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
