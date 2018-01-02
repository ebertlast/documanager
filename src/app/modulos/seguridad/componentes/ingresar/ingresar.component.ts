import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Helper } from '../../../../app-helper';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { Usuario } from '../../modelos/usuario';

declare var $: any;
@Component({
  selector: 'app-ingresar',
  templateUrl: './ingresar.component.html',
  styleUrls: ['./ingresar.component.css']
})
export class IngresarComponent implements OnInit {
  environment = environment;
  msjBienvenida = '';
  cargando = false;
  constructor(
    private _helper: Helper,
    private _authService: AuthService,
    private _router: Router
  ) { }


  private _usuario: Usuario = new Usuario();
  public get usuario(): Usuario {
    return this._usuario;
  }
  public set usuario(v: Usuario) {
    this._usuario = v;
  }

  ngOnInit() {
    $('body').attr('class', 'gray-bg');
    this.msjBienvenida = this._authService.MsjBienvenida();
    this._authService.CerrarSesion();

    const me = this;
    $('#email').on('keypress', function (e) {
      if (e.keyCode === 13) {
        me.ingresar();
      }
    });
    $('#clave').on('keypress', function (e) {
      if (e.keyCode === 13) {
        me.ingresar();
      }
    });
  }

  ingresar() {
    this.usuario.usuario_id = this.usuario.email;
    if (this.usuario.email === '') {
      this._helper.AnimarDiv('formIngresar');
      $('#email').focus();
      return false;
    }
    if (this.usuario.clave === '') {
      this._helper.AnimarDiv('formIngresar');
      $('#clave').focus();
      return false;
    }
    this.cargando = true;
    // this._helper.Sleep(1500).then(() => {
    //   this.cargando = false;
    //   // this._router.navigate(['']);
    //   window.location.href = '';
    //   // this._helper.AnimarDiv('formIngresar');
    // });
    this._authService.Ingresar(this.usuario.email, this.usuario.clave).subscribe(valido => {
      // console.log('Valido: ', valido);
      if (valido) {
        window.location.href = '';
      } else {
        this.cargando = false;
        this._helper.Notificacion('Ups! No te reconozco, vuelve a intentarlo.', '', 'error');
        this._helper.AnimarDiv('formIngresar');
      }
    });
    return false;
  }

}
