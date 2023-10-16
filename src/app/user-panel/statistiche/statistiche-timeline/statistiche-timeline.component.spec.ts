import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticheTimelineComponent } from './statistiche-timeline.component';

describe('StatisticheTimelineComponent', () => {
  let component: StatisticheTimelineComponent;
  let fixture: ComponentFixture<StatisticheTimelineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticheTimelineComponent]
    });
    fixture = TestBed.createComponent(StatisticheTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
