import { Component, OnInit, ViewChild } from '@angular/core';
import { Helper } from '../../../../app-helper';
import { TipoService } from '../../servicios/tipo.service';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import { Subserie } from '../../modelos/subserie';
import { Serie } from '../../modelos/serie';
import { Tipo } from '../../modelos/tipo';
import { SerieService } from '../../servicios/serie.service';
import { SubserieService } from '../../servicios/subserie.service';
import { Sede } from '../../modelos/sede';
import { SedeService } from '../../servicios/sede.service';
import { TerceroService } from '../../servicios/tercero.service';
import { Tercero } from '../../modelos/tercero';
import { ConvencionService } from '../../servicios/convencion.service';
import { Convencion } from '../../modelos/convencion';
import { DisposicionService } from '../../servicios/disposicion.service';
import { Disposicion } from '../../modelos/disposicion';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-tipos',
  templateUrl: './tipos.component.html',
  styleUrls: ['./tipos.component.css']
})
export class TiposComponent implements OnInit {
  cargando = false;
  editar = false;
  terceroVacio = new Tercero;
  sedeVacia = new Sede();
  serieVacia = new Serie();
  subserieVacia = new Subserie();
  constructor(
    private _helper: Helper,
    private _tipoService: TipoService,
    private _serieService: SerieService,
    private _subserieService: SubserieService,
    private _sedeService: SedeService,
    private _terceroService: TerceroService,
    private _convencionService: ConvencionService,
    private _disposicionService: DisposicionService
  ) { }
  // #region Métodos de obtención y establecimiento de valores

  private _series: Serie[] = [];
  public get series(): Serie[] {
    return this._series;
  }
  public set series(v: Serie[]) {
    this._series = v;
  }

  private _serie: Serie = new Serie();
  public get serie(): Serie {
    return this._serie;
  }
  public set serie(v: Serie) {
    this._serie = v;
  }

  private _subseries: Subserie[] = [];
  public get subseries(): Subserie[] {
    return this._subseries;
  }
  public set subseries(v: Subserie[]) {
    this._subseries = v;
  }

  private _subserie: Subserie = new Subserie();
  public get subserie(): Subserie {
    return this._subserie;
  }
  public set subserie(v: Subserie) {
    this._subserie = v;
  }

  private _tipo: Tipo = new Tipo();
  public get tipo(): Tipo {
    return this._tipo;
  }
  public set tipo(v: Tipo) {
    this._tipo = v;
  }

  private _tipos: Tipo[] = [];
  public get tipos(): Tipo[] {
    return this._tipos;
  }
  public set tipos(v: Tipo[]) {
    this._tipos = v;
  }

  private _sedes: Sede[] = [];
  public get sedes(): Sede[] {
    return this._sedes;
  }
  public set sedes(v: Sede[]) {
    this._sedes = v;
  }

  private _sede: Sede = new Sede();
  public get sede(): Sede {
    return this._sede;
  }
  public set sede(v: Sede) {
    this._sede = v;
  }

  private _terceros: Tercero[] = [];
  public get terceros(): Tercero[] {
    return this._terceros;
  }
  public set terceros(v: Tercero[]) {
    this._terceros = v;
  }

  private _tercero: Tercero = new Tercero();
  public get tercero(): Tercero {
    return this._tercero;
  }
  public set tercero(v: Tercero) {
    this._tercero = v;
  }

  private _convenciones: Convencion[] = [];
  public get convenciones(): Convencion[] {
    return this._convenciones;
  }
  public set convenciones(v: Convencion[]) {
    this._convenciones = v;
  }
  private _disposiciones: Convencion[] = [];
  public get disposiciones(): Convencion[] {
    return this._disposiciones;
  }
  public set disposiciones(v: Convencion[]) {
    this._disposiciones = v;
  }



