import { GestionEtudiantsComponent } from './pedagogie/etudiants/gestion-etudiants/gestion-etudiants.component';
import { RouterModule, Routes } from '@angular/router';
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
import { PartenaireInscriptionComponent } from './partenaire/partenaire-inscription/partenaire-inscription.component';
import { AuthGuardService } from './dev-components/guards/auth-guard';
import { AdminGuardService } from './dev-components/guards/admin-guard';
import { AdmissionGuardService } from './dev-components/guards/admission-guard';
import { PedagogieGuardService } from './dev-components/guards/pedagogie-guard';
import { AdministrationGuardService } from './dev-components/guards/administration-guard';

import { FirstConnectionComponent } from './profil/first-connection/first-connection.component';
import { ProspectsComponent } from './pedagogie/assignation-groupe/prospects.component';
import { ProspectGuard } from './dev-components/guards/prospect-guard';
import { ReinscritComponent } from './administration/validation-prospects/reinscrit.component';
import { LoginGuard } from './dev-components/guards/login-guard';
import { FormAdmissionGuard } from './dev-components/guards/formAdmission-guard';
import { DetailsEtudiantComponent } from './pedagogie/etudiants/details-etudiant/details-etudiant.component';
import { NotificationComponent } from './ticketing/notification/notification.component';
import { ContactComponent } from './footer/contact/contact.component';
import { CollaborateurGuard } from './dev-components/guards/collaborateur.guard';
import { MentionsLegalesComponent } from './footer/mentions-legales/mentions-legales.component';
import { PolitiqueConfidentialiteComponent } from './footer/politique-confidentialite/politique-confidentialite.component';
import { InscriptionEntrepriseComponent } from './pedagogie/entreprises/inscription-entreprise/inscription-entreprise.component';
import { DemandeEventsComponent } from './demande-events/demande-events.component';
import { ListEventsComponent } from './demande-events/list-events/list-events.component';

import {
    MsalModule,
    MsalRedirectComponent,
    MsalGuard,
} from '@azure/msal-angular'; // MsalGuard added to imports
import { AppComponent } from './app.component';

import { TuteurComponent } from './pedagogie/tuteur/tuteur.component';

