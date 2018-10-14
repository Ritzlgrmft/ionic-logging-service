import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggingServiceComponent } from './logging-service.component';

describe('LoggingServiceComponent', () => {
  let component: LoggingServiceComponent;
  let fixture: ComponentFixture<LoggingServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoggingServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggingServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
