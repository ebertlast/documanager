import { Injectable } from '@angular/core';
import { Helper } from '../../../app-helper';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Usuario as Model } from '../modelos/usuario';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Observable';
// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';
import { MSJBIENVENIDA } from './mock.msjsbienvenida';

@Injectable()
export class AuthService {
  private usuario: Model = new Model();
  public Usuario(): Model {
    if (!localStorage.getItem(environment.currentuser)) {
      return new Model();
    }
    this.usuario = JSON.parse(localStorage.getItem(environment.currentuser))['usuario'];
    if (this.usuario.avatar === '') {
      this.usuario.avatar = 'assets/img/avatars/user-default.jpg';
    }
    return this.usuario;
  }

  constructor(private _helper: Helper, private _router: Router, private _http: Http) { }

  /**
   * Extrae el contenido del Response que devuelve la API Rest
   * @param res Respuesta que genera la API Rest
   * @param mostrarError Muestra al usuario o no lo que contiene el campo 'error' en el response.
   */
  public ExtraerResultados(res: Response, mostrarError: boolean = true) {
    console.log(res);
    const body = res.json();
    if (!body.response && body.message && mostrarError) {
      this._helper.Notificacion(body.message || body.statusText, '', 'warning');
      if (body.logout === true) {
        this._router.navigate(['/seguridad/ingresar']);
      }
    }

    this.usuario = this.Usuario();
    this.usuario.token = (typeof (body.token) === 'undefined') ? '' : body.token;
    if (this.usuario.token === '') { this.usuario.token = (typeof (body.token) === 'undefined') ? '' : body.token; }
    if ((typeof (this.usuario.token) === 'undefined') ||
      this.usuario.token === '' ||
      !this.usuario.token
    ) { this.usuario.token = this.Usuario().token; }
    localStorage.removeItem(environment.currentuser);
    localStorage.setItem(environment.currentuser, JSON.stringify({ usuario: this.usuario }));

    return body.result || {};
  }

  /**
   * Maneja los errores que se puedan generar la momento de hacer las solicitudes a la API Rest
   * @param error Respuesta que genera la API Rest
   */
  public CapturarError(error: Response | any) {
    let errMsg: string;
    if (!error.ok) {
      console.log(error);
      errMsg = (typeof (error._body.message) !== 'undefined' || error._body.message) ? error._body.message : '';
      if (error instanceof Response) {
        let body: any = '';
        try {
          body = error.json();
          // console.log(error);
          // console.log(body);
        } catch (e) {
          body = '';
        }
        if (typeof (body.message) !== 'undefined') {
          errMsg = body.message;
        } else {
          errMsg = body.error || JSON.stringify(body);
        }
      } else {
        errMsg = error.message ? error.message : error.toString();
      }
      this._helper.Notificacion(errMsg, 'Error', 'error');
    }
    return Observable.throw(errMsg);
  }

  public MsjBienvenida(): string {
    const MSJID = Math.floor(Math.random() * 57) + 1;
    let _msj = '';
    MSJBIENVENIDA.forEach(msj => {
      if (MSJID === msj.msjid) {
        _msj = msj.msj;
      }
    });
    return _msj;
  }

  public Ingresar(usuario: string, clave: string): Observable<boolean> {
    return this._http.get(environment.apiurl + '/usuarios/ingresar/' + usuario + '/' + clave)
      .map((response: Response) => {
        const data = this.ExtraerResultados(response);
        // console.log(data);

        this.usuario = this.Usuario();
        const userData: Model = data[0];
        // console.log(userData);
        if (
          // typeof (userData.USUARIOID) !== 'undefined'
          // &&
          // userData.USUARIOID !== ''
          // userData.hasOwnProperty('USUARIOID')
          // 'USUARIOID' in userData
          userData
        ) {
          this.usuario = userData;
          // console.log(this.usuario.activo);
          if (this.usuario.activo !== 1) {
            // tslint:disable-next-line:max-line-length
            this._helper.Notificacion('Tu usuario se encuentra inactivo en nuestra base de datos. Si esto es un error, comunicate por favor con tu supervisor o con el departamento de tecnologóa.', '', 'info');
            return false;
          }
          localStorage.setItem(environment.currentuser, JSON.stringify({ usuario: this.usuario }));
          // console.log(this.Usuario());
          return true;
        }
        return false;
      })
      .catch(err => this.CapturarError(err));
  }

  public CerrarSesion() {
    // console.log('Cerrar Sesión!');
    // console.log(this.Usuario());
    if (this.Usuario().usuario_id !== '') {
      this._helper.Notificacion(this.Usuario().usuario_id + '.- ' + this.Usuario().nombres + '',
        'Sesión previa cerrada', 'info');
      localStorage.removeItem(environment.currentuser);
      localStorage.clear();
      this.usuario = new Model();
    }
  }

  public ReenviarClave(email: string): Observable<boolean> {
    const _url = environment.apiurl + '/usuarios/reenviarclave/' + email;
    return this._http.get(_url)
      .map((response: Response) => {
        const data = this.ExtraerResultados(response);
        // console.log(data);
        // return data;
        if (data === true) {
          return true;
        } else { return false; }
      })
      .catch(err => this.CapturarError(err));
  }

}
