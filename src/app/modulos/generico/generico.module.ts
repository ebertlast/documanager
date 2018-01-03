import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizarPipe } from './pipes/capitalizar.pipe';
import { FechaPipe } from './pipes/fecha.pipe';
import { FiltrarPipe } from './pipes/filtrar.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { TercerosComponent } from './componentes/terceros/terceros.component';
import { PagerService } from './servicios/pager.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    CapitalizarPipe, FechaPipe, FiltrarPipe, SafePipe, TercerosComponent
  ],
  declarations: [CapitalizarPipe, FechaPipe, FiltrarPipe, SafePipe, TercerosComponent],
  providers: [PagerService]
})
export class GenericoModule { }