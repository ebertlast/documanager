import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import { Grupo } from '../modelos/grupo';
import { Usuario } from '../modelos/usuario';
import { GrupoService } from '../servicios/grupo.service';
import { UsuarioService } from '../servicios/usuario.service';
import { Helper } from '../../../app-helper';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  cargando = false;
  editar = false;
  grupoVacio: Grupo = new Grupo();
  constructor(
    private _helper: Helper,
    private _grupoService: GrupoService,
    private _usuarioService: UsuarioService
  ) { }

  // #region Métodos de obtención y establecimiento de valores

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

  private _usuarios: Usuario[] = [];
  public get usuarios(): Usuario[] {
    return this._usuarios;
  }
  public set usuarios(v: Usuario[]) {
    this._usuarios = v;
  }

  private _usuario: Usuario = new Usuario();
  public get usuario(): Usuario {
    return this._usuario;
  }
  public set usuario(v: Usuario) {
    this._usuario = v;
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
    this.usuario = new Usuario();
    this.usuario.tipo_id = _row[0];
    this.usuario.identificacion = _row[1];
    this.usuario.sede = _row[2];
    this.usuario.grupo_id = _row[3];
    this.usuario.usuario_id = _row[4];
    this.usuario.nombres = _row[5];
    this.usuario.email = _row[6];
    this.usuario.activo = (_row[7] === 'SI') ? 1 : 0;
    this.usuario.fecha_registro = new Date(Date.parse(_row[8]));
    this.editar = true;
    this.grupo = this.grupoVacio;
    this.grupos.forEach(grupo => {
      if (
        grupo.grupo_id === this.usuario.grupo_id
      ) {
        this.grupo = grupo;
      }
    });
    // console.log(this.grupo);
  }

  refrescar_tabla(): void {
    this.cargando = true;
    this._usuarioService.registros().subscribe(usuarios => {
      this.cargando = false;
      this.usuarios = usuarios;
      console.log(this.usuarios);

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
    this._grupoService.registros().subscribe(rows => {
      this.cargando = false;
      this.grupos = rows;
    });
    this.refrescar_tabla();
  }

  cancelar() {
    this.grupo = this.grupoVacio;
    this.grupo = new Grupo();
    this.editar = false;
  }

  guardar() {
    const me = this;
    if (me.grupo.grupo_id === '') {
      $('#grupo').focus();
      return;
    }
    if (me.usuario.usuario_id === '') {
      $('#usuario_id').focus();
      return;
    }
    if (me.usuario.nombres === '') {
      $('#nombres').focus();
      return;
    }
    if (me.usuario.email === '') {
      $('#email').focus();
      return;
    }
    me.usuario.grupo_id = me.grupo.grupo_id;
    me.cargando = true;
    if (me.editar) {
      me._usuarioService.actualizarRegistro(me.usuario).subscribe(exito => {
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
      me.cargando = true;
      me._usuarioService.usuario_existe(me.usuario.usuario_id).subscribe(existe_usuario => {
        if (existe_usuario === true) {
          me.cargando = false;
          me._helper.Prompt('Usuario (' + me.usuario.usuario_id + ') existe.', 'Usuario duplicado', 'error');
          return;
        } else {
          me._usuarioService.usuario_existe(me.usuario.email).subscribe(existe_email => {
            if (existe_email === true) {
              me.cargando = false;
              me._helper.Prompt('Email (' + me.usuario.email + ') existe.', 'Email duplicado', 'error');
              return;
            } else {
              me._usuarioService.nuevoRegistro(me.usuario).subscribe(exito => {
                me.cargando = false;
                if (exito) {
                  me.refrescar_tabla();
                  me.cancelar();
                  me._helper.Prompt('Usuario registrado exitosamente', 'Un correo con la contraseña ha sido enviado al usuario')
                } else {
                  // me._helper.Notificacion('Vuelve a intentarlo', 'No se ha podido realizar el registro del usuario', 'error');
                  me._helper.Prompt('No se ha podido realizar el registro del usuario', 'Vuelve a intentarlo', 'error');
                }
              });
            }
          });
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
