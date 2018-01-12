import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElegirTipoDocumentoComponent } from './elegir-tipo-documento.component';

describe('ElegirTipoDocumentoComponent', () => {
  let component: ElegirTipoDocumentoComponent;
  let fixture: ComponentFixture<ElegirTipoDocumentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElegirTipoDocumentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElegirTipoDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
