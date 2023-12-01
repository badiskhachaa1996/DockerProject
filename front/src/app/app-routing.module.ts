import { GestionEtudiantsComponent } from './pedagogie/etudiants/gestion-etudiants/gestion-etudiants.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AppMainComponent } from './app.main.component';
import { LandingComponent } from './components/landing/landing.component';
import { ErrorComponent } from './components/error/error.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AccessComponent } from './components/access/access.component';
/***************************/
import { ListPartenaireComponent } from './partenaire/partenaires/list-partenaire/list-partenaire.component';
import { ListCollaborateurComponent } from './partenaire/collaborateurs/list-collaborateur/list-collaborateur.component';
/*
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
 */
import { MatieresComponent } from './pedagogie/matieres/matieres.component';
import { AddFormateurComponent } from './pedagogie/formateurs/add-formateur/add-formateur.component';
import { ListFormateursComponent } from './pedagogie/formateurs/list-formateurs/list-formateurs.component';
import { AddEtudiantComponent } from './pedagogie/etudiants/add-etudiant/add-etudiant.component';
import { ListEtudiantComponent } from './pedagogie/etudiants/list-etudiant/list-etudiant.component';
import { ListEntrepriseComponent } from './pedagogie/entreprises/list-entreprise/list-entreprise.component';
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
//import { AdminGuardService } from './dev-components/guards/admin-guard';

import { FirstConnectionComponent } from './profil/first-connection/first-connection.component';
import { ProspectsComponent } from './pedagogie/assignation-groupe/prospects.component';
import { ProspectGuard } from './dev-components/guards/prospect-guard';
//import { ReinscritComponent } from './administration/validation-prospects/reinscrit.component';
import { LoginGuard } from './dev-components/guards/login-guard';
//import { FormAdmissionGuard } from './dev-components/guards/formAdmission-guard';
import { DetailsEtudiantComponent } from './pedagogie/etudiants/details-etudiant/details-etudiant.component';
import { NotificationComponent } from './ticketing/notification/notification.component';
import { ContactComponent } from './footer/contact/contact.component';
//import { CollaborateurGuard } from './dev-components/guards/collaborateur.guard';
import { MentionsLegalesComponent } from './footer/mentions-legales/mentions-legales.component';
import { PolitiqueConfidentialiteComponent } from './footer/politique-confidentialite/politique-confidentialite.component';
import { InscriptionEntrepriseComponent } from './pedagogie/entreprises/inscription-entreprise/inscription-entreprise.component';
import { DemandeEventsComponent } from './demande-events/demande-events.component';
import { ListEventsComponent } from './demande-events/list-events/list-events.component';

import {
    MsalRedirectComponent,
} from '@azure/msal-angular'; // MsalGuard added to imports

import { TuteurComponent } from './pedagogie/tuteur/tuteur.component';

