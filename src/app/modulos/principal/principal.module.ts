import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrincipalRoutingModule } from './principal-routing.module';
import { EscritorioComponent } from './componentes/escritorio/escritorio.component';
import { ArchivoModule } from '../archivo/archivo.module';

@NgModule({
  imports: [
    CommonModule,
    PrincipalRoutingModule,
    ArchivoModule
  ],
  declarations: [EscritorioComponent]
})
export class PrincipalModule { }
