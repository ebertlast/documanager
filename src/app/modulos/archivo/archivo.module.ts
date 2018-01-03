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

@NgModule({
  imports: [
    CommonModule,
    ArchivoRoutingModule,
    DataTablesModule,
    GenericoModule
  ],
  exports: [
    ArchivoCargarComponent, ArchivosComponent, ArchivoComponent, LotesComponent
  ],
  declarations: [ArchivoCargarComponent, ArchivosComponent, ArchivoComponent, LotesComponent],
  providers: [ArchivoService]
})
export class ArchivoModule { }
