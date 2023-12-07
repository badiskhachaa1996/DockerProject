import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RhRoutingModule } from './rh-routing.module';
import { ActualiteNotificationsComponent } from "./actualite-notifications/actualite-notifications.component";
import { ArchivagePointageComponent } from "./archivage-pointage/archivage-pointage.component";
import { CalendrierRhComponent } from "./calendrier-rh/calendrier-rh.component";
import { CollaborateursComponent } from "./collaborateurs/collaborateurs.component";
import { ConfigurationPointageComponent } from "./configuration-pointage/configuration-pointage.component";
import { ConfigurationPointeuseComponent } from "./configuration-pointeuse/configuration-pointeuse.component";
import { CongesAutorisationsComponent } from "./conges-autorisations/conges-autorisations.component";
import { DashboardRhComponent } from "./dashboard-rh/dashboard-rh.component";
import { DemandesReclamationsComponent } from "./demandes-reclamations/demandes-reclamations.component";
import { GestionEquipeRhComponent } from "./gestion-equipe-rh/gestion-equipe-rh.component";
import { NewCalendrierComponent } from "./new-calendrier/new-calendrier.component";
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
import { ReadMoreModule } from '../other/component/read-more/read-more.module';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';



@NgModule({
    declarations: [
        ActualiteNotificationsComponent,
        ArchivagePointageComponent,
        CalendrierRhComponent,
        CollaborateursComponent,
        ConfigurationPointageComponent,
        ConfigurationPointeuseComponent,
        CongesAutorisationsComponent,
        DashboardRhComponent,
        DemandesReclamationsComponent,
        GestionEquipeRhComponent,
        NewCalendrierComponent
    ],
    exports: [
        ActualiteNotificationsComponent,
        ArchivagePointageComponent,
        CalendrierRhComponent,
        CollaborateursComponent,
        ConfigurationPointageComponent,
        ConfigurationPointeuseComponent,
        CongesAutorisationsComponent,
        DashboardRhComponent,
        DemandesReclamationsComponent,
        GestionEquipeRhComponent,
        NewCalendrierComponent
    ],
    imports: [
        CommonModule,
        RhRoutingModule,
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
        ReadMoreModule,
        InputTextModule,
        InputTextareaModule
    ]
})
export class RhModule { }
