import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EscritorioComponent } from './componentes/escritorio/escritorio.component';
import { AuthGuard } from '../../app-authguard';
import { ArchivoCargarComponent } from '../archivo/componentes/archivo-cargar/archivo-cargar.component';
import { PerfilComponent } from '../seguridad/componentes/perfil/perfil.component';
import { TercerosComponent } from '../generico/componentes/terceros/terceros.component';
import { ArchivosComponent } from '../archivo/componentes/archivos/archivos.component';
import { ArchivoComponent } from '../archivo/componentes/archivo/archivo.component';
import { LotesComponent } from '../archivo/componentes/lotes/lotes.component';
import { TablasComponent } from '../generico/componentes/tablas/tablas.component';
import { SedesComponent } from '../generico/componentes/sedes/sedes.component';
import { EtiquetasComponent } from '../archivo/componentes/etiquetas/etiquetas.component';
import { UsuariosComponent } from '../seguridad/usuarios/usuarios.component';
import { GruposComponent } from '../seguridad/grupos/grupos.component';
import { ResumenComponent } from '../archivo/componentes/resumen/resumen.component';
import { SeriesComponent } from '../generico/componentes/series/series.component';

const routes: Routes = [
  { path: '', redirectTo: '.', pathMatch: 'full' },
  {
    path: '.', component: EscritorioComponent, canActivate: [AuthGuard], children: [
      // { path: 'consultas', component: ConsultasComponent, canActivate: [AuthGuard] }
      { path: '', redirectTo: 'archivos/listado', pathMatch: 'full' },
      { path: 'archivos/cargar', component: ArchivoCargarComponent, canActivate: [AuthGuard] },
      { path: 'archivos/listado', component: ArchivosComponent, canActivate: [AuthGuard] },
      { path: 'archivo/:archivo_id', component: ArchivoComponent, canActivate: [AuthGuard] },
      { path: 'archivos/lotes', component: LotesComponent, canActivate: [AuthGuard] },
      { path: 'archivos/etiquetas', component: EtiquetasComponent, canActivate: [AuthGuard] },
      { path: 'archivos/resumen', component: ResumenComponent, canActivate: [AuthGuard] },
      { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
      { path: 'terceros', component: TercerosComponent, canActivate: [AuthGuard] },
      { path: 'sedes', component: SedesComponent, canActivate: [AuthGuard] },
      { path: 'series', component: SeriesComponent, canActivate: [AuthGuard] },
      { path: 'tablas', component: TablasComponent, canActivate: [AuthGuard] },
      { path: 'grupos', component: GruposComponent, canActivate: [AuthGuard] },
      { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
      { path: '**', redirectTo: 'archivos/listado' }
    ],
  },
  { path: '**', redirectTo: '.' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalRoutingModule { }
