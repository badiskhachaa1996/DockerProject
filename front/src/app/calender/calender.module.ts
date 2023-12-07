import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalenderRoutingModule } from './calender-routing.module';
import { CalenderComponent } from "./calender.component";
import { TableModule } from "primeng/table";
import { FullCalendarModule } from "primeng/fullcalendar";
import { DialogModule } from "primeng/dialog";
import { CheckboxModule } from "primeng/checkbox";
import { TabViewModule } from "primeng/tabview";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { ToggleButtonModule } from "primeng/togglebutton";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextareaModule } from 'primeng/inputtextarea';


@NgModule({
    declarations: [
        CalenderComponent
    ],
    exports: [
        CalenderComponent
    ],
    imports: [
        CommonModule,
        CalenderRoutingModule,
        TableModule,
        FullCalendarModule,
        DialogModule,
        CheckboxModule,
        TabViewModule,
        DropdownModule,
        CalendarModule,
        ToggleButtonModule,
        ReactiveFormsModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        TooltipModule,
        InputTextareaModule
    ]
})
export class CalenderModule {
}
