import { Component, OnInit } from '@angular/core';
import { TablaGenericaService } from '../../../generico/servicios/tabla-generica.service';
import { TablaGenerica } from '../../../generico/modelos/tabla-generica';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit {

  constructor(
    private _tablaGenericaService: TablaGenericaService
  ) { }

  // #region Metodos de obtención y establecimiento de valores
  private _propiedades: TablaGenerica[] = [];
  public get propiedades(): TablaGenerica[] {
    return this._propiedades;
  }
  public set propiedades(v: TablaGenerica[]) {
    this._propiedades = v;
  }

  // #endregion

  ngOnInit() {
    this.refrescar();
  }

  refrescar() {
    const tabla = new TablaGenerica('ARCHIVOS', 'PROPIEDAD');
    this._tablaGenericaService.consultar(tabla).subscribe(rows => {
      console.log(rows);
    });
  }

}
