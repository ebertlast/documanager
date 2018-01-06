import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { TablaGenericaService } from '../../servicios/tabla-generica.service';
import { TablaGenerica } from '../../modelos/tabla-generica';
import { DataTableDirective } from 'angular-datatables';
import { Helper } from '../../../../app-helper';
import { AuthService } from '../../../seguridad/servicios/auth.service';

declare var $: any;
@Component({
  selector: 'app-tablas',
  templateUrl: './tablas.component.html',
  styleUrls: ['./tablas.component.css']
})
export class TablasComponent implements OnInit {
  cargando = false;
  editar = false;
  private grupo_id = '';
  constructor(
    private _tablaGenericaService: TablaGenericaService,
    private _helper: Helper,
    private _authService: AuthService
  ) {
    this.grupo_id = this._authService.Usuario().grupo_id;
  }

  // #region Metodos de obtención y establecimiento de valores

  private _tablas: string[] = [];
  public get tablas(): string[] {
    return this._tablas;
  }
  public set tablas(v: string[]) {
    this._tablas = v;
  }

  private _tabla = '';
  public get tabla(): string {
    return this._tabla;
  }
  public set tabla(v: string) {
    this._tabla = v;
  }

  private _campos: string[] = [];
  public get campos(): string[] {
    return this._campos;
  }
  public set campos(v: string[]) {
    this._campos = v;
  }

  private _campo = '';
  public get campo(): string {
    return this._campo;
  }
  public set campo(v: string) {
    this._campo = v;
  }

  private _codigos: string[] = [];
  public get codigos(): string[] {
    return this._codigos;
  }
  public set codigos(v: string[]) {
    this._codigos = v;
  }

  private _codigo = '';
  public get codigo(): string {
    return this._codigo;
  }
  public set codigo(v: string) {
    this._codigo = v;
  }

  private _tgen: TablaGenerica = new TablaGenerica();
  public get tgen(): TablaGenerica {
    return this._tgen;
  }
  public set tgen(v: TablaGenerica) {
    this._tgen = v;
  }

  private _tgens: TablaGenerica[] = [];
  public get tgens(): TablaGenerica[] {
    return this._tgens;
  }
  public set tgens(v: TablaGenerica[]) {
    this._tgens = v;
  }

  private _dato = '';
  public get dato(): string {
    return this._dato;
  }
  public set dato(v: string) {
    this._dato = v;
  }

  private _valor = 0;
  public get valor(): number {
    return this._valor;
  }
  public set valor(v: number) {
    this._valor = v;
  }

  private _cantidad = 0;
  public get cantidad(): number {
    return this._cantidad;
  }
  public set cantidad(v: number) {
    this._cantidad = v;
  }

  private _observacion = '';
  public get observacion(): string {
    return this._observacion;
  }
  public set observacion(v: string) {
    this._observacion = v;
  }


  private _tipo = '';
  public get tipo(): string {
    return this._tipo;
  }
  public set tipo(v: string) {
    this._tipo = v;
  }
  // #endregion

