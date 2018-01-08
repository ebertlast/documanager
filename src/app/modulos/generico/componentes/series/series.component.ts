import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import { SerieService } from '../../servicios/serie.service';
import { Serie } from '../../modelos/serie';
import { Sede } from '../../modelos/sede';
import { SedeService } from '../../servicios/sede.service';
import { Helper } from '../../../../app-helper';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css']
})
export class SeriesComponent implements OnInit {
  cargando = false;
  editar = false;
  sedeVacia = new Sede;
  constructor(
    private _serieService: SerieService,
    private _sedeService: SedeService,
    private _helper: Helper
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
    this.serie = new Serie();
    this.serie.tipo_id = _row[0];
    this.serie.identificacion = _row[1];
    this.serie.sede_id = _row[2];
    this.serie.serie_id = _row[3];
    this.serie.denominacion = _row[4];
    this.serie.sede = _row[5];
    this.serie.tercero = _row[6];
    this.serie.fecha_registro = new Date(Date.parse(_row[7]));
    this.editar = true;
    this.sede = this.sedeVacia;
    this.sedes.forEach(sede => {
      if (
        sede.tipo_id === this.serie.tipo_id &&
        sede.identificacion === this.serie.identificacion &&
        sede.sede_id === this.serie.sede_id
      ) {
        this.sede = sede;
      }
    });
    // console.log(this.serie);
  }

  refrescar_tabla(): void {
    this.cargando = true;
    this._serieService.registros().subscribe(series => {
      this.cargando = false;
      this.series = series;
      console.log(this.series);

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
    this._sedeService.registros().subscribe(rows => {
      this.cargando = false;
      this.sedes = rows;
    });
  }

  cancelar() {
    this.sede = this.sedeVacia;
    this.serie = new Serie();
    this.editar = false;
  }

  guardar() {
    const me = this;
    if (me.sede.sede_id === '') {
      $('#sede').focus();
      return;
    }
    if (me.serie.serie_id === '') {
      $('#serie_id').focus();
      return;
    }
    if (me.serie.denominacion === '') {
      $('#denominacion').focus();
      return;
    }
    me.serie.tipo_id = me.sede.tipo_id;
    me.serie.identificacion = me.sede.identificacion;
    me.serie.sede_id = me.sede.sede_id;
    me.cargando = true;
    if (me.editar) {
      me._serieService.actualizarRegistro(me.serie).subscribe(exito => {
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
      me._serieService.nuevoRegistro(me.serie).subscribe(exito => {
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
    if (this.serie.serie_id === '') { return; }
    const me = this;
    me._helper.Prompt('Confirme que desea realmente eliminar el registro', 'Ésta acción no podrá deshacerse', 'warning').then((result) => {
      if (result.value) {
        this.cargando = true;
        this._serieService.eliminarRegistro(this.serie.serie_id, this.sede.tipo_id, this.sede.identificacion, this.sede.sede_id)
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
