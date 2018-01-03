import { Injectable } from '@angular/core';
import { Archivo as Model } from '../modelos/archivo';
import { environment } from '../../../../environments/environment';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthService } from '../../seguridad/servicios/auth.service';
import { Observable } from 'rxjs/Observable';
// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';
import { FileGeneric } from '../modelos/file-generic';

@Injectable()
export class ArchivoService {

  constructor(private _http: Http, private _authService: AuthService) { }

  cargar(postData: any, files: File[]) {
    const _headers = new Headers({ 'Authorization': 'Bearer ' + this._authService.Usuario().token });
    // console.log(_headers);
    // const _headers = new Headers({ 'Authorization': 'Bearer ' + '' });
    const _url = environment.apiurl + '/archivos/cargar';
    const _formData: FormData = new FormData();
    // console.log(files[0]);
    // _formData.append('files', files[0], files[0].name);
    // Para multiples subidas
    for (let i = 0; i < files.length; i++) {
      _formData.append(`files[]`, files[i], files[i].name);
    }

    if (postData !== '' && postData !== undefined && postData !== null) {
      for (const property in postData) {
        if (postData.hasOwnProperty(property)) {
          _formData.append(property, postData[property]);
        }
      }
    }
    // console.log(_formData);
    const returnReponse = new Promise((resolve, reject) => {
      this._http.post(_url, _formData, {
        headers: _headers
      }).subscribe(
        res => {
          // this.responseData = res.json();
          // resolve(this.responseData);
          const data = this._authService.ExtraerResultados(res);
          // console.log("Data: ");
          // console.log(data);
          resolve(data);
        },
        error => {
          // this.router.navigate(['/login']);
          // console.log(error);
          this._authService.CapturarError(error);
          reject(error);
        }
        );
    });
    return returnReponse;
  }

  public registros(archivo_id = ''): Observable<Model[]> {
    const _headers = new Headers({ 'Authorization': 'Bearer ' + this._authService.Usuario().token });
    const _options = new RequestOptions({ headers: _headers });
    const _url = environment.apiurl + '/archivos/' + archivo_id;
    return this._http.get(_url, _options)
      .map((response: Response) => {
        const data = this._authService.ExtraerResultados(response);
        const archivos: Model[] = [];
        data.forEach(archivo => {
          const modelo: Model = archivo;
          modelo.directorio = environment.urlFilesUploads + modelo.directorio.replace('.', '');
          archivos.push(archivo);
        });
        return archivos;
      })
      .catch(err => this._authService.CapturarError(err));
  }

}
