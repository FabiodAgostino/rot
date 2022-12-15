import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSkillsComponent } from './info-skills.component';

describe('InfoSkillsComponent', () => {
  let component: InfoSkillsComponent;
  let fixture: ComponentFixture<InfoSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoSkillsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
