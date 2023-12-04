import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from "primeng/toast";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
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
        DropdownModule,
        ToastModule,
        ReactiveFormsModule,
        FormsModule,
        ButtonModule,
        RadioButtonModule,
        InputTextareaModule,
        InputTextModule,
    ]
})
export class FormCRMModule { }