import { ListeContratsComponent } from './pedagogie/entreprises/liste-contrats/liste-contrats.component';
import { TuteurEntrepriseGuard } from './dev-components/guards/tuteur-entreprise.guard';
import { CeoEntrepriseGuard } from './dev-components/guards/ceo-entreprise.guard';
import { CompletionProfilGuard } from './dev-components/guards/completion-profil.guard';
//import { GestionEquipeComponent } from './commercial/gestion-equipe/gestion-equipe.component';
//import { DetailEquipeComponent } from './commercial/detail-equipe/detail-equipe.component';
//import { DemandeConseillerComponent } from './commercial/demande-conseiller/demande-conseiller.component';
//import { UsersSettingsComponent } from './admin-tools/users-settings/users-settings.component';
//import { InfoImsComponent } from './admin-tools/info-ims/info-ims.component';
import { FactureFormateurComponent } from './finance/facture-formateur/facture-formateur.component';
import { FormulaireIntunsComponent } from './formulaire-admission/formulaire-intuns/formulaire-intuns.component';
import { ProgressionPedagogiqueComponent } from './pedagogie/formateurs/progression-pedagogique/progression-pedagogique.component';
import { QuestionnaireSatisfactionComponent } from './pedagogie/questionnaire-satisfaction/questionnaire-satisfaction.component';
import { ResultatComponent } from './pedagogie/questionnaire-satisfaction/resultat/resultat.component';
import { ProspectsIntunsComponent } from './admission/prospects-intuns/prospects-intuns.component';
import { QuestionnaireFinFormationComponent } from './pedagogie/questionnaire-fin-formation/questionnaire-fin-formation.component';
import { PovFormateurComponent } from './pedagogie/etudiants/list-etudiant/pov-formateur/pov-formateur.component';
import { PvSemestrielComponent } from './pedagogie/notes/pv-semestriel/pv-semestriel.component';
import { PendingChangesGuard } from './dev-components/guards/pending-changes.guard';
import { BulletinComponent } from './pedagogie/notes/bulletin/bulletin.component';
import { PvAppreciationComponent } from './pedagogie/notes/pv-appreciation/pv-appreciation.component';
import { AppreciationInputComponent } from './pedagogie/formateurs/appreciation-input/appreciation-input.component';
import { PvAnnuelComponent } from './pedagogie/notes/pv-annuel/pv-annuel.component';
import { ListEntrepriseCeoComponent } from './pedagogie/entreprises/list-entreprise-ceo/list-entreprise-ceo.component';
import { TuteurCeoComponent } from './pedagogie/tuteur-ceo/tuteur-ceo.component';
import { ContratsTutelleCeoComponent } from './pedagogie/entreprises/contrats-tutelle-ceo/contrats-tutelle-ceo.component';
import { EntrepriseFormComponent } from './pedagogie/entreprises/entreprise-form/entreprise-form.component';
import { FormulaireExterneSkillsnetComponent } from './skillsnet/externe-skillsnet/formulaire-externe-skillsnet/formulaire-externe-skillsnet.component';
import { POVHorsCommercialComponent } from './skillsnet/matching/povhors-commercial/povhors-commercial.component';
import { ProspectAltFormComponent } from './pedagogie/etudiants/prospect-alt-form/prospect-alt-form.component';
//import { ProspectsAlternablesComponent } from './commercial/prospects-alternables/prospects-alternables.component';
import { AddProspectComponent } from './admission/add-prospect/add-prospect.component';
import { QuestionnaireFormateurComponent } from './pedagogie/questionnaire-formateur/questionnaire-formateur.component';
import { ResultatQfComponent } from './pedagogie/questionnaire-formateur/resultat-qf/resultat-qf.component';
import { ResultatQFFComponent } from './pedagogie/questionnaire-fin-formation/resultat-qff/resultat-qff.component';
import { AjoutCollaborateurComponent } from './partenaire/collaborateurs/ajout-collaborateur/ajout-collaborateur.component';
//import { StageComponent } from './commercial/stage/stage.component';
import { MpOublieComponent } from './authentification/mp-oublie/mp-oublie.component';
import { VentesComponent } from './partenaire/commissions/ventes/ventes.component';
import { ReglementComponent } from './partenaire/commissions/reglement/reglement.component';
import { EmployabiliteComponent } from './intuns/employabilite/employabilite.component';
import { FormationsIntunsComponent } from './intuns/formations-intuns/formations-intuns.component';
import { EtudiantsIntunsComponent } from './intuns/etudiants-intuns/etudiants-intuns.component';
import { FormulaireAdmissionInternationalComponent } from './formulaire-admission/formulaire-admission-international/formulaire-admission-international.component';
//import { StageCeoComponent } from './commercial/stage-ceo/stage-ceo.component';
import { DashboardPartenaireComponent } from './international/dashboard-partenaire/dashboard-partenaire.component';
import { LivretGeneratorComponent } from './pedagogie/livret-generator/livret-generator.component';
//import { DashboardCommercialComponent } from './commercial/dashboard-commercial/dashboard-commercial.component';
import { FormulaireIcbsComponent } from './other/formulaire-icbs/formulaire-icbs.component';
import { ResultatsFormulaireIcbsComponent } from './other/resultats-formulaire-icbs/resultats-formulaire-icbs.component';
import { FormAdmissionDubaiComponent } from './other/form-admission-dubai/form-admission-dubai.component';
//import { CollaborateursComponent } from './rh/collaborateurs/collaborateurs.component';
//import { CongesAutorisationsComponent } from './rh/conges-autorisations/conges-autorisations.component';
//import { ActualiteNotificationsComponent } from './rh/actualite-notifications/actualite-notifications.component';
//import { DemandesReclamationsComponent } from './rh/demandes-reclamations/demandes-reclamations.component';
//import { DashboardRhComponent } from './rh/dashboard-rh/dashboard-rh.component';

