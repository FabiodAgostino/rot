import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacroMultiInsertComponent } from './macro-multi-insert.component';

describe('MacroMultiInsertComponent', () => {
  let component: MacroMultiInsertComponent;
  let fixture: ComponentFixture<MacroMultiInsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MacroMultiInsertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MacroMultiInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
