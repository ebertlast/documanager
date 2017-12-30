import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './app-authguard';
import { Helper } from './app-helper';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { PrincipalModule } from './modulos/principal/principal.module';
import { ArchivoModule } from './modulos/archivo/archivo.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PrincipalModule,
    ArchivoModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, Helper, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
