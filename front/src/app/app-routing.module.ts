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
import { ExterneComponent } from './authentification/externe/externe.component';
import { SuiviePreinscriptionComponent } from './admission/suivie-preinscription/suivie-preinscription.component';
import { ValidationEmailComponent } from './authentification/validation-email/validation-email.component';
import { UserProfilComponent } from './profil/user-profil/user-profil.component';
import { PartenaireInscriptionComponent } from './partenaire/partenaire-inscription/partenaire-inscription.component';
import { AuthGuardService } from './dev-components/guards/auth-guard';
//import { AdminGuardService } from './dev-components/guards/admin-guard';

import { FirstConnectionComponent } from './profil/first-connection/first-connection.component';
import { ProspectGuard } from './dev-components/guards/prospect-guard';
//import { ReinscritComponent } from './administration/validation-prospects/reinscrit.component';
import { LoginGuard } from './dev-components/guards/login-guard';
//import { FormAdmissionGuard } from './dev-components/guards/formAdmission-guard';
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


import { CompletionProfilGuard } from './dev-components/guards/completion-profil.guard';
//import { GestionEquipeComponent } from './commercial/gestion-equipe/gestion-equipe.component';
//import { DetailEquipeComponent } from './commercial/detail-equipe/detail-equipe.component';
//import { DemandeConseillerComponent } from './commercial/demande-conseiller/demande-conseiller.component';
//import { UsersSettingsComponent } from './admin-tools/users-settings/users-settings.component';
//import { InfoImsComponent } from './admin-tools/info-ims/info-ims.component';
import { FactureFormateurComponent } from './finance/facture-formateur/facture-formateur.component';
import { FormulaireIntunsComponent } from './formulaire-admission/formulaire-intuns/formulaire-intuns.component';
import { QuestionnaireSatisfactionComponent } from './pedagogie/questionnaire-satisfaction/questionnaire-satisfaction.component';
import { ProspectsIntunsComponent } from './admission/prospects-intuns/prospects-intuns.component';
import { QuestionnaireFinFormationComponent } from './pedagogie/questionnaire-fin-formation/questionnaire-fin-formation.component';
import { PovFormateurComponent } from './pedagogie/etudiants/list-etudiant/pov-formateur/pov-formateur.component';
import { BulletinComponent } from './pedagogie/notes/bulletin/bulletin.component';
import { EntrepriseFormComponent } from './pedagogie/entreprises/entreprise-form/entreprise-form.component';
import { FormulaireExterneSkillsnetComponent } from './skillsnet/externe-skillsnet/formulaire-externe-skillsnet/formulaire-externe-skillsnet.component';
import { POVHorsCommercialComponent } from './skillsnet/matching/povhors-commercial/povhors-commercial.component';
import { ProspectAltFormComponent } from './pedagogie/etudiants/prospect-alt-form/prospect-alt-form.component';
//import { ProspectsAlternablesComponent } from './commercial/prospects-alternables/prospects-alternables.component';
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
import { LinksComponent } from './links/links.component';
import { ImatchCandidatComponent } from './skillsnet/i-match/imatch-candidat/imatch-candidat.component';
import { ImatchEntrepriseComponent } from './skillsnet/i-match/imatch-entreprise/imatch-entreprise.component';
import { ListRemboursementComponent } from './remboursement/list-remboursement/list-remboursement.component';

