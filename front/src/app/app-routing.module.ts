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
import { UserProfilComponent } from './profil/user-profil/user-profil.component';
import { AjoutExamenComponent } from './pedagogie/examen/ajout-examen/ajout-examen.component';
import { PartenaireInscriptionComponent } from './partenaire-inscription/partenaire-inscription.component';
import { AuthGuardService } from './guards/auth-guard';
import { AdminGuardService } from './guards/admin-guard';
import { AdmissionGuardService } from './guards/admission-guard';
import { PedagogieGuardService } from './guards/pedagogie-guard';
import { AdministrationGuardService } from './guards/administration-guard';

import { FirstConnectionComponent } from './profil/first-connection/first-connection.component';
import { ProspectsComponent } from './pedagogie/assignation-groupe/prospects.component';
import { ProspectGuard } from './guards/prospect-guard';
import { ReinscritComponent } from './administration/validation-prospects/reinscrit.component';
import { LoginGuard } from './guards/login-guard';
import { FormAdmissionGuard } from './guards/formAdmission-guard';
import { DetailsEtudiantComponent } from './pedagogie/etudiants/details-etudiant/details-etudiant.component';
import { NotificationComponent } from './notification/notification.component';
import { ContactComponent } from './contact/contact.component';
import { CollaborateurGuard } from './guards/collaborateur.guard';
import { MpOublieComponent } from './authentification/mp-oublie/mp-oublie.component';
import { ResetMpComponent } from './authentification/reset-mp/reset-mp.component';
import { MentionsLegalesComponent } from './footer/mentions-legales/mentions-legales.component';
import { PolitiqueConfidentialiteComponent } from './footer/politique-confidentialite/politique-confidentialite.component';
import { InscriptionEntrepriseComponent } from './pedagogie/entreprises/inscription-entreprise/inscription-entreprise.component';
import { DemandeEventsComponent } from './demande-events/demande-events.component';
import { ListEventsComponent } from './demande-events/list-events/list-events.component';

import { MsalModule, MsalRedirectComponent, MsalGuard } from '@azure/msal-angular'; // MsalGuard added to imports
import { AppComponent } from './app.component';

import { TuteurComponent } from './pedagogie/tuteur/tuteur.component';

import { ListeContratsComponent } from './pedagogie/entreprises/liste-contrats/liste-contrats.component';
import { TuteurEntrepriseGuard } from './guards/tuteur-entreprise.guard';
import { CeoEntrepriseGuard } from './guards/ceo-entreprise.guard';
import { CompletionProfilGuard } from './guards/completion-profil.guard';
import { CreateAccountComponent } from './support/create-account/create-account.component';
import { MyAccountComponent } from './gestion-bancaire/gestion-des-comptes/my-account/my-account.component';
import { AddNewIndividualAccountComponent } from './gestion-bancaire/gestion-des-comptes/add-new-individual-account/add-new-individual-account.component';
import { ListeDesComptesComponent } from './gestion-bancaire/gestion-des-comptes/liste-des-comptes/liste-des-comptes.component';
import { AccountDetailsComponent } from './gestion-bancaire/gestion-des-comptes/account-details/account-details.component';
import { ReturnUrlComponent } from './gestion-bancaire/gestion-des-transactions/return-pages/return-url/return-url.component';
import { ErrorUrlComponent } from './gestion-bancaire/gestion-des-transactions/return-pages/error-url/error-url.component';
import { CancelUrlComponent } from './gestion-bancaire/gestion-des-transactions/return-pages/cancel-url/cancel-url.component';
import { PaymentComponent } from './gestion-bancaire/gestion-des-transactions/payment/payment.component';
import { LogementComponent } from './ims+/logement/logement.component';
import { GestionLogementComponent } from './ims+/gestion-logement/gestion-logement.component';
import { MissionComponent } from './skillsnet/mission/mission.component';
import { MesMissionsComponent } from './skillsnet/mes-missions/mes-missions.component';
import { MatchingComponent } from './skillsnet/matching/matching.component';
import { EntreprisesMissionsComponent } from './skillsnet/entreprises-missions/entreprises-missions.component';
import { GestionEquipeComponent } from './commercial/gestion-equipe/gestion-equipe.component';
import { ResponsableCommercialGuard } from './guards/responsable-commercial.guard';
import { DetailEquipeComponent } from './commercial/detail-equipe/detail-equipe.component';
import { DemandeConseillerComponent } from './commercial/demande-conseiller/demande-conseiller.component';


@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                children: [
                    { path: '', component: DashboardComponent, canActivate: [AuthGuardService] },
                    /*{ path: 'uikit/formlayout', component: FormLayoutComponent },
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
                    { path: 'admin/partenaire', component: ListPartenaireComponent, canActivate: [AuthGuardService, AdmissionGuardService] },
                    { path: 'admin/ajout-de-partenaire', component: ListPartenaireComponent, canActivate: [AuthGuardService, AdmissionGuardService] },
                    { path: 'collaborateur', component: ListCollaborateurComponent, canActivate: [AuthGuardService] },
                    { path: 'collaborateur/:id', component: ListCollaborateurComponent, canActivate: [AuthGuardService] },
                    { path: 'annee-scolaire', component: ListAnneeScolaireComponent, canActivate: [AuthGuardService, AdministrationGuardService] },
                    { path: 'ajout-annee-scolaire', component: AddAnneeScolaireComponent, canActivate: [AuthGuardService, AdministrationGuardService] },
                    { path: 'ecole', component: ListEcoleComponent, canActivate: [AuthGuardService, AdministrationGuardService] },
                    { path: 'ecole/:id', component: ListEcoleComponent, canActivate: [AuthGuardService, AdministrationGuardService] },
                    { path: 'ajout-ecole', component: AddEcoleComponent, canActivate: [AuthGuardService, AdministrationGuardService] },
                    { path: 'campus', component: ListCampusComponent, canActivate: [AuthGuardService, AdministrationGuardService] },
                    { path: 'campus/:id', component: ListCampusComponent, canActivate: [AuthGuardService, AdministrationGuardService] },
                    { path: 'ajout-campus', component: AddCampusComponent, canActivate: [AuthGuardService, AdministrationGuardService] },
                    { path: 'diplomes', component: ListDiplomeComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'diplomes/:id', component: ListDiplomeComponent, canActivate: [AuthGuardService, AdministrationGuardService] },
                    { path: 'ajout-diplome', component: AddDiplomeComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'groupes', component: ListGroupeComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'ajout-groupe', component: AddGroupeComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'admin/agents', component: ListAgentComponent, canActivate: [AuthGuardService, AdminGuardService] },
                    { path: 'admin/ajout-agent', component: AddAgentComponent, canActivate: [AuthGuardService, AdminGuardService] },
                    { path: 'gestion-tickets', component: GestionTicketsComponent, canActivate: [AuthGuardService] },
                    { path: 'suivi-ticket', component: SuiviTicketsComponent, canActivate: [AuthGuardService] },
                    { path: 'admin/gestion-services', component: GestionServicesComponent, canActivate: [AuthGuardService, AdminGuardService] },
                    { path: 'matieres', component: MatieresComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'matieres/:id', component: MatieresComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'ajout-formateur', component: AddFormateurComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'formateurs', component: ListFormateursComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'ajout-etudiant', component: AddEtudiantComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'etudiants', component: ListEtudiantComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'etudiants/:code', component: ListEtudiantComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'ajout-entreprise', component: AddEntrepriseComponent, canActivate: [AuthGuardService] },
                    { path: 'assignation-inscrit', component: ProspectsComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'validation-inscrit', component: ReinscritComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'entreprises', component: ListEntrepriseComponent, canActivate: [AuthGuardService] },
                    { path: 'gestion-preinscriptions', component: GestionPreinscriptionsComponent, canActivate: [AuthGuardService, AdmissionGuardService] },//Admission
                    { path: 'gestion-preinscriptions/:code', component: GestionPreinscriptionsComponent, canActivate: [CollaborateurGuard] },//Collaborateur/Partenaire type:Commercial
                    { path: 'ajout-seance', component: AddSeanceComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'seances', component: ListSeancesComponent, canActivate: [AuthGuardService, PedagogieGuardService] },
                    { path: 'emploi-du-temps', component: EmploiDuTempsComponent },
                    { path: 'emploi-du-temps/:type/:id', component: EmploiDuTempsComponent },
                    { path: "emergement/:id", component: EmergementComponent, canActivate: [AuthGuardService] },
                    { path: 'examens', component: ExamenComponent, canActivate: [AuthGuardService] },
                    { path: 'ajout-examen', component: AjoutExamenComponent, canActivate: [AuthGuardService] },
                    { path: 'profil', component: UserProfilComponent, canActivate: [AuthGuardService] },
                    { path: 'details/:id', component: DetailsEtudiantComponent, canActivate: [TuteurEntrepriseGuard] },
                    { path: 'notifications', component: NotificationComponent, canActivate: [AuthGuardService] },
                    { path: 'contact', component: ContactComponent },
                    { path: 'list-events', component: ListEventsComponent },
                    { path: 'assign-ims', component: CreateAccountComponent },

                    { path: 'tuteur', component: TuteurComponent },
                    { path: 'tuteur/:entreprise', component: TuteurComponent },

                    { path: 'liste-contrats/:idTuteur', component: ListeContratsComponent, canActivate: [CeoEntrepriseGuard] }, // Listes des apprentie d'un tuteur
                    { path: 'liste-contrats', component: ListeContratsComponent, canActivate: [TuteurEntrepriseGuard] },
                    { path: 'inscription-entreprise', component: InscriptionEntrepriseComponent },

                    /** Path Lemon Way */

                    { path: 'mon-compte-bancaire', component: MyAccountComponent },
                    { path: 'new-individual-account', component: AddNewIndividualAccountComponent },
                    { path: 'list-accounts', component: ListeDesComptesComponent },
                    { path: 'account-details/:id', component: AccountDetailsComponent },
                    { path: 'payment', component: PaymentComponent },
                    { path: 'success', component: ReturnUrlComponent },
                    { path: 'error', component: ErrorUrlComponent },
                    { path: 'cancel', component: CancelUrlComponent },

                    /** end */
                    { path: 'logements', canActivate: [AuthGuardService], component: LogementComponent },
                    { path: 'gestion-reservations', canActivate: [AuthGuardService, AdminGuardService], component: GestionLogementComponent },

                    { path: 'missions', component: MissionComponent, canActivate: [AuthGuardService] },
                    { path: 'mes-missions', component: MesMissionsComponent, canActivate: [AuthGuardService] },
                    { path: 'matching/:user_id', component: MatchingComponent, canActivate: [AuthGuardService] },
                    { path: 'entreprise-missions', component: EntreprisesMissionsComponent },
                    { path: 'equipe-commercial', component: GestionEquipeComponent, canActivate: [AuthGuardService, ResponsableCommercialGuard] },
                    { path: 'detail-equipe-commercial/:equipe_id', component: DetailEquipeComponent, canActivate: [AuthGuardService] },
                    { path: 'liste-demande-commercial', component: DemandeConseillerComponent, canActivate: [AuthGuardService] },
                    { path: 'liste-demande-commercial/:equipe_id', component: DemandeConseillerComponent, canActivate: [AuthGuardService] },

                ],
            },
            { path: "formulaire-entreprise/:code", component: InscriptionEntrepriseComponent },
            { path: 'formulaire', component: DemandeEventsComponent },
            { path: 'completion-profil', canActivate: [AuthGuardService, CompletionProfilGuard], component: FirstConnectionComponent },
            { path: 'formulaire-admission/:ecole', component: FormulaireAdmissionComponent, canActivate: [FormAdmissionGuard] },
            { path: 'formulaire-admission/:ecole/:code_commercial', component: FormulaireAdmissionComponent, canActivate: [FormAdmissionGuard] },
            { path: 'partenaireInscription', component: PartenaireInscriptionComponent },
            { path: 'login', component: ExterneComponent, canActivate: [LoginGuard] },
            { path: 'mot-de-passe_oublie', component: MpOublieComponent, canActivate: [LoginGuard] },
            { path: 'mot_de_passe_reinit/:pwdtokenID', component: ResetMpComponent, canActivate: [LoginGuard] },
            { path: 'suivre-ma-preinscription', component: SuiviePreinscriptionComponent, canActivate: [ProspectGuard] },
            { path: 'pages/landing', component: LandingComponent },
            { path: 'pages/error', component: ErrorComponent },
            { path: 'pages/notfound', component: NotfoundComponent },
            { path: 'pages/access', component: AccessComponent },
            { path: 'validation-email/:mail', component: ValidationEmailComponent }, // platforme activer mon compte en validant mon email
            { path: 'validation-email', component: ValidationEmailComponent }, // platforme activer mon compte en validant mon email
            { path: 'mentions-legales', component: MentionsLegalesComponent },
            { path: 'politique-confidentialite', component: PolitiqueConfidentialiteComponent },
            { path: '**', redirectTo: 'pages/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ],

    exports: [RouterModule]
})
export class AppRoutingModule {
}
