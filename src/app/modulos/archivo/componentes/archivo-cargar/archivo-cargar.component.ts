import { Component, OnInit } from '@angular/core';
import { FileGeneric } from '../../modelos/file-generic';
import { ArchivoService } from '../../servicios/archivo.service';
import { Helper } from '../../../../app-helper';

@Component({
  selector: 'app-archivo-cargar',
  templateUrl: './archivo-cargar.component.html',
  styleUrls: ['./archivo-cargar.component.css']
})
export class ArchivoCargarComponent implements OnInit {

  constructor(
    private _helper: Helper,
    private _archivoService: ArchivoService
  ) { }

  // #region Metodos de obtención y establecimiento de valores

  private _archivos: FileGeneric[] = [];
  public get archivos(): FileGeneric[] {
    return this._archivos;
  }
  public set archivos(v: FileGeneric[]) {
    this._archivos = v;
  }

  // #endregion
  ngOnInit() {
    // this._helper.Notificacion('Pruebas');
    // this._helper.Notificacion('Pruebas', 'Titulos', 'error');
    // this._helper.Notificacion('Pruebas', 'Titulos', 'info');
    // this._helper.Notificacion('Pruebas', 'Titulos', 'warning');
  }

  updateList() {
    const input: any = document.getElementById('directorio');
    this.archivos = [];
    for (let index = 0; index < input.files.length; index++) {
      const archivo: FileGeneric = input.files[index];
      if (archivo.type.indexOf('pdf') !== -1) {
        this.archivos.push(archivo);
      }
    }
    // this.archivos = input.files;
    // const file: FileGeneric = this.archivos[0];
  }

  cargarArchivos() {
    const postData = { field1: 'field1', field2: 'field2' };
    const archivos: any = this.archivos;
    this._archivoService.cargar(postData, archivos).then(
      archivosRegistrados => {
        console.log(archivosRegistrados);
      }
    );
  }


}
