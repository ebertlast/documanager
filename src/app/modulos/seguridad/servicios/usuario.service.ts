import { Injectable } from '@angular/core';
import { Helper } from '../../../app-helper';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Usuario as Model } from '../modelos/usuario';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';

@Injectable()
export class UsuarioService {

  constructor(
    private _helper: Helper,
    private _router: Router,
    private _http: Http,
    private _authService: AuthService
  ) { }

  public cambiar_clave(model: Model, claveactual: string): Observable<boolean> {
    const _headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + this._authService.Usuario().token
    });
    const _options = new RequestOptions({ headers: _headers });
    const _json = 'json=' + JSON.stringify({ model });
    const _url = environment.apiurl + '/usuarios/cambiarclave/' + claveactual;
    // console.log(_json);
    // console.log(_url);
    return this._http.post(_url, _json, _options)
      .map((response: Response) => {
        const data = this._authService.ExtraerResultados(response);
        // console.log(data);
        return data;
      })
      .catch(err => this._authService.CapturarError(err));
  }
}
