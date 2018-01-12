import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TerceroService } from '../../servicios/tercero.service';
import { SedeService } from '../../servicios/sede.service';
import { SerieService } from '../../servicios/serie.service';
import { SubserieService } from '../../servicios/subserie.service';
import { TipoService } from '../../servicios/tipo.service';
import { Sede } from '../../modelos/sede';
import { Serie } from '../../modelos/serie';
import { Subserie } from '../../modelos/subserie';
import { Tipo } from '../../modelos/tipo';
import { Tercero } from '../../modelos/tercero';

@Component({
  selector: 'app-elegir-tipo-documento',
  templateUrl: './elegir-tipo-documento.component.html',
  styleUrls: ['./elegir-tipo-documento.component.css']
})
export class ElegirTipoDocumentoComponent implements OnInit {
  cargando = false;
  btnminimizar = '';
  @Output() EnviarTipoDocumental = new EventEmitter();
  constructor(
    private _terceroService: TerceroService,
    private _sedeService: SedeService,
    private _serieService: SerieService,
    private _subserieService: SubserieService,
    private _tipoService: TipoService,
  ) { }

  // #region Metodos de Obtención y establecimiento de valores
  private _entidades: Tercero[] = [];
  public get entidades(): Tercero[] {
    return this._entidades;
  }
  public set entidades(v: Tercero[]) {
    this._entidades = v;
  }

  private _entidad: Tercero = new Tercero();
  public get entidad(): Tercero {
    return this._entidad;
  }
  public set entidad(v: Tercero) {
    this._entidad = v;
  }

  private _oficinas: Sede[] = [];
  public get oficinas(): Sede[] {
    return this._oficinas;
  }
  public set oficinas(v: Sede[]) {
    this._oficinas = v;
  }

  private _oficina: Sede = new Sede();
  public get oficina(): Sede {
    return this._oficina;
  }
  public set oficina(v: Sede) {
    this._oficina = v;
  }

  private _series: Serie[] = [];
  public get series(): Serie[] {
    return this._series;
  }
  public set series(v: Serie[]) {
    this._series = v;
  }

  private _serie: Serie = new Serie();
  public get serie(): Serie {
    return this._serie;
  }
  public set serie(v: Serie) {
    this._serie = v;
  }

  private _subseries: Subserie[] = [];
  public get subseries(): Subserie[] {
    return this._subseries;
  }
  public set subseries(v: Subserie[]) {
    this._subseries = v;
  }

  private _subserie: Subserie = new Subserie();
  public get subserie(): Subserie {
    return this._subserie;
  }
  public set subserie(v: Subserie) {
    this._subserie = v;
  }

  private _tipodocumentos: Tipo[] = [];
  public get tipodocumentos(): Tipo[] {
    return this._tipodocumentos;
  }
  public set tipodocumentos(v: Tipo[]) {
    this._tipodocumentos = v;
  }

  private _tipodocumento: Tipo = new Tipo();
  public get tipodocumento(): Tipo {
    return this._tipodocumento;
  }
  public set tipodocumento(v: Tipo) {
    this._tipodocumento = v;
  }
  // #endregion

  ngOnInit() {
    this.cargando = true;
    this._terceroService.registros().subscribe(entidades => {
      this.cargando = false;
      this.entidades = entidades;
    });
    this.btnminimizar = (Math.floor(Math.random() * 999999)).toString();
  }

  refrescar_oficinas() {
    this.cargando = true;
    this._sedeService.registros_por_identificacion(this.entidad.tipo_id, this.entidad.identificacion)
      .subscribe(oficinas => {
        this.cargando = false;
        this.oficinas = oficinas;
      });
  }

  refrescar_series() {
    this.cargando = true;
    this._serieService.consultar(new Serie('', '', this.oficina.tipo_id, this.oficina.identificacion, this.oficina.sede_id))
      .subscribe(series => {
        this.cargando = false;
        this.series = series;
        // console.log(this.series);
      });
  }

  refrescar_subseries() {
    this.cargando = true;
    this._subserieService.registros(new Subserie(-1, '', '', this.serie.serie_id, '',
      this.serie.tipo_id, this.serie.identificacion, this.serie.sede_id))
      .subscribe(subseries => {
        this.cargando = false;
        this.subseries = subseries;
        // console.log(this.subseries);
      });
  }

  refrescar_tipo_documentos() {
    this.cargando = true;
    this._tipoService.registros(new Tipo('', '', this.subserie.consecutivo)).subscribe(tipos_documentos => {
      this.cargando = false;
      this.tipodocumentos = tipos_documentos;
      // console.log(this.tipodocumentos);
    });
  }

  enviar_tipo_documental(event) {
    this.EnviarTipoDocumental.emit({ tipo_documental: this.tipodocumento });
    $('#' + this.btnminimizar).click();
  }

}
