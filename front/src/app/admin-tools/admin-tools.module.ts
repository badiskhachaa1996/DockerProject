import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminToolsRoutingModule } from './admin-tools-routing.module';
import {InfoImsComponent} from "./info-ims/info-ims.component";
import {UsersSettingsComponent} from "./users-settings/users-settings.component";
import {ToastModule} from "primeng/toast";
import {ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {TableModule} from "primeng/table";
import {MultiSelectModule} from "primeng/multiselect";


@NgModule({
  declarations: [
      InfoImsComponent,
      UsersSettingsComponent
  ],
    exports: [
        InfoImsComponent,
        UsersSettingsComponent
    ],
    imports: [
        CommonModule,
        AdminToolsRoutingModule,
        ToastModule,
        ReactiveFormsModule,
        DropdownModule,
        TableModule,
        MultiSelectModule
    ]
})
export class AdminToolsModule { }
