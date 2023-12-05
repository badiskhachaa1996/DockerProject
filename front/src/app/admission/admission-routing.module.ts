import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';
import { AuthGuardService } from "../dev-components/guards/auth-guard";
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
import { InformationsComponent } from "../informations/informations.component";

const routes: Routes = [
    /* Configuration Formulaire Admission */
    {
        path: 'informations',
        component: InformationsComponent,

    },
    {
        path: 'formations',
        component: FormationAdmissionComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'ecoles',
        component: EcoleAdmissionComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'rentree',
        component: RentreeScolaireAdmissionComponent,
        canActivate: [AuthGuardService],
    },

    // dubai admission form
    {
        path: 'dubai-form-results',
        component: FormAdmissionDubaiResultsComponent,
        canActivate: [AuthGuardService],
    },
    //Accès Prospect V2
    {
        path: 'lead-programme/:id',
        component: LeadProgrammeComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'lead-dossier/:id',
        component: LeadDossierComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'lead-paiements/:id',
        component: LeadPaiementsComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'lead-documents/:id',
        component: LeadDocumentsComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'lead-informations/:id',
        component: LeadInformationsPersonnelComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'lead-suivi/:id',
        component: LeadSuiviComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'lead-candidature/:id',
        component: LeadCandidatureComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'lead-evaluation',
        component: LeadEvaluationComponent,
        canActivate: [AuthGuardService],
    },
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdmissionRoutingModule { }