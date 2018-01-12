import { Component, OnInit } from '@angular/core';
import { ConvencionService } from '../../servicios/convencion.service';
import { Convencion } from '../../modelos/convencion';
import { Tercero } from '../../modelos/tercero';
import { TerceroService } from '../../servicios/tercero.service';
import { SedeService } from '../../servicios/sede.service';
import { Sede } from '../../modelos/sede';
import { DisposicionService } from '../../servicios/disposicion.service';
import { Serie } from '../../modelos/serie';
import { SerieService } from '../../servicios/serie.service';
import { Disposicion } from '../../modelos/disposicion';
import { SubserieService } from '../../servicios/subserie.service';
import { Subserie } from '../../modelos/subserie';
import { TipoService } from '../../servicios/tipo.service';
import { Tipo } from '../../modelos/tipo';
import { Helper } from '../../../../app-helper';

@Component({
  selector: 'app-tabla-retencion',
  templateUrl: './tabla-retencion.component.html',
  styleUrls: ['./tabla-retencion.component.css']
})
export class TablaRetencionComponent implements OnInit {
  cargando = false;
  constructor(
    private _convencionService: ConvencionService,
    private _terceroService: TerceroService,
    private _sedeService: SedeService,
    private _disposicionService: DisposicionService,
    private _serieService: SerieService,
    private _subserieService: SubserieService,
    private _tipoService: TipoService,
    private _helper: Helper,
  ) { }

  // #region Metodos de Obtención y Establecimiento de valores

  private _entidades: Tercero[] = [];
  public get entidades(): Tercero[] {
    return this._entidades;
  }
  public set entidades(v: Tercero[]) {
    this._entidades = v;
  }

  private _convenciones: Convencion[] = [];
  public get convenciones(): Convencion[] {
    return this._convenciones;
  }
  public set convenciones(v: Convencion[]) {
    this._convenciones = v;
  }

  private _entidad: Tercero = new Tercero;
  public get entidad(): Tercero {
    return this._entidad;
  }
  public set entidad(v: Tercero) {
    this._entidad = v;
  }

  private _oficinas: Sede[] = [];
  public get oficinas(): Sede[] {
    return this._oficinas;
  }
  public set oficinas(v: Sede[]) {
    this._oficinas = v;
  }

  private _disposiciones: Disposicion[] = [];
  public get disposiciones(): Disposicion[] {
    return this._disposiciones;
  }
  public set disposiciones(v: Disposicion[]) {
    this._disposiciones = v;
  }

  private _series: Serie[] = [];
  public get series(): Serie[] {
    return this._series;
  }
  public set series(v: Serie[]) {
    this._series = v;
  }

  private _lineas: LineaTabla[] = [];
  public get lineas(): LineaTabla[] {
    return this._lineas;
  }
  public set lineas(v: LineaTabla[]) {
    this._lineas = v;
  }

  private _subseries: Subserie[] = [];
  public get subseries(): Subserie[] {
    return this._subseries;
  }
  public set subseries(v: Subserie[]) {
    this._subseries = v;
  }

  private _tipos: Tipo[] = [];
  public get tipos(): Tipo[] {
    return this._tipos;
  }
  public set tipos(v: Tipo[]) {
    this._tipos = v;
  }

  // #endregion

  ngOnInit() {
    this.cargando = true;
    this._terceroService.registros().subscribe(entidades => {
      this.entidades = entidades;
      this._convencionService.registros().subscribe(convenciones => {
        this.convenciones = convenciones;
        this._serieService.registros().subscribe(series => {
          this.series = series;
          this._subserieService.registros().subscribe(subseries => {
            this.subseries = subseries;
            this._tipoService.registros().subscribe(tipos => {
              this.tipos = tipos;
              this._disposicionService.registros().subscribe(disposiciones => {
                this.disposiciones = disposiciones;
                this.cargando = false;
              });
            });
          });
        });
      });
    });

  }

  refrescar_tabla2() {
    this.cargando = true;
    this.lineas = [];
    this._sedeService.registros_por_identificacion(this.entidad.tipo_id, this.entidad.identificacion).subscribe(oficinas => {
      this.oficinas = oficinas;
      // this.cargando = false;
      // console.log(this.oficinas);
      // this._serieService.registros().subscribe(series => {
      //   this.series = series;
      // });
      // this.cargando
      oficinas.forEach(oficina => {
        let linea = new LineaTabla();
        linea.dependencia_id = oficina.sede_id;
        linea.dependencia = oficina.razon_social;
        this.lineas.push(linea);
        linea = new LineaTabla();
        linea.dependencia_id = oficina.sede_id;

        this._serieService.consultar(new Serie('', '', oficina.tipo_id, oficina.identificacion, oficina.sede_id))
          .subscribe(series => {
            series.forEach(serie => {
              linea.serie_id = serie.serie_id;
              linea.serie = serie.denominacion;


              this._subserieService.registros(new Subserie(-1, '', '', serie.serie_id, '', serie.tipo_id,
                serie.identificacion, serie.sede_id))
                .subscribe(subseries => {
                  subseries.forEach(subserie => {
                    linea.subserie_id = subserie.subserie_id;
                    linea.subserie = subserie.denominacion;

                    this._tipoService.registros(new Tipo('', '', subserie.consecutivo)).subscribe(tipos_documental => {
                      tipos_documental.forEach(tipo_doc => {
                        linea.descripcion_documental = tipo_doc.denominacion;
                        linea.retencion_gestion = tipo_doc.retencion_gestion;
                        linea.retencion_central = tipo_doc.retencion_central;
                        linea.soporte_fisico = (tipo_doc.soporte_fisico <= 0);
                        linea.soporte_electronico = (tipo_doc.soporte_electronico <= 0);
                        linea.procedimiento = tipo_doc.procedimiento;
                        this._disposicionService.registros(new Disposicion(tipo_doc.tipo_id, tipo_doc.consecutivo))
                          .subscribe(disposiciones => {
                            disposiciones.forEach(disposicion => {
                              linea.disposiciones.push(disposicion);
                            });
                          });
                        this.lineas.push(linea);
                      });
                    });
                  });
                });
            });
          });
        // console.log(this.lineas);
      });

    });
  }

