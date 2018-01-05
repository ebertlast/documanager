import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import { Helper } from '../../../../app-helper';
import { TerceroService } from '../../servicios/tercero.service';
import { Tercero } from '../../modelos/tercero';
import { TipoDocumentoService } from '../../servicios/tipo-documento.service';
import { TipoDocumento } from '../../modelos/tipo-documento';

@Component({
  selector: 'app-terceros',
  templateUrl: './terceros.component.html',
  styleUrls: ['./terceros.component.css']
})
export class TercerosComponent implements OnInit {
  cargando = false;
  editar = false;
  constructor(
    private _helper: Helper,
    private _terceroService: TerceroService,
    private _tipoDocumentoService: TipoDocumentoService
  ) { }

  // #region Métodos de obtención y establecimiento de valores

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

  private _tipoDocumentos: TipoDocumento[] = [];
  public get tipoDocumentos(): TipoDocumento[] {
    return this._tipoDocumentos;
  }
  public set tipoDocumentos(v: TipoDocumento[]) {
    this._tipoDocumentos = v;
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
    console.log(_row);
    this.tercero = new Tercero();
    this.tercero.tipo_id = _row[0];
    this.tercero.identificacion = _row[1];
    this.tercero.razon_social = _row[2];
    this.tercero.direccion = _row[3];
    this.tercero.email = _row[4];
    this.tercero.telefono = _row[5];
    this.tercero.fecha_registro = new Date(Date.parse(_row[6]));
    this.tercero.logo = _row[7];
    this.editar = true;
    console.log(this.tercero);
    // this.refrescar_propiedades();
  }
  // #endregion

  ngOnInit() {
    this.refrescar_terceros();
    this.cargando = true;
    this._tipoDocumentoService.registros().subscribe(rows => {
      this.tipoDocumentos = rows;
      this.cargando = false;
      // console.log(this.tipoDocumentos);
    });
  }

  refrescar_terceros() {
    this.cargando = true;
    this._terceroService.registros().subscribe(terceros => {
      this.terceros = terceros;
      // console.log(this.terceros);
      this.refrescar_tabla();
      this.cargando = false;
    });
  }

  refrescar_tabla(): void {
    if (this.aux === 0) {
      this.aux++;
      this.dtTrigger.next();
    } else {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    }
  }

  cancelar() {
    this.tercero = new Tercero();
    this.editar = false;
  }

  guardar() {
    const me = this;
    if (me.tercero.tipo_id === '') {
      $('#tipo_id').focus();
      return;
    }
    if (me.tercero.identificacion === '') {
      $('#identificacion').focus();
      return;
    }
    if (me.tercero.razon_social === '') {
      $('#razon_social').focus();
      return;
    }
    me.cargando = true;
    if (me.editar) {
      me._terceroService.actualizarRegistro(me.tercero).subscribe(exito => {
        me.cargando = false;
        if (exito) {
          me.refrescar_terceros();
          // me.cancelar();
          me._helper.Notificacion('Registro actualizado exitosamente');
        } else {
          me._helper.Notificacion('Vuelve a intentarlo', 'Registro no actualizado', 'error');
        }
      });
    } else {
      me._terceroService.nuevoRegistro(me.tercero).subscribe(exito => {
        me.cargando = false;
        if (exito) {
          me.refrescar_terceros();
          me.cancelar();
          me._helper.Notificacion('Tercero registrado exitosamente');
        } else {
          me._helper.Notificacion('Vuelve a intentarlo', 'No se ha podido realizar el registro del tercero', 'error');
        }
      });
    }
  }

  borrar() {
    if (this.tercero.tipo_id === '' || this.tercero.identificacion === '') { return; }
    const me = this;
    me._helper.Prompt('Confirme que desea realmente eliminar el registro', 'Ésta acción no podrá deshacerse', 'warning').then((result) => {
      if (result.value) {
        this.cargando = true;
        this._terceroService.eliminarRegistro(this.tercero.tipo_id, this.tercero.identificacion).subscribe(exito => {
          this.cargando = false;
          if (exito) {
            this.cancelar();
            this.refrescar_terceros();
            this._helper.Prompt('Registro eliminado de la base de datos');
          }
        });
      } else if (result.dismiss === 'cancel') {
        me._helper.Prompt('Eliminación cancelada', 'Registro sin cambios', 'error');
      }
    });
  }


}
