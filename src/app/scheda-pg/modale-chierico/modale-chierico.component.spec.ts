import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleChiericoComponent } from './modale-chierico.component';

describe('ModaleChiericoComponent', () => {
  let component: ModaleChiericoComponent;
  let fixture: ComponentFixture<ModaleChiericoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModaleChiericoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModaleChiericoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
