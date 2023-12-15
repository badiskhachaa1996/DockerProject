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
import { ContactUsBtechComponent } from './components/contact-us-btech/contact-us-btech.component';
import {MessagesModule} from "primeng/messages";
import {ToastModule} from "primeng/toast";
import { MessageService } from 'primeng/api';
import { ContactUsIcbsEngComponent } from './components/contact-us-icbs-eng/contact-us-icbs-eng.component';
import {ToggleButtonModule} from "primeng/togglebutton";
import {InputSwitchModule} from "primeng/inputswitch";
import { Ng2TelInputModule } from 'ng2-tel-input';
import { ContactUsIntComponent } from './components/contact-us-int/contact-us-int.component';
import { ContactUsStudinfoComponent } from './components/contact-us-studinfo/contact-us-studinfo.component'

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
    ContactUsBtechComponent,
    ContactUsIcbsEngComponent,
    ContactUsIntComponent,
    ContactUsStudinfoComponent,

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
    MessagesModule,
    ToastModule,
    ToggleButtonModule,
    InputSwitchModule,
    Ng2TelInputModule,

  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
