import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedaPersonaggioComponent } from './scheda-personaggio.component';

describe('SchedaPersonaggioComponent', () => {
  let component: SchedaPersonaggioComponent;
  let fixture: ComponentFixture<SchedaPersonaggioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedaPersonaggioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedaPersonaggioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
