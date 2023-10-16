import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleStatisticheComponent } from './modale-statistiche.component';

describe('ModaleStatisticheComponent', () => {
  let component: ModaleStatisticheComponent;
  let fixture: ComponentFixture<ModaleStatisticheComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModaleStatisticheComponent]
    });
    fixture = TestBed.createComponent(ModaleStatisticheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
