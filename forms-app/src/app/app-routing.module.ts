import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import {ContactUsComponent} from "./components/contact-us/contact-us.component";
import {ContactUsEspicComponent} from "./components/contact-us-espic/contact-us-espic.component";
import {ContactUsIntunsComponent} from "./components/contact-us-intuns/contact-us-intuns.component";
import {ContactUsAdgComponent} from "./components/contact-us-adg/contact-us-adg.component";
import {ContactUsIcbsComponent} from "./components/contact-us-icbs/contact-us-icbs.component";
import {ContactUsIegComponent} from "./components/contact-us-ieg/contact-us-ieg.component";
import {ContactUsBtechComponent} from "./components/contact-us-btech/contact-us-btech.component";
import {ContactIcbsEngComponent} from "./components/contact-icbs-eng/contact-icbs-eng.component";
import {ContactUsMedasupComponent} from "./components/contact-us-medasup/contact-us-medasup.component";
import {ContactUsIntComponent} from "./components/contact-us-int/contact-us-int.component";
import {ContactUsComponent} from "./components/contact-us/contact-us.component";
import {ContactUsStudinfoComponent} from "./components/contact-us-studinfo/contact-us-studinfo.component";

const routes: Routes = [

  { path: 'contact-form', component: ContactUsComponent },
  { path: 'contact-form/btech', component: ContactUsBtechComponent },
  { path: 'contact-form/espic', component: ContactUsEspicComponent },
  { path: 'contact-form/intuns', component: ContactUsIntunsComponent },
  { path: 'contact-form/adg', component: ContactUsAdgComponent },
  { path: 'contact-form/medasup', component: ContactUsMedasupComponent },
  { path: 'contact-form/icbs', component: ContactUsIcbsComponent },
  { path: 'contact-form/icbs/eng', component: ContactIcbsEngComponent },
  { path: 'contact-form/ieg', component: ContactUsIegComponent },
  { path: 'contact-form/int', component: ContactUsIntComponent },
  { path: 'contact-form/studinfo', component: ContactUsStudinfoComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
