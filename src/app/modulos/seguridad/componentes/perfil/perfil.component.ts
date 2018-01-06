import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Usuario } from '../../modelos/usuario';
import { Helper } from '../../../../app-helper';
import { UsuarioService } from '../../servicios/usuario.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  cargando = false;
  constructor(
    private _authService: AuthService,
    private _helper: Helper,
    private _usuarioService: UsuarioService,
    private _router: Router
  ) { }


  private _usuario: Usuario;
  public get usuario(): Usuario {
    return this._usuario;
  }
  public set usuario(v: Usuario) {
    this._usuario = v;
  }

  private _claveactual = '';
  public get claveactual(): string {
    return this._claveactual;
  }
  public set claveactual(v: string) {
    this._claveactual = v;
  }

  ngOnInit() {
    this.usuario = this._authService.Usuario();
    this.usuario.clave = '';
    const me = this;
    $('#claveactual').on('keypress', function (e) {
      if (e.keyCode === 13) {
        me.cambiarclave();
      }
    });
    $('#clave').on('keypress', function (e) {
      if (e.keyCode === 13) {
        me.cambiarclave();
      }
    });
  }

  cambiarclave() {
    const me = this;
    if (me.claveactual === '') {
      $('#claveactual').focus();
      me._helper.AnimarDiv('formulario');
      return;
    }
    if (me.usuario.clave === '') {
      $('#clave').focus();
      me._helper.AnimarDiv('formulario');
      return;
    }

    // swal({
    //   title: 'Confirme que desea realmente actualizar su contraseña',
    //   text: `Ésta acción no podrá deshacerse`,
    //   type: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Si, dese hacerlo',
    //   cancelButtonText: 'No, cancelar',
    //   confirmButtonClass: 'btn btn-success',
    //   cancelButtonClass: 'btn btn-danger',
    //   buttonsStyling: false,
    //   reverseButtons: true
    // })
    me._helper.Prompt(
      'Confirme que desea realmente actualizar su contraseña',
      `Ésta acción no podrá deshacerse`,
      'warning'
    )
      .then((result) => {
        if (result.value) {
          me.cargando = true;
          // me._helper.Sleep(1500).then(() => {
          // });
          me._usuarioService.cambiar_clave(me.usuario, me.claveactual).subscribe(exito => {
            me.cargando = false;
            if (exito === true) {
              me._helper.Prompt(
                'Contraseña actualizada',
                'Tu contraseña ha cambiado, debes iniciar sesión nuevamente.',
                'success'
              ).then((result2) => {
                me._router.navigate(['/seguridad/ingresar']);
              });
            } else {
              me.cargando = false;
              $('#claveactual').focus();
              me._helper.AnimarDiv('formulario');
              // me._helper.Prompt(
              //   'Contraseña no actualizada',
              //   `Ha ocurrido un evento inesperado mientras intentamos actualizar su contraseña, vuelve a intentarlo.
              //   Si el problema persiste no dudes en contactar al personal de tecnología.`,
              //   'error'
              // );
            }
          });

          // result.dismiss can be 'cancel', 'overlay',
          // 'close', and 'timer'
        } else if (result.dismiss === 'cancel') {
          me.cargando = false;
          me._helper.Prompt(
            'Cancelado',
            'Su contraseña sigue siendo la misma',
            'error'
          );
        }
      });
  }

}
