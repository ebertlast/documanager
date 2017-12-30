import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './app-authguard';

const routes: Routes = [
  {
    path: '',
    children: [
      // { path: 'portal', loadChildren: 'app/modulos/portal/portal.module#PortalModule' },
      // { path: 'seguridad', loadChildren: 'app/modulos/seguridad/seguridad.module#SeguridadModule', canActivate: [AuthGuard] },
      { path: 'escritorio', loadChildren: 'app/modulos/principal/principal.module#PrincipalModule', canActivate: [AuthGuard] },
    ], canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
