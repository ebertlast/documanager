import { Component, OnInit } from '@angular/core';
import { Lote } from '../../modelos/lote';
import { LoteService } from '../../servicios/lote.service';
import { Archivo } from '../../modelos/archivo';
import { ArchivoService } from '../../servicios/archivo.service';
import { TablaGenericaService } from '../../../generico/servicios/tabla-generica.service';
import { TablaGenerica } from '../../../generico/modelos/tabla-generica';
import { Helper } from '../../../../app-helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.css']
})
export class LotesComponent implements OnInit {
  cargando = false;
  public lote = '';
  public guardar = false;
  constructor(
    private _loteService: LoteService,
    private _archivoService: ArchivoService,
    private _tablaGenericaService: TablaGenericaService,
    private _helper: Helper,
    private _router: Router
  ) { }

  // #region Métodos de obtención y establecimiento de valores
  private _lotes: Lote[] = [];
  public get lotes(): Lote[] {
    return this._lotes;
  }
  public set lotes(v: Lote[]) {
    this._lotes = v;
  }

  private _lotesUnicos: string[] = [];
  public get lotesUnicos(): string[] {
    return this._lotesUnicos;
  }
  public set lotesUnicos(v: string[]) {
    this._lotesUnicos = v;
  }

  private _archivos: Archivo[] = [];
  public get archivos(): Archivo[] {
    return this._archivos;
  }
  public set archivos(v: Archivo[]) {
    this._archivos = v;
  }

  private _clasificaciones: TablaGenerica[] = [];
  public get clasificaciones(): TablaGenerica[] {
    return this._clasificaciones;
  }
  public set clasificaciones(v: TablaGenerica[]) {
    this._clasificaciones = v;
  }

  private _clasificacion: TablaGenerica[] = [];
  public get clasificacion(): TablaGenerica[] {
    return this._clasificacion;
  }
  public set clasificacion(v: TablaGenerica[]) {
    this._clasificacion = v;
  }
  private _etiqueta: TablaGenerica[] = [];
  public get etiqueta(): TablaGenerica[] {
    return this._etiqueta;
  }
  public set etiqueta(v: TablaGenerica[]) {
    this._etiqueta = v;
  }

  private _etiquetas: TablaGenerica[] = [];
  public get etiquetas(): TablaGenerica[] {
    return this._etiquetas;
  }
  public set etiquetas(v: TablaGenerica[]) {
    this._etiquetas = v;
  }

  // #endregion


  ngOnInit() {
    this.refrescar_lotes();
    this._tablaGenericaService.consultar(new TablaGenerica('ARCHIVOS', 'CLASIFICACION')).subscribe(tablas => {
      // tablas.forEach(tabla => {
      //   this.clasificaciones.push(tabla);
      // });
      this.clasificaciones = tablas;
      this._tablaGenericaService.consultar(new TablaGenerica('ARCHIVOS', 'ETIQUETA')).subscribe(rows => {
        this.etiquetas = rows;
        // console.log(this.etiquetas);
      });
    });
  }

  public refrescar_lotes() {
    const me = this;
    me.lotes = [];
    me.cargando = true;
    me._loteService.registros_no_procesados().subscribe(lotes => {
      me.cargando = false;
      me.lotes = lotes;
      const _lotes: string[] = [];
      me._lotesUnicos = [];
      me.lotes.forEach(lote => { _lotes.push(lote.lote_id); });
      $.each(_lotes, function (i, el) {
        if ($.inArray(el, me._lotesUnicos) === -1) {
          me._lotesUnicos.push(el);
        }
      });
    });
  }

  public refrescar_archivos() {
    if (this.lote === '') { return; }
    this.guardar = false;
    this.archivos = [];
    this.clasificacion = [];
    this.etiqueta = [];
    this.cargando = true;
    this._archivoService.registrosPorLote(this.lote).subscribe(archivos => {
      this.archivos = archivos;
      // console.log(this.archivos);
    });
  }