  refrescar_tabla() {
    this.cargando = true;
    // console.log(this.entidad);
    this._sedeService.registros_por_identificacion(this.entidad.tipo_id, this.entidad.identificacion).subscribe(oficinas => {
      this.oficinas = oficinas;
      // console.log(this.oficinas);
      this.cargando = false;
    });
  }

  get_tipos(_tipo_id: string = '', _identificacion: string = '', _sede_id: string = ''): Tipo[] {
    const tipos: Tipo[] = [];
    // this.oficinas.forEach(oficina => {
      this.series.forEach(serie => {
        if (
          // serie.sede_id === ((_sede_id === '') ? oficina.sede_id : _sede_id)
          // && serie.tipo_id === ((_tipo_id === '') ? oficina.tipo_id : _tipo_id)
          // && serie.identificacion === ((_identificacion === '') ? oficina.identificacion : _identificacion)

          serie.sede_id === _sede_id
          && serie.tipo_id === _tipo_id
          && serie.identificacion === _identificacion
        ) {
          this.subseries.forEach(ss => {
            if (
              ss.serie_id === serie.serie_id
              && ss.sede_id === serie.sede_id
              && ss.tipo_id === serie.tipo_id
              && ss.identificacion === serie.identificacion
            ) {
              this.tipos.forEach(tipo => {
                if (ss.consecutivo.toString() === tipo.consecutivo.toString()) {
                  tipos.push(tipo);
                }
              });
            }
          });

        }
      });
    // });
    // console.log(tipos);
    return tipos;
  }

  get_series(tipo_id: string, identificacion: string, sede_id: string): Serie[] {
    const series: Serie[] = [];
    this.series.forEach(serie => {
      if (serie.tipo_id === tipo_id && serie.identificacion === identificacion && serie.sede_id === sede_id) {
        series.push(serie);
      }
    });
    return series;
  }

  get_subserie(consecutivo: number): Subserie {
    this.subseries.forEach(subserie => {
      // console.log(subserie);
      console.log(subserie.consecutivo + ' ' + consecutivo);
      if (1 * subserie.consecutivo === consecutivo) {
        // console.log(subserie);
        return subserie;
      }
    });
    return new Subserie;
  }

  get_linea(consecutivo: number, tipo_id: string): LineaTabla {
    // consecutivo = 1 * consecutivo;
    const linea: LineaTabla = new LineaTabla();
    this.disposiciones.forEach(disposicion => {
      if (disposicion.tipo_id === tipo_id && disposicion.consecutivo === consecutivo) {
        linea.disposiciones.push(disposicion);
      }
    });
    this.tipos.forEach(tipo => {
      if (tipo.consecutivo === consecutivo && tipo.tipo_id === tipo_id) {

        this.subseries.forEach(subserie => {
          if (1 * subserie.consecutivo === tipo.consecutivo) {
            linea.subserie_id = subserie.subserie_id;
            linea.subserie = subserie.denominacion;

            linea.serie_id = subserie.serie_id;
            this.series.forEach(serie => {
              if (
                serie.serie_id === subserie.serie_id
                && serie.tipo_id === subserie.tipo_id
                && serie.identificacion === subserie.identificacion
                && serie.sede_id === subserie.sede_id
              ) {
                linea.serie = serie.denominacion;
                // linea.dependencia_id = serie.sede_id;
                this.oficinas.forEach(oficina => {
                  if (oficina.sede_id === serie.sede_id
                    && oficina.tipo_id === serie.tipo_id
                    && serie.identificacion === oficina.identificacion) {
                    linea.dependencia = oficina.razon_social;
                    linea.dependencia_id = oficina.sede_id;
                  }
                });
              }
            });
          }
        });
        // console.log(tipo);
        linea.retencion_gestion = tipo.retencion_gestion;
        linea.retencion_central = tipo.retencion_central;
        linea.soporte_electronico = (tipo.soporte_electronico > 0);
        linea.soporte_fisico = (tipo.soporte_fisico > 0);
        linea.descripcion_documental = tipo.denominacion;
      }
    });
    // console.log(linea.disposiciones);
    return linea;
  }

}

class LineaTabla {
  constructor(
    public dependencia_id: string = '',
    public dependencia: string = '',
    public serie_id: string = '',
    public serie: string = '',
    public subserie_id: string = '',
    public subserie: string = '',
    public descripcion_documental: string = '',
    public retencion_gestion: number = 0,
    public retencion_central: number = 0,
    public soporte_electronico: boolean = false,
    public soporte_fisico: boolean = false,
    public disposiciones: Disposicion[] = [],
    public procedimiento: string = '',
  ) { }
}
