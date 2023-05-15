import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlussoDatiComponent } from './flusso-dati.component';

describe('FlussoDatiComponent', () => {
  let component: FlussoDatiComponent;
  let fixture: ComponentFixture<FlussoDatiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlussoDatiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlussoDatiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
