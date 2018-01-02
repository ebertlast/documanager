import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArchivoRoutingModule } from './archivo-routing.module';
import { ArchivoCargarComponent } from './componentes/archivo-cargar/archivo-cargar.component';
import { ArchivoService } from './servicios/archivo.service';

@NgModule({
  imports: [
    CommonModule,
    ArchivoRoutingModule
  ],
  exports: [
    ArchivoCargarComponent
  ],
  declarations: [ArchivoCargarComponent],
  providers: [ArchivoService]
})
export class ArchivoModule { }
