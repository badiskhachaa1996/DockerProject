import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { TableModule } from 'primeng/table';
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
import { CustomerService } from './dev-components/service-template/customerservice';
import { EventService } from './dev-components/service-template/eventservice';
import { IconService } from './dev-components/service-template/iconservice';
import { NodeService } from './dev-components/service-template/nodeservice';
import { PhotoService } from './dev-components/service-template/photoservice';
import { ProductService } from './dev-components/service-template/productservice';
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
import { AddAgentComponent } from './administration/agents/add-agent/add-agent.component';
import { ListAgentComponent } from './administration/agents/list-agent/list-agent.component';
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
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotesComponent } from './pedagogie/notes/notes.component';
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
import { MentionsLegalesComponent } from './footer/mentions-legales/mentions-legales.component';
import { PolitiqueConfidentialiteComponent } from './footer/politique-confidentialite/politique-confidentialite.component';
import { InscriptionEntrepriseComponent } from './pedagogie/entreprises/inscription-entreprise/inscription-entreprise.component';
import { TuteurComponent } from './pedagogie/tuteur/tuteur.component';

import { ListeContratsComponent } from './pedagogie/entreprises/liste-contrats/liste-contrats.component';
import { DemandeEventsComponent } from './demande-events/demande-events.component';
import { ListEventsComponent } from './demande-events/list-events/list-events.component';
import { ArrToStrPipe } from './arr-to-str.pipe';
import { CreateAccountComponent } from './support/create-account/create-account.component';
import { MyAccountComponent } from './gestion-bancaire/gestion-des-comptes/my-account/my-account.component';
import { AddNewIndividualAccountComponent } from './gestion-bancaire/gestion-des-comptes/add-new-individual-account/add-new-individual-account.component';
import { ListeDesComptesComponent } from './gestion-bancaire/gestion-des-comptes/liste-des-comptes/liste-des-comptes.component';
import { AccountDetailsComponent } from './gestion-bancaire/gestion-des-comptes/account-details/account-details.component';
import { ReturnUrlComponent } from './gestion-bancaire/gestion-des-transactions/return-pages/return-url/return-url.component';
import { CancelUrlComponent } from './gestion-bancaire/gestion-des-transactions/return-pages/cancel-url/cancel-url.component';
import { ErrorUrlComponent } from './gestion-bancaire/gestion-des-transactions/return-pages/error-url/error-url.component';
import { LogementComponent } from './ims+/logement/logement.component';
import { GestionLogementComponent } from './ims+/gestion-logement/gestion-logement.component';
import { MatchingComponent } from './skillsnet/matching/matching.component';
import { GestionEquipeComponent } from './commercial/gestion-equipe/gestion-equipe.component';
import { DetailEquipeComponent } from './commercial/detail-equipe/detail-equipe.component';
import { DemandeConseillerComponent } from './commercial/demande-conseiller/demande-conseiller.component';
import { GrhComponent } from './rh/grh/grh.component';
import { UsersSettingsComponent } from './admin-tools/users-settings/users-settings.component';
import { AnalyseDoublonComponent } from './admin-tools/analyse-doublon/analyse-doublon.component';
import { GestionEtudiantsComponent } from './pedagogie/etudiants/gestion-etudiants/gestion-etudiants.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { DevoirsComponent } from './pedagogie/devoirs/devoirs.component';
import { DevoirsEtudiantsComponent } from './pedagogie/devoirs-etudiants/devoirs-etudiants.component';
import { InfoImsComponent } from './admin-tools/info-ims/info-ims.component';
import * as fr from '@angular/common/locales/fr';
import { PublicClientApplication, InteractionType } from "@azure/msal-browser";
import {
  MsalInterceptor,
  MsalModule,
  MsalRedirectComponent,
} from "@azure/msal-angular";
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
import { ResultatQFFComponent } from './pedagogie/questionnaire-fin-formation/resultat-qff/resultat-qff.component';
import { PovFormateurComponent } from './pedagogie/etudiants/list-etudiant/pov-formateur/pov-formateur.component';
import { MyTaskComponent } from './projects/my-task/my-task.component';
import { TaskManagementComponent } from './projects/task-management/task-management.component';
import { PvSemestrielComponent } from './pedagogie/notes/pv-semestriel/pv-semestriel.component';
import { BulletinComponent } from './pedagogie/notes/bulletin/bulletin.component';
import { ListEntrepriseCeoComponent } from './pedagogie/entreprises/list-entreprise-ceo/list-entreprise-ceo.component';
import { PvAppreciationComponent } from './pedagogie/notes/pv-appreciation/pv-appreciation.component';
import { AppreciationInputComponent } from './pedagogie/formateurs/appreciation-input/appreciation-input.component';
import { PvAnnuelComponent } from './pedagogie/notes/pv-annuel/pv-annuel.component';
import { TeamComponent } from './projects/team/team.component';
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


@NgModule({
  imports: [
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
    AddAgentComponent,
    ListAgentComponent,
    GestionTicketsComponent,
    SuiviTicketsComponent,
    GestionServicesComponent,
    MatieresComponent,
    AddFormateurComponent,
    ListFormateursComponent,
    AddEtudiantComponent,
    ListEtudiantComponent,
    AddEntrepriseComponent,
    ListEntrepriseComponent,
    GestionPreinscriptionsComponent,
    FormulaireAdmissionComponent,
    NotesComponent,
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
    CreateAccountComponent,
    MyAccountComponent,
    AddNewIndividualAccountComponent,
    ListeDesComptesComponent,
    AccountDetailsComponent,
    ReturnUrlComponent,
    CancelUrlComponent,
    ErrorUrlComponent,
    LogementComponent,
    GestionLogementComponent,
    MatchingComponent,
    GestionEquipeComponent,
    DetailEquipeComponent,
    DemandeConseillerComponent,
    GrhComponent,
    UsersSettingsComponent,
    AnalyseDoublonComponent,
    GestionEtudiantsComponent,
    DevoirsComponent,
    DevoirsEtudiantsComponent,
    InfoImsComponent,
    FactureFormateurComponent,
    AnnoncesComponent,
    FormulaireIntunsComponent,
    CvthequeComponent,
    MesOffresComponent,
    SkillsManagementComponent,
    ProgressionPedagogiqueComponent,
    QuestionnaireSatisfactionComponent,
    ResultatComponent,
    ProspectsIntunsComponent,
    QuestionnaireFinFormationComponent,
    ResultatQFFComponent,
    PovFormateurComponent,
    MyTaskComponent,
    TaskManagementComponent,
    PvSemestrielComponent,
    BulletinComponent,
    ListEntrepriseCeoComponent,
    PvAppreciationComponent,
    AppreciationInputComponent,
    PvAnnuelComponent,
    TeamComponent,
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
    BrandsListComponent
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }, MessageService, ConfirmationService,DatePipe,
  { provide: LocationStrategy, useClass: HashLocationStrategy },
    MenuService, ConfigService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: MsalInterceptor,
    multi: true,
  },
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(fr.default);
  }
}