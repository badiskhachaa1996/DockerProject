import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormLayoutComponent } from './components/formlayout/formlayout.component';
import { PanelsComponent } from './components/panels/panels.component';
import { OverlaysComponent } from './components/overlays/overlays.component';
import { MediaComponent } from './components/media/media.component';
import { MessagesComponent } from './components/messages/messages.component';
import { MiscComponent } from './components/misc/misc.component';
import { EmptyComponent } from './components/empty/empty.component';
import { ChartsComponent } from './components/charts/charts.component';
import { FileComponent } from './components/file/file.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { AppMainComponent } from './app.main.component';
import { InputComponent } from './components/input/input.component';
import { ButtonComponent } from './components/button/button.component';
import { TableComponent } from './components/table/table.component';
import { ListComponent } from './components/list/list.component';
import { TreeComponent } from './components/tree/tree.component';
import { CrudComponent } from './components/crud/crud.component';
import { BlocksComponent } from './components/blocks/blocks.component';
import { FloatLabelComponent } from './components/floatlabel/floatlabel.component';
import { InvalidStateComponent } from './components/invalidstate/invalidstate.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { IconsComponent } from './components/icons/icons.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AccessComponent } from './components/access/access.component';
/***************************/
import { ListPartenaireComponent } from './partenaire/partenaires/list-partenaire/list-partenaire.component';
import { AddPartenaireComponent } from './partenaire/partenaires/add-partenaire/add-partenaire.component';
import { ListCollaborateurComponent } from './partenaire/collaborateurs/list-collaborateur/list-collaborateur.component';
import { ListAnneeScolaireComponent } from './administration/annees-scolaires/list-annee-scolaire/list-annee-scolaire.component';
import { AddAnneeScolaireComponent } from './administration/annees-scolaires/add-annee-scolaire/add-annee-scolaire.component';
import { ListEcoleComponent } from './administration/ecoles/list-ecole/list-ecole.component';
import { AddEcoleComponent } from './administration/ecoles/add-ecole/add-ecole.component';
import { ListCampusComponent } from './administration/campus/list-campus/list-campus.component';
import { AddCampusComponent } from './administration/campus/add-campus/add-campus.component';
import { ListDiplomeComponent } from './administration/diplomes/list-diplome/list-diplome.component';
import { AddDiplomeComponent } from './administration/diplomes/add-diplome/add-diplome.component';
import { ListGroupeComponent } from './administration/groupes/list-groupe/list-groupe.component';
import { AddGroupeComponent } from './administration/groupes/add-groupe/add-groupe.component';
import { ListAgentComponent } from './administration/agents/list-agent/list-agent.component';
import { AddAgentComponent } from './administration/agents/add-agent/add-agent.component';
import { GestionTicketsComponent } from './ticketing/gestion-tickets/gestion-tickets.component';
import { SuiviTicketsComponent } from './ticketing/suivi-tickets/suivi-tickets.component';
import { GestionServicesComponent } from './ticketing/gestion-services/gestion-services.component';
import { MatieresComponent } from './pedagogie/matieres/matieres.component';
import { AddFormateurComponent } from './pedagogie/formateurs/add-formateur/add-formateur.component';
import { ListFormateursComponent } from './pedagogie/formateurs/list-formateurs/list-formateurs.component';
import { AddEtudiantComponent } from './pedagogie/etudiants/add-etudiant/add-etudiant.component';
import { ListEtudiantComponent } from './pedagogie/etudiants/list-etudiant/list-etudiant.component';
import { AddEntrepriseComponent } from './pedagogie/entreprises/add-entreprise/add-entreprise.component';
import { ListEntrepriseComponent } from './pedagogie/entreprises/list-entreprise/list-entreprise.component';
import { GestionPreinscriptionsComponent } from './admission/gestion-preinscriptions/gestion-preinscriptions.component';
import { FormulaireAdmissionComponent } from './formulaire-admission/formulaire-admission.component';
import { NotesComponent } from './pedagogie/notes/notes.component';
import { ExterneComponent } from './authentification/externe/externe.component';
import { SuiviePreinscriptionComponent } from './admission/suivie-preinscription/suivie-preinscription.component';
import { AddSeanceComponent } from './pedagogie/seances/add-seance/add-seance.component';
import { ListSeancesComponent } from './pedagogie/seances/list-seances/list-seances.component';
import { EmploiDuTempsComponent } from './pedagogie/seances/emploi-du-temps/emploi-du-temps.component';
import { EmergementComponent } from './pedagogie/seances/emergement/emergement.component';
import { ValidationEmailComponent } from './authentification/validation-email/validation-email.component';
import { ExamenComponent } from './pedagogie/examen/list-examen/examen.component';
import { InterneComponent } from './authentification/interne/interne.component';
import { UserProfilComponent } from './profil/user-profil/user-profil.component';
import { AjoutExamenComponent } from './pedagogie/examen/ajout-examen/ajout-examen.component';
import { PartenaireInscriptionComponent } from './partenaire-inscription/partenaire-inscription.component';
import { AuthGuardService } from './guards/auth-guard';
import { AdminGuardService } from './guards/admin-guard';
import { AdmissionGuardService } from './guards/admission-guard';
import { PedagogieGuardService } from './guards/pedagogie-guard';
import { AdministrationGuardService } from './guards/administration-guard';
import { EtudiantGuardService } from './guards/etudiant-guard';
import { FirstConnectionComponent } from './profil/first-connection/first-connection.component';
import { ProspectsComponent } from './pedagogie/prospects/prospects.component';


