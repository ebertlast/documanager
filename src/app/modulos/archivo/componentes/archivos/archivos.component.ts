import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';
import { Helper } from '../../../../app-helper';
import { ArchivoService } from '../../servicios/archivo.service';
import { Archivo } from '../../modelos/archivo';
import { Router } from '@angular/router';

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
    private _router: Router
  ) { }


  // #region Metodos de obtención y establecimiento de valores
  private _archivos: Archivo[] = [];
  public get archivos(): Archivo[] {
    return this._archivos;
  }
  public set archivos(v: Archivo[]) {
    this._archivos = v;
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

    this.refrescarArchivos();
  }


  refrescarArchivos() {
    this.cargando = true;
    this._archivoService.registros().subscribe(archivos => {
      this.archivos = archivos;
      console.log(this.archivos);
      if (this.aux === 0) {
        this.aux++;
        this.dtTrigger.next();
      } else {
        this.rerender();
      }
      this.cargando = false;
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
