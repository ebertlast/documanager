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
import { SedesComponent } from './componentes/sedes/sedes.component';
import { TipoDocumentoService } from './servicios/tipo-documento.service';
import { SerieService } from './servicios/serie.service';
import { SeriesComponent } from './componentes/series/series.component';
import { SubserieService } from './servicios/subserie.service';
import { SubseriesComponent } from './componentes/subseries/subseries.component';
import { ConvencionesComponent } from './componentes/convenciones/convenciones.component';
import { ConvencionService } from './servicios/convencion.service';
import { TipoService } from './servicios/tipo.service';
import { TiposComponent } from './componentes/tipos/tipos.component';
import { DisposicionService } from './servicios/disposicion.service';
import { ElegirTipoDocumentoComponent } from './componentes/elegir-tipo-documento/elegir-tipo-documento.component';
import { TablaRetencionComponent } from './componentes/tabla-retencion/tabla-retencion.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DataTablesModule
  ],
  exports: [
    CapitalizarPipe, FechaPipe, FiltrarPipe, SafePipe, TercerosComponent, TablasComponent, SedesComponent,
    SeriesComponent, SubseriesComponent, ConvencionesComponent, ElegirTipoDocumentoComponent, TablaRetencionComponent
  ],
  declarations: [CapitalizarPipe, FechaPipe, FiltrarPipe, SafePipe, TercerosComponent,
    TablasComponent, FechacortaPipe, SedesComponent, SeriesComponent, SubseriesComponent,
    ConvencionesComponent, TiposComponent, ElegirTipoDocumentoComponent, TablaRetencionComponent],
  providers: [PagerService, TablaGenericaService, TerceroService, SedeService, TipoDocumentoService,
    SerieService, SubserieService, ConvencionService, TipoService, DisposicionService]
})
export class GenericoModule { }
