import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersSettingsComponent} from "./users-settings/users-settings.component";
import {AdminGuardService} from "../dev-components/guards/admin-guard";
import {InfoImsComponent} from "./info-ims/info-ims.component";

const routes: Routes = [
            {
                path: '',
                component: UsersSettingsComponent,
                canActivate: [AdminGuardService],
            },
            {
                path: '',
                canActivate: [AdminGuardService],
                component: InfoImsComponent,
            },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminToolsRoutingModule { }
