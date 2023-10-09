import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonsterDexTreeComponent } from './monster-dex-tree.component';

describe('MonsterDexTreeComponent', () => {
  let component: MonsterDexTreeComponent;
  let fixture: ComponentFixture<MonsterDexTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonsterDexTreeComponent]
    });
    fixture = TestBed.createComponent(MonsterDexTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
