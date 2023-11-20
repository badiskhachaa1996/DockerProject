import { LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { AppRoutingModule } from './app-routing.module';
import { registerLocaleData } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { InplaceModule } from 'primeng/inplace';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KnobModule } from 'primeng/knob';
import { LightboxModule } from 'primeng/lightbox';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeTableModule } from 'primeng/treetable';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { BlockViewer } from './components/blockviewer/blockviewer.component';
import { FullCalendarModule } from 'primeng/fullcalendar'; // must go before plugins
import { AppCodeModule } from './components/app-code/app.code.component';
import { AppComponent } from './app.component';
import { AppMainComponent } from './app.main.component';
import { AppTopBarComponent } from './app.topbar.component';
import { AppFooterComponent } from './app.footer.component';
import { AppConfigComponent } from './app.config.component';
import { AppMenuComponent } from './app.menu.component';
import { AppMenuitemComponent } from './app.menuitem.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormLayoutComponent } from './components/formlayout/formlayout.component';
import { FloatLabelComponent } from './components/floatlabel/floatlabel.component';
import { InvalidStateComponent } from './components/invalidstate/invalidstate.component';
import { InputComponent } from './components/input/input.component';
import { ButtonComponent } from './components/button/button.component';
import { TableComponent } from './components/table/table.component';
import { ListComponent } from './components/list/list.component';
import { TreeComponent } from './components/tree/tree.component';
import { PanelsComponent } from './components/panels/panels.component';
import { OverlaysComponent } from './components/overlays/overlays.component';
import { MediaComponent } from './components/media/media.component';
import { MenusComponent } from './components/menus/menus.component';
import { MessagesComponent } from './components/messages/messages.component';
import { MiscComponent } from './components/misc/misc.component';
import { EmptyComponent } from './components/empty/empty.component';
import { ChartsComponent } from './components/charts/charts.component';
import { FileComponent } from './components/file/file.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { CrudComponent } from './components/crud/crud.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { IconsComponent } from './components/icons/icons.component';
import { BlocksComponent } from './components/blocks/blocks.component';
import { PaymentComponent } from './components/menus/payment.component';
import { ConfirmationComponent } from './components/menus/confirmation.component';
import { PersonalComponent } from './components/menus/personal.component';
import { SeatComponent } from './components/menus/seat.component';
import { LandingComponent } from './components/landing/landing.component';
import { CountryService } from './dev-components/service-template/countryservice';

import { MenuService } from './dev-components/service-template/app.menu.service';
import { ConfigService } from './dev-components/service-template/app.config.service';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AccessComponent } from './components/access/access.component';
import { ListCampusComponent } from './administration/campus/list-campus/list-campus.component';
import { AddCampusComponent } from './administration/campus/add-campus/add-campus.component';
import { ListEcoleComponent } from './administration/ecoles/list-ecole/list-ecole.component';
import { AddEcoleComponent } from './administration/ecoles/add-ecole/add-ecole.component';
import { ListAnneeScolaireComponent } from './administration/annees-scolaires/list-annee-scolaire/list-annee-scolaire.component';
import { AddAnneeScolaireComponent } from './administration/annees-scolaires/add-annee-scolaire/add-annee-scolaire.component';
import { ListCollaborateurComponent } from './partenaire/collaborateurs/list-collaborateur/list-collaborateur.component';
import { ListPartenaireComponent } from './partenaire/partenaires/list-partenaire/list-partenaire.component';
import { ListDiplomeComponent } from './administration/diplomes/list-diplome/list-diplome.component';
import { AddDiplomeComponent } from './administration/diplomes/add-diplome/add-diplome.component';
import { AddGroupeComponent } from './administration/groupes/add-groupe/add-groupe.component';
import { ListGroupeComponent } from './administration/groupes/list-groupe/list-groupe.component';
import { MatieresComponent } from './pedagogie/matieres/matieres.component';
import { AddFormateurComponent } from './pedagogie/formateurs/add-formateur/add-formateur.component';
import { ListFormateursComponent } from './pedagogie/formateurs/list-formateurs/list-formateurs.component';
import { AddEtudiantComponent } from './pedagogie/etudiants/add-etudiant/add-etudiant.component';
import { ListEtudiantComponent } from './pedagogie/etudiants/list-etudiant/list-etudiant.component';
import { AddEntrepriseComponent } from './pedagogie/entreprises/add-entreprise/add-entreprise.component';
import { ListEntrepriseComponent } from './pedagogie/entreprises/list-entreprise/list-entreprise.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ExterneComponent } from './authentification/externe/externe.component';
import { SuiviePreinscriptionComponent } from './admission/suivie-preinscription/suivie-preinscription.component';

