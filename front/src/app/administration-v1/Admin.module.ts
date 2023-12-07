import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { SidebarModule } from 'primeng/sidebar';
import { TimelineModule } from 'primeng/timeline';
import { ChartModule } from 'primeng/chart';

import { FullCalendarModule } from 'primeng/fullcalendar';
import { DataViewModule } from 'primeng/dataview';
import { CheckboxModule } from 'primeng/checkbox';
import { StepsModule } from 'primeng/steps';
import { AdminRoutingModule } from './Admin-routing.module';
import { DocumentsCandidatureViewerComponent } from './documents-candidature-viewer/documents-candidature-viewer.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { InscriptionComponent } from './gestion-des-inscriptions/inscription/inscription/inscription.component';
import { PreinscriptionComponent } from './gestion-des-inscriptions/preinscription/preinscription/preinscription.component';
import { AddGroupeV2Component } from "./configuration/groupes/add-groupe-v2/add-groupe-v2.component";
import { GroupesComponent } from "./configuration/groupes/groupes.component";
import { AccordionModule } from "primeng/accordion";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LeadDossierModule } from '../admission/lead/lead-dossier/lead-dossier.module';
import { LeadDossierComponent } from '../admission/lead/lead-dossier/lead-dossier.component';
import { InputTextarea, InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
    declarations: [
        DocumentsCandidatureViewerComponent,
        EvaluationComponent,
        InscriptionComponent,
        PreinscriptionComponent,
        AddGroupeV2Component,
        GroupesComponent
    ],
    exports: [
        DocumentsCandidatureViewerComponent,
        EvaluationComponent,
        InscriptionComponent,
        PreinscriptionComponent,
        AddGroupeV2Component,
        GroupesComponent
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
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
        SidebarModule,
        TimelineModule,
        ChartModule,
        FullCalendarModule,
        DataViewModule,
        CheckboxModule,
        StepsModule,
        AccordionModule,
        ButtonModule,
        InputTextModule,
        LeadDossierModule,
        InputTextareaModule
    ]
})
export class AdminModule { }
