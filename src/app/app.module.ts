import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './app-authguard';
import { Helper } from './app-helper';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { PrincipalModule } from './modulos/principal/principal.module';
import { ArchivoModule } from './modulos/archivo/archivo.module';
import { SeguridadModule } from './modulos/seguridad/seguridad.module';
import { GenericoModule } from './modulos/generico/generico.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    PrincipalModule,
    ArchivoModule,
    SeguridadModule,
    GenericoModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, Helper, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