  // #endregion
  // #region DataTable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 10,
    language: {
      lengthMenu: 'Mostrar _MENU_ registros por página',
      zeroRecords: 'Nada encontrado - intenta con otra palabra',
      info: 'Mostrando página _PAGE_ de _PAGES_',
      infoEmpty: 'No hay registros disponibles',
      infoFiltered: '(filtrado de _MAX_ registros en total)',
      search: 'Buscar:',
      paginate: {
        previous: 'Anterior',
        next: 'Siguiente',
        first: 'Primera',
        last: 'Última',
      },
      // buttons: {
      //   copy: 'Copiar',
      //   print: 'Imprimir',
      //   csv: 'CSV'
      // }
    },
    rowCallback: (row: Node, data: any[] | Object, index: number) => {
      const self = this;
      /**
       * Desvincular primero para evitar cualquier controlador duplicado
       * (mirar https://github.com/l-lin/angular-datatables/issues/87)
       */
      $('td', row).unbind('click');
      $('td', row).bind('click', () => {
        self.someClickHandler(data);
      });
      return row;
    },
    // Declare the use of the extension in the dom parameter
    // dom: 'Bfrtip',
    // Configure the buttons
    // buttons: [
    //   // 'columnsToggle',
    //   'colvis',
    //   'copy',
    //   'print',
    //   'excel',
    //   {
    //     text: 'Some button',
    //     key: '1',
    //     action: function (e, dt, node, config) {
    //       alert('Button activated');
    //     }
    //   }
    // ]
  };
  /**
   * Usamos este disparador porque recuperar la lista de registros puede ser bastante largo,
   * por lo tanto, aseguramos que los datos se obtienen antes de la representación
   */
  dtTrigger: Subject<any> = new Subject();
  aux = 0;
  someClickHandler(_row: any): void {
    // console.log(_row);
    this.tipo = new Tipo();

    this.tipo.tipo_id = _row[0];
    this.tipo.consecutivo = _row[1];
    this.tipo.denominacion = _row[2];
    this.tipo.retencion_gestion = _row[3];
    this.tipo.retencion_central = _row[4];
    this.tipo.soporte_electronico = _row[5];
    this.tipo.soporte_fisico = _row[6];
    this.tipo.procedimiento = _row[7];
    this.tipo.activo = _row[8];
    // this.serie = this.serieVacia;
    this.editar = true;
    this.cargando = true;
    this._subserieService.registros(new Subserie(this.tipo.consecutivo)).subscribe(subseries => {
      subseries.forEach(subserie => {
        this.subserie = subserie;
      });
      this._serieService.consultar(
        new Serie(this.subserie.serie_id, '', this.subserie.tipo_id, this.subserie.identificacion, this.serie.sede_id)
      )
        .subscribe(series => {
          series.forEach(serie => {
            this.serie = serie;
          });

          this._sedeService.registros_por_identificacion(this.serie.tipo_id, this.serie.identificacion, this.serie.sede_id)
            .subscribe(sedes => {
              sedes.forEach(sede => {
                this.sede = sede;
              });
              this._terceroService.registros_por_identificacion(this.sede.tipo_id, this.sede.identificacion).subscribe(terceros => {
                terceros.forEach(tercero => {
                  this.tercero = tercero;
                });
                this.cargando = false;

                // console.log(this.subserie);
                // console.log(this.serie);
                // console.log(this.sede);
                // console.log(this.tercero);
              });
            });
        });

    });
    this.disposiciones = [];
    this._disposicionService.registros(new Disposicion(this.tipo.tipo_id, this.tipo.consecutivo)).subscribe(disposiciones => {
      disposiciones.forEach(disposicion => {
        const convencion = new Convencion();
        convencion.convencion_id = disposicion.convencion_id;
        this.disposiciones.push(convencion);
      });
      // this.disposiciones = disposiciones;
    });
    // this.series.forEach(serie => {
    //   if (
    //     serie.tipo_id === this.subserie.tipo_id &&
    //     serie.identificacion === this.subserie.identificacion &&
    //     serie.sede_id === this.subserie.sede_id &&
    //     serie.serie_id === this.subserie.serie_id
    //   ) {
    //     this.serie = serie;
    //   }
    // });
    // console.log(this.tipo);
  }

  refrescar_tabla(): void {
    this.cargando = true;
    this._tipoService.registros(new Tipo('', '', this.subserie.consecutivo)).subscribe(tipos => {
      this.cargando = false;
      this.tipos = tipos;
      // console.log(this.tipos);

      if (this.aux === 0) {
        this.aux++;
        this.dtTrigger.next();
      } else {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      }
    });


  }
  // #endregion

  ngOnInit() {
    this.cargando = true;
    this._terceroService.registros().subscribe(rows => {
      this.terceros = rows;
      this._convencionService.registros().subscribe(convenciones => {
        this.convenciones = convenciones;
        this.cargando = false;
      });
    });
  }

  refrescar_sedes() {
    this.series = [];
    this.subseries = [];
    if (this.tercero.identificacion === '') {
      $('#tercero').focus();
      return;
    }
    this.cargando = true;
    this._sedeService.registros_por_identificacion(this.tercero.tipo_id, this.tercero.identificacion)
      .subscribe(sedes => {
        this.cargando = false;
        this.sedes = sedes;
      });
  }
  refrescar_series() {
    if (this.sede.sede_id === '') {
      $('#sede').focus();
      return;
    }
    this.cargando = true;
    this._serieService.consultar(new Serie('', '', this.sede.tipo_id, this.sede.identificacion, this.sede.sede_id))
      .subscribe(rows => {
        this.cargando = false;
        this.series = rows;
      });
  }
  refrescar_subseries() {
    if (this.serie.serie_id === '') {
      $('#serie').focus();
      return;
    }
    this.cargando = true;
    this._subserieService.registros(
      new Subserie(-1, '', '', this.serie.serie_id, '', this.serie.tipo_id, this.serie.identificacion, this.serie.sede_id)
    )
      .subscribe(rows => {
        this.cargando = false;
        this.subseries = rows;
        this.refrescar_tabla();
      });
  }
  agregar_quitar_convenciones() {
    this.disposiciones = [];
    this.convenciones.forEach(convencion => {
      if ($('#disposicion' + convencion.convencion_id).is(':checked')) {
        this.disposiciones.push(convencion);
      }
    });
    // console.log(this.disposiciones);
  }
  cancelar() {
    this.serie = this.serieVacia;
    // this.serie = new Serie();
    this.tipo = new Tipo();
    this.disposiciones = [];
    this.editar = false;
  }

  guardar() {
    const me = this;
    if (me.serie.serie_id === '') {
      $('#serie').focus();
      return;
    }
    if (me.subserie.subserie_id === '') {
      $('#subserie').focus();
      return;
    }
    if (me.tipo.denominacion === '') {
      $('#denominacion').focus();
      return;
    }
    if (this.convenciones.length <= 0) {
      this._helper.Prompt('Debe al menos elegir una disposición', '', 'error');
      return;
    }
    // alert('');
    me.tipo.consecutivo = me.subserie.consecutivo;
    me.cargando = true;
    if (me.editar) {
      me._tipoService.actualizarRegistro(me.tipo).subscribe(exito => {
        me.cargando = false;
        if (exito) {
          me.actualizar_disposiciones(me.tipo.tipo_id);
          me.refrescar_tabla();
          // me.cancelar();
          me._helper.Notificacion('Registro actualizado exitosamente');
        } else {
          me._helper.Notificacion('Vuelve a intentarlo', 'Registro no actualizado', 'error');
        }
      });
    } else {
      // console.log(me.tipo);
      me._tipoService.nuevoRegistro(me.tipo).subscribe(tipo_id => {
        me.cargando = false;
        // console.log('tipo_id: ', tipo_id);
        if (tipo_id !== '') {
          // console.log(me.disposiciones);
          me.actualizar_disposiciones(tipo_id, true);
          // alert('');
          // console.log(me.disposiciones);

        } else {
          me._helper.Notificacion('Vuelve a intentarlo', 'No se ha podido realizar el registro en la base de datos', 'error');
        }
      });
    }
  }

  actualizar_disposiciones(_tipo_id, nuevo_registro = false) {
    // console.log('Ebert');
    this._disposicionService.eliminar(_tipo_id, this.tipo.consecutivo).subscribe(
      eliminados => {
        if (eliminados) {
          // console.log('Disposiciones Eliminadas: ', eliminados);
          // console.log(this.disposiciones);
          this.disposiciones.forEach(disposicion => {
            const _disposicion: Disposicion = new Disposicion();
            _disposicion.consecutivo = this.tipo.consecutivo;
            _disposicion.convencion_id = disposicion.convencion_id;
            _disposicion.tipo_id = _tipo_id;
            // console.log('Disposición:');
            // console.log(_disposicion);
            this._disposicionService.nuevoRegistro(_disposicion).subscribe(registrado => {
              // console.log(registrado);
            });
          });
          if (nuevo_registro) {
            this.refrescar_tabla();
            this.cancelar();
            this._helper.Notificacion('Registrado exitosamente');
            this.tipo = new Tipo();
          }
        } else {
        }
      }
    );
    // return Observable.of(false);
  }

  chequear_disposicion(convencion_id: string) {
    let check = false;
    this.disposiciones.forEach(disposicion => {
      if (disposicion.convencion_id === convencion_id) {
        check = true;
      }
    });
    return check;
  }

  borrar() {
    if (this.tipo.tipo_id === '') { return; }
    const me = this;
    me._helper.Prompt('Confirme que desea realmente eliminar el registro', 'Ésta acción no podrá deshacerse', 'warning').then((result) => {
      if (result.value) {
        me.cargando = true;
        me._tipoService.eliminarRegistro(me.tipo.tipo_id, me.tipo.consecutivo)
          .subscribe(exito => {
            me.cargando = false;
            if (exito) {
              me._disposicionService.eliminar(me.tipo.tipo_id, me.tipo.consecutivo).subscribe(eliminados => {
                // console.log('Disposiciones Eliminadas: ', eliminados);
                me.cancelar();
                me.refrescar_tabla();
                me._helper.Prompt('Registro eliminado de la base de datos');
              });
            }
          });
      } else if (result.dismiss === 'cancel') {
        me._helper.Prompt('Eliminación cancelada', 'Registro sin cambios', 'error');
      }
    });
  }

}
