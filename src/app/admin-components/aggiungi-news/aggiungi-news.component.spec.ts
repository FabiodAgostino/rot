import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiNewsComponent } from './aggiungi-news.component';

describe('AggiungiNewsComponent', () => {
  let component: AggiungiNewsComponent;
  let fixture: ComponentFixture<AggiungiNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AggiungiNewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AggiungiNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