//import { NewCalendrierComponent } from './rh/new-calendrier/new-calendrier.component';
//import { GestionEquipeRhComponent } from './rh/gestion-equipe-rh/gestion-equipe-rh.component';
import { AddRemboursementPublicComponent } from './remboursement/add-remboursement-public/add-remboursement-public.component';
import { AddRemboussementComponent } from './remboursement/add-remboursement/add-remboussement.component';
//import { CrmListComponent } from './crm/crm-list/crm-list.component';
import { LogementComponent } from './ims+/logement/logement.component';
import { GestionLogementComponent } from './ims+/gestion-logement/gestion-logement.component';
import { BookingV2Component } from './booking-v2/booking-v2.component';
import { GroupesComponent } from './administration-v1/configuration/groupes/groupes.component';
import { CriteresComponent } from './crm/criteres/criteres.component';
import { LeadersListComponent } from './admission/leaders-list/leaders-list.component';
import { AddProspectComponent } from './admission/add-prospect/add-prospect.component';
import { CvComponent } from './skillsnet/i-match/cv/cv.component';
const routes: Routes = [
    {
        path: '',
        component: AppMainComponent,
        children: [
            {
                path: 'partenaireInscription', component: PartenaireInscriptionComponent,
                canActivate: [AuthGuardService],
            },

            {
                path: '',
                component: DashboardComponent,
                canActivate: [AuthGuardService],
            },

            {
                path: 'crm',
                loadChildren: () => import('./crm/crm.module').then(m => m.CRMModule),


            },
            {
                path: 'pedagogie',
                loadChildren: () => import('./pedagogie/pedagogie.module').then(m => m.PedagogieModule)
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
                path: 'administrations',
                loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
            },
            {
                path: 'crm-criteres',
                component: CriteresComponent,
                canActivate: [AuthGuardService],
            },
            {
                path: 'new-groupes',
                component: GroupesComponent,
                canActivate: [AuthGuardService],
            },

            {
                path: 'ajout-lead',
                component: AddProspectComponent,
                canActivate: [AuthGuardService],
            }, //Admission
            {
                path: 'listdeslead',
                component:LeadersListComponent ,
                canActivate: [AuthGuardService],
            },


            {
                path: 'profil',
                component: UserProfilComponent,
                canActivate: [AuthGuardService],
            },

            {
                path: 'notifications', loadChildren: () => import('./ticketing/ticketing.module').then(m => m.TicketingModule)
            },
            { path: 'contact', component: ContactComponent },
            {
                path: 'list-events',
                component: ListEventsComponent,
                canActivate: [AuthGuardService],
            },


            {
                path: 'prospects-intuns',
                component: ProspectsIntunsComponent,
                canActivate: [AuthGuardService],
            },

            {
                path: 'remboursements',
                component: ListRemboursementComponent,
                canActivate: [AuthGuardService],
            },

            {
                path: 'ajout-remboursement',
                component: AddRemboussementComponent,
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
            { path: 'calendar', loadChildren: () => import('./calender/calender.module').then(m => m.CalenderModule) },
            /**informations */
            //{ path: 'informations', component: InformationsComponent, canActivate: [AuthGuardService] },
            /**links */
            //{ path: 'Links', component: LinksComponent, canActivate: [AuthGuardService] },
            { path: 'Links', loadChildren: () => import('./links/links.module').then(m => m.LinksModule) },


            //{ path: 'offres', component: AnnoncesComponent, canActivate: [AuthGuardService] },
            //{ path: 'mes-offres', component: MesOffresComponent, canActivate: [AuthGuardService] },
            { path: 'matching-externe/:id', component: POVHorsCommercialComponent, canActivate: [AuthGuardService] },


            { path: 'equipe-commercial', loadChildren: () => import('./commercial/commercial.module').then(m => m.CommercialModule) },
            { path: 'detail-equipe-commercial/:equipe_id', loadChildren: () => import('./commercial/commercial.module').then(m => m.CommercialModule) },
            { path: 'liste-demande-commercial', loadChildren: () => import('./commercial/commercial.module').then(m => m.CommercialModule) },
            { path: 'liste-demande-commercial/:equipe_id', loadChildren: () => import('./commercial/commercial.module').then(m => m.CommercialModule) },


            { path: 'stages', loadChildren: () => import('./commercial/commercial.module').then(m => m.CommercialModule) },
            { path: 'stages/:id', loadChildren: () => import('./commercial/commercial.module').then(m => m.CommercialModule) },

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
                path: 'formateur/etudiants',
                component: PovFormateurComponent,
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
            { path: 'ticketing', loadChildren: () => import('./ticketing/ticketing.module').then(m => m.TicketingModule) },
            { path: 'ticketing/Ajouter-un-ticket-projet', loadChildren: () => import('./ticketing/ticketing.module').then(m => m.TicketingModule) },
            { path: 'ticketing/configuration', loadChildren: () => import('./ticketing/ticketing.module').then(m => m.TicketingModule) },
            { path: 'ticketing/dashboard', loadChildren: () => import('./ticketing/ticketing.module').then(m => m.TicketingModule) },
            { path: 'configuration/service-mention', loadChildren: () => import('./agents/agents.module').then(m => m.AgentsModule) },
            /* Ticketing V3 */
            { path: 'ticketing/mes-tickets', loadChildren: () => import('./ticketing/ticketing.module').then(m => m.TicketingModule) },
            { path: 'ticketing/mes-tickets-services', loadChildren: () => import('./ticketing/ticketing.module').then(m => m.TicketingModule) },
            { path: 'ticketing/mes-tickets/:ticket_id', loadChildren: () => import('./ticketing/ticketing.module').then(m => m.TicketingModule) },
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
    { path: 'imatch/cv/:id', component: CvComponent },
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
