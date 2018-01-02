import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EscritorioComponent } from './componentes/escritorio/escritorio.component';
import { AuthGuard } from '../../app-authguard';
import { ArchivoCargarComponent } from '../archivo/componentes/archivo-cargar/archivo-cargar.component';
import { PerfilComponent } from '../seguridad/componentes/perfil/perfil.component';

const routes: Routes = [
  { path: '', redirectTo: 'escritorio', pathMatch: 'full' },
  {
    path: 'escritorio', component: EscritorioComponent, canActivate: [AuthGuard], children: [
      // { path: 'consultas', component: ConsultasComponent, canActivate: [AuthGuard] }
      { path: '', redirectTo: 'archivo/cargar', pathMatch: 'full' },
      { path: 'archivo/cargar', component: ArchivoCargarComponent, canActivate: [AuthGuard] },
      { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
      { path: '**', redirectTo: 'archivo/cargar' }
    ],
  },
  { path: '**', redirectTo: 'escritorio' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalRoutingModule { }
