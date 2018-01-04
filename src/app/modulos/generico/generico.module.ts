import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizarPipe } from './pipes/capitalizar.pipe';
import { FechaPipe } from './pipes/fecha.pipe';
import { FiltrarPipe } from './pipes/filtrar.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { TercerosComponent } from './componentes/terceros/terceros.component';
import { PagerService } from './servicios/pager.service';
import { TablasComponent } from './componentes/tablas/tablas.component';
import { TablaGenericaService } from './servicios/tabla-generica.service';
import { TerceroService } from './servicios/tercero.service';
import { SedeService } from './servicios/sede.service';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { FechacortaPipe } from './pipes/fechacorta.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule
  ],
  exports: [
    CapitalizarPipe, FechaPipe, FiltrarPipe, SafePipe, TercerosComponent, TablasComponent
  ],
  declarations: [CapitalizarPipe, FechaPipe, FiltrarPipe, SafePipe, TercerosComponent, TablasComponent, FechacortaPipe],
  providers: [PagerService, TablaGenericaService, TerceroService, SedeService]
})
export class GenericoModule { }
