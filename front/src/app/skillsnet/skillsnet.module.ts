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
import { SkillsNetRoutingModule } from './skillsnet-routing.module';

import { AnnonceViewerComponent } from './annonce-viewer/annonce-viewer.component';
import { AnnoncesComponent } from './annonces/annonces.component';
import { CalendrierEtudiantComponent } from './calendrier-etudiant/calendrier-etudiant.component';
import { DashboardImatchComponent } from './dashboard-imatch/dashboard-imatch.component';
import { EntrepriseDashboardComponent } from './entreprise-dashboard/entreprise-dashboard.component';
import { EvenementsComponent } from './evenements/evenements.component';
import { MatchingComponent } from './matching/matching.component';
import { MesOffresComponent } from './mes-offres/mes-offres.component';
import { MesRendezVousComponent } from './mes-rendez-vous/mes-rendez-vous.component';
import { NewEntreprisesComponent } from './new-entreprises/new-entreprises.component';
import { SkillsManagementComponent } from './skills-management/skills-management.component';
import { SuiviCandidatComponent } from './suivi-candidat/suivi-candidat.component';
import { VoirCvComponent } from './voir-cv/voir-cv.component';
import { VoirDetailsOffreComponent } from './voir-details-offre/voir-details-offre.component';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { AddEntrepriseComponent } from '../pedagogie/entreprises/add-entreprise/add-entreprise.component';
import { DataViewModule } from 'primeng/dataview';
import { CheckboxModule } from 'primeng/checkbox';
import { StepsModule } from 'primeng/steps';
import { Fieldset, FieldsetModule } from 'primeng/fieldset';
import { SkillsManagementModule } from './skills-management/skills-management.module';
@NgModule({
    declarations: [
        AnnonceViewerComponent,
        AnnoncesComponent,
        CalendrierEtudiantComponent,
        DashboardImatchComponent,
        EntrepriseDashboardComponent,
        EvenementsComponent,
        MatchingComponent,
        MesOffresComponent,
        MesRendezVousComponent,
        NewEntreprisesComponent,
        SuiviCandidatComponent,
        VoirCvComponent,
        VoirDetailsOffreComponent,
        AddEntrepriseComponent
    ],
    imports: [
        CommonModule,
        SkillsNetRoutingModule,
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
        FieldsetModule,
        SkillsManagementModule
    ]
})
export class SkillsNetModule { }
