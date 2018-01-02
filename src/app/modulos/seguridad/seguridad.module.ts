import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguridadRoutingModule } from './seguridad-routing.module';
import { AuthService } from './servicios/auth.service';
import { IngresarComponent } from './componentes/ingresar/ingresar.component';
import { FormsModule } from '@angular/forms';
import { PerfilComponent } from './componentes/perfil/perfil.component';

@NgModule({
  imports: [
    CommonModule,
    SeguridadRoutingModule,
    FormsModule
  ],
  declarations: [IngresarComponent, PerfilComponent],
  providers: [AuthService]
})
export class SeguridadModule { }
