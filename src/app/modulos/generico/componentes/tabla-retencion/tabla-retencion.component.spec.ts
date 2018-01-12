import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaRetencionComponent } from './tabla-retencion.component';

describe('TablaRetencionComponent', () => {
  let component: TablaRetencionComponent;
  let fixture: ComponentFixture<TablaRetencionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaRetencionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaRetencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
