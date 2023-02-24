import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateStatSkillsComponent } from './template-stat-skills.component';

describe('TemplateStatSkillsComponent', () => {
  let component: TemplateStatSkillsComponent;
  let fixture: ComponentFixture<TemplateStatSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateStatSkillsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateStatSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
