import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvencionesComponent } from './convenciones.component';

describe('ConvencionesComponent', () => {
  let component: ConvencionesComponent;
  let fixture: ComponentFixture<ConvencionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvencionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvencionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
