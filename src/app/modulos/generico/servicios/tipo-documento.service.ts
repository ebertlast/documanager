import { Injectable } from '@angular/core';
import { TipoDocumento as Model } from '../modelos/tipo-documento';
import { environment } from '../../../../environments/environment';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthService } from '../../seguridad/servicios/auth.service';
import { Observable } from 'rxjs/Observable';
// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';

@Injectable()
export class TipoDocumentoService {

  constructor(private _http: Http, private _authService: AuthService) { }

  public nuevoRegistro(model: Model): Observable<boolean> {
    const _headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + this._authService.Usuario().token
    });
    const _options = new RequestOptions({ headers: _headers });
    const _json = 'json=' + JSON.stringify({ model });
    const _url = environment.apiurl + '/tipos_documentos/nuevo';
    return this._http.put(_url, _json, _options)
      .map((response: Response) => {
        const data = this._authService.ExtraerResultados(response);
        return data;
      })
      .catch(err => this._authService.CapturarError(err));
  }
  public registros(tipo_id: string = ''): Observable<Model[]> {
    const _headers = new Headers({ 'Authorization': 'Bearer ' + this._authService.Usuario().token });
    const _options = new RequestOptions({ headers: _headers });
    const _url = environment.apiurl + '/tipos_documentos/' + tipo_id;
    return this._http.get(_url, _options)
      .map((response: Response) => {
        const data = this._authService.ExtraerResultados(response);
        return data;
      })
      .catch(err => this._authService.CapturarError(err));
  }
  public eliminarRegistro(tipo_id: string): Observable<boolean> {
    const _headers = new Headers({
      'Authorization': 'Bearer ' + this._authService.Usuario().token
    });
    const _options = new RequestOptions({ headers: _headers });
    const _url = environment.apiurl + '/tipos_documentos/' + tipo_id;
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
    const _url = environment.apiurl + '/tipos_documentos/actualizar';
    return this._http.post(_url, _json, _options)
      .map((response: Response) => {
        const data = this._authService.ExtraerResultados(response);
        return data;
      })
      .catch(err => this._authService.CapturarError(err));
  }

}