import { ListSeancesComponent } from './pedagogie/seances/list-seances/list-seances.component';
import { AddSeanceComponent } from './pedagogie/seances/add-seance/add-seance.component';
import { EmploiDuTempsComponent } from './pedagogie/seances/emploi-du-temps/emploi-du-temps.component';
import { EmergementComponent } from './pedagogie/seances/emergement/emergement.component';
import { ValidationEmailComponent } from './authentification/validation-email/validation-email.component';
import { ExamenComponent } from './pedagogie/examen/list-examen/examen.component';

import { environment } from 'src/environments/environment';
import { UserProfilComponent } from './profil/user-profil/user-profil.component';
import { AjoutExamenComponent } from './pedagogie/examen/ajout-examen/ajout-examen.component';
import { ProspectsComponent } from './pedagogie/assignation-groupe/prospects.component';
import { PartenaireInscriptionComponent } from './partenaire/partenaire-inscription/partenaire-inscription.component';
import { FirstConnectionComponent } from './profil/first-connection/first-connection.component';
import { ReinscritComponent } from './administration/validation-prospects/reinscrit.component';
import { DetailsEtudiantComponent } from './pedagogie/etudiants/details-etudiant/details-etudiant.component';
import { NotificationComponent } from './ticketing/notification/notification.component';
import { MpOublieComponent } from './authentification/mp-oublie/mp-oublie.component';
import { ContactComponent } from './footer/contact/contact.component';
import { InscriptionEntrepriseComponent } from './pedagogie/entreprises/inscription-entreprise/inscription-entreprise.component';
import { TuteurComponent } from './pedagogie/tuteur/tuteur.component';
import { ListeContratsComponent } from './pedagogie/entreprises/liste-contrats/liste-contrats.component';
import { DemandeEventsComponent } from './demande-events/demande-events.component';
import { ListEventsComponent } from './demande-events/list-events/list-events.component';
import { ArrToStrPipe } from './arr-to-str.pipe';
import { MatchingComponent } from './skillsnet/matching/matching.component';
import { GestionEquipeComponent } from './commercial/gestion-equipe/gestion-equipe.component';
import { DetailEquipeComponent } from './commercial/detail-equipe/detail-equipe.component';
import { DemandeConseillerComponent } from './commercial/demande-conseiller/demande-conseiller.component';
import { UsersSettingsComponent } from './admin-tools/users-settings/users-settings.component';
import { GestionEtudiantsComponent } from './pedagogie/etudiants/gestion-etudiants/gestion-etudiants.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { InfoImsComponent } from './admin-tools/info-ims/info-ims.component';
import * as fr from '@angular/common/locales/fr';
import { PublicClientApplication, InteractionType } from "@azure/msal-browser";
import { CalendrierRhComponent } from './rh/calendrier-rh/calendrier-rh.component';
import { ConfigurationPointageComponent } from './rh/configuration-pointage/configuration-pointage.component';

import {
  MsalInterceptor,
  MsalModule,
  MsalRedirectComponent,
} from "@azure/msal-angular";
import { FactureFormateurComponent } from './finance/facture-formateur/facture-formateur.component';
import { AnnoncesComponent } from './skillsnet/annonces/annonces.component';
import { FormulaireIntunsComponent } from './formulaire-admission/formulaire-intuns/formulaire-intuns.component';

