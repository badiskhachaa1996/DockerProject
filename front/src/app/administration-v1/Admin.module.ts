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
import { AccordionModule } from 'primeng/accordion';

@NgModule({
    declarations: [
        DocumentsCandidatureViewerComponent,
        EvaluationComponent,
        PreinscriptionComponent,
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
        AccordionModule
    ]
})
export class AdminModule { }
