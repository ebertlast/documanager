import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizarPipe } from './pipes/capitalizar.pipe';
import { FechaPipe } from './pipes/fecha.pipe';
import { FiltrarPipe } from './pipes/filtrar.pipe';
import { SafePipe } from './pipes/safe.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    CapitalizarPipe, FechaPipe, FiltrarPipe, SafePipe
  ],
  declarations: [CapitalizarPipe, FechaPipe, FiltrarPipe, SafePipe]
})
export class GenericoModule { }
