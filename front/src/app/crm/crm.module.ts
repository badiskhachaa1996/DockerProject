import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from "primeng/toast";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { TabViewModule } from "primeng/tabview";
import { SidebarModule } from "primeng/sidebar";
import { MultiSelectModule } from "primeng/multiselect";
import { TagModule } from "primeng/tag";
import { CheckboxModule } from "primeng/checkbox";
import { ToggleButtonModule } from "primeng/togglebutton";
import { ButtonModule } from "primeng/button";
import { FullCalendarModule } from "primeng/fullcalendar";
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { CrmListComponent } from './crm-list/crm-list.component';
import { SuivreLeadComponent } from './crm-list/suivre-lead/suivre-lead.component';
import { GestionOperationComponent } from './gestion-operation/gestion-operation.component';
import { GestionProduitsComponent } from './gestion-produits/gestion-produits.component';
import { GestionSrourcesComponent } from './gestion-srources/gestion-srources.component';
import { ImportCrmComponent } from './import-crm/import-crm.component';
import { AjoutLeadcrmComponent } from './leadcrm/ajout-leadcrm/ajout-leadcrm.component';
import { ListLeadcrmComponent } from './leadcrm/list-leadcrm/list-leadcrm.component';
import { LeadsNonAttribuesComponent } from './leads-non-attribues/leads-non-attribues.component';
import { LeadsNonQualifiesComponent } from './leads-non-qualifies/leads-non-qualifies.component';
import { LeadsPrequalifiesComponent } from './leads-prequalifies/leads-prequalifies.component';
import { LeadsQualifiesComponent } from './leads-qualifies/leads-qualifies.component';
import { MesLeadsComponent } from './mes-leads/mes-leads.component';
import { ConfigurationTargetComponent } from './target/configuration-target/configuration-target.component';
import { DashboardTargetComponent } from './target/dashboard-target/dashboard-target.component';
import { MyTargetComponent } from './target/my-target/my-target.component';
import { TeamsCrmComponent } from './teams-crm/teams-crm.component';
import { VentesCRMComponent } from './ventes-crm/ventes-crm.component';
import { CrmRoutingModule } from './crm-routing.module';
import { MemberCrmComponent } from './teams-crm/member-crm/member-crm.component';
import { ChartModule } from 'primeng/chart';
import {CriteresComponent} from "./criteres/criteres.component";
import { TooltipModule } from 'primeng/tooltip';
import { ReportingComponent } from './reporting/reporting.component';
import { CalendarModule } from 'primeng/calendar';





@NgModule({
    declarations: [
        SuivreLeadComponent,
        ListLeadcrmComponent,
        MesLeadsComponent,
        CrmListComponent,
        AjoutLeadcrmComponent,
        GestionOperationComponent,
        CrmListComponent,
        GestionProduitsComponent,
        GestionSrourcesComponent,
        ImportCrmComponent,
        LeadsNonAttribuesComponent,
        LeadsNonQualifiesComponent,
        LeadsPrequalifiesComponent,
        LeadsQualifiesComponent,
        ConfigurationTargetComponent,
        DashboardTargetComponent,
        MyTargetComponent,
        TeamsCrmComponent,
        VentesCRMComponent,
        MemberCrmComponent,
        CriteresComponent,
        ReportingComponent
    ],
    exports: [
        SuivreLeadComponent,
        ListLeadcrmComponent,
        MesLeadsComponent,
        CrmListComponent,
        AjoutLeadcrmComponent,
        GestionOperationComponent,
        CrmListComponent,
        GestionProduitsComponent,
        GestionSrourcesComponent,
        ImportCrmComponent,
        LeadsNonAttribuesComponent,
        LeadsNonQualifiesComponent,
        LeadsPrequalifiesComponent,
        LeadsQualifiesComponent,
        ConfigurationTargetComponent,
        DashboardTargetComponent,
        MyTargetComponent,
        TeamsCrmComponent,
        VentesCRMComponent,
        MemberCrmComponent,
        CriteresComponent,
        ReportingComponent,
    ],
    imports: [
        CalendarModule,
        CommonModule,
        CrmRoutingModule,
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
        ChartModule,
        TooltipModule,
    ]
})
export class CRMModule { }
