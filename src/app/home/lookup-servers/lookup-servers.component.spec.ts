import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupServersComponent } from './lookup-servers.component';

describe('LookupServersComponent', () => {
  let component: LookupServersComponent;
  let fixture: ComponentFixture<LookupServersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LookupServersComponent]
    });
    fixture = TestBed.createComponent(LookupServersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
