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
import { AdmissionRoutingModule } from './admission-routing.module';
import { FormationAdmissionComponent } from "../international/formation-admission/formation-admission.component";
import { EcoleAdmissionComponent } from "../international/ecole-admission/ecole-admission.component";
import { RentreeScolaireAdmissionComponent } from "../international/rentree-scolaire-admission/rentree-scolaire-admission.component";
import { FormAdmissionDubaiResultsComponent } from "../other/form-admission-dubai-results/form-admission-dubai-results.component";
import { LeadProgrammeComponent } from "./lead/lead-programme/lead-programme.component";
import { LeadDossierComponent } from "./lead/lead-dossier/lead-dossier.component";
import { LeadPaiementsComponent } from "./lead/lead-paiements/lead-paiements.component";
import { LeadDocumentsComponent } from "./lead/lead-documents/lead-documents.component";
import { LeadInformationsPersonnelComponent } from "./lead/lead-informations-personnel/lead-informations-personnel.component";
import { LeadSuiviComponent } from "./lead/lead-suivi/lead-suivi.component";
import { LeadCandidatureComponent } from "./lead/lead-candidature/lead-candidature.component";
import { LeadEvaluationComponent } from "./lead/lead-evaluation/lead-evaluation.component";
import { InformationsComponent } from '../informations/informations.component';
import { Fieldset, FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { LeadDossierModule } from './lead/lead-dossier/lead-dossier.module';
import { LeadCandidatureModule } from './lead/lead-candidature/lead-candidature.module';
@NgModule({
    declarations: [
        FormationAdmissionComponent,
        EcoleAdmissionComponent,
        RentreeScolaireAdmissionComponent,
        FormAdmissionDubaiResultsComponent,
        LeadProgrammeComponent,
        LeadPaiementsComponent,
        LeadDocumentsComponent,
        LeadInformationsPersonnelComponent,
        LeadSuiviComponent,
        LeadEvaluationComponent,
        InformationsComponent
    ],
    imports: [
        CommonModule,
        AdmissionRoutingModule,
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
        FieldsetModule,
        ButtonModule,
        InputTextModule,
        LeadDossierModule,
        LeadCandidatureModule
    ]
})
export class AdmissionModule { }
