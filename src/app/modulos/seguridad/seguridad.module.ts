import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeguridadRoutingModule } from './seguridad-routing.module';
import { AuthService } from './servicios/auth.service';
import { IngresarComponent } from './componentes/ingresar/ingresar.component';
import { FormsModule } from '@angular/forms';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { GenericoModule } from '../generico/generico.module';
import { UsuarioService } from './servicios/usuario.service';
import { GruposComponent } from './grupos/grupos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { GrupoService } from './servicios/grupo.service';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  imports: [
    CommonModule,
    SeguridadRoutingModule,
    FormsModule,
    GenericoModule,
    DataTablesModule
  ],
  exports: [GruposComponent, UsuariosComponent, PerfilComponent],
  declarations: [IngresarComponent, PerfilComponent, GruposComponent, UsuariosComponent],
  providers: [AuthService, UsuarioService, GrupoService]
})
export class SeguridadModule { }
