import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LinksRoutingModule } from './links-routing.module';
import {LinksComponent} from "./links.component";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {DataViewModule} from "primeng/dataview";
import {PanelModule} from "primeng/panel";
import {TooltipModule} from "primeng/tooltip";
import {TabViewModule} from "primeng/tabview";


@NgModule({
  declarations: [
      LinksComponent
  ],
    exports:[
      LinksComponent
    ],
    imports: [
        CommonModule,
        LinksRoutingModule,
        ButtonModule,
        DialogModule,
        ReactiveFormsModule,
        DataViewModule,
        PanelModule,
        TooltipModule,
        TabViewModule
    ]
})
export class LinksModule { }
