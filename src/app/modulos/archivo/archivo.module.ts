import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArchivoRoutingModule } from './archivo-routing.module';
import { ArchivoCargarComponent } from './componentes/archivo-cargar/archivo-cargar.component';
import { ArchivoService } from './servicios/archivo.service';
import { ArchivosComponent } from './componentes/archivos/archivos.component';
import { DataTablesModule } from 'angular-datatables';
import { GenericoModule } from '../generico/generico.module';
import { ArchivoComponent } from './componentes/archivo/archivo.component';
import { Archivo } from './modelos/archivo';
import { LotesComponent } from './componentes/lotes/lotes.component';
import { ImageZoomModule } from 'angular2-image-zoom';
import { LoteService } from './servicios/lote.service';
import { FormsModule } from '@angular/forms';
import { EtiquetasComponent } from './componentes/etiquetas/etiquetas.component';
import { ResumenComponent } from './componentes/resumen/resumen.component';

@NgModule({
  imports: [
    CommonModule,
    ArchivoRoutingModule,
    DataTablesModule,
    GenericoModule,
    ImageZoomModule,
    FormsModule
  ],
  exports: [
    ArchivoCargarComponent, ArchivosComponent, ArchivoComponent, LotesComponent, EtiquetasComponent, ResumenComponent
  ],
  declarations: [ArchivoCargarComponent, ArchivosComponent, ArchivoComponent, LotesComponent, EtiquetasComponent, ResumenComponent],
  providers: [ArchivoService, LoteService]
})
export class ArchivoModule { }