import { UpdateAgentComponent } from './agents/update-agent/update-agent.component';
import { ListAgentComponent as ListAgentV2Component } from './agents/list-agent/list-agent.component';

import { ConfigurationComponent } from './ticketing/configuration/configuration.component';
import { DashboardTicketingComponent } from './ticketing/dashboard-ticketing/dashboard-ticketing.component';
import { VersionNonIframeComponent } from './formulaire-admission/formulaire-admission-international/version-non-iframe/version-non-iframe.component';
import { ConfigurationMailComponent } from './mail-type/configuration-mail/configuration-mail.component';
import { MailTypeComponent } from './mail-type/mail/mail.component';
import { MailAutoComponent } from './mail-type/mail-auto/mail-auto.component';
import { DocCheckerComponent } from './international/generation-doc/doc-checker/doc-checker.component';
import { GestionComponent } from './project-v2/gestion-des-projects/gestion/gestion.component';
import { MytaskComponent } from './project-v2/mytask/mytask.component';
import { MyprojectComponent } from './project-v2/myproject/myproject.component';
import { DashboardProjectV2Component } from './project-v2/dashboard-project-v2/dashboard-project-v2.component';
import { IMatchComponent } from './skillsnet/i-match/i-match.component';
//import { ConfigurationPointeuseComponent } from './rh/configuration-pointeuse/configuration-pointeuse.component';
//import { CalendrierRhComponent } from './rh/calendrier-rh/calendrier-rh.component';
//import { ConfigurationPointageComponent } from './rh/configuration-pointage/configuration-pointage.component';
import { RendezVousComponent } from './skillsnet/i-match/rendez-vous/rendez-vous.component';
//import { GestionMentionServiceComponent } from './agents/gestion-mention-service/gestion-mention-service.component';
//import { ArchivagePointageComponent } from './rh/archivage-pointage/archivage-pointage.component';
import { ConfigurationMIComponent } from './other/formulaireMI/configuration-mi/configuration-mi.component';
import { FormulaireMIComponent } from './other/formulaireMI/formulaire-mi/formulaire-mi.component';
import { ResultatsMIComponent } from './other/formulaireMI/resultats-mi/resultats-mi.component';
import { GenschoolComponent } from './gen_doc/genschool/genschool.component';
import { GencampusComponent } from './gen_doc/gencampus/gencampus.component';
import { GenformationComponent } from './gen_doc/genformation/genformation.component';
import { GendocComponent } from './gen_doc/gendoc/gendoc.component';
import { GendocViewComponent } from './gen_doc/gendoc/gendoc-view/gendoc-view.component';
import { FormulaireFrontComponent } from './template/formulaire/formulaire-front/formulaire-front.component';
//import { DashboardAlternanceComponent } from './commercial/dashboard-alternance/dashboard-alternance.component';
import { AjouterUnTicketProjetComponent } from './ticketing/ajouter-un-ticket-projet/ajouter-un-ticket-projet.component';
import { LinksComponent } from './links/links.component';
import { ImatchCandidatComponent } from './skillsnet/i-match/imatch-candidat/imatch-candidat.component';
import { ImatchEntrepriseComponent } from './skillsnet/i-match/imatch-entreprise/imatch-entreprise.component';
import { CalenderComponent } from './calender/calender.component';
import { NewListTicketsComponent } from './ticketing/new-list-tickets/new-list-tickets.component';
import { ListRemboursementComponent } from './remboursement/list-remboursement/list-remboursement.component';