import { MesOffresComponent } from './skillsnet/mes-offres/mes-offres.component';
import { SkillsManagementComponent } from './skillsnet/skills-management/skills-management.component';
import { ProgressionPedagogiqueComponent } from './pedagogie/formateurs/progression-pedagogique/progression-pedagogique.component';
import { QuestionnaireSatisfactionComponent } from './pedagogie/questionnaire-satisfaction/questionnaire-satisfaction.component';
import { ResultatComponent } from './pedagogie/questionnaire-satisfaction/resultat/resultat.component';
import { ProspectsIntunsComponent } from './admission/prospects-intuns/prospects-intuns.component';
import { QuestionnaireFinFormationComponent } from './pedagogie/questionnaire-fin-formation/questionnaire-fin-formation.component';
import { ResultatQFFComponent } from './pedagogie/questionnaire-fin-formation/resultat-qff/resultat-qff.component';
import { PovFormateurComponent } from './pedagogie/etudiants/list-etudiant/pov-formateur/pov-formateur.component';
import { PvSemestrielComponent } from './pedagogie/notes/pv-semestriel/pv-semestriel.component';
import { BulletinComponent } from './pedagogie/notes/bulletin/bulletin.component';
import { ListEntrepriseCeoComponent } from './pedagogie/entreprises/list-entreprise-ceo/list-entreprise-ceo.component';
import { PvAppreciationComponent } from './pedagogie/notes/pv-appreciation/pv-appreciation.component';
import { AppreciationInputComponent } from './pedagogie/formateurs/appreciation-input/appreciation-input.component';
import { PvAnnuelComponent } from './pedagogie/notes/pv-annuel/pv-annuel.component';
import { TuteurCeoComponent } from './pedagogie/tuteur-ceo/tuteur-ceo.component';
import { EvenementsComponent } from './skillsnet/evenements/evenements.component';
import { ContratsTutelleCeoComponent } from './pedagogie/entreprises/contrats-tutelle-ceo/contrats-tutelle-ceo.component';
import { ExterneSkillsnetComponent } from './skillsnet/externe-skillsnet/externe-skillsnet.component';
import { EntrepriseFormComponent } from './pedagogie/entreprises/entreprise-form/entreprise-form.component';
import { FormulaireExterneSkillsnetComponent } from './skillsnet/externe-skillsnet/formulaire-externe-skillsnet/formulaire-externe-skillsnet.component';
import { POVHorsCommercialComponent } from './skillsnet/matching/povhors-commercial/povhors-commercial.component';
import { ProspectAltFormComponent } from './pedagogie/etudiants/prospect-alt-form/prospect-alt-form.component';
import { ProspectsAlternablesComponent } from './commercial/prospects-alternables/prospects-alternables.component';
import { AddProspectComponent } from './admission/add-prospect/add-prospect.component';
import { QuestionnaireFormateurComponent } from './pedagogie/questionnaire-formateur/questionnaire-formateur.component';
import { ResultatQfComponent } from './pedagogie/questionnaire-formateur/resultat-qf/resultat-qf.component';
import { StageComponent } from './commercial/stage/stage.component';
import { AjoutCollaborateurComponent } from './partenaire/collaborateurs/ajout-collaborateur/ajout-collaborateur.component';
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
import { AddAgentComponent as AddAgentC } from './agents/add-agent/add-agent.component';
import { UpdateAgentComponent } from './agents/update-agent/update-agent.component';
import { ListAgentComponent as ListAgentV2Component } from './agents/list-agent/list-agent.component';
import { ConfigurationComponent } from './ticketing/configuration/configuration.component';
import { DashboardTicketingComponent } from './ticketing/dashboard-ticketing/dashboard-ticketing.component';
import { PaiementComponent } from './international/generation-doc/paiement/paiement.component';
import { LeadInformationsPersonnelComponent } from './admission/lead/lead-informations-personnel/lead-informations-personnel.component';
import { LeadProgrammeComponent } from './admission/lead/lead-programme/lead-programme.component';
import { LeadSuiviComponent } from './admission/lead/lead-suivi/lead-suivi.component';
import { LeadPaiementsComponent } from './admission/lead/lead-paiements/lead-paiements.component';
import { LeadDossierComponent } from './admission/lead/lead-dossier/lead-dossier.component';
import { VersionNonIframeComponent } from './formulaire-admission/formulaire-admission-international/version-non-iframe/version-non-iframe.component';
import { ConfigurationMailComponent } from './mail-type/configuration-mail/configuration-mail.component';
import { MailTypeComponent } from './mail-type/mail/mail.component';
import { MailAutoComponent } from './mail-type/mail-auto/mail-auto.component';
import { EditorModule } from 'primeng/editor';
import { MyTargetComponent } from './crm/target/my-target/my-target.component';
import { ConfigurationTargetComponent } from './crm/target/configuration-target/configuration-target.component';
import { DashboardTargetComponent } from './crm/target/dashboard-target/dashboard-target.component';
import { DocCheckerComponent } from './international/generation-doc/doc-checker/doc-checker.component';
import { LeadCandidatureComponent } from './admission/lead/lead-candidature/lead-candidature.component';
import { GestionComponent } from './project-v2/gestion-des-projects/gestion/gestion.component';
import { MytaskComponent } from './project-v2/mytask/mytask.component';
import { MyprojectComponent } from './project-v2/myproject/myproject.component';
import { DashboardProjectV2Component } from './project-v2/dashboard-project-v2/dashboard-project-v2.component';