  // #region DataTable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 10,
    language: {
      lengthMenu: 'Mostrar _MENU_ registros por página',
      zeroRecords: 'Nada encontrado - intenta con otra palabra',
      info: 'Mostrando página _PAGE_ de _PAGES_',
      infoEmpty: 'No hay registros disponibles',
      infoFiltered: '(filtrado de _MAX_ registros en total)',
      search: 'Buscar:',
      paginate: {
        previous: 'Anterior',
        next: 'Siguiente',
        first: 'Primera',
        last: 'Última',
      },
      // buttons: {
      //   copy: 'Copiar',
      //   print: 'Imprimir',
      //   csv: 'CSV'
      // }
    },
    rowCallback: (row: Node, data: any[] | Object, index: number) => {
      const self = this;
      /**
       * Desvincular primero para evitar cualquier controlador duplicado
       * (mirar https://github.com/l-lin/angular-datatables/issues/87)
       */
      $('td', row).unbind('click');
      $('td', row).bind('click', () => {
        self.someClickHandler(data);
      });
      return row;
    },
    // Declare the use of the extension in the dom parameter
    // dom: 'Bfrtip',
    // Configure the buttons
    // buttons: [
    //   // 'columnsToggle',
    //   'colvis',
    //   'copy',
    //   'print',
    //   'excel',
    //   {
    //     text: 'Some button',
    //     key: '1',
    //     action: function (e, dt, node, config) {
    //       alert('Button activated');
    //     }
    //   }
    // ]
  };
  /**
   * Usamos este disparador porque recuperar la lista de registros puede ser bastante largo,
   * por lo tanto, aseguramos que los datos se obtienen antes de la representación
   */
  dtTrigger: Subject<any> = new Subject();
  aux = 0;
  someClickHandler(_row: any): void {
    console.log(_row);
    this.tgen = new TablaGenerica();
    this.tgen.tabla = _row[0];
    this.tgen.campo = _row[1];
    this.tgen.codigo = _row[2];
    this.tgen.tipo = _row[3];
    this.tgen.dato = _row[4];
    this.tgen.cantidad = 1 * _row[5];
    this.tgen.valor = 1 * _row[6];
    this.tgen.observacion = _row[7];
    this.tgen.grupo_id = this.grupo_id;
    this.editar = true;
    console.log(this.tgen);
  }
  // #endregion


  ngOnInit() {
    this.refrescar_tablas();
    const me = this;
    $('#tabla').on('change', function () { me.tabla = $('#tabla').val(); });
    $('#campo').on('change', function () { me.campo = $('#campo').val(); });
    $('#codigo').on('change', function () { me.codigo = $('#codigo').val(); });
    $('#codigo').on('change', function () { me.codigo = $('#codigo').val(); });
  }

  refrescar_tablas() {
    this.tablas = [];
    this.campos = [];
    this.campo = '';
    this._tablaGenericaService.solo_tablas().subscribe(tablas => {
      this.tablas.push('ARCHIVOS');
      tablas.forEach(tabla => {
        const _tabla: any = tabla;
        if (tabla !== 'ARCHIVOS') {
          this.tablas.push(_tabla.tabla);
        }
      });
      const me = this;
      $('#tabla').typeahead({
        source: me.tablas
      });
    });
  }
  refrescar_campos() {
    if (this.tabla === '') { return; }
    this.tabla = this.tabla.toUpperCase();
    this.campos = [];
    this.codigos = [];
    this.codigo = '';
    this._tablaGenericaService.solo_campos(this.tabla).subscribe(campos => {
      if (this.tabla === 'ARCHIVOS') {
        this.campos.push('CLASIFICACION');
        this.campos.push('PROPIEDAD');
      }
      campos.forEach(campo => {
        const _campo: any = campo;
        if (this.tabla === 'ARCHIVOS' && _campo !== 'CLASIFICACION' && _campo !== 'PROPIEDAD') {
          this.campos.push(_campo.campo);
        }
      });
      // console.log(this.campos);
      const me = this;
      $('#campo').typeahead({
        source: me.campos
      });
      me.consultar_tablas();
    });
  }
  refrescar_codigos() {
    if (this.campo === '') { return; }
    this.campo = this.campo.toUpperCase();
    this._tablaGenericaService.solo_codigos(this.tabla, this.campo).subscribe(codigos => {
      codigos.forEach(codigo => {
        const _codigo: any = codigo;
        this.codigos.push(_codigo.codigo);
      });
      // console.log(this.codigos);
      const me = this;
      $('#codigo').typeahead({
        source: me.codigos
      });
      me.consultar_tablas();
    });
  }
  consultar_tablas() {
    // console.log("Ebert")
    // console.log("Manuel")
    this.tgens = [];
    this.rerender();
    if (this.tabla === '' || this.campo === '') { return; }
    this._tablaGenericaService.codigos(this.tabla, this.campo, this.codigo).subscribe(tgens => {
      this.tgens = tgens;
      this.rerender();
      this.cargando = false;
    });
  }

  rerender(): void {
    if (this.aux === 0) {
      this.aux++;
      this.dtTrigger.next();
    } else {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    }
  }

  cancelar() {
    this.tgen = new TablaGenerica();
    this.editar = false;
  }
  borrar() {
    const me = this;
    me._helper.Prompt('Confirme que desea realmente eliminar el registro',
      'Ésta acción no podrá deshacerse', 'warning')
      .then((result) => {
        if (result.value) {
          me.cargando = true;
          me._tablaGenericaService.eliminarRegistro(me.tgen.tabla, me.tgen.campo, me.tgen.codigo).subscribe(borrado => {
            if (borrado) {

              // me.refrescar_tablas();
              me.refrescar_codigos();
              // me.consultar_tablas();
              me.editar = false;

              me._helper.Prompt(
                'Registro borrado',
                'El registro se ha borrado de la base de datos.',
                'success'
              ).then((result2) => {
                // me.cancelar();
              });
            } else {
              me._helper.Prompt(
                'Error',
                'El registro no se ha borrado. Vuelve a intentarlo.',
                'error'
              );
            }
          });

        } else if (result.dismiss === 'cancel') {
          me.cargando = false;
          me._helper.Prompt(
            'Cancelado',
            'El registro no se ha borrado',
            'error'
          );
        }
      });
  }
  guardar() {
    const me = this;
    me.tgen.tabla = $('#tabla').val();
    me.tgen.campo = $('#campo').val();
    me.tgen.codigo = $('#codigo').val();
    me.tgen.tabla = me.tgen.tabla.toUpperCase();
    me.tgen.campo = me.tgen.campo.toUpperCase();
    me.tgen.codigo = me.tgen.codigo.toUpperCase();
    me.tgen.observacion = me.tgen.observacion.toUpperCase();
    me.tgen.dato = me.tgen.dato.toUpperCase();
    if (me.tgen.tabla === '') { $('#tabla').focus(); return; }
    if (me.tgen.campo === '') { $('#campo').focus(); return; }
    if (me.tgen.codigo === '') { $('#codigo').focus(); return; }

    if (me.editar) {
      me._tablaGenericaService.actualizarRegistro(this.tgen).subscribe(actualizado => {
        me._helper.Prompt('Registro guardado', 'Registro actualizado en la base de datos');
        me.refrescar_codigos();
        me.cancelar();
      });
    } else {
      me._tablaGenericaService.nuevoRegistro(this.tgen).subscribe(actualizado => {
        me._helper.Prompt('Registro guardado', 'Registro nuevo guardado en la base de datos');
        me.refrescar_tablas();
        me.refrescar_codigos();
        me.cancelar();
      });
    }

  }
}
