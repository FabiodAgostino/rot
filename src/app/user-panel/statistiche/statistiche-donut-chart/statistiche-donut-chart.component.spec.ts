import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticheDonutChartComponent } from './statistiche-donut-chart.component';

describe('StatisticheDonutChartComponent', () => {
  let component: StatisticheDonutChartComponent;
  let fixture: ComponentFixture<StatisticheDonutChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticheDonutChartComponent]
    });
    fixture = TestBed.createComponent(StatisticheDonutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