import { ConfigurationPointeuseComponent } from './rh/configuration-pointeuse/configuration-pointeuse.component';
import { IMatchComponent } from './skillsnet/i-match/i-match.component';
import { CvComponent } from './skillsnet/i-match/cv/cv.component';
import { AjoutCvComponent } from './skillsnet/i-match/cv/ajout-cv/ajout-cv.component';
import { ArchivagePointageComponent } from './rh/archivage-pointage/archivage-pointage.component';
import { RendezVousComponent } from './skillsnet/i-match/rendez-vous/rendez-vous.component';
import { GestionMentionServiceComponent } from './agents/gestion-mention-service/gestion-mention-service.component';
import { ConfigurationMIComponent } from './other/formulaireMI/configuration-mi/configuration-mi.component';
import { FormulaireMIComponent } from './other/formulaireMI/formulaire-mi/formulaire-mi.component';
import { ResultatsMIComponent } from './other/formulaireMI/resultats-mi/resultats-mi.component';
import { GenschoolComponent } from './gen_doc/genschool/genschool.component';
import { GencampusComponent } from './gen_doc/gencampus/gencampus.component';
import { GenformationComponent } from './gen_doc/genformation/genformation.component';
import { GendocComponent } from './gen_doc/gendoc/gendoc.component';
import { OutputpageComponent } from './gen_doc/gendoc/outputpage/outputpage.component';
import { QRCodeModule } from 'angularx-qrcode';
import { GenIntroComponent } from './gen_doc/gendoc/outputpage/gen-intro/gen-intro.component';
import { GenOutroComponent } from './gen_doc/gendoc/outputpage/gen-outro/gen-outro.component';
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
import { ImatchEntrepriseComponent } from './skillsnet/i-match/imatch-entreprise/imatch-entreprise.component';
import { ImatchCandidatComponent } from './skillsnet/i-match/imatch-candidat/imatch-candidat.component';
import { CandidatListComponent } from './skillsnet/i-match/imatch-candidat/candidat-list/candidat-list.component';
import { EntrepriseListComponent } from './skillsnet/i-match/imatch-entreprise/entreprise-list/entreprise-list.component';
import { CalenderComponent } from './calender/calender.component';
import { NewListTicketsComponent } from './ticketing/new-list-tickets/new-list-tickets.component';
import { ReadMoreComponent } from './other/component/read-more/read-more.component';
import { NewCvthequeInterneComponent } from './skillsnet/i-match/new-cvtheque-interne/new-cvtheque-interne.component';
import { NgModule } from '@angular/core';
import { AddRemboussementComponent } from './remboursement/add-remboursement/add-remboussement.component';
import { ListRemboursementComponent } from './remboursement/list-remboursement/list-remboursement.component';
import { DataCleComponent } from './remboursement/list-remboursement/data-cle/data-cle.component';
import { DetailsCandidatComponent } from './remboursement/list-remboursement/details-candidat/details-candidat.component';
import { ContactRemboursementComponent } from './remboursement/list-remboursement/contact/contact.component';
import { DossierRemboursementComponent } from './remboursement/list-remboursement/dossier-remboursement/dossier-remboursement.component';
import { CommentaireSectionComponent } from './remboursement/list-remboursement/commentaire-section/commentaire-section.component';
import { PayementInformationComponent } from './remboursement/list-remboursement/payement-information/payement-information.component';
import { InformationRemboursementComponent } from './remboursement/list-remboursement/information-remboursement/information-remboursement.component';
import { UploadRemboursementDocComponent } from './remboursement/add-remboursement/upload-remboursement-doc/upload-remboursement-doc.component';
import { MatchingViewerComponent } from './skillsnet/i-match/matching-viewer/matching-viewer.component';
import { NewEntreprisesComponent } from './skillsnet/new-entreprises/new-entreprises.component';
import { AnnonceViewerComponent } from './skillsnet/annonce-viewer/annonce-viewer.component';
import { RdvCalendarInterneComponent } from './skillsnet/i-match/rdv-calendar-interne/rdv-calendar-interne.component';
import { SeeCvExterneComponent } from './skillsnet/i-match/see-cv-externe/see-cv-externe.component';
import { VoirDetailsOffreComponent } from './skillsnet/voir-details-offre/voir-details-offre.component';
import { CvEtudiantComponent } from './skillsnet/i-match/cv-etudiant/cv-etudiant.component';
import { PreinscriptionComponent } from './administration-v1/gestion-des-inscriptions/preinscription/preinscription/preinscription.component';
import { PauseReadMoreComponent } from './other/component/pause-read-more/pause-read-more.component';
import { NewCalendrierComponent } from './rh/new-calendrier/new-calendrier.component';
import { DashboardImatchComponent } from './skillsnet/dashboard-imatch/dashboard-imatch.component';
import { CvPdfPreviewComponent } from './skillsnet/i-match/cv/ajout-cv/cv-pdf-preview/cv-pdf-preview.component';
import { CvPdfHeaderComponent } from './skillsnet/i-match/cv/ajout-cv/cv-pdf-preview/cv-pdf-header/cv-pdf-header.component';
import { CvPdfHeaderEspicComponent } from './skillsnet/i-match/cv/ajout-cv/cv-pdf-preview/cv-pdf-header/cv-pdf-header-espic/cv-pdf-header-espic.component';
import { CvPdfHeaderStudinfoComponent } from './skillsnet/i-match/cv/ajout-cv/cv-pdf-preview/cv-pdf-header/cv-pdf-header-studinfo/cv-pdf-header-studinfo.component';
import { CvPdfHeaderAdgComponent } from './skillsnet/i-match/cv/ajout-cv/cv-pdf-preview/cv-pdf-header/cv-pdf-header-adg/cv-pdf-header-adg.component';
import { CvPdfHeaderMedasupComponent } from './skillsnet/i-match/cv/ajout-cv/cv-pdf-preview/cv-pdf-header/cv-pdf-header-medasup/cv-pdf-header-medasup.component';
import { CvPdfHeaderBtechComponent } from './skillsnet/i-match/cv/ajout-cv/cv-pdf-preview/cv-pdf-header/cv-pdf-header-btech/cv-pdf-header-btech.component';
import { CvPdfSidebarComponent } from './skillsnet/i-match/cv/ajout-cv/cv-pdf-preview/cv-pdf-sidebar/cv-pdf-sidebar.component';
import { CvPdfContentComponent } from './skillsnet/i-match/cv/ajout-cv/cv-pdf-preview/cv-pdf-content/cv-pdf-content.component';
import { GestionEquipeRhComponent } from './rh/gestion-equipe-rh/gestion-equipe-rh.component';
import { CvLoaderPreviewComponent } from './skillsnet/i-match/cv-pdf-preview/cv-loader-preview/cv-loader-preview.component';
import { InscriptionComponent } from './administration-v1/gestion-des-inscriptions/inscription/inscription/inscription.component';
import { PreviewCandidatureComponent } from './admission/lead/preview-candidature/preview-candidature.component';
import { LeadDocumentsComponent } from './admission/lead/lead-documents/lead-documents.component';
import { EvaluationComponent } from './administration-v1/evaluation/evaluation.component';
import { UploadButtonComponent } from './remboursement/upload-button/upload-button.component';
import { AjoutTicketComponent } from './ticketing/ajout-ticket/ajout-ticket.component';
import { LeadEvaluationComponent } from './admission/lead/lead-evaluation/lead-evaluation.component';


