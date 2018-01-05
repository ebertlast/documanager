import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import { Helper } from '../../../../app-helper';
import { TerceroService } from '../../servicios/tercero.service';
import { Tercero } from '../../modelos/tercero';
import { TipoDocumentoService } from '../../servicios/tipo-documento.service';
import { TipoDocumento } from '../../modelos/tipo-documento';
import { SedeService } from '../../servicios/sede.service';
import { Sede } from '../../modelos/sede';

@Component({
  selector: 'app-sedes',
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.css']
})
export class SedesComponent implements OnInit {
  cargando = false;
  editar = false;
  terceroVacio: Tercero = new Tercero();
  constructor(
    private _helper: Helper,
    private _terceroService: TerceroService,
    private _tipoDocumentoService: TipoDocumentoService,
    private _sedeService: SedeService
  ) { }

  // #region Métodos de obtención y establecimiento de valores

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
    this.sede = new Sede();
    this.sede.tipo_id = _row[0];
    this.sede.identificacion = _row[1];
    this.sede.tercero = _row[2];
    this.sede.sede_id = _row[3];
    this.sede.razon_social = _row[4];
    this.sede.activa = (_row[5] === 'SI') ? 1 : 0;
    this.sede.fecha_registro = new Date(Date.parse(_row[6]));
    this.sede.logo = _row[7];
    this.editar = true;
    this.tercero = this.terceroVacio;
    this.terceros.forEach(tercero => {
      if (tercero.tipo_id === this.sede.tipo_id && tercero.identificacion === this.sede.identificacion) {
        this.tercero = tercero;
      }
    });
    // console.log(this.sede);
  }

  refrescar_tabla(): void {
    this.cargando = true;
    this._sedeService.registros().subscribe(sedes => {
      this.cargando = false;
      this.sedes = sedes;
      // console.log(this.sedes);

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
    this._terceroService.registros().subscribe(rows => {
      this.cargando = false;
      this.terceros = rows;
    });
  }

  cancelar() {
    this.tercero = this.terceroVacio;
    this.sede = new Sede();
    this.editar = false;
  }
  guardar() {
    const me = this;
    if (me.tercero.tipo_id === '' || me.tercero.identificacion === '') {
      $('#tercero').focus();
      return;
    }
    if (me.sede.sede_id === '') {
      $('#sede_id').focus();
      return;
    }
    if (me.sede.razon_social === '') {
      $('#razon_social').focus();
      return;
    }
    me.sede.tipo_id = me.tercero.tipo_id;
    me.sede.identificacion = me.tercero.identificacion;
    me.cargando = true;
    if (me.editar) {
      me._sedeService.actualizarRegistro(me.sede).subscribe(exito => {
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
      me._sedeService.nuevoRegistro(me.sede).subscribe(exito => {
        me.cargando = false;
        if (exito) {
          me.refrescar_tabla();
          me.cancelar();
          me._helper.Notificacion('Sede registrada exitosamente');
        } else {
          me._helper.Notificacion('Vuelve a intentarlo', 'No se ha podido realizar el registro de la sede', 'error');
        }
      });
    }
  }

  borrar() {
    if (this.sede.tipo_id === '' || this.sede.identificacion === '' || this.sede.sede_id === '') { return; }
    const me = this;
    me._helper.Prompt('Confirme que desea realmente eliminar el registro', 'Ésta acción no podrá deshacerse', 'warning').then((result) => {
      if (result.value) {
        this.cargando = true;
        this._sedeService.eliminarRegistro(this.sede.tipo_id, this.sede.identificacion, this.sede.sede_id).subscribe(exito => {
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
