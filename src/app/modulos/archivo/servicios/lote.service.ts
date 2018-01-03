import { Injectable } from '@angular/core';
import { Lote as Model } from '../modelos/lote';
import { environment } from '../../../../environments/environment';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthService } from '../../seguridad/servicios/auth.service';
import { Observable } from 'rxjs/Observable';
// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';

@Injectable()
export class LoteService {

  constructor(private _http: Http, private _authService: AuthService) { }

  /**
   * Obtiene registros de la tabla lote que estan con la columna procesado = 0 vinculados al usuario que los subió
   * @param usuario_id Identificador del usuario, si no ingresa un usuario por defecto toma el que esta logueado
   */
  public registros_no_procesados(usuario_id = ''): Observable<Model[]> {
    const _headers = new Headers({ 'Authorization': 'Bearer ' + this._authService.Usuario().token });
    const _options = new RequestOptions({ headers: _headers });
    const _url = environment.apiurl + '/lotes/sinprocesar/' + usuario_id;
    return this._http.get(_url, _options)
      .map((response: Response) => {
        const data = this._authService.ExtraerResultados(response);
        return data;
      })
      .catch(err => this._authService.CapturarError(err));
  }

}
