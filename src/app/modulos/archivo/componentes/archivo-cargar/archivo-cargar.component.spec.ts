import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivoCargarComponent } from './archivo-cargar.component';

describe('ArchivoCargarComponent', () => {
  let component: ArchivoCargarComponent;
  let fixture: ComponentFixture<ArchivoCargarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivoCargarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivoCargarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
