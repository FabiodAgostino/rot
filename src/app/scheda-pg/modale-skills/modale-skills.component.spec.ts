import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleSkillsComponent } from './modale-skills.component';

describe('ModaleSkillsComponent', () => {
  let component: ModaleSkillsComponent;
  let fixture: ComponentFixture<ModaleSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModaleSkillsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModaleSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
