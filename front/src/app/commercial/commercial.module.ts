import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommercialRoutingModule } from './commercial-routing.module';
import {DashboardAlternanceComponent} from "./dashboard-alternance/dashboard-alternance.component";
import {DashboardCommercialComponent} from "./dashboard-commercial/dashboard-commercial.component";
import {DemandeConseillerComponent} from "./demande-conseiller/demande-conseiller.component";
import {DetailEquipeComponent} from "./detail-equipe/detail-equipe.component";
import {GestionEquipeComponent} from "./gestion-equipe/gestion-equipe.component";
import {ProspectsAlternablesComponent} from "./prospects-alternables/prospects-alternables.component";
import {StageComponent} from "./stage/stage.component";
import {StageCeoComponent} from "./stage-ceo/stage-ceo.component";
import {ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {TagModule} from "primeng/tag";
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {MultiSelectModule} from "primeng/multiselect";
import {DialogModule} from "primeng/dialog";
import {FieldsetModule} from "primeng/fieldset";
import {ButtonModule} from "primeng/button";



@NgModule({
    declarations: [
        DashboardAlternanceComponent,
        DashboardCommercialComponent,
        DemandeConseillerComponent,
        DetailEquipeComponent,
        GestionEquipeComponent,
        ProspectsAlternablesComponent,
        StageComponent,
        StageCeoComponent
    ],
    exports: [
        DashboardAlternanceComponent,
        DashboardCommercialComponent,
        DemandeConseillerComponent,
        DetailEquipeComponent,
        GestionEquipeComponent,
        ProspectsAlternablesComponent,
        StageComponent,
        StageCeoComponent
    ],
    imports: [
        CommonModule,
        CommercialRoutingModule,
        ReactiveFormsModule,
        DropdownModule,
        TagModule,
        TableModule,
        ToastModule,
        MultiSelectModule,
        DialogModule,
        FieldsetModule,
        ButtonModule
    ]
})
export class CommercialModule { }