import { ListeContratsComponent } from './pedagogie/entreprises/liste-contrats/liste-contrats.component';
import { TuteurEntrepriseGuard } from './dev-components/guards/tuteur-entreprise.guard';
import { CeoEntrepriseGuard } from './dev-components/guards/ceo-entreprise.guard';
import { CompletionProfilGuard } from './dev-components/guards/completion-profil.guard';
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
import { MatchingComponent } from './skillsnet/matching/matching.component';
import { GestionEquipeComponent } from './commercial/gestion-equipe/gestion-equipe.component';
import { ResponsableCommercialGuard } from './dev-components/guards/responsable-commercial.guard';
import { DetailEquipeComponent } from './commercial/detail-equipe/detail-equipe.component';
import { DemandeConseillerComponent } from './commercial/demande-conseiller/demande-conseiller.component';
import { UsersSettingsComponent } from './admin-tools/users-settings/users-settings.component';
import { AnalyseDoublonComponent } from './admin-tools/analyse-doublon/analyse-doublon.component';
import { DevoirsComponent } from './pedagogie/devoirs/devoirs.component';
import { DevoirsEtudiantsComponent } from './pedagogie/devoirs-etudiants/devoirs-etudiants.component';
import { InfoImsComponent } from './admin-tools/info-ims/info-ims.component';
import { FactureFormateurComponent } from './finance/facture-formateur/facture-formateur.component';
import { AnnoncesComponent } from './skillsnet/annonces/annonces.component';
import { FormulaireIntunsComponent } from './formulaire-admission/formulaire-intuns/formulaire-intuns.component';
import { CvthequeComponent } from './skillsnet/cvtheque/cvtheque.component';
import { MesOffresComponent } from './skillsnet/mes-offres/mes-offres.component';
import { SkillsManagementComponent } from './skillsnet/skills-management/skills-management.component';
import { ProgressionPedagogiqueComponent } from './pedagogie/formateurs/progression-pedagogique/progression-pedagogique.component';
import { QuestionnaireSatisfactionComponent } from './pedagogie/questionnaire-satisfaction/questionnaire-satisfaction.component';
import { ResultatComponent } from './pedagogie/questionnaire-satisfaction/resultat/resultat.component';
import { ProspectsIntunsComponent } from './admission/prospects-intuns/prospects-intuns.component';
import { QuestionnaireFinFormationComponent } from './pedagogie/questionnaire-fin-formation/questionnaire-fin-formation.component';
import { PovFormateurComponent } from './pedagogie/etudiants/list-etudiant/pov-formateur/pov-formateur.component';
import { MyTaskComponent } from './projects/my-task/my-task.component';
import { TaskManagementComponent } from './projects/task-management/task-management.component';
import { PvSemestrielComponent } from './pedagogie/notes/pv-semestriel/pv-semestriel.component';
import { PendingChangesGuard } from './dev-components/guards/pending-changes.guard';
import { BulletinComponent } from './pedagogie/notes/bulletin/bulletin.component';
import { PvAppreciationComponent } from './pedagogie/notes/pv-appreciation/pv-appreciation.component';
import { AppreciationInputComponent } from './pedagogie/formateurs/appreciation-input/appreciation-input.component';
import { PvAnnuelComponent } from './pedagogie/notes/pv-annuel/pv-annuel.component';
import { TeamComponent } from './projects/team/team.component';
import { ListEntrepriseCeoComponent } from './pedagogie/entreprises/list-entreprise-ceo/list-entreprise-ceo.component';
import { TuteurCeoComponent } from './pedagogie/tuteur-ceo/tuteur-ceo.component';
import { EvenementsComponent } from './skillsnet/evenements/evenements.component';
import { ContratsTutelleCeoComponent } from './pedagogie/entreprises/contrats-tutelle-ceo/contrats-tutelle-ceo.component';
import { EntrepriseFormComponent } from './pedagogie/entreprises/entreprise-form/entreprise-form.component';
import { ExterneSkillsnetComponent } from './skillsnet/externe-skillsnet/externe-skillsnet.component';
import { FormulaireExterneSkillsnetComponent } from './skillsnet/externe-skillsnet/formulaire-externe-skillsnet/formulaire-externe-skillsnet.component';
import { POVHorsCommercialComponent } from './skillsnet/matching/povhors-commercial/povhors-commercial.component';
import { ProspectAltFormComponent } from './pedagogie/etudiants/prospect-alt-form/prospect-alt-form.component';
import { ProspectsAlternablesComponent } from './commercial/prospects-alternables/prospects-alternables.component';
import { AddProspectComponent } from './admission/add-prospect/add-prospect.component';
import { QuestionnaireFormateurComponent } from './pedagogie/questionnaire-formateur/questionnaire-formateur.component';
import { ResultatQfComponent } from './pedagogie/questionnaire-formateur/resultat-qf/resultat-qf.component';
import { ResultatQFFComponent } from './pedagogie/questionnaire-fin-formation/resultat-qff/resultat-qff.component';
import { AjoutCollaborateurComponent } from './partenaire/collaborateurs/ajout-collaborateur/ajout-collaborateur.component';
import { StageComponent } from './commercial/stage/stage.component';
import { MpOublieComponent } from './authentification/mp-oublie/mp-oublie.component';
import { VentesComponent } from './partenaire/commissions/ventes/ventes.component';
import { ReglementComponent } from './partenaire/commissions/reglement/reglement.component';
import { SourcingComponent } from './admission/international/sourcing/sourcing.component';
import { EmployabiliteComponent } from './intuns/employabilite/employabilite.component';
import { FormationsIntunsComponent } from './intuns/formations-intuns/formations-intuns.component';
import { EtudiantsIntunsComponent } from './intuns/etudiants-intuns/etudiants-intuns.component';
import { TeamsIntComponent } from './international/teams-int/teams-int.component';
import { MemberIntComponent } from './international/teams-int/member-int/member-int.component';
import { OrientationComponent } from './admission/international/orientation/orientation.component';
import { AdmissionIntComponent } from './admission/international/admission-int/admission-int.component';
import { FormationAdmissionComponent } from './international/formation-admission/formation-admission.component';
import { EcoleAdmissionComponent } from './international/ecole-admission/ecole-admission.component';
import { RentreeScolaireAdmissionComponent } from './international/rentree-scolaire-admission/rentree-scolaire-admission.component';
import { ConsulaireComponent } from './admission/international/consulaire/consulaire.component';
import { FormulaireAdmissionInternationalComponent } from './formulaire-admission/formulaire-admission-international/formulaire-admission-international.component';
import { PaiementsComponent } from './admission/international/paiements/paiements.component';
import { StageCeoComponent } from './commercial/stage-ceo/stage-ceo.component';
import { PovPartenaireListProspectsComponent } from './admission/international/pov-partenaire-list-prospects/pov-partenaire-list-prospects.component';
import { PovPartenaireAlternantsComponent } from './admission/international/pov-partenaire-alternants/pov-partenaire-alternants.component';
import { AjoutAlternantPartenaireComponent } from './admission/international/pov-partenaire-alternants/ajout-alternant-partenaire/ajout-alternant-partenaire.component';
import { DashboardIntComponent } from './international/dashboard-int/dashboard-int.component';
import { BrandsListComponent } from './international/support-marketing/brands-list/brands-list.component';
import { DashboardPartenaireComponent } from './international/dashboard-partenaire/dashboard-partenaire.component';
import { GenerationDocComponent } from './international/generation-doc/generation-doc.component';
import { GenDocInscriptionComponent } from './international/generation-doc/gen-doc-inscription/gen-doc-inscription.component';
import { GenDocPreinscriptionComponent } from './international/generation-doc/gen-doc-preinscription/gen-doc-preinscription.component';
import { GenDocPaiementPreinscriptionComponent } from './international/generation-doc/gen-doc-paiement-preinscription/gen-doc-paiement-preinscription.component';
import { GenDocPaiementPreinscriptionAcompteComponent } from './international/generation-doc/gen-doc-paiement-preinscription-acompte/gen-doc-paiement-preinscription-acompte.component';
import { GenDocPaiementAcompteComponent } from './international/generation-doc/gen-doc-paiement-acompte/gen-doc-paiement-acompte.component';
import { GenDocDerogationComponent } from './international/generation-doc/gen-doc-derogation/gen-doc-derogation.component';
import { GenDocLettreAcceptationComponent } from './international/generation-doc/gen-doc-lettre-acceptation/gen-doc-lettre-acceptation.component';
import { PerformanceComponent } from './international/dashboard-int/performance/performance.component';
import { ListProspectsComponent } from './admission/international/list-prospects/list-prospects.component';
import { LivretGeneratorComponent } from './pedagogie/livret-generator/livret-generator.component';
import { ActualiteComponent } from './international/actualite/actualite.component';
import { DashboardCommercialComponent } from './commercial/dashboard-commercial/dashboard-commercial.component';
import { FormulaireIcbsComponent } from './other/formulaire-icbs/formulaire-icbs.component';
import { ResultatsFormulaireIcbsComponent } from './other/resultats-formulaire-icbs/resultats-formulaire-icbs.component';
import { FormAdmissionDubaiComponent } from './other/form-admission-dubai/form-admission-dubai.component';
import { FormAdmissionDubaiResultsComponent } from './other/form-admission-dubai-results/form-admission-dubai-results.component';
import { AjoutLeadcrmComponent } from './crm/leadcrm/ajout-leadcrm/ajout-leadcrm.component';
import { ListLeadcrmComponent } from './crm/leadcrm/list-leadcrm/list-leadcrm.component';
import { CollaborateursComponent } from './rh/collaborateurs/collaborateurs.component';
import { CongesAutorisationsComponent } from './rh/conges-autorisations/conges-autorisations.component';
import { ActualiteNotificationsComponent } from './rh/actualite-notifications/actualite-notifications.component';
import { DemandesReclamationsComponent } from './rh/demandes-reclamations/demandes-reclamations.component';
import { DashboardRhComponent } from './rh/dashboard-rh/dashboard-rh.component';
import { LeadsNonAttribuesComponent } from './crm/leads-non-attribues/leads-non-attribues.component';
import { MesLeadsComponent } from './crm/mes-leads/mes-leads.component';
import { TeamsCrmComponent } from './crm/teams-crm/teams-crm.component';
import { MemberCrmComponent } from './crm/teams-crm/member-crm/member-crm.component';
import { ImportCrmComponent } from './crm/import-crm/import-crm.component';
import { LeadsNonQualifiesComponent } from './crm/leads-non-qualifies/leads-non-qualifies.component';
import { LeadsPrequalifiesComponent } from './crm/leads-prequalifies/leads-prequalifies.component';
import { VentesCRMComponent } from './crm/ventes-crm/ventes-crm.component';
import { LeadsQualifiesComponent } from './crm/leads-qualifies/leads-qualifies.component';
import { MesTicketsComponent } from './ticketing/mes-tickets/mes-tickets.component';
import { AjoutTicketComponent } from './ticketing/ajout-ticket/ajout-ticket.component';
import { TicketsAssignesComponent } from './ticketing/tickets-assignes/tickets-assignes.component';
import { AddAgentComponent as AddAgentV2Component } from './agents/add-agent/add-agent.component';
import { UpdateAgentComponent } from './agents/update-agent/update-agent.component';
import { ListAgentComponent as ListAgentV2Component } from './agents/list-agent/list-agent.component';
import { TicketNonAssignesComponent } from './ticketing/ticket-non-assignes/ticket-non-assignes.component';
import { ListTicketsTraiteComponent } from './ticketing/list-tickets-traite/list-tickets-traite.component';
import { ListTicketsRefuseComponent } from './ticketing/list-tickets-refuse/list-tickets-refuse.component';
import { ConfigurationComponent } from './ticketing/configuration/configuration.component';
import { ListTicketsEnAttenteDeTraitementComponent } from './ticketing/list-tickets-en-attente-de-traitement/list-tickets-en-attente-de-traitement.component';
import { DashboardTicketingComponent } from './ticketing/dashboard-ticketing/dashboard-ticketing.component';
import { PaiementComponent } from './international/generation-doc/paiement/paiement.component';
import { LeadProgrammeComponent } from './admission/lead/lead-programme/lead-programme.component';
import { LeadDossierComponent } from './admission/lead/lead-dossier/lead-dossier.component';
import { LeadPaiementsComponent } from './admission/lead/lead-paiements/lead-paiements.component';
import { LeadInformationsPersonnelComponent } from './admission/lead/lead-informations-personnel/lead-informations-personnel.component';
import { LeadSuiviComponent } from './admission/lead/lead-suivi/lead-suivi.component';
import { VersionNonIframeComponent } from './formulaire-admission/formulaire-admission-international/version-non-iframe/version-non-iframe.component';
import { ConfigurationMailComponent } from './mail-type/configuration-mail/configuration-mail.component';
import { MailTypeComponent } from './mail-type/mail/mail.component';
import { MailAutoComponent } from './mail-type/mail-auto/mail-auto.component';
import { MyTargetComponent } from './crm/target/my-target/my-target.component';
import { DashboardTargetComponent } from './crm/target/dashboard-target/dashboard-target.component';
import { ConfigurationTargetComponent } from './crm/target/configuration-target/configuration-target.component';
import { DocCheckerComponent } from './international/generation-doc/doc-checker/doc-checker.component';
import { LeadCandidatureComponent } from './admission/lead/lead-candidature/lead-candidature.component';
import { GestionComponent } from './project-v2/gestion-des-projects/gestion/gestion.component';
import { MytaskComponent } from './project-v2/mytask/mytask.component';
import { MyprojectComponent } from './project-v2/myproject/myproject.component';
import { DashboardProjectV2Component } from './project-v2/dashboard-project-v2/dashboard-project-v2.component';
import { BookingV2Component } from './booking-v2/booking-v2.component';
import { IMatchComponent } from './skillsnet/i-match/i-match.component';
import { CvComponent } from './skillsnet/i-match/cv/cv.component';
import { AjoutCvComponent } from './skillsnet/i-match/cv/ajout-cv/ajout-cv.component';
import { ConfigurationPointeuseComponent } from './rh/configuration-pointeuse/configuration-pointeuse.component';
import { CalendrierRhComponent } from './rh/calendrier-rh/calendrier-rh.component';
import { ConfigurationPointageComponent } from './rh/configuration-pointage/configuration-pointage.component';
import { RendezVousComponent } from './skillsnet/i-match/rendez-vous/rendez-vous.component';
import { GestionMentionServiceComponent } from './agents/gestion-mention-service/gestion-mention-service.component';
import { ArchivagePointageComponent } from './rh/archivage-pointage/archivage-pointage.component';
import { ConfigurationMIComponent } from './other/formulaireMI/configuration-mi/configuration-mi.component';
import { FormulaireMIComponent } from './other/formulaireMI/formulaire-mi/formulaire-mi.component';
import { ResultatsMIComponent } from './other/formulaireMI/resultats-mi/resultats-mi.component';
import { GenschoolComponent } from './gen_doc/genschool/genschool.component';
import { GencampusComponent } from './gen_doc/gencampus/gencampus.component';
import { GenformationComponent } from './gen_doc/genformation/genformation.component';
import { GendocComponent } from './gen_doc/gendoc/gendoc.component';
import { RendezVousResultatsComponent } from './skillsnet/i-match/rendez-vous-resultats/rendez-vous-resultats.component';
import { GendocViewComponent } from './gen_doc/gendoc/gendoc-view/gendoc-view.component';
import { FormulaireFrontComponent } from './template/formulaire/formulaire-front/formulaire-front.component';
import { DashboardAlternanceComponent } from './commercial/dashboard-alternance/dashboard-alternance.component';
import { MesRendezVousComponent } from './skillsnet/mes-rendez-vous/mes-rendez-vous.component';
import { EntrepriseDashboardComponent } from './skillsnet/entreprise-dashboard/entreprise-dashboard.component';
import { SuiviCandidatComponent } from './skillsnet/suivi-candidat/suivi-candidat.component';
import { AjouterUnTicketProjetComponent } from './ticketing/ajouter-un-ticket-projet/ajouter-un-ticket-projet.component';
import { InformationsComponent } from './informations/informations.component';
import { LinksComponent } from './links/links.component';
import { VoirCvComponent } from './skillsnet/voir-cv/voir-cv.component';
import { CalendrierEtudiantComponent } from './skillsnet/calendrier-etudiant/calendrier-etudiant.component';
import { ImatchCandidatComponent } from './skillsnet/i-match/imatch-candidat/imatch-candidat.component';
import { ImatchEntrepriseComponent } from './skillsnet/i-match/imatch-entreprise/imatch-entreprise.component';
import { CalenderComponent } from './calender/calender.component';
import { NewListTicketsComponent } from './ticketing/new-list-tickets/new-list-tickets.component';
// <<<<<<< HEAD
import { NewCvthequeInterneComponent } from './skillsnet/i-match/new-cvtheque-interne/new-cvtheque-interne.component';
import { AddRemboussementComponent } from './remboussement/add-remboussement/add-remboussement.component';
import { RemboursementListComponent } from './remboussement/remboursement-list/remboursement-list.component';
// =======
// import {AddRemboussementComponent} from "./remboussement/add-remboussement/add-remboussement.component";
// >>>>>>> de65bc579e9136f39326ed2bfdfd50dcc37e01e8
const routes: Routes = [
    {
        path: '',
        component: AppMainComponent,
        children: [
            {
                path: '',
                component: DashboardComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'gestion-des-utilisateurs',
                component: UsersSettingsComponent,
                canActivate: [AdminGuardService],
            },
            {
                path: 'analyseur-doublons',
                component: AnalyseDoublonComponent,
                canActivate: [AdminGuardService],
            },
            {
                path: 'notes',
                component: BulletinComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'notesDev',
                component: NotesComponent,
                canActivate: [AdminGuardService],
            },
            {
                path: 'admin/partenaire',
                component: ListPartenaireComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admin/ajout-de-partenaire',
                component: ListPartenaireComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'collaborateur',
                component: ListCollaborateurComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'collaborateur/:id',
                component: ListCollaborateurComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'ajout-collaborateur/:id',
                component: AjoutCollaborateurComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'annee-scolaire',
                component: ListAnneeScolaireComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'ajout-annee-scolaire',
                component: AddAnneeScolaireComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'ecole',
                component: ListEcoleComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'ecole/:id',
                component: ListEcoleComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'ajout-ecole',
                component: AddEcoleComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'campus',
                component: ListCampusComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'campus/:id',
                component: ListCampusComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'ajout-campus',
                component: AddCampusComponent,
                canActivate: [AuthGuardService,],
            },
            {
                path: 'diplomes',
                component: ListDiplomeComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'diplomes/:id',
                component: ListDiplomeComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'ajout-diplome',
                component: AddDiplomeComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'groupes',
                component: ListGroupeComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'ajout-groupe',
                component: AddGroupeComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admin/agents',
                component: ListAgentComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admin/ajout-agent',
                component: AddAgentComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'gestion-tickets',
                component: GestionTicketsComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'suivi-ticket',
                component: SuiviTicketsComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admin/gestion-services',
                component: GestionServicesComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'matieres',
                component: MatieresComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'matieres/:id',
                component: MatieresComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'ajout-formateur',
                component: AddFormateurComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'formateurs',
                component: ListFormateursComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'progression-pedagogique/:formateur_id',
                component: ProgressionPedagogiqueComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'ajout-etudiant',
                component: AddEtudiantComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'etudiants',
                component: ListEtudiantComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'gestion-etudiants',
                component: GestionEtudiantsComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'etudiants/:code',
                component: ListEtudiantComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'ajout-entreprise',
                component: AddEntrepriseComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'assignation-inscrit',
                component: ProspectsComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'validation-inscrit',
                component: ReinscritComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'entreprises',
                component: ListEntrepriseComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'gestion-preinscriptions',
                component: GestionPreinscriptionsComponent,
                canActivate: [AuthGuardService],
            }, //Admission
            {
                path: 'ajout-lead',
                component: AddProspectComponent,
                canActivate: [AuthGuardService],
            }, //Admission
            {
                path: 'gestion-preinscriptions-filtered/:statut',
                component: GestionPreinscriptionsComponent,
                canActivate: [AuthGuardService],
            }, //Admissio
            {
                path: 'gestion-preinscriptions-filter/:statut',
                component: GestionPreinscriptionsComponent,
                canActivate: [AuthGuardService],
            }, //Admissio
            {
                path: 'gestion-preinscriptions/:code',
                component: GestionPreinscriptionsComponent,
                canActivate: [CollaborateurGuard],
            }, //Collaborateur/Partenaire type:Commercial
            {
                path: 'ajout-seance',
                component: AddSeanceComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'seances',
                component: ListSeancesComponent,
                canActivate: [AuthGuardService],
            },
            { path: 'emploi-du-temps', component: EmploiDuTempsComponent },
            {
                path: 'emploi-du-temps/:type/:id',
                component: EmploiDuTempsComponent,
            },
            {
                path: 'emergement/:id',
                component: EmergementComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'examens',
                component: ExamenComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'ajout-examen',
                component: AjoutExamenComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'profil',
                component: UserProfilComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'details/:id',
                component: DetailsEtudiantComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'notifications',
                component: NotificationComponent,
                canActivate: [AuthGuardService],
            },
            { path: 'contact', component: ContactComponent },
            {
                path: 'list-events',
                component: ListEventsComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'assign-ims',
                component: CreateAccountComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'devoirs',
                component: DevoirsComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'rendu-devoirs',
                component: DevoirsEtudiantsComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'tuteur',
                component: TuteurComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'tuteur-ceo',
                component: TuteurCeoComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'tuteur/:entreprise',
                component: TuteurComponent,
                canActivate: [AuthGuardService],
            },

            {
                path: 'prospects-intuns',
                component: ProspectsIntunsComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'prospects-alt',
                component: ProspectsAlternablesComponent,
                canActivate: [AuthGuardService],
            },

            {
                path: 'liste-contrats/:idTuteur',
                component: ListeContratsComponent,
                canActivate: [CeoEntrepriseGuard],
            }, // Listes des apprentie d'un tuteur
            {
                path: 'liste-contrats-ceo',
                component: ContratsTutelleCeoComponent,
                canActivate: [CeoEntrepriseGuard],
            }, // Listes des apprentie d'un tuteur
            {
                path: 'liste-entreprises-ceo',
                component: ListEntrepriseCeoComponent,
                canActivate: [CeoEntrepriseGuard],
            }, // Listes des apprentie d'un tuteur
            {
                path: 'liste-contrats',
                component: ListeContratsComponent,
                canActivate: [TuteurEntrepriseGuard],
            },
            {
                path: 'inscription-entreprise',
                component: InscriptionEntrepriseComponent,
            },


            {
                path: 'ajout-remboussement',
                component: AddRemboussementComponent,
                canActivate: [AuthGuardService],
            }, //Remboursement

            {
                path: 'list-remboussement',
                component: RemboursementListComponent,
                canActivate: [AuthGuardService],  
            },

            /** Paths Lemon Way */

            { path: 'mon-compte-bancaire', component: MyAccountComponent },
            {
                path: 'new-individual-account',
                component: AddNewIndividualAccountComponent,
            },
            { path: 'list-accounts', component: ListeDesComptesComponent },
            { path: 'account-details/:id', component: AccountDetailsComponent },
            { path: 'payment', component: PaymentComponent },
            { path: 'success', component: ReturnUrlComponent },
            { path: 'error', component: ErrorUrlComponent },
            { path: 'cancel', component: CancelUrlComponent },

            /** end */

            /** IMS Project */
            {
                path: 'my-tasks',
                canActivate: [AuthGuardService],
                component: MyTaskComponent,
            },
            {
                path: 'task-management',
                canActivate: [AuthGuardService],
                component: TaskManagementComponent,
            },
            {
                path: 'team',
                canActivate: [AuthGuardService],
                component: TeamComponent,
            },
            /** end */
            /** IMS Project-V2 */
            { path: 'gestion-project', component: GestionComponent, canActivate: [AuthGuardService] },
            { path: 'mytask', component: MytaskComponent, canActivate: [AuthGuardService] },
            { path: 'myproject', component: MyprojectComponent, canActivate: [AuthGuardService] },
            { path: 'dashboard-project-v2', component: DashboardProjectV2Component, canActivate: [AuthGuardService] },
            /** end */

            /**Calender */
            { path: 'calendar', component: CalenderComponent, canActivate: [AuthGuardService] },
            /**informations */
            { path: 'informations', component: InformationsComponent, canActivate: [AuthGuardService] },
            /**links */
            { path: 'Links', component: LinksComponent, canActivate: [AuthGuardService] },
            {
                path: 'logements',
                canActivate: [AuthGuardService],
                component: LogementComponent,
            },
            {
                path: 'gestion-reservations',
                canActivate: [AuthGuardService],
                component: GestionLogementComponent,
            },
            { path: 'logements', canActivate: [AuthGuardService], component: LogementComponent },
            { path: 'gestion-reservations', canActivate: [AuthGuardService], component: GestionLogementComponent },

            { path: 'offres', component: AnnoncesComponent, canActivate: [AuthGuardService] },
            { path: 'mes-offres', component: MesOffresComponent, canActivate: [AuthGuardService] },
            { path: 'matching-externe/:id', component: POVHorsCommercialComponent, canActivate: [AuthGuardService] },
            { path: 'matching/:offre_id', component: MatchingComponent, canActivate: [AuthGuardService] },
            { path: 'old-cvtheque-interne', component: CvthequeComponent, canActivate: [AuthGuardService] },
            { path: 'cvtheque-interne', component: NewCvthequeInterneComponent, canActivate: [AuthGuardService] },
            { path: 'cvtheque-interne/:id', component: CvthequeComponent, canActivate: [AuthGuardService] },
            { path: 'skills-management', component: SkillsManagementComponent, canActivate: [AuthGuardService] },
            { path: 'equipe-commercial', component: GestionEquipeComponent, canActivate: [AuthGuardService] },
            { path: 'detail-equipe-commercial/:equipe_id', component: DetailEquipeComponent, canActivate: [AuthGuardService] },
            { path: 'liste-demande-commercial', component: DemandeConseillerComponent, canActivate: [AuthGuardService] },
            { path: 'liste-demande-commercial/:equipe_id', component: DemandeConseillerComponent, canActivate: [AuthGuardService] },
            { path: 'evenements', component: EvenementsComponent, canActivate: [AuthGuardService] },
            { path: 'imatch/externe', component: ExterneSkillsnetComponent, canActivate: [AuthGuardService] },
            { path: 'stages', component: StageComponent, canActivate: [AuthGuardService] },
            { path: 'stages/:id', component: StageCeoComponent, canActivate: [AuthGuardService] },
            { path: 'livret', component: LivretGeneratorComponent, canActivate: [AuthGuardService] },
            { path: 'livret/:id', component: LivretGeneratorComponent, canActivate: [AuthGuardService] },

            {
                path: 'offres',
                component: AnnoncesComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'mes-offres',
                component: MesOffresComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'matching-externe/:id',
                component: POVHorsCommercialComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'matching/:offre_id',
                component: MatchingComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'cvtheque',
                component: CvthequeComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'cvtheque/:id',
                component: CvthequeComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'skills-management',
                component: SkillsManagementComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'equipe-commercial',
                component: GestionEquipeComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'detail-equipe-commercial/:equipe_id',
                component: DetailEquipeComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'liste-demande-commercial',
                component: DemandeConseillerComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'dashboard-alternance',
                component: DashboardAlternanceComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'liste-demande-commercial/:equipe_id',
                component: DemandeConseillerComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'evenements',
                component: EvenementsComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'imatch/externe',
                component: ExterneSkillsnetComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'stages',
                component: StageComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'stages/:id',
                component: StageCeoComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'livret',
                component: LivretGeneratorComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'livret/:id',
                component: LivretGeneratorComponent,
                canActivate: [AuthGuardService],
            },

            // RH paths
            { path: 'rh/collaborateurs', component: CollaborateursComponent },
            {
                path: 'rh/conges-autorisations',
                component: CongesAutorisationsComponent,
            },
            {
                path: 'rh/actualite-notifications',
                component: ActualiteNotificationsComponent,
            },
            {
                path: 'rh/demandes-reclamations',
                component: DemandesReclamationsComponent,
            },
            { path: 'rh/dashboard', component: DashboardRhComponent },
            { path: 'rh/calendrier', component: CalendrierRhComponent },
            { path: 'rh/calendrier/:id', component: CalendrierRhComponent },

            /** end */
            {
                path: 'resultats-icbs',
                component: ResultatsFormulaireIcbsComponent,
            },
            {
                path: 'infos-ims',
                canActivate: [AdminGuardService],
                component: InfoImsComponent,
            },
            {
                path: 'suivi-preinscription/:user_id',
                component: SuiviePreinscriptionComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'facture-formateur',
                component: FactureFormateurComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'resultat-qs',
                component: ResultatComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'resultat-qf',
                component: ResultatQfComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'resultat-qff',
                component: ResultatQFFComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'formateur/etudiants',
                component: PovFormateurComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'pv-annuel/:classe_id',
                component: PvAnnuelComponent,
                canActivate: [AuthGuardService],
                canDeactivate: [PendingChangesGuard],
            },
            {
                path: 'pv-semestriel/:semestre/:classe_id',
                component: PvSemestrielComponent,
                canActivate: [AuthGuardService],
                canDeactivate: [PendingChangesGuard],
            },
            {
                path: 'pv-appreciation/:semestre/:classe_id',
                component: PvAppreciationComponent,
                canActivate: [AuthGuardService],
                canDeactivate: [PendingChangesGuard],
            },
            {
                path: 'appreciation/:semestre/:classe_id/:formateur_id',
                component: AppreciationInputComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'bulletin/:semestre/:classe_id/:etudiant_id/:pv_id',
                component: BulletinComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'formulaire-formateur',
                component: QuestionnaireFormateurComponent,
                canActivate: [AuthGuardService],
            },
            /* Partenaire Haithem */
            {
                path: 'commissions/ventes',
                component: VentesComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'commissions/reglement',
                component: ReglementComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'commissions/ventes/:partenaire_id',
                component: VentesComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'commissions/reglement/:partenaire_id',
                component: ReglementComponent,
                canActivate: [AuthGuardService],
            },
            /* International Haithem */
            {
                path: 'international/sourcing',
                component: SourcingComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/orientation',
                component: OrientationComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/admission',
                component: AdmissionIntComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/consulaire',
                component: ConsulaireComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/paiement',
                component: PaiementsComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/teams',
                component: TeamsIntComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/member',
                component: MemberIntComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/alternants',
                component: PovPartenaireAlternantsComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/partenaire/ajout-alternant/:code_commercial',
                component: AjoutAlternantPartenaireComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/partenaire/alternants/:id',
                component: PovPartenaireAlternantsComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/partenaire/:id',
                component: PovPartenaireListProspectsComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'dashboard/partenaire',
                component: DashboardPartenaireComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'dashboard/commercial',
                component: DashboardCommercialComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'dashboard/partenaire/:id',
                component: DashboardPartenaireComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/dashboard',
                component: DashboardIntComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/dashboard/performance',
                component: PerformanceComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/brands/:id',
                component: BrandsListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/brands',
                component: BrandsListComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/prospects',
                component: ListProspectsComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/actualite/:type',
                component: ActualiteComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/actualite',
                component: ActualiteComponent,
                canActivate: [AuthGuardService],
            },
            /* Generation Documents */
            {
                path: 'international/generation-documents',
                component: GenerationDocComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/generation-documents/inscription/:ecole/:prospect_id/:formation/:rentree',
                component: GenDocInscriptionComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/generation-documents/preinscription/:ecole/:prospect_id/:formation/:rentree',
                component: GenDocPreinscriptionComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/generation-documents/paiement/:ecole/:prospect_id/:formation/:rentree',
                component: PaiementComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/generation-documents/paiement-preinscription/:ecole/:prospect_id/:formation/:rentree',
                component: GenDocPaiementPreinscriptionComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/generation-documents/paiement-preinscription-acompte/:ecole/:prospect_id/:formation/:rentree',
                component: GenDocPaiementPreinscriptionAcompteComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/generation-documents/paiement-acompte/:ecole/:prospect_id/:formation/:rentree',
                component: GenDocPaiementAcompteComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/generation-documents/derogation/:ecole/:prospect_id/:formation/:rentree',
                component: GenDocDerogationComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'international/generation-documents/lettre-acceptation/:ecole/:prospect_id/:formation/:rentree',
                component: GenDocLettreAcceptationComponent,
                canActivate: [AuthGuardService],
            },
            /* Module CRM */
            {
                path: 'crm/leads/ajout',
                component: AjoutLeadcrmComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'crm/leads/liste',
                component: ListLeadcrmComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'crm/leads/liste-non-attribue',
                component: LeadsNonAttribuesComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'crm/mes-leads/liste/:id',
                component: MesLeadsComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'crm/teams',
                component: TeamsCrmComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'crm/member',
                component: MemberCrmComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'crm/import',
                component: ImportCrmComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'crm/leads/non-qualifies',
                component: LeadsNonQualifiesComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'crm/leads/pre-qualifies',
                component: LeadsPrequalifiesComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'crm/leads/qualifies',
                component: LeadsQualifiesComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'crm/mes-leads/non-qualifies/:id',
                component: LeadsNonQualifiesComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'crm/mes-leads/pre-qualifies/:id',
                component: LeadsPrequalifiesComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'crm/mes-leads/qualifies/:id',
                component: LeadsQualifiesComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'crm/ventes',
                component: VentesCRMComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'crm/target/configuration',
                component: ConfigurationTargetComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'crm/target/my-target',
                component: MyTargetComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'crm/target/dashboard',
                component: DashboardTargetComponent,
                canActivate: [AuthGuardService],
            },
            /* Intuns */
            {
                path: 'intuns/employabilite',
                component: EmployabiliteComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'intuns/formations',
                component: FormationsIntunsComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'intuns/etudiants',
                component: EtudiantsIntunsComponent,
                canActivate: [AuthGuardService],
            },
            /*Ticketing V2*/
            { path: 'ticketing/gestion/ajout', component: AjoutTicketComponent, canActivate: [AuthGuardService] },
            { path: 'ticketing/gestion/ajout/:service_id', component: AjoutTicketComponent, canActivate: [AuthGuardService] },
            { path: 'ticketing/gestion/mes-tickets', component: MesTicketsComponent, canActivate: [AuthGuardService] },
            { path: 'ticketing/suivi/attente-de-traitement', component: ListTicketsEnAttenteDeTraitementComponent, canActivate: [AuthGuardService] },
            { path: 'ticketing/suivi/attente-de-traitement/:service', component: ListTicketsEnAttenteDeTraitementComponent, canActivate: [AuthGuardService] },
            { path: 'ticketing/suivi/traite', component: ListTicketsTraiteComponent, canActivate: [AuthGuardService] },
            { path: 'ticketing/suivi/traite/:service', component: ListTicketsTraiteComponent, canActivate: [AuthGuardService] },
            { path: 'ticketing/suivi/refuse', component: ListTicketsRefuseComponent, canActivate: [AuthGuardService] },
            { path: 'ticketing/suivi/refuse/:service', component: ListTicketsRefuseComponent, canActivate: [AuthGuardService] },
            { path: 'ticketing/suivi/non-assignes', component: TicketNonAssignesComponent, canActivate: [AuthGuardService] },
            { path: 'ticketing/suivi/non-assignes/:service', component: TicketNonAssignesComponent, canActivate: [AuthGuardService] },
            { path: 'ticketing/gestion/assignes', component: TicketsAssignesComponent, canActivate: [AuthGuardService] },
            { path: 'ticketing/Ajouter-un-ticket-projet', component: AjouterUnTicketProjetComponent, canActivate: [AuthGuardService] },
            { path: 'ticketing/configuration', component: ConfigurationComponent, canActivate: [AuthGuardService] },
            { path: 'ticketing/dashboard', component: DashboardTicketingComponent, canActivate: [AuthGuardService] },
            { path: 'ticketing-igs', component: AjoutTicketComponent, canActivate: [AuthGuardService] },
            { path: 'configuration/service-mention', component: GestionMentionServiceComponent, canActivate: [AuthGuardService] },
            /* Ticketing V3 */
            { path: 'ticketing/mes-tickets', component: NewListTicketsComponent, canActivate: [AuthGuardService] },
            /* Gestion Agent V2 */
            {
                path: 'agent/ajout',
                component: AddAgentV2Component,
                canActivate: [AuthGuardService],
            },
            {
                path: 'agent/list',
                component: ListAgentV2Component,
                canActivate: [AuthGuardService],
            },
            {
                path: 'agent/update/:id',
                component: UpdateAgentComponent,
                canActivate: [AuthGuardService],
            },
            /* Configuration Formulaire Admission */
            {
                path: 'admission/formations',
                component: FormationAdmissionComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admission/ecoles',
                component: EcoleAdmissionComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admission/rentree',
                component: RentreeScolaireAdmissionComponent,
                canActivate: [AuthGuardService],
            },

            // dubai admission form
            {
                path: 'admission/dubai-form-results',
                component: FormAdmissionDubaiResultsComponent,
                canActivate: [AuthGuardService],
            },
            //Accès Prospect V2
            {
                path: 'admission/lead-programme/:id',
                component: LeadProgrammeComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admission/lead-dossier/:id',
                component: LeadDossierComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admission/lead-paiements/:id',
                component: LeadPaiementsComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admission/lead-informations/:id',
                component: LeadInformationsPersonnelComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admission/lead-suivi/:id',
                component: LeadSuiviComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'admission/lead-candidature/:id',
                component: LeadCandidatureComponent,
                canActivate: [AuthGuardService],
            },
            //Module Mail Type
            { path: 'mails/configuration', component: ConfigurationMailComponent, canActivate: [AuthGuardService] },
            { path: 'mails/type', component: MailTypeComponent, canActivate: [AuthGuardService] },
            { path: 'mails/auto', component: MailAutoComponent, canActivate: [AuthGuardService] },
            { path: 'pointeuse/configuration', component: ConfigurationPointeuseComponent, canActivate: [AuthGuardService] },
            { path: 'pointage/configuration', component: ConfigurationPointageComponent, canActivate: [AuthGuardService] },
            { path: 'pointage/archivage', component: ArchivagePointageComponent, canActivate: [AuthGuardService] },

            //Module Booking V2
            {
                path: 'booking/configuration',
                component: BookingV2Component,
                canActivate: [AuthGuardService],
            },
            //Module Formulaire MI
            { path: 'formulaireMI/configuration', component: ConfigurationMIComponent, canActivate: [AuthGuardService] },
            { path: 'formulaireMI/resultats', component: ResultatsMIComponent, canActivate: [AuthGuardService] },


            { path: 'generateur-cv', component: AjoutCvComponent, canActivate: [AuthGuardService], },
            { path: 'cv/:cv_id', component: VoirCvComponent, canActivate: [AuthGuardService], },
            { path: 'generateur-cv/:id', component: AjoutCvComponent, canActivate: [AuthGuardService], },
            { path: 'imatch/rendez-vous', component: RendezVousResultatsComponent, canActivate: [AuthGuardService], },
            { path: 'mes-rendez-vous', component: MesRendezVousComponent, canActivate: [AuthGuardService], },
            { path: 'mes-disponibilites', component: CalendrierEtudiantComponent, canActivate: [AuthGuardService], },
            { path: 'suivi-candidat', component: SuiviCandidatComponent, canActivate: [AuthGuardService], },
            { path: 'entreprise-dashboard', component: EntrepriseDashboardComponent, canActivate: [AuthGuardService], },

            // Generateur de Doc
            { path: 'genschools', component: GenschoolComponent, canActivate: [AuthGuardService] },
            { path: 'genCampus', component: GencampusComponent, canActivate: [AuthGuardService] },
            { path: 'genFormation', component: GenformationComponent, canActivate: [AuthGuardService] },
            { path: 'genDoc', component: GendocComponent, canActivate: [AuthGuardService] },
            //Template
            { path: 'template/formulaire', component: FormulaireFrontComponent, canActivate: [AuthGuardService] },
            { path: 'template/formulaire/:ecole', component: FormulaireFrontComponent, canActivate: [AuthGuardService] },
        ],
    },
    {
        path: 'formulaire-entreprise/:code',
        component: InscriptionEntrepriseComponent,
    },
    { path: 'formulaire', component: DemandeEventsComponent },
    { path: 'formulaire-mi', component: FormulaireMIComponent },
    { path: 'completion-profil', canActivate: [AuthGuardService, CompletionProfilGuard], component: FirstConnectionComponent },
    { path: 'formulaire-admission/:ecole', component: FormulaireAdmissionComponent, canActivate: [FormAdmissionGuard] },
    { path: 'formulaire-admission-international/:ecole', component: VersionNonIframeComponent },
    { path: 'formulaire-admission-international/:ecole/:code_commercial', component: VersionNonIframeComponent },
    { path: 'formulaire-admission-int/:ecole', component: FormulaireAdmissionInternationalComponent },
    { path: 'formulaire-admission-int-lang/:ecole/:lang', component: FormulaireAdmissionInternationalComponent },
    { path: 'formulaire-admission-int/:ecole/:code_commercial', component: FormulaireAdmissionInternationalComponent },
    { path: 'formulaire-admission-alternance/:id', component: ProspectAltFormComponent },
    { path: 'formulaire-admission-intuns', component: FormulaireIntunsComponent },
    { path: 'formulaire-admission/:ecole/:code_commercial', component: FormulaireAdmissionComponent, canActivate: [FormAdmissionGuard] },
    { path: 'partenaireInscription', component: PartenaireInscriptionComponent },
    { path: 'login', component: ExterneComponent, canActivate: [LoginGuard] },
    {
        path: 'suivre-ma-preinscription',
        component: SuiviePreinscriptionComponent,
        canActivate: [ProspectGuard],
    },
    {
        path: 'suivre-ma-preinscription/:user_id',
        component: SuiviePreinscriptionComponent,
        canActivate: [ProspectGuard],
    },
    { path: 'creer-mon-entreprise/:id', component: EntrepriseFormComponent },

    { path: 'pages/landing', component: LandingComponent },
    { path: 'pages/error', component: ErrorComponent },
    { path: 'pages/notfound', component: NotfoundComponent },
    { path: 'pages/access', component: AccessComponent },
    { path: 'validation-email/:mail', component: ValidationEmailComponent }, // platforme activer mon compte en validant mon email
    { path: 'validation-email', component: ValidationEmailComponent }, // platforme activer mon compte en validant mon email
    { path: 'mentions-legales', component: MentionsLegalesComponent },
    {
        path: 'politique-confidentialite',
        component: PolitiqueConfidentialiteComponent,
    },
    { path: 'auth', component: MsalRedirectComponent },
    { path: 'code', redirectTo: '' },
    {
        path: 'questionnaire-satisfaction',
        component: QuestionnaireSatisfactionComponent,
    },
    {
        path: 'questionnaire-fin-formation',
        component: QuestionnaireFinFormationComponent,
    },
    {
        path: 'formulaire-externe',
        component: FormulaireExterneSkillsnetComponent,
    },
    { path: 'mp-oublie', component: MpOublieComponent },
    { path: 'mp-oublie/:id', component: MpOublieComponent },
    { path: 'questionnaire-icbs', component: FormulaireIcbsComponent },
    { path: 'admission/dubai-form', component: FormAdmissionDubaiComponent },
    { path: 'document-authentification', component: DocCheckerComponent },
    // Accessible from anywhere
    { path: 'imatch', component: IMatchComponent },
    { path: 'imatch/cvtheque', component: ImatchCandidatComponent },
    { path: 'imatch/offres', component: ImatchEntrepriseComponent },
    { path: 'rendez-vous', component: RendezVousComponent },
    { path: 'rendez-vous/:user_id', component: RendezVousComponent },
    { path: 'imatch/cv/:id', component: CvComponent },

    { path: 'document/:id_doc', component: GendocViewComponent },
// <<<<<<< HEAD
    
// =======


// >>>>>>> de65bc579e9136f39326ed2bfdfd50dcc37e01e8
]


@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'enabled',
            anchorScrolling: 'enabled',
            useHash: false,
        }),
    ],

    exports: [RouterModule],
})
export class AppRoutingModule { }
