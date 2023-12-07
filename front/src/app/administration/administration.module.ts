import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AddAnneeScolaireComponent } from "./annees-scolaires/add-annee-scolaire/add-annee-scolaire.component";
import { ListAnneeScolaireComponent } from "./annees-scolaires/list-annee-scolaire/list-annee-scolaire.component";
import { AddCampusComponent } from "./campus/add-campus/add-campus.component";
import { ListCampusComponent } from "./campus/list-campus/list-campus.component";
import { AddDiplomeComponent } from "./diplomes/add-diplome/add-diplome.component";
import { ListDiplomeComponent } from "./diplomes/list-diplome/list-diplome.component";
import { AddEcoleComponent } from "./ecoles/add-ecole/add-ecole.component";
import { ListEcoleComponent } from "./ecoles/list-ecole/list-ecole.component";
import { AddGroupeComponent } from "./groupes/add-groupe/add-groupe.component";
import { ListGroupeComponent } from "./groupes/list-groupe/list-groupe.component";
import { ReinscritComponent } from "./validation-prospects/reinscrit.component";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { MultiSelectModule } from "primeng/multiselect";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FileUploadModule } from "primeng/fileupload";
import { DialogModule } from "primeng/dialog";
import { TabViewModule } from "primeng/tabview";
import { CalendarModule } from "primeng/calendar";
import { SelectButtonModule } from "primeng/selectbutton";
import { ButtonModule } from 'primeng/button';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { LeadDossierModule } from '../admission/lead/lead-dossier/lead-dossier.module';
import { ReadMoreComponent } from '../other/component/read-more/read-more.component';
import { ReadMoreModule } from '../other/component/read-more/read-more.module';


@NgModule({
    declarations: [
        AddAnneeScolaireComponent,
        ListAnneeScolaireComponent,
        AddCampusComponent,
        ListCampusComponent,
        AddDiplomeComponent,
        ListDiplomeComponent,
        AddEcoleComponent,
        ListEcoleComponent,
        AddGroupeComponent,
        ListGroupeComponent,
        ReinscritComponent
    ],
    imports: [
        CommonModule,
        AdministrationRoutingModule,
        TableModule,
        ToastModule,
        MultiSelectModule,
        DropdownModule,
        ReactiveFormsModule,
        FileUploadModule,
        FormsModule,
        DialogModule,
        TabViewModule,
        CalendarModule,
        SelectButtonModule,
        ButtonModule,
        InputTextModule,
        TooltipModule,
        LeadDossierModule,
        ReadMoreModule
    ]
})
export class AdministrationModule { }
