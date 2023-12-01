import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from "primeng/toast";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { AppModule } from "../app.module";
import { DialogModule } from "primeng/dialog";
import { TabViewModule } from "primeng/tabview";
import { SidebarModule } from "primeng/sidebar";
import { MultiSelectModule } from "primeng/multiselect";
import { TagModule } from "primeng/tag";
import { CheckboxModule } from "primeng/checkbox";
import { ToggleButtonModule } from "primeng/togglebutton";
import { ButtonModule } from "primeng/button";
import { FullCalendarModule } from "primeng/fullcalendar";
import { FormCrmRoutingModule } from './formcrm-routing.module';
import { FormCrmExtComponent } from './form-crm-ext/form-crm-ext.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';



@NgModule({
    declarations: [
        FormCrmExtComponent
    ],
    exports: [
        FormCrmExtComponent
    ],
    imports: [
        CommonModule,
        FormCrmRoutingModule,
        ToastModule,
        DropdownModule,
        ReactiveFormsModule,
        TableModule,
        DialogModule,
        TabViewModule,
        SidebarModule,
        MultiSelectModule,
        FormsModule,
        TagModule,
        CheckboxModule,
        ToggleButtonModule,
        ButtonModule,
        FullCalendarModule,
        RadioButtonModule,
        InputTextareaModule,
        InputTextModule,
    ]
})
export class FormCRMModule { }
