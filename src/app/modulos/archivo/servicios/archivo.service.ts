import { Injectable } from '@angular/core';
// import { Arch as Model } from '../modelos/arch';
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
    // const _headers = new Headers({ 'Authorization': 'Bearer ' + this._authService.Usuario().TOKEN });
    const _headers = new Headers({ 'Authorization': 'Bearer ' + '' });
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
    console.log(_formData);
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
}
