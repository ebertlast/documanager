import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArchivoRoutingModule } from './archivo-routing.module';
import { ArchivoCargarComponent } from './componentes/archivo-cargar/archivo-cargar.component';

@NgModule({
  imports: [
    CommonModule,
    ArchivoRoutingModule
  ],
  exports: [
    ArchivoCargarComponent
  ],
  declarations: [ArchivoCargarComponent]
})
export class ArchivoModule { }
