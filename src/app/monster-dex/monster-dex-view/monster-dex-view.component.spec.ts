import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterDexViewComponent } from './monster-dex-view.component';

describe('MonsterDexViewComponent', () => {
  let component: MonsterDexViewComponent;
  let fixture: ComponentFixture<MonsterDexViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonsterDexViewComponent]
    });
    fixture = TestBed.createComponent(MonsterDexViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
