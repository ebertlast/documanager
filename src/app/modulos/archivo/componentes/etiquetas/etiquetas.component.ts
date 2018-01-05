import { Component, OnInit, ViewChild } from '@angular/core';
import { Helper } from '../../../../app-helper';
import { TablaGenericaService } from '../../../generico/servicios/tabla-generica.service';
import { TablaGenerica } from '../../../generico/modelos/tabla-generica';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-etiquetas',
  templateUrl: './etiquetas.component.html',
  styleUrls: ['./etiquetas.component.css']
})
export class EtiquetasComponent implements OnInit {
  texto_etiqueta = '';
  cargando = false;
  public texto_propiedad = '';
  public codigo_propiedad = '';
  constructor(
    private _helper: Helper,
    private _tablaGenericaService: TablaGenericaService
  ) { }

  // #region Metodos de obtención y establecimiento de valores

  private _etiquetas: TablaGenerica[] = [];
  public get etiquetas(): TablaGenerica[] {
    return this._etiquetas;
  }
  public set etiquetas(v: TablaGenerica[]) {
    this._etiquetas = v;
  }

  private _propiedades: TablaGenerica[] = [];
  public get propiedades(): TablaGenerica[] {
    return this._propiedades;
  }
  public set propiedades(v: TablaGenerica[]) {
    this._propiedades = v;
  }

  private _etiqueta: TablaGenerica = new TablaGenerica();
  public get etiqueta(): TablaGenerica {
    return this._etiqueta;
  }
  public set etiqueta(v: TablaGenerica) {
    this._etiqueta = v;
  }

  private _etiqueta_propiedades: TablaGenerica[] = [];
  public get etiqueta_propiedades(): TablaGenerica[] {
    return this._etiqueta_propiedades;
  }
  public set etiqueta_propiedades(v: TablaGenerica[]) {
    this._etiqueta_propiedades = v;
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
    // console.log(_row);
    this.etiqueta = new TablaGenerica();
    this.etiqueta.tabla = _row[0];
    this.etiqueta.campo = _row[1];
    this.etiqueta.codigo = _row[2];
    this.etiqueta.tipo = _row[3];
    this.etiqueta.dato = _row[4];
    this.etiqueta.cantidad = 1 * _row[5];
    this.etiqueta.valor = 1 * _row[6];
    this.etiqueta.observacion = _row[7];
    // this.etiqueta.grupo_id = this.grupo_id;
    // this.editar = true;
    // console.log(this.etiqueta);
    this.refrescar_propiedades();
  }
  // #endregion


  ngOnInit() {
    const me = this;
    $('#texto_etiqueta').on('keypress', function (e) {
      if (e.keyCode === 13) {
        me.agregar_etiqueta();
      }
    });
    me.refrescar_etiquetas();
    const tgen: TablaGenerica = new TablaGenerica();
    tgen.tabla = 'ARCHIVOS';
    tgen.campo = 'PROPIEDAD';
    me._tablaGenericaService.consultar(tgen).subscribe(registros => {
      this.propiedades = registros;
      // console.log(this.propiedades);
    });
  }

  agregar_etiqueta() {
    const me = this;
    if (me.texto_etiqueta === '') {
      $('#texto_etiqueta').focus();
      return;
    }
    me.cargando = true;
    const tgen: TablaGenerica = new TablaGenerica();
    tgen.tabla = 'ARCHIVOS';
    tgen.campo = 'ETIQUETA';
    tgen.codigo = me.texto_etiqueta.toUpperCase();
    tgen.cantidad = 0;
    me._tablaGenericaService.nuevoRegistro(tgen).subscribe(registrado => {
      if (registrado) {
        me._helper.Notificacion('Etiqueta agregada');
        me.cargando = false;
        me.texto_etiqueta = '';
        $('#texto_etiqueta').focus();
        me.refrescar_etiquetas();
      } else {
        me._helper.Notificacion('Vuelve a intentarlo.', 'Etiqueta no registrada', 'error');
      }
    });
    // me._helper.Sleep(1500).then(() => {
    //   me._helper.Notificacion('Etiqueta agregada');
    //   me.cargando = false;
    //   me.texto_etiqueta = '';
    //   $('#texto_etiqueta').focus();
    //   me.refrescar_etiquetas();
    // });
  }

  refrescar_etiquetas() {
    const me = this;
    me.cargando = true;
    const tgen: TablaGenerica = new TablaGenerica();
    tgen.tabla = 'ARCHIVOS';
    tgen.campo = 'ETIQUETA';
    tgen.cantidad = 0;
    me._tablaGenericaService.consultar(tgen).subscribe(registros => {
      this.etiquetas = registros;
      // console.log(this.etiquetas);
      this.cargando = false;
      this.rerender();
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

  agregar_propiedad() {
    if (this.codigo_propiedad === '') {
      $('#codigo_propiedad').focus();
      return;
    }
    if (this.texto_propiedad === '') {
      $('#texto_propiedad').focus();
      return;
    }
    const tgen: TablaGenerica = new TablaGenerica();
    tgen.tabla = 'ETIQUETA';
    tgen.campo = this.etiqueta.codigo.toUpperCase();
    tgen.codigo = this.codigo_propiedad.toUpperCase();
    tgen.dato = this.texto_propiedad.toUpperCase();
    this._tablaGenericaService.nuevoRegistro(tgen).subscribe(registrado => {
      if (registrado) {
        this.texto_propiedad = '';
        this.codigo_propiedad = '';
        $('codigo_propiedad').focus();
        this._helper.Notificacion('Propiedad agregada a la etiqueta');
        this.refrescar_propiedades();
      }
    });
  }

  refrescar_propiedades() {
    if (this.etiqueta.codigo === '') { return; }
    const tgen: TablaGenerica = new TablaGenerica();
    tgen.tabla = 'ETIQUETA';
    tgen.campo = this.etiqueta.codigo;
    this._tablaGenericaService.consultar(tgen).subscribe(propiedades => {
      this.etiqueta_propiedades = propiedades;
      // console.log(this.etiqueta_propiedades);
    });
  }

  eliminar_propiedad(codigo: string) {
    const me = this;
    const tgen: TablaGenerica = new TablaGenerica();
    tgen.tabla = 'ETIQUETA';
    tgen.campo = this.etiqueta.codigo.toUpperCase();
    tgen.codigo = codigo;
    // console.log(tgen);
    me._helper.Prompt('Confirme que desea realmente eliminar la propiedad', '', 'warning').then((result) => {
      if (result.value) {
        this._tablaGenericaService.eliminarRegistro(tgen.tabla, tgen.campo, tgen.codigo).subscribe(exito => {
          if (exito) {
            this.refrescar_propiedades();
            me._helper.Prompt('Propiead de la etiqueta eliminada', '').then(() => {
            });
          } else {
            me._helper.Prompt('No se ha podido eliminar la propiedad de la etiqueta', 'Vuelve a intentarlo', 'error');
          }
        });
      } else if (result.dismiss === 'cancel') {
        me._helper.Prompt('Eliminación cancelada', '', 'error');
      }
    });
    return false;
  }

}
