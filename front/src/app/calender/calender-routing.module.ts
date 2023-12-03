import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CalenderComponent} from "./calender.component";
import {AuthGuardService} from "../dev-components/guards/auth-guard";

const routes: Routes = [
    {
        path: '',
        component: CalenderComponent,
        canActivate: [AuthGuardService]
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalenderRoutingModule { }
