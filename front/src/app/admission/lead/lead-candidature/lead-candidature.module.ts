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
import { ButtonModule } from 'primeng/button';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { LeadCandidatureComponent } from './lead-candidature.component';
import { PreviewCandidatureComponent } from '../preview-candidature/preview-candidature.component';
import { InputTextarea, InputTextareaModule } from 'primeng/inputtextarea';
import { SignaturePadModule } from 'angular2-signaturepad';


@NgModule({
    declarations: [
        LeadCandidatureComponent,
        PreviewCandidatureComponent
    ],
    exports: [
        LeadCandidatureComponent,
        PreviewCandidatureComponent
    ],
    imports: [
        CommonModule,
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
        InputTextareaModule,
        SignaturePadModule
    ]
})
export class LeadCandidatureModule { }
