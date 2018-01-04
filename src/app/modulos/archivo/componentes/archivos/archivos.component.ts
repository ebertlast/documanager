import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';
import { Helper } from '../../../../app-helper';
import { ArchivoService } from '../../servicios/archivo.service';
import { Archivo } from '../../modelos/archivo';
import { Router } from '@angular/router';
import { Tercero } from '../../../generico/modelos/tercero';
import { TerceroService } from '../../../generico/servicios/tercero.service';
import { Sede } from '../../../generico/modelos/sede';
import { SedeService } from '../../../generico/servicios/sede.service';
import { TablaGenerica } from '../../../generico/modelos/tabla-generica';
@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.css']
})
export class ArchivosComponent implements OnInit {
  cargando = false;
  constructor(
    private _helper: Helper,
    private _archivoService: ArchivoService,
    private _router: Router,
    private _terceroService: TerceroService,
    private _sedeService: SedeService,
  ) { }


  // #region Metodos de obtención y establecimiento de valores
  private _archivos: Archivo[] = [];
  public get archivos(): Archivo[] {
    return this._archivos;
  }
  public set archivos(v: Archivo[]) {
    this._archivos = v;
  }

  private _terceros: Tercero[] = [];
  public get terceros(): Tercero[] {
    return this._terceros;
  }
  public set terceros(v: Tercero[]) {
    this._terceros = v;
  }

  private _tercero: Tercero = new Tercero();
  public get tercero(): Tercero {
    return this._tercero;
  }
  public set tercero(v: Tercero) {
    this._tercero = v;
  }

  private _sedes: Sede[] = [];
  public get sedes(): Sede[] {
    return this._sedes;
  }
  public set sedes(v: Sede[]) {
    this._sedes = v;
  }

  private _sede: Sede = new Sede();
  public get sede(): Sede {
    return this._sede;
  }
  public set sede(v: Sede) {
    this._sede = v;
  }

  private _clasificaciones: TablaGenerica[] = [];
  public get clasificaciones(): TablaGenerica[] {
    return this._clasificaciones;
  }
  public set clasificaciones(v: TablaGenerica[]) {
    this._clasificaciones = v;
  }

  private _etiquetas: TablaGenerica[] = [];
  public get etiquetas(): TablaGenerica[] {
    return this._etiquetas;
  }
  public set etiquetas(v: TablaGenerica[]) {
    this._etiquetas = v;
  }




  // #endregion

  // #region DataTable
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  /**
   * Usamos este disparador porque recuperar la lista de registros puede ser bastante largo,
   * por lo tanto, aseguramos que los datos se obtienen antes de la representación
   */
  dtTrigger: Subject<any> = new Subject();
  aux = 0;
  someClickHandler(_archivo: any): void {
    const archivo_id = _archivo[0];
    if (archivo_id === '') { return; }
    this._router.navigate(['escritorio/escritorio/archivo', archivo_id]);
    // this.cargando = true;
    // this._archivoService.registros(archivo_id).subscribe(archivos => {
    //   this.cargando=false;
    //   let archivo = new Archivo();
    //   archivos.forEach(_arch => {
    //     archivo = _arch;
    //   });
    //   console.log(archivo);
    // });

  }
  // #endregion

  ngOnInit() {
    this.dtOptions = {
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
      // columns: [{
      //   title: 'Tipo',
      //   data: 'TipoID'
      // }, {
      //   title: 'Identificación',
      //   data: 'NumeroIdentificacion'
      // }, {
      //   title: 'Razón Social',
      //   data: 'RazonSocial'
      // }, {
      //   title: 'Dirección Fiscal',
      //   data: 'DireccionFiscal'
      // }, {
      //   title: 'Email',
      //   data: 'Email'
      // }, {
      //   title: 'Teléfono',
      //   data: 'Telefono'
      // }
      // ],
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

    this.refrescar_archivos();

    this._terceroService.registros().subscribe(terceros => {
      this.terceros = terceros;
      // console.log(this.terceros);
    });

  }



  refrescar_archivos() {
    this.cargando = true;
    this._archivoService.registros().subscribe(archivos => {
      this.archivos = archivos;
      // console.log(this.archivos);
      if (this.aux === 0) {
        this.aux++;
        this.dtTrigger.next();
      } else {
        this.rerender();
      }
      this.cargando = false;
    });
  }

  refrescar_sedes() {
    if (this.tercero.identificacion === '') { return; }
    this.sedes = [];
    this.cargando = true;
    this._sedeService.registros_por_identificacion(this.tercero.tipo_id, this.tercero.identificacion).subscribe(sedes => {
      this.sedes = sedes;
      console.log(this.sedes);
    });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

}
