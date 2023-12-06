import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ContactUsComponent} from "./components/contact-us/contact-us.component";

const routes: Routes = [
  { path: 'contact-form/:ecole', component: ContactUsComponent },
  // Add more routes for other contact forms if needed
  // { path: 'contact-form2', component: ContactForm2Component },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
