import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubseriesComponent } from './subseries.component';

describe('SubseriesComponent', () => {
  let component: SubseriesComponent;
  let fixture: ComponentFixture<SubseriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubseriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubseriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
