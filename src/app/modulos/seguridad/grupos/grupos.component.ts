import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import { Sede } from '../../generico/modelos/sede';
import { Helper } from '../../../app-helper';
import { GrupoService } from '../servicios/grupo.service';
import { SedeService } from '../../generico/servicios/sede.service';
import { Grupo } from '../modelos/grupo';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent implements OnInit {
  cargando = false;
  editar = false;
  sedeVacia: Sede = new Sede();
  constructor(
    private _helper: Helper,
    private _grupoService: GrupoService,
    private _sedeService: SedeService,
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


  private _grupos: Grupo[] = [];
  public get grupos(): Grupo[] {
    return this._grupos;
  }
  public set grupos(v: Grupo[]) {
    this._grupos = v;
  }

  private _grupo: Grupo = new Grupo();
  public get grupo(): Grupo {
    return this._grupo;
  }
  public set grupo(v: Grupo) {
    this._grupo = v;
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
    this.grupo = new Grupo();
    this.grupo.tipo_id = _row[0];
    this.grupo.identificacion = _row[1];
    this.grupo.sede_id = _row[2];
    this.grupo.sede = _row[3];
    this.grupo.grupo_id = _row[4];
    this.grupo.denominacion = _row[5];
    this.grupo.activo = (_row[6] === 'SI') ? 1 : 0;
    this.grupo.fecha_registro = new Date(Date.parse(_row[7]));
    // this.grupo.logo = _row[7];
    this.editar = true;
    this.sede = this.sedeVacia;
    this.sedes.forEach(sede => {
      if (
        sede.tipo_id === this.grupo.tipo_id &&
        sede.identificacion === this.grupo.identificacion &&
        sede.sede_id === this.grupo.sede_id
      ) {
        this.sede = sede;
      }
    });
    // console.log(this.grupo);
  }

  refrescar_tabla(): void {
    this.cargando = true;
    this._grupoService.registros().subscribe(grupos => {
      this.cargando = false;
      this.grupos = grupos;
      // console.log(this.grupos);

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
    this.grupo = new Grupo();
    this.editar = false;
  }

  guardar() {
    const me = this;
    if (me.sede.sede_id === '') {
      $('#sede').focus();
      return;
    }
    if (me.grupo.grupo_id === '') {
      $('#grupo_id').focus();
      return;
    }
    if (me.grupo.denominacion === '') {
      $('#denominacion').focus();
      return;
    }
    me.grupo.tipo_id = me.sede.tipo_id;
    me.grupo.identificacion = me.sede.identificacion;
    me.grupo.sede_id = me.sede.sede_id;
    me.cargando = true;
    if (me.editar) {
      me._grupoService.actualizarRegistro(me.grupo).subscribe(exito => {
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
      me._grupoService.nuevoRegistro(me.grupo).subscribe(exito => {
        me.cargando = false;
        if (exito) {
          me.refrescar_tabla();
          me.cancelar();
          me._helper.Notificacion('Grupo registrado exitosamente');
        } else {
          me._helper.Notificacion('Vuelve a intentarlo', 'No se ha podido realizar el registro del grupo', 'error');
        }
      });
    }
  }

  borrar() {
    if (this.grupo.grupo_id === '') { return; }
    const me = this;
    me._helper.Prompt('Confirme que desea realmente eliminar el registro', 'Ésta acción no podrá deshacerse', 'warning').then((result) => {
      if (result.value) {
        this.cargando = true;
        this._grupoService.eliminarRegistro(this.grupo.grupo_id).subscribe(exito => {
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
