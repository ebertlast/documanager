import { Injectable } from '@angular/core';
import { Serie as Model } from '../modelos/serie';
import { environment } from '../../../../environments/environment';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthService } from '../../seguridad/servicios/auth.service';
import { Observable } from 'rxjs/Observable';
// tslint:disable-next-line:import-blacklist

@Injectable()
export class SerieService {

  constructor(private _http: Http, private _authService: AuthService) { }

  public nuevoRegistro(model: Model): Observable<boolean> {
    const _headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + this._authService.Usuario().token
    });
    const _options = new RequestOptions({ headers: _headers });
    const _json = 'json=' + JSON.stringify({ model });
    const _url = environment.apiurl + '/series/nuevo';
    return this._http.put(_url, _json, _options)
      .map((response: Response) => {
        const data = this._authService.ExtraerResultados(response);
        return data;
      })
      .catch(err => this._authService.CapturarError(err));
  }
  public registros(serie_id: string = ''): Observable<Model[]> {
    const _headers = new Headers({ 'Authorization': 'Bearer ' + this._authService.Usuario().token });
    const _options = new RequestOptions({ headers: _headers });
    const _url = environment.apiurl + '/series/' + serie_id;
    return this._http.get(_url, _options)
      .map((response: Response) => {
        const data = this._authService.ExtraerResultados(response);
        // console.log(data);
        return data;
      })
      .catch(err => this._authService.CapturarError(err));
  }
  public consultar(model: Model): Observable<Model[]> {
    const _headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + this._authService.Usuario().token
    });
    const _options = new RequestOptions({ headers: _headers });
    const _json = 'json=' + JSON.stringify({ model });
    const _url = environment.apiurl + '/series/consultar';
    // console.log(_json);
    // console.log(_url);
    return this._http.post(_url, _json, _options)
      .map((response: Response) => {
        const data = this._authService.ExtraerResultados(response);
        return data;
      })
      .catch(err => this._authService.CapturarError(err));
  }
  public eliminarRegistro(serie_id: string, tipo_id: string, identificacion: string, sede_id: string): Observable<boolean> {
    const _headers = new Headers({
      'Authorization': 'Bearer ' + this._authService.Usuario().token
    });
    const _options = new RequestOptions({ headers: _headers });
    const _url = environment.apiurl + '/series/' + serie_id + '/' + tipo_id + '/' + identificacion + '/' + sede_id;
    return this._http.delete(_url, _options)
      .map((response: Response) => {
        const data = this._authService.ExtraerResultados(response);
        return data;
      })
      .catch(err => this._authService.CapturarError(err));
  }
  public actualizarRegistro(model: Model): Observable<boolean> {
    const _headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + this._authService.Usuario().token
    });
    const _options = new RequestOptions({ headers: _headers });
    const _json = 'json=' + JSON.stringify({ model });
    const _url = environment.apiurl + '/series/actualizar';
    return this._http.post(_url, _json, _options)
      .map((response: Response) => {
        const data = this._authService.ExtraerResultados(response);
        return data;
      })
      .catch(err => this._authService.CapturarError(err));
  }

}