@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                children: [
                    { path: '', component: DashboardComponent },
                    { path: 'uikit/formlayout', component: FormLayoutComponent },
                    { path: 'uikit/input', component: InputComponent },
                    { path: 'uikit/floatlabel', component: FloatLabelComponent },
                    { path: 'uikit/invalidstate', component: InvalidStateComponent },
                    { path: 'uikit/button', component: ButtonComponent },
                    { path: 'uikit/table', component: TableComponent },
                    { path: 'uikit/list', component: ListComponent },
                    { path: 'uikit/tree', component: TreeComponent },
                    { path: 'uikit/panel', component: PanelsComponent },
                    { path: 'uikit/overlay', component: OverlaysComponent },
                    { path: 'uikit/media', component: MediaComponent },
                    { path: 'uikit/menu', loadChildren: () => import('./components/menus/menus.module').then(m => m.MenusModule) },
                    { path: 'uikit/message', component: MessagesComponent },
                    { path: 'uikit/misc', component: MiscComponent },
                    { path: 'uikit/charts', component: ChartsComponent },
                    { path: 'uikit/file', component: FileComponent },
                    { path: 'pages/crud', component: CrudComponent },
                    { path: 'pages/timeline', component: TimelineComponent },
                    { path: 'pages/empty', component: EmptyComponent },
                    { path: 'icons', component: IconsComponent },
                    { path: 'blocks', component: BlocksComponent },
                    { path: 'documentation', component: DocumentationComponent },
                    /***************************/
                    { path: 'notes', component: NotesComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'admin/partenaire', component: ListPartenaireComponent, canActivate: [AuthGuardService, AdminGuardService] },
                    { path: 'admin/ajout-de-partenaire', component: AddPartenaireComponent, canActivate: [AuthGuardService, AdminGuardService] },
                    { path: 'collaborateur', component: ListCollaborateurComponent, canActivate: [AuthGuardService] },
                    { path: 'collaborateur/:id', component: ListCollaborateurComponent, canActivate: [AuthGuardService] },
                    { path: 'annee-scolaire', component: ListAnneeScolaireComponent, canActivate: [AuthGuardService, AdministrationGuardService] },
                    { path: 'ajout-annee-scolaire', component: AddAnneeScolaireComponent, canActivate: [AuthGuardService, AdministrationGuardService] },
                    { path: 'ecole', component: ListEcoleComponent, canActivate: [AuthGuardService, AdministrationGuardService] },
                    { path: 'ajout-ecole', component: AddEcoleComponent, canActivate: [AuthGuardService, AdministrationGuardService] },
                    { path: 'campus', component: ListCampusComponent, canActivate: [AuthGuardService, AdministrationGuardService] },
                    { path: 'ajout-campus', component: AddCampusComponent, canActivate: [AuthGuardService, AdministrationGuardService] },
                    { path: 'diplomes', component: ListDiplomeComponent, canActivate: [AuthGuardService, AdministrationGuardService] },
                    { path: 'ajout-diplome', component: AddDiplomeComponent, canActivate: [AuthGuardService, AdministrationGuardService] },
                    { path: 'groupes', component: ListGroupeComponent, canActivate: [AuthGuardService, AdministrationGuardService] },
                    { path: 'ajout-groupe', component: AddGroupeComponent, canActivate: [AuthGuardService, AdministrationGuardService] },
                    { path: 'admin/agents', component: ListAgentComponent, canActivate: [AuthGuardService, AdminGuardService] },
                    { path: 'admin/ajout-agent', component: AddAgentComponent, canActivate: [AuthGuardService, AdminGuardService] },
                    { path: 'gestion-tickets', component: GestionTicketsComponent, canActivate: [AuthGuardService] },
                    { path: 'suivi-ticket', component: SuiviTicketsComponent, canActivate: [AuthGuardService] },
                    { path: 'admin/gestion-services', component: GestionServicesComponent, canActivate: [AuthGuardService, AdminGuardService] },
                    { path: 'matières', component: MatieresComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'ajout-formateur', component: AddFormateurComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'formateurs', component: ListFormateursComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'ajout-etudiant', component: AddEtudiantComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'etudiants', component: ListEtudiantComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'ajout-entreprise', component: AddEntrepriseComponent, canActivate: [AuthGuardService] },
                    { path: 'prospects', component: ProspectsComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'entreprises', component: ListEntrepriseComponent, canActivate: [AuthGuardService] },
                    { path: 'gestion-preinscriptions', component: GestionPreinscriptionsComponent, canActivate: [AuthGuardService, AdmissionGuardService] },
                    { path: 'gestion-preinscriptions/:code', component: GestionPreinscriptionsComponent, canActivate: [AuthGuardService, AdmissionGuardService] },
                    { path: 'formulaire-admission', component: FormulaireAdmissionComponent },
                    { path: 'ajout-seance', component: AddSeanceComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'seances', component: ListSeancesComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'emploi-du-temps', component: EmploiDuTempsComponent, canActivate: [AuthGuardService, EtudiantGuardService] },
                    { path: 'emploi-du-temps/:type/:id', component: EmploiDuTempsComponent, canActivate: [AuthGuardService, EtudiantGuardService] },
                    { path: "emergement/:id", component: EmergementComponent, canActivate: [AuthGuardService] },
                    { path: 'formulaire-admission', component: FormulaireAdmissionComponent },
                    { path: 'examens', component: ExamenComponent, canActivate: [AuthGuardService] },
                    { path: 'ajout-examen', component: AjoutExamenComponent, canActivate: [AuthGuardService] },
                    { path: 'profil', component: UserProfilComponent, canActivate: [AuthGuardService] },
                    { path: 'completion-profil', canActivate: [AuthGuardService], component: FirstConnectionComponent }

                ],
            },
            { path: 'partenaireInscription', component: PartenaireInscriptionComponent },
            { path: 'login-externe', component: ExterneComponent },
            { path: 'suivre-ma-preinscription', component: SuiviePreinscriptionComponent },
            { path: 'suivre-ma-preinscription/:id', component: SuiviePreinscriptionComponent },
            { path: 'pages/landing', component: LandingComponent },
            { path: 'login', component: InterneComponent },
            { path: 'pages/error', component: ErrorComponent },
            { path: 'pages/notfound', component: NotfoundComponent },
            { path: 'pages/access', component: AccessComponent },
            { path: 'validation-email/:mail', component: ValidationEmailComponent }, // platforme activer mon compte en validant mon email
            { path: 'validation-email', component: ValidationEmailComponent }, // platforme activer mon compte en validant mon email
            { path: '**', redirectTo: 'pages/notfound' }
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
