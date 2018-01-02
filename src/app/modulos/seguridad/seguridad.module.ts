import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguridadRoutingModule } from './seguridad-routing.module';
import { AuthService } from './servicios/auth.service';
import { IngresarComponent } from './componentes/ingresar/ingresar.component';
import { FormsModule } from '@angular/forms';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { GenericoModule } from '../generico/generico.module';
import { UsuarioService } from './servicios/usuario.service';

@NgModule({
  imports: [
    CommonModule,
    SeguridadRoutingModule,
    FormsModule,
    GenericoModule
  ],
  declarations: [IngresarComponent, PerfilComponent],
  providers: [AuthService, UsuarioService]
})
export class SeguridadModule { }
