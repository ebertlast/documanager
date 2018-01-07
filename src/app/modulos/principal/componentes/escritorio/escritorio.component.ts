import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Usuario } from '../../../seguridad/modelos/usuario';
import { AuthService } from '../../../seguridad/servicios/auth.service';
import { Navlink } from '../../../generico/modelos/navlink';
declare var $: any;
declare var cargarInspinia: any;
@Component({
  selector: 'app-escritorio',
  templateUrl: './escritorio.component.html',
  styleUrls: ['./escritorio.component.css']
})
export class EscritorioComponent implements OnInit {
  environment = environment;
  public title = 'Escritorio';
  public navlinks: Navlink[] = [];
  private componente_actual = '';
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

  public component_added(event) {
    // console.log(event);
    this.componente_actual = event.constructor.name;
    this.actualizar_navegacion();
  }
  public component_removed(event) {
    // console.log(event);
  }

  actualizar_navegacion() {
    // console.log(this.componente_actual);
    this.navlinks = [];
    switch (this.componente_actual) {
      case 'ArchivosComponent':
        this.title = 'Consulta de Archivos';
        this.navlinks = [
          { url: 'escritorio', title: 'Inicio', active: false },
          { url: '', title: 'Archivos', active: true },
        ];
        break;
      case 'ArchivoCargarComponent':
        this.title = 'Subir archivos digitalizados';
        this.navlinks = [
          { url: 'escritorio', title: 'Inicio', active: false },
          { url: 'archivos/listado', title: 'Archivos', active: false },
          { url: '', title: 'Subir', active: true },
        ];
        break;
      case 'LotesComponent':
        this.title = 'Lotes de archivos por identificar';
        this.navlinks = [
          { url: 'escritorio', title: 'Inicio', active: false },
          { url: 'archivos/listado', title: 'Archivos', active: false },
          { url: '', title: 'Lotes', active: true },
        ];
        break;
      case 'PerfilComponent':
        this.title = 'Perfil de usuario';
        this.navlinks = [
          { url: 'escritorio', title: 'Inicio', active: false },
          { url: '', title: 'Seguridad', active: true },
          { url: '', title: 'Perfil', active: true },
        ];
        break;
      case 'TercerosComponent':
        this.title = 'Terceros del sistema';
        this.navlinks = [
          { url: 'escritorio', title: 'Inicio', active: false },
          { url: '', title: 'Sistema', active: true },
          { url: '', title: 'Terceros', active: true },
        ];
        break;
      case 'SedesComponent':
        this.title = 'Sedes de terceros';
        break;
      case 'TablasComponent':
        this.title = 'Tablas genéricas';
        this.navlinks = [
          { url: 'escritorio', title: 'Inicio', active: false },
          { url: '', title: 'Sistema', active: true },
          { url: '', title: 'Tablas Genéricas', active: true },
        ];
        break;
      case 'EtiquetasComponent':
        this.title = 'Etiquetas';
        this.navlinks = [
          { url: 'escritorio', title: 'Inicio', active: false },
          { url: 'archivos/listado', title: 'Archivos', active: false },
          { url: '', title: 'Etiquetas', active: true },
        ];
        break;
      case 'UsuariosComponent':
        this.title = 'Usuarios';
        this.navlinks = [
          { url: '', title: 'Inicio', active: false },
          { url: '', title: 'Sistema', active: true },
          { url: '', title: 'Usuarios', active: true },
        ];
        break;
      case 'GruposComponent':
        this.title = 'Grupos';
        this.navlinks = [
          { url: '', title: 'Inicio', active: false },
          { url: '', title: 'Sistema', active: true },
          { url: '', title: 'Grupos', active: true },
        ];
        break;
      case 'ResumenComponent':
        this.title = 'Vista Resumen';
        this.navlinks = [
          { url: 'escritorio', title: 'Inicio', active: false },
          { url: 'archivos/listado', title: 'Archivos', active: false },
          { url: '', title: 'Resumen', active: true },
        ];
        break;
      case 'ArchivoComponent':
        this.title = 'Detalles del archivo';
        this.navlinks = [
          { url: 'escritorio', title: 'Inicio', active: false },
          { url: 'archivos/listado', title: 'Archivos', active: false },
          { url: '', title: 'Archivo', active: true },
        ];
        break;
      default:
        this.title = 'Escritorio';
    }
    const links: Navlink[] = [
      { url: 'archivos', title: 'Archivos', active: false },
      { url: 'perfiles', title: 'Perfiles', active: false },
      // { url: 'perfil/' + this.perfil.perfilid, title: 'Perfil ' + this.perfil.denominacion, active: false },
      { url: '', title: 'Nuevo Perfil', active: true }
    ];
  }
}
