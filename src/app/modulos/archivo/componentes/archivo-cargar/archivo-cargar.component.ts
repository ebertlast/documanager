import { Component, OnInit} from '@angular/core';
import { FileGeneric } from '../../modelos/file-generic';
import { ArchivoService } from '../../servicios/archivo.service';
import { Helper } from '../../../../app-helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-archivo-cargar',
  templateUrl: './archivo-cargar.component.html',
  styleUrls: ['./archivo-cargar.component.css']
})
export class ArchivoCargarComponent implements OnInit {
  cargando = false;
  constructor(
    private _helper: Helper,
    private _archivoService: ArchivoService,
    private _router: Router
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

  cargarArchivos2() {
    const me = this;
    me._router.navigate(['escritorio/./archivo/listado']);

  }
  cargarArchivos() {
    const me = this;
    const postData = { field1: 'field1', field2: 'field2' };
    const archivos: any = me.archivos;
    me.cargando = true;
    me._archivoService.cargar(postData, archivos).then(
      archivosRegistrados => {
        me.cargando = false;
        if (archivosRegistrados === true) {
          me._helper.Prompt(
            'Archivos registrados',
            'Archivos subidos y respaldados, debe ahora editar sus propiedades'
          ).then(() => {
            me._router.navigate(['escritorio/./archivos/lotes']);
          });
        } else {
          me._helper.Prompt(
            'Archivos no registrados',
            `Ha ocurrido un error mientras intentabamos subir los archivos a nuestro servidor, vuelve a intentarlo.
            Si el problema persiste no dudes en contactar a nuestro personal de tecnología`,
            'error'
          );
        }

      }
    );
  }


}