@NgModule({
  imports: [
    TableModule,
    SignaturePadModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AccordionModule,
    AutoCompleteModule,
    AvatarModule,
    AvatarGroupModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    CarouselModule,
    CascadeSelectModule,
    ChartModule,
    CheckboxModule,
    ChipsModule,
    ChipModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    ColorPickerModule,
    ContextMenuModule,
    DataViewModule,
    DialogModule,
    DividerModule,
    DropdownModule,
    FieldsetModule,
    FileUploadModule,
    GalleriaModule,
    ImageModule,
    InplaceModule,
    InputNumberModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    KnobModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessageModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OrganizationChartModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    RippleModule,
    ScrollPanelModule,
    ScrollTopModule,
    SelectButtonModule,
    SidebarModule,
    SkeletonModule,
    SlideMenuModule,
    SliderModule,
    SplitButtonModule,
    SplitterModule,
    StepsModule,
    TagModule,
    TableModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    TimelineModule,
    ToastModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeSelectModule,
    TreeTableModule,
    VirtualScrollerModule,
    AppCodeModule,
    StyleClassModule,
    FullCalendarModule,
    NgxIntlTelInputModule,
    EditorModule,
    QRCodeModule,
    PdfViewerModule,
    MsalModule.forRoot(
      new PublicClientApplication({
        auth: {
          clientId: environment.clientId,
          authority: 'https://login.microsoftonline.com/680e0b0b-c23d-4c18-87b7-b9be3abc45c6', // PPE testing environment.
          redirectUri: '/',
          postLogoutRedirectUri: '/login'
        },
        cache: {
          cacheLocation: "localStorage",
          storeAuthStateInCookie: window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1, // set to true for IE 11
        },
      }),
      {
        interactionType: InteractionType.Redirect, // Msal Guard Configuration
        authRequest: {
          scopes: ["user.read"],
        },
      },
      {
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
          ["https://graph.microsoft.com/v1.0/me", ["user.read"]],
        ]),
      }
    ),
  ],
  declarations: [
    AppComponent,
    AppMainComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AppConfigComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    DashboardComponent,
    FormLayoutComponent,
    FloatLabelComponent,
    InvalidStateComponent,
    InputComponent,
    ButtonComponent,
    TableComponent,
    ListComponent,
    TreeComponent,
    PanelsComponent,
    OverlaysComponent,
    MenusComponent,
    MessagesComponent,
    MessagesComponent,
    MiscComponent,
    ChartsComponent,
    EmptyComponent,
    FileComponent,
    IconsComponent,
    DocumentationComponent,
    CrudComponent,
    TimelineComponent,
    BlocksComponent,
    BlockViewer,
    MediaComponent,
    PaymentComponent,
    ConfirmationComponent,
    PersonalComponent,
    SeatComponent,
    LandingComponent,
    LoginComponent,
    ErrorComponent,
    NotfoundComponent,
    AccessComponent,
    ListPartenaireComponent,
    ListCollaborateurComponent,
    AddAnneeScolaireComponent,
    ListAnneeScolaireComponent,
    AddEcoleComponent,
    ListEcoleComponent,
    AddCampusComponent,
    ListCampusComponent,
    ListDiplomeComponent,
    AddDiplomeComponent,
    AddGroupeComponent,
    ListGroupeComponent,
    MatieresComponent,
    AddFormateurComponent,
    ListFormateursComponent,
    AddEtudiantComponent,
    ListEtudiantComponent,
    AddEntrepriseComponent,
    ListEntrepriseComponent,
    ExterneComponent,
    SuiviePreinscriptionComponent,
    ListSeancesComponent,
    AddSeanceComponent,
    EmploiDuTempsComponent,
    EmergementComponent,
    ValidationEmailComponent,
    ExamenComponent,
    UserProfilComponent,
    AjoutExamenComponent,
    PartenaireInscriptionComponent,
    FirstConnectionComponent,
    ProspectsComponent,
    ReinscritComponent,
    DetailsEtudiantComponent,
    NotificationComponent,
    MpOublieComponent,
    ContactComponent,
    InscriptionEntrepriseComponent,
    TuteurComponent,
    ListeContratsComponent,
    DemandeEventsComponent,
    ListEventsComponent,
    ListeContratsComponent,
    ArrToStrPipe,
    MatchingComponent,
    GestionEquipeComponent,
    DetailEquipeComponent,
    DemandeConseillerComponent,
    UsersSettingsComponent,
    GestionEtudiantsComponent,
    InfoImsComponent,
    FactureFormateurComponent,
    AnnoncesComponent,
    FormulaireIntunsComponent,
    AjoutTicketComponent,
    MesOffresComponent,
    SkillsManagementComponent,
    ProgressionPedagogiqueComponent,
    QuestionnaireSatisfactionComponent,
    ResultatComponent,
    ProspectsIntunsComponent,
    QuestionnaireFinFormationComponent,
    ResultatQFFComponent,
    PovFormateurComponent,
    PvSemestrielComponent,
    BulletinComponent,
    ListEntrepriseCeoComponent,
    PvAppreciationComponent,
    AppreciationInputComponent,
    PvAnnuelComponent,
    TuteurCeoComponent,
    EvenementsComponent,
    ContratsTutelleCeoComponent,
    ExterneSkillsnetComponent,
    EntrepriseFormComponent,
    FormulaireExterneSkillsnetComponent,
    POVHorsCommercialComponent,
    ProspectAltFormComponent,
    ProspectsAlternablesComponent,
    AddProspectComponent,
    QuestionnaireFormateurComponent,
    ResultatQfComponent,
    StageComponent,
    AjoutCollaborateurComponent,
    VentesComponent,
    ReglementComponent,
    SourcingComponent,
    EmployabiliteComponent,
    FormationsIntunsComponent,
    EtudiantsIntunsComponent,
    TeamsIntComponent,
    MemberIntComponent,
    OrientationComponent,
    AdmissionIntComponent,
    FormationAdmissionComponent,
    EcoleAdmissionComponent,
    RentreeScolaireAdmissionComponent,
    ConsulaireComponent,
    FormulaireAdmissionInternationalComponent,
    PaiementsComponent,
    StageCeoComponent,
    PovPartenaireListProspectsComponent,
    PovPartenaireAlternantsComponent,
    AjoutAlternantPartenaireComponent,
    DashboardIntComponent,
    BrandsListComponent,
    DashboardPartenaireComponent,
    GenerationDocComponent,
    GenDocInscriptionComponent,
    GenDocPreinscriptionComponent,
    GenDocPaiementPreinscriptionComponent,
    GenDocPaiementPreinscriptionAcompteComponent,
    GenDocPaiementAcompteComponent,
    GenDocDerogationComponent,
    GenDocLettreAcceptationComponent,
    PerformanceComponent,
    ListProspectsComponent,
    LivretGeneratorComponent,
    ActualiteComponent,
    DashboardCommercialComponent,
    FormulaireIcbsComponent,
    ResultatsFormulaireIcbsComponent,
    FormAdmissionDubaiComponent,
    FormAdmissionDubaiResultsComponent,
    AjoutLeadcrmComponent,
    ListLeadcrmComponent,
    CollaborateursComponent,
    CongesAutorisationsComponent,
    ActualiteNotificationsComponent,
    DemandesReclamationsComponent,
    DashboardRhComponent,
    LeadsNonAttribuesComponent,
    MesLeadsComponent,
    TeamsCrmComponent,
    MemberCrmComponent,
    ImportCrmComponent,
    LeadsNonQualifiesComponent,
    LeadsPrequalifiesComponent,
    VentesCRMComponent,
    LeadsQualifiesComponent,
    AddAgentC,
    UpdateAgentComponent,
    ListAgentV2Component,
    ConfigurationComponent,
    DashboardTicketingComponent,
    PaiementComponent,
    LeadInformationsPersonnelComponent,
    LeadProgrammeComponent,
    LeadSuiviComponent,
    LeadPaiementsComponent,
    LeadDossierComponent,
    VersionNonIframeComponent,
    ConfigurationMailComponent,
    MailTypeComponent,
    MailAutoComponent,
    MyTargetComponent,
    ConfigurationTargetComponent,
    DashboardTargetComponent,
    DocCheckerComponent,
    LeadCandidatureComponent,
    GestionComponent,
    MytaskComponent,
    MyprojectComponent,
    DashboardProjectV2Component,
    ConfigurationPointeuseComponent,
    IMatchComponent,
    AjouterUnTicketProjetComponent,
    IMatchComponent,
    CalendrierRhComponent,
    ConfigurationPointageComponent,
    CvComponent,
    AjoutCvComponent,
    ArchivagePointageComponent,
    RendezVousComponent,
    GestionMentionServiceComponent,
    ConfigurationMIComponent,
    FormulaireMIComponent,
    ResultatsMIComponent,
    GenschoolComponent,
    GencampusComponent,
    GenformationComponent,
    GendocComponent,
    OutputpageComponent,
    GenIntroComponent,
    GenOutroComponent,
    RendezVousResultatsComponent,
    GendocViewComponent,
    FormulaireFrontComponent,
    DashboardAlternanceComponent,
    MesRendezVousComponent,
    EntrepriseDashboardComponent,
    SuiviCandidatComponent,
    InformationsComponent,
    LinksComponent,
    VoirCvComponent,
    CalendrierEtudiantComponent,
    ImatchEntrepriseComponent,
    ImatchCandidatComponent,
    CandidatListComponent,
    EntrepriseListComponent,
    CalenderComponent,
    NewListTicketsComponent,
    ReadMoreComponent,
    NewCvthequeInterneComponent,
    // ======= Remboursement
    AddRemboussementComponent,
    ListRemboursementComponent,
    ContactRemboursementComponent,
    DataCleComponent,
    DetailsCandidatComponent,
    DossierRemboursementComponent,
    CommentaireSectionComponent,
    PayementInformationComponent,
    InformationRemboursementComponent,
    UploadRemboursementDocComponent,

    // >>>>>>> 
    MatchingViewerComponent,
    NewEntreprisesComponent,
    AnnonceViewerComponent,
    RdvCalendarInterneComponent,
    SeeCvExterneComponent,
    VoirDetailsOffreComponent,
    CvEtudiantComponent,
    PreinscriptionComponent,
    InscriptionComponent,
    PauseReadMoreComponent,
    NewCalendrierComponent,
    DashboardImatchComponent,
    CvPdfPreviewComponent,
    CvPdfHeaderComponent,
    CvPdfHeaderEspicComponent,
    CvPdfHeaderStudinfoComponent,
    CvPdfHeaderAdgComponent,
    CvPdfHeaderMedasupComponent,
    CvPdfHeaderBtechComponent,
    CvPdfSidebarComponent,
    CvPdfContentComponent,
    GestionEquipeRhComponent,
    CvLoaderPreviewComponent,
    PreviewCandidatureComponent,
    LeadDocumentsComponent,
    EvaluationComponent,
    UploadButtonComponent,
    LeadEvaluationComponent
    
    
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }, MessageService, ConfirmationService, DatePipe,
  { provide: LocationStrategy, useClass: HashLocationStrategy },
    MenuService, ConfigService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: MsalInterceptor,
    multi: true,
  },
  [CountryService]

  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(fr.default);
  }
}
