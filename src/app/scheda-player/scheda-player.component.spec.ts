import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaPlayerComponent } from './scheda-player.component';

describe('SchedaPlayerComponent', () => {
  let component: SchedaPlayerComponent;
  let fixture: ComponentFixture<SchedaPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedaPlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedaPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
