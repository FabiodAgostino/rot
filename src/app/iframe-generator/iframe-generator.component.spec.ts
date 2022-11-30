import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeGeneratorComponent } from './iframe-generator.component';

describe('IframeGeneratorComponent', () => {
  let component: IframeGeneratorComponent;
  let fixture: ComponentFixture<IframeGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IframeGeneratorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IframeGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
