import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';
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
import { AuthGuardService } from "../dev-components/guards/auth-guard";
import { AddEntrepriseComponent } from "../pedagogie/entreprises/add-entreprise/add-entreprise.component";
const routes: Routes = [
    // Generateur de Doc
    { path: 'entreprise', component: NewEntreprisesComponent, canActivate: [AuthGuardService], },
    { path: 'annonce/entreprise/:entreprise_id', component: AnnonceViewerComponent, canActivate: [AuthGuardService], },
    { path: 'mes-disponibilites', component: CalendrierEtudiantComponent, canActivate: [AuthGuardService], },
    { path: 'reporting', component: DashboardImatchComponent, canActivate: [AuthGuardService] },
    { path: 'entreprise-dashboard', component: EntrepriseDashboardComponent, canActivate: [AuthGuardService], },
    { path: 'evenements', component: EvenementsComponent, canActivate: [AuthGuardService] },
    { path: 'matching/:offre_id', component: MatchingComponent, canActivate: [AuthGuardService] },
    { path: 'mes-rendez-vous', component: MesRendezVousComponent, canActivate: [AuthGuardService], },
    { path: 'skills-management', component: SkillsManagementComponent, canActivate: [AuthGuardService] },
    { path: 'suivi-candidat', component: SuiviCandidatComponent, canActivate: [AuthGuardService], },
    { path: 'cv/:cv_id', component: VoirCvComponent, canActivate: [AuthGuardService], },
    { path: 'offres', component: AnnoncesComponent, canActivate: [AuthGuardService], },
    { path: 'mes-offres', component: MesOffresComponent, canActivate: [AuthGuardService], },
    { path: 'ajout-entreprise', component: AddEntrepriseComponent, canActivate: [AuthGuardService], },
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SkillsNetRoutingModule { }