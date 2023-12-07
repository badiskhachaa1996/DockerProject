import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LinksComponent} from "./links.component";
import {AuthGuardService} from "../dev-components/guards/auth-guard";

const routes: Routes = [
    {
        path: '',
        component: LinksComponent,
        canActivate: [AuthGuardService]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinksRoutingModule { }
