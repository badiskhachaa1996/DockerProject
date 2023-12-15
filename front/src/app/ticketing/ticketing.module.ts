import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketingRoutingModule } from './ticketing-routing.module';
import { AjoutTicketComponent } from "./ajout-ticket/ajout-ticket.component";
import { AjouterUnTicketProjetComponent } from "./ajouter-un-ticket-projet/ajouter-un-ticket-projet.component";
import { ConfigurationComponent } from "./configuration/configuration.component";
import { DashboardTicketingComponent } from "./dashboard-ticketing/dashboard-ticketing.component";
import { NewListTicketsComponent } from "./new-list-tickets/new-list-tickets.component";
import { NotificationComponent } from "./notification/notification.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { FileUploadModule } from "primeng/fileupload";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { CalendarModule } from "primeng/calendar";
import { TabViewModule } from "primeng/tabview";
import { SelectButtonModule } from "primeng/selectbutton";
import { CheckboxModule } from "primeng/checkbox";
import { MultiSelectModule } from "primeng/multiselect";
import { TagModule } from "primeng/tag";
import { ChartModule } from "primeng/chart";
import { TooltipModule } from 'primeng/tooltip';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ReadMoreModule } from '../other/component/read-more/read-more.module';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { AutomatisationTicketingComponent } from './automatisation-ticketing/automatisation-ticketing.component';


@NgModule({
    declarations: [
        AjoutTicketComponent,
        AjouterUnTicketProjetComponent,
        ConfigurationComponent,
        DashboardTicketingComponent,
        NewListTicketsComponent,
        NotificationComponent,
        AutomatisationTicketingComponent
    ],
    exports: [
        AjoutTicketComponent,
        AjouterUnTicketProjetComponent,
        ConfigurationComponent,
        DashboardTicketingComponent,
        NewListTicketsComponent,
        NotificationComponent
    ],
    imports: [
        CommonModule,
        TicketingRoutingModule,
        ReactiveFormsModule,
        DropdownModule,
        FileUploadModule,
        TableModule,
        DialogModule,
        FormsModule,
        CalendarModule,
        TabViewModule,
        SelectButtonModule,
        CheckboxModule,
        MultiSelectModule,
        TagModule,
        ChartModule,
        TooltipModule,
        InputTextModule,
        InputTextareaModule,
        ReadMoreModule,
        VirtualScrollerModule
    ]
})
export class TicketingModule { }
