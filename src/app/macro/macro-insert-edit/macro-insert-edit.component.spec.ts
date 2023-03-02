import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacroInsertEditComponent } from './macro-insert-edit.component';

describe('MacroInsertEditComponent', () => {
  let component: MacroInsertEditComponent;
  let fixture: ComponentFixture<MacroInsertEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MacroInsertEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MacroInsertEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
