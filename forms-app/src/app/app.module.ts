import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";
import {InputTextareaModule} from "primeng/inputtextarea";
import { ContactUsEspicComponent } from './components/contact-us-espic/contact-us-espic.component';
import { ContactUsIntunsComponent } from './components/contact-us-intuns/contact-us-intuns.component';
import { ContactUsAdgComponent } from './components/contact-us-adg/contact-us-adg.component';
import { ContactUsMedasupComponent } from './components/contact-us-medasup/contact-us-medasup.component';
import { ContactUsIcbsComponent } from './components/contact-us-icbs/contact-us-icbs.component';
import { ContactUsIegComponent } from './components/contact-us-ieg/contact-us-ieg.component';
import {NgxCaptchaModule} from "ngx-captcha";

@NgModule({
  declarations: [
    AppComponent,
    ContactUsComponent,
    ContactUsEspicComponent,
    ContactUsIntunsComponent,
    ContactUsAdgComponent,
    ContactUsMedasupComponent,
    ContactUsIcbsComponent,
    ContactUsIegComponent,

  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    RadioButtonModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    InputTextareaModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
