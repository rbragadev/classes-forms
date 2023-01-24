import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TemplateFormModule } from './template-form/template-form.module';
import { DataFormModuleModule } from './data-form/data-form-module.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TemplateFormModule,
    DataFormModuleModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
