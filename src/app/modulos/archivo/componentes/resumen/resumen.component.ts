import { Component, OnInit } from '@angular/core';
import { TablaGenericaService } from '../../../generico/servicios/tabla-generica.service';
import { TablaGenerica } from '../../../generico/modelos/tabla-generica';
import { ArchivoService } from '../../servicios/archivo.service';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css']
})
export class ResumenComponent implements OnInit {
  etiquetas_generadas = 0;
  etiquetas_utilizadas = 0;
  etiquetas_a_utilizar = 0;
  archivos_subidos = 0;
  archivos_por_etiquetar = 0;
  archivos_etiquetados = 0;
  constructor(
    private _tablaGenericaService: TablaGenericaService,
    private _archivoService: ArchivoService,
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
    this._archivoService.cantidad_archivos().subscribe(archivos_subidos => {
      this.archivos_subidos = archivos_subidos;
      this._archivoService.cantidad_archivos(1).subscribe(archivos_por_etiquetar => {
        this.archivos_por_etiquetar = archivos_por_etiquetar;
      });
    });
    this._archivoService.cantidad_etiquetas().subscribe(etiquetas_generadas => {
      this.etiquetas_generadas = etiquetas_generadas;
      this._archivoService.cantidad_etiquetas(2).subscribe(etiquetas_utilizadas => {
        this.etiquetas_utilizadas = etiquetas_utilizadas;
      });
    });
  }

  refrescar() {
    const tabla = new TablaGenerica('ARCHIVOS', 'PROPIEDAD');
    // this._tablaGenericaService.consultar(tabla).subscribe(rows => {
    //   // console.log(rows);
    // });
  }

}
