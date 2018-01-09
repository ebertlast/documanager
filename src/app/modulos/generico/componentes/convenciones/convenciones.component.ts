import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import { Convencion } from '../../modelos/convencion';
import { Helper } from '../../../../app-helper';
import { ConvencionService } from '../../servicios/convencion.service';

@Component({
  selector: 'app-convenciones',
  templateUrl: './convenciones.component.html',
  styleUrls: ['./convenciones.component.css']
})
export class ConvencionesComponent implements OnInit {
  cargando = false;
  editar = false;
  constructor(
    private _helper: Helper,
    private _convencionService: ConvencionService
  ) { }
  // #region Métodos de obtención y establecimiento de valores

  private _convenciones: Convencion[] = [];
  public get convenciones(): Convencion[] {
    return this._convenciones;
  }
  public set convenciones(v: Convencion[]) {
    this._convenciones = v;
  }

  private _convencion: Convencion = new Convencion();
  public get convencion(): Convencion {
    return this._convencion;
  }
  public set convencion(v: Convencion) {
    this._convencion = v;
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
    this.convencion = new Convencion();
    this.convencion.convencion_id = _row[0];
    this.convencion.denominacion = _row[1];
    this.convencion.activo = (_row[2] === 'SI') ? 1 : 0;
    this.editar = true;
    // console.log(this.convencion);
  }

  refrescar_tabla(): void {
    this.cargando = true;
    this._convencionService.registros().subscribe(convenciones => {
      this.cargando = false;
      this.convenciones = convenciones;
      // console.log(this.convenciones);

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
  }
  cancelar() {
    this.convencion = new Convencion();
    this.editar = false;
  }

  guardar() {
    const me = this;
    if (me.convencion.convencion_id === '') {
      $('#convencion_id').focus();
      return;
    }
    if (me.convencion.denominacion === '') {
      $('#denominacion').focus();
      return;
    }
    me.cargando = true;
    if (me.editar) {
      console.log(me.convencion);
      me._convencionService.actualizarRegistro(me.convencion).subscribe(exito => {
        me.cargando = false;
        if (exito) {
          me.refrescar_tabla();
          me._helper.Notificacion('Registro actualizado exitosamente');
        } else {
          me._helper.Notificacion('Vuelve a intentarlo', 'Registro no actualizado', 'error');
        }
      });
    } else {
      me._convencionService.nuevoRegistro(me.convencion).subscribe(exito => {
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
    if (this.convencion.convencion_id === '') { return; }
    const me = this;
    me._helper.Prompt('Confirme que desea realmente eliminar el registro', 'Ésta acción no podrá deshacerse', 'warning').then((result) => {
      if (result.value) {
        this.cargando = true;
        this._convencionService.eliminarRegistro(this.convencion.convencion_id)
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