  public clasificar(archivo_id: string) {
    const clasificacion: string = $('#clasificacion' + archivo_id).val().toString();
    let existe = -1;
    for (let i = 0; i < this.clasificacion.length; i++) {
      const _tgen = this.clasificacion[i];
      if (_tgen.codigo === archivo_id) {
        existe = i;
      }
    }
    if (existe > -1) {
      this.clasificacion.splice(existe);
    }
    if (clasificacion === '') { return; }
    const tgen: TablaGenerica = new TablaGenerica();
    tgen.tabla = 'ARCHIVO';
    tgen.campo = 'CLASIFICADO';
    tgen.codigo = archivo_id;
    tgen.dato = clasificacion;
    this.clasificaciones.forEach(element => {
      if (element.codigo === clasificacion) {
        tgen.observacion = element.observacion;
      }
    });
    this.clasificacion.push(tgen);
    this.revisar();
  }

  public etiquetar(archivo_id: string) {
    const etiqueta: string = $('#etiqueta' + archivo_id).val().toString();
    let existe = -1;
    for (let i = 0; i < this.etiqueta.length; i++) {
      const _tgen = this.etiqueta[i];
      if (_tgen.codigo === archivo_id) {
        existe = i;
      }
    }
    if (existe > -1) {
      this.etiqueta.splice(existe);
    }
    if (etiqueta === '') { return; }
    const tgen: TablaGenerica = new TablaGenerica();
    tgen.tabla = 'ARCHIVO';
    tgen.campo = 'ETIQUETADO';
    tgen.codigo = archivo_id;
    tgen.dato = etiqueta;
    this.etiqueta.push(tgen);

    this.revisar();
  }

  public abrirArchivo(source: string) {
    const win = window.open();
    win.document.write('<iframe width="100%" height="100%" src="' + source + '" frameborder="0" allowfullscreen></iframe>');
    return false;
  }

  private revisar() {
    if (this.archivos.length === this.clasificacion.length && this.archivos.length === this.etiqueta.length) {
      this.guardar = true;
    } else {
      this.guardar = false;
    }
    // console.log('this.archivos.length: ', this.archivos.length);
    // console.log('this.clasificacion.length: ', this.clasificacion.length);
    // console.log('this.etiqueta.length: ', this.etiqueta.length);
    // console.log(this.clasificacion);
    // console.log(this.etiqueta);
  }

  public guardar_cambios() {
    // this.clasificacion.forEach(tgen => {
    //   this._tablaGenericaService.nuevoRegistro(tgen).subscribe(exito => {
    //     this._helper.Notificacion('Archivo ' + tgen.codigo + ' clasificado en la base de datos');
    //   });
    // });
    this.cargando = true;
    this.archivos.forEach(archivo => {
      let arc_a_clasificar: TablaGenerica = new TablaGenerica();
      let arc_a_etiquetar: TablaGenerica = new TablaGenerica();
      this.clasificacion.forEach(element => {
        if (archivo.archivo_id === element.codigo) {
          arc_a_clasificar = element;
        }
      });
      this.etiqueta.forEach(element => {
        if (archivo.archivo_id === element.codigo) {
          arc_a_etiquetar = element;
        }
      });
      this._tablaGenericaService.nuevoRegistro(arc_a_clasificar).subscribe(clasificado => {
        if (clasificado) {
          this._tablaGenericaService.nuevoRegistro(arc_a_etiquetar).subscribe(etiquetado => {
            this.cargando = false;
            if (etiquetado) {
              this._helper.Notificacion('Archivo ' + archivo.nombre + ' clasificado y etiquetado correctamente');
            } else {
              // TODO
            }
          });
        } else {
          // TODO
        }
      });
    });
    // this.refrescar_lotes();
    // this._helper.Prompt('Archivos etiquetados y ')
    // this._router.navigate(['archivos/cargar']);
    const me = this;
    me._helper.Prompt(
      'Archivos actualizados',
      'Los archivos fueron etiquetados y clasificados correctamente.',
      'success'
    ).then((result2) => {
      me._router.navigate(['escritorio/./archivos/cargar']);
    });
  }

  validar(archivo_id: string) {
    const codigo = $('#etiqueta' + archivo_id).val();
    this.archivos.forEach(archivo => {
      if (archivo.archivo_id !== archivo_id) {
        const valor = $('#etiqueta' + archivo.archivo_id).val();
        if (valor === codigo) {
          $('#etiqueta' + archivo_id).val('');
        }
      }
    });
  }
}
