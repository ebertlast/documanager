import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Usuario } from '../../../seguridad/modelos/usuario';
import { AuthService } from '../../../seguridad/servicios/auth.service';
declare var $: any;
declare var cargarInspinia: any;
@Component({
  selector: 'app-escritorio',
  templateUrl: './escritorio.component.html',
  styleUrls: ['./escritorio.component.css']
})
export class EscritorioComponent implements OnInit {
  environment = environment;
  constructor(
    private _authService: AuthService
  ) { }

  private _usuario: Usuario;
  public get usuario(): Usuario {
    return this._usuario;
  }
  public set usuario(v: Usuario) {
    this._usuario = v;
  }

  ngOnInit() {
    $('body').attr('class', 'fixed-sidebar no-skin-config full-height-layout pace-done');
    this.usuario = this._authService.Usuario();
    const me = this;
    cargarInspinia();
  }
}
