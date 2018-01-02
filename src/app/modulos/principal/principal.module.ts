import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrincipalRoutingModule } from './principal-routing.module';
import { EscritorioComponent } from './componentes/escritorio/escritorio.component';
import { ArchivoModule } from '../archivo/archivo.module';
import { GenericoModule } from '../generico/generico.module';
import { SeguridadModule } from '../seguridad/seguridad.module';

@NgModule({
  imports: [
    CommonModule,
    PrincipalRoutingModule,
    ArchivoModule,
    GenericoModule,
    SeguridadModule
  ],
  declarations: [EscritorioComponent]
})
export class PrincipalModule { }