//import { NewCalendrierComponent } from './rh/new-calendrier/new-calendrier.component';
//import { GestionEquipeRhComponent } from './rh/gestion-equipe-rh/gestion-equipe-rh.component';
import { AddRemboursementPublicComponent } from './remboursement/add-remboursement-public/add-remboursement-public.component';
import { AddRemboussementComponent } from './remboursement/add-remboursement/add-remboussement.component';
//import { CrmListComponent } from './crm/crm-list/crm-list.component';
import { LogementComponent } from './ims+/logement/logement.component';
import { GestionLogementComponent } from './ims+/gestion-logement/gestion-logement.component';
import { BookingV2Component } from './booking-v2/booking-v2.component';
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
                path: 'skillsnet',
                loadChildren: () => import('./skillsnet/skillsnet.module').then(m => m.SkillsNetModule)
            },
            {
                path: 'i-match',
                loadChildren: () => import('./skillsnet/i-match/imatch.module').then(m => m.IMatchModule)

            }, {
                path: 'administration',
                loadChildren: () => import('./administration-v1/Admin.module').then(m => m.AdminModule)

            },
            {
                path: 'gestion-des-utilisateurs',
                loadChildren: () => import('./admin-tools/admin-tools.module').then(m => m.AdminToolsModule)
            },
            {
                path: 'notes',
                component: BulletinComponent,
                canActivate: [AuthGuardService],
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
                loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
            },
            {
                path: 'ajout-annee-scolaire',
                loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
            },
            {
                path: 'ecole',
                loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
            },
            {
                path: 'ecole/:id',
                loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
            },
            {
                path: 'ajout-ecole',
                loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
            },
            {
                path: 'campus',
                loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
            },
            {
                path: 'campus/:id',
                loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
            },
            {
                path: 'ajout-campus',
                loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
            },
            {
                path: 'diplomes',
                loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
            },
            {
                path: 'diplomes/:id',
                loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
            },
            {
                path: 'ajout-diplome',
                loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
            },
            {
                path: 'groupes',
                loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
            },
            {
                path: 'ajout-groupe',
                loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
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
                path: 'assignation-inscrit',
                component: ProspectsComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'validation-inscrit',
                loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
            },
            {
                path: 'entreprises',
                component: ListEntrepriseComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'ajout-lead',
                component: AddProspectComponent,
                canActivate: [AuthGuardService],
            }, //Admission
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
                path: 'ajout-remboursement',
                component: AddRemboussementComponent,

            }, //Remboursement

            // {
            //     path: 'list-remboursement',
            //     component: RemboursementListComponent,
            //     canActivate: [AuthGuardService],
            // },
            {
                path: 'remboursements',
                component: ListRemboursementComponent,
                canActivate: [AuthGuardService],
            },

            /** end */

            /** IMS Project */
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
            //{ path: 'informations', component: InformationsComponent, canActivate: [AuthGuardService] },
            /**links */
            { path: 'Links', component: LinksComponent, canActivate: [AuthGuardService] },


            //{ path: 'offres', component: AnnoncesComponent, canActivate: [AuthGuardService] },
            //{ path: 'mes-offres', component: MesOffresComponent, canActivate: [AuthGuardService] },
            { path: 'matching-externe/:id', component: POVHorsCommercialComponent, canActivate: [AuthGuardService] },


            { path: 'equipe-commercial', loadChildren: () => import('./commercial/commercial.module').then(m => m.CommercialModule) },
            { path: 'detail-equipe-commercial/:equipe_id', loadChildren: () => import('./commercial/commercial.module').then(m => m.CommercialModule) },
            { path: 'liste-demande-commercial', loadChildren: () => import('./commercial/commercial.module').then(m => m.CommercialModule) },
            { path: 'liste-demande-commercial/:equipe_id', loadChildren: () => import('./commercial/commercial.module').then(m => m.CommercialModule) },


            { path: 'stages', loadChildren: () => import('./commercial/commercial.module').then(m => m.CommercialModule) },
            { path: 'stages/:id', loadChildren: () => import('./commercial/commercial.module').then(m => m.CommercialModule) },

            { path: 'livret', component: LivretGeneratorComponent, canActivate: [AuthGuardService] },
            { path: 'livret/:id', component: LivretGeneratorComponent, canActivate: [AuthGuardService] },

            {
                path: 'matching-externe/:id',
                component: POVHorsCommercialComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'equipe-commercial',
                loadChildren: () => import('./commercial/commercial.module').then(m => m.CommercialModule)
            },
            {
                path: 'detail-equipe-commercial/:equipe_id',
                loadChildren: () => import('./commercial/commercial.module').then(m => m.CommercialModule)
            },
            {
                path: 'prospects-alt',
                loadChildren: () => import('./commercial/commercial.module').then(m => m.CommercialModule)
            },
            {
                path: 'liste-demande-commercial',
                loadChildren: () => import('./commercial/commercial.module').then(m => m.CommercialModule)
            },
            {
                path: 'dashboard-alternance',
                loadChildren: () => import('./commercial/commercial.module').then(m => m.CommercialModule)
            },
            {
                path: 'liste-demande-commercial/:equipe_id',
                loadChildren: () => import('./commercial/commercial.module').then(m => m.CommercialModule)
            },
            {
                path: 'stages',
                loadChildren: () => import('./commercial/commercial.module').then(m => m.CommercialModule)
            },
            {
                path: 'stages/:id',
                loadChildren: () => import('./commercial/commercial.module').then(m => m.CommercialModule)
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
            {
                path: 'rh',
                loadChildren: () => import('./rh/rh.module').then(m => m.RhModule)
            },
            {
                path: 'rh/collaborateurs',
                loadChildren: () => import('./rh/rh.module').then(m => m.RhModule)
            },
            {
                path: 'rh/conges-autorisations',
                loadChildren: () => import('./rh/rh.module').then(m => m.RhModule)
            },
            {
                path: 'rh/actualite-notifications',
                loadChildren: () => import('./rh/rh.module').then(m => m.RhModule)
            },
            {
                path: 'rh/demandes-reclamations',
                loadChildren: () => import('./rh/rh.module').then(m => m.RhModule)
            },
            {
                path: 'rh/dashboard',
                loadChildren: () => import('./rh/rh.module').then(m => m.RhModule)
            },
            {
                path: 'rh/calendrier',
                loadChildren: () => import('./rh/rh.module').then(m => m.RhModule)
            },
            {
                path: 'rh/calendrier/:id',
                loadChildren: () => import('./rh/rh.module').then(m => m.RhModule)
            },
            {
                path: 'rh/teams',
                loadChildren: () => import('./rh/rh.module').then(m => m.RhModule)
            },
            /** end of rh paths */
            {
                path: 'resultats-icbs',
                component: ResultatsFormulaireIcbsComponent,
            },
            {
                path: 'infos-ims',
                loadChildren: () => import('./admin-tools/admin-tools.module').then(m => m.AdminToolsModule),
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
                path: 'international',
                loadChildren: () => import('./admission/international/international.module').then(m => m.InternationalModule)
            },
            {
                path: 'dashboard/partenaire',
                component: DashboardPartenaireComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'dashboard/commercial',
                loadChildren: () => import('./commercial/commercial.module').then(m => m.CommercialModule)
            },
            {
                path: 'dashboard/partenaire/:id',
                component: DashboardPartenaireComponent,
                canActivate: [AuthGuardService],
            },

            /* Module CRM */

            {
                path: 'crm',
                loadChildren: () => import('./crm/crm.module').then(m => m.CRMModule),
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
            { path: 'ticketing/Ajouter-un-ticket-projet', component: AjouterUnTicketProjetComponent, canActivate: [AuthGuardService] },
            { path: 'ticketing/configuration', component: ConfigurationComponent, canActivate: [AuthGuardService] },
            { path: 'ticketing/dashboard', component: DashboardTicketingComponent, canActivate: [AuthGuardService] },
            { path: 'configuration/service-mention', loadChildren: () => import('./agents/agents.module').then(m => m.AgentsModule) },
            /* Ticketing V3 */
            { path: 'ticketing/mes-tickets', component: NewListTicketsComponent, canActivate: [AuthGuardService] },
            { path: 'ticketing/mes-tickets-services', component: NewListTicketsComponent, canActivate: [AuthGuardService] },
            { path: 'ticketing/mes-tickets/:ticket_id', component: NewListTicketsComponent, canActivate: [AuthGuardService] },
            /* Gestion Agent V2 */
            {
                path: 'agent/ajout',
                loadChildren: () => import('./agents/agents.module').then(m => m.AgentsModule)
            },
            {
                path: 'agent/list',
                component: ListAgentV2Component,
                loadChildren: () => import('./agents/agents.module').then(m => m.AgentsModule)
            },
            {
                path: 'agent/update/:id',
                component: UpdateAgentComponent,
                loadChildren: () => import('./agents/agents.module').then(m => m.AgentsModule)
            },
            {
                path: 'admission',
                loadChildren: () => import('./admission/admission.module').then(m => m.AdmissionModule)
            },

            //Module Mail Type
            { path: 'mails/configuration', component: ConfigurationMailComponent, canActivate: [AuthGuardService] },
            { path: 'mails/type', component: MailTypeComponent, canActivate: [AuthGuardService] },
            { path: 'mails/auto', component: MailAutoComponent, canActivate: [AuthGuardService] },
            { path: 'pointeuse/configuration', loadChildren: () => import('./rh/rh.module').then(m => m.RhModule) },
            { path: 'pointage/configuration', loadChildren: () => import('./rh/rh.module').then(m => m.RhModule) },
            { path: 'pointage/archivage', loadChildren: () => import('./rh/rh.module').then(m => m.RhModule) },

            //Module Formulaire MI
            { path: 'formulaireMI/configuration', component: ConfigurationMIComponent, canActivate: [AuthGuardService] },
            { path: 'formulaireMI/resultats', component: ResultatsMIComponent, canActivate: [AuthGuardService] },




            // Generateur de Doc
            { path: 'genschools', component: GenschoolComponent, canActivate: [AuthGuardService] },
            { path: 'genCampus', component: GencampusComponent, canActivate: [AuthGuardService] },
            { path: 'genFormation', component: GenformationComponent, canActivate: [AuthGuardService] },
            { path: 'genDoc', component: GendocComponent, canActivate: [AuthGuardService] },
            // Booking V2
            {
                path: 'booking/configuration',
                component: BookingV2Component,
                canActivate: [AuthGuardService],
            },
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
            //Template
            { path: 'template/formulaire', component: FormulaireFrontComponent, canActivate: [AuthGuardService] },
            { path: 'template/formulaire/:ecole', component: FormulaireFrontComponent, canActivate: [AuthGuardService] },
        ],
    },
    {
        path: 'formulaire-entreprise/:code',
        component: InscriptionEntrepriseComponent,
    },
    {
        path: 'formulaire-crm/:ecole', loadChildren: () => import('./crm/formcrm.module').then(m => m.FormCRMModule)
    },
    { path: 'formulaire', component: DemandeEventsComponent },
    { path: 'formulaire-mi', component: FormulaireMIComponent },
    { path: 'completion-profil', canActivate: [AuthGuardService, CompletionProfilGuard], component: FirstConnectionComponent },
    { path: 'formulaire-admission-international/:ecole', component: VersionNonIframeComponent },
    { path: 'formulaire-admission-international/:ecole/:code_commercial', component: VersionNonIframeComponent },
    { path: 'formulaire-admission-int/:ecole', component: FormulaireAdmissionInternationalComponent },
    { path: 'formulaire-admission-int-lang/:ecole/:lang', component: FormulaireAdmissionInternationalComponent },
    { path: 'formulaire-admission-int/:ecole/:code_commercial', component: FormulaireAdmissionInternationalComponent },
    { path: 'formulaire-admission-alternance/:id', component: ProspectAltFormComponent },
    { path: 'formulaire-admission-intuns', component: FormulaireIntunsComponent },
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
    { path: 'rendez-vous/:user_id', component: RendezVousComponent },


    { path: 'document/:id_doc', component: GendocViewComponent },
    { path: 'formulaire-remboursement', component: AddRemboursementPublicComponent },

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
    declarations: []
})
export class AppRoutingModule { }
