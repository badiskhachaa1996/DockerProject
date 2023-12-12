import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
//import {ContactUsComponent} from "./components/contact-us/contact-us.component";
import {ContactUsEspicComponent} from "./components/contact-us-espic/contact-us-espic.component";
import {ContactUsIntunsComponent} from "./components/contact-us-intuns/contact-us-intuns.component";
import {ContactUsAdgComponent} from "./components/contact-us-adg/contact-us-adg.component";
import {ContactUsIcbsComponent} from "./components/contact-us-icbs/contact-us-icbs.component";
import {ContactUsIegComponent} from "./components/contact-us-ieg/contact-us-ieg.component";
import {ContactUsSimpleComponent} from "./components/contact-us-simple/contact-us-simple.component";
import {ContactIcbsEngComponent} from "./components/contact-icbs-eng/contact-icbs-eng.component";
import {ContactUsMedasupComponent} from "./components/contact-us-medasup/contact-us-medasup.component";

const routes: Routes = [
  //{ path: 'contact-form/:ecole', component: ContactUsComponent },
  { path: 'contact-form', component: ContactUsSimpleComponent },
  { path: 'contact-form/espic', component: ContactUsEspicComponent },
  { path: 'contact-form/intuns', component: ContactUsIntunsComponent },
  { path: 'contact-form/adg', component: ContactUsAdgComponent },
  { path: 'contact-form/medasup', component: ContactUsMedasupComponent },
  { path: 'contact-form/icbs', component: ContactUsIcbsComponent },
  { path: 'contact-form/icbs/eng', component: ContactIcbsEngComponent },
  { path: 'contact-form/ieg', component: ContactUsIegComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
