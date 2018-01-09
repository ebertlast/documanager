import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import { Serie } from '../../modelos/serie';
import { Subserie } from '../../modelos/subserie';
import { SubserieService } from '../../servicios/subserie.service';
import { SerieService } from '../../servicios/serie.service';
import { Helper } from '../../../../app-helper';

@Component({
  selector: 'app-subseries',
  templateUrl: './subseries.component.html',
  styleUrls: ['./subseries.component.css']
})
export class SubseriesComponent implements OnInit {
  cargando = false;
  editar = false;
  serieVacia = new Serie();
  constructor(
    private _subserieService: SubserieService,
    private _serieService: SerieService,
    private _helper: Helper,
  ) { }

  // #region Métodos de obtención y establecimiento de valores
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
    this.subserie = new Subserie();
    this.subserie.tipo_id = _row[0];
    this.subserie.identificacion = _row[1];
    this.subserie.sede_id = _row[2];
    this.subserie.serie_id = _row[3];
    this.subserie.serie = _row[4];
    this.subserie.subserie_id = _row[5];
    this.subserie.denominacion = _row[6];
    this.subserie.sede = _row[7];
    this.subserie.tercero = _row[8];
    this.subserie.fecha_registro = new Date(Date.parse(_row[9]));
    this.subserie.consecutivo = _row[10];
    this.serie = this.serieVacia;
    this.editar = true;
    this.series.forEach(serie => {
      if (
        serie.tipo_id === this.subserie.tipo_id &&
        serie.identificacion === this.subserie.identificacion &&
        serie.sede_id === this.subserie.sede_id &&
        serie.serie_id === this.subserie.serie_id
      ) {
        this.serie = serie;
      }
    });
    // console.log(this.subserie);
  }

  refrescar_tabla(): void {
    this.cargando = true;
    this._subserieService.registros().subscribe(subseries => {
      this.cargando = false;
      this.subseries = subseries;
      // console.log(this.subseries);

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
    this.refrescar_tabla();
    this.cargando = true;
    this._serieService.registros().subscribe(rows => {
      this.cargando = false;
      this.series = rows;
    });
  }

  cancelar() {
    this.serie = this.serieVacia;
    this.serie = new Serie();
    this.editar = false;
  }

  guardar() {
    const me = this;
    if (me.serie.serie_id === '') {
      $('#serie').focus();
      return;
    }
    if (me.subserie.subserie_id === '') {
      $('#subserie_id').focus();
      return;
    }
    if (me.subserie.denominacion === '') {
      $('#denominacion').focus();
      return;
    }
    me.subserie.serie_id = me.serie.serie_id;
    me.subserie.tipo_id = me.serie.tipo_id;
    me.subserie.identificacion = me.serie.identificacion;
    me.subserie.sede_id = me.serie.sede_id;
    me.cargando = true;
    if (me.editar) {
      me._subserieService.actualizarRegistro(me.subserie).subscribe(exito => {
        me.cargando = false;
        if (exito) {
          me.refrescar_tabla();
          // me.cancelar();
          me._helper.Notificacion('Registro actualizado exitosamente');
        } else {
          me._helper.Notificacion('Vuelve a intentarlo', 'Registro no actualizado', 'error');
        }
      });
    } else {
      me._subserieService.nuevoRegistro(me.subserie).subscribe(exito => {
        me.cargando = false;
        if (exito) {
          me.refrescar_tabla();
          me.cancelar();
          me._helper.Notificacion('Registrado exitosamente');
        } else {
          me._helper.Notificacion('Vuelve a intentarlo', 'No se ha podido realizar el registro en la base de datos', 'error');
        }
      });
    }
  }

  borrar() {
    if (this.subserie.consecutivo <= 0) { return; }
    const me = this;
    me._helper.Prompt('Confirme que desea realmente eliminar el registro', 'Ésta acción no podrá deshacerse', 'warning').then((result) => {
      if (result.value) {
        this.cargando = true;
        this._subserieService.eliminarRegistro(this.subserie.consecutivo)
          .subscribe(exito => {
            this.cargando = false;
            if (exito) {
              this.cancelar();
              this.refrescar_tabla();
              this._helper.Prompt('Registro eliminado de la base de datos');
            }
          });
      } else if (result.dismiss === 'cancel') {
        me._helper.Prompt('Eliminación cancelada', 'Registro sin cambios', 'error');
      }
    });
  }
}
