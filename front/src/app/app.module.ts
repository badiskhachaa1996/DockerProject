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
//import { ListCampusComponent } from './administration/campus/list-campus/list-campus.component';
//import { AddCampusComponent } from './administration/campus/add-campus/add-campus.component';
//import { ListEcoleComponent } from './administration/ecoles/list-ecole/list-ecole.component';
//import { AddEcoleComponent } from './administration/ecoles/add-ecole/add-ecole.component';
//import { ListAnneeScolaireComponent } from './administration/annees-scolaires/list-annee-scolaire/list-annee-scolaire.component';
//import { AddAnneeScolaireComponent } from './administration/annees-scolaires/add-annee-scolaire/add-annee-scolaire.component';
import { ListCollaborateurComponent } from './partenaire/collaborateurs/list-collaborateur/list-collaborateur.component';
import { ListPartenaireComponent } from './partenaire/partenaires/list-partenaire/list-partenaire.component';
//import { ListDiplomeComponent } from './administration/diplomes/list-diplome/list-diplome.component';
//import { AddDiplomeComponent } from './administration/diplomes/add-diplome/add-diplome.component';
//import { AddGroupeComponent } from './administration/groupes/add-groupe/add-groupe.component';
//import { ListGroupeComponent } from './administration/groupes/list-groupe/list-groupe.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ExterneComponent } from './authentification/externe/externe.component';
import { SuiviePreinscriptionComponent } from './admission/suivie-preinscription/suivie-preinscription.component';

import { ValidationEmailComponent } from './authentification/validation-email/validation-email.component';
import { environment } from 'src/environments/environment';
import { UserProfilComponent } from './profil/user-profil/user-profil.component';
import { PartenaireInscriptionComponent } from './partenaire/partenaire-inscription/partenaire-inscription.component';
import { FirstConnectionComponent } from './profil/first-connection/first-connection.component';
//import { ReinscritComponent } from './administration/validation-prospects/reinscrit.component';
import { MpOublieComponent } from './authentification/mp-oublie/mp-oublie.component';
import { ContactComponent } from './footer/contact/contact.component';
import { InscriptionEntrepriseComponent } from './pedagogie/entreprises/inscription-entreprise/inscription-entreprise.component';
import { DemandeEventsComponent } from './demande-events/demande-events.component';
import { ListEventsComponent } from './demande-events/list-events/list-events.component';
import { ArrToStrPipe } from './arr-to-str.pipe';
//import { GestionEquipeComponent } from './commercial/gestion-equipe/gestion-equipe.component';
//import { DetailEquipeComponent } from './commercial/detail-equipe/detail-equipe.component';
//import { DemandeConseillerComponent } from './commercial/demande-conseiller/demande-conseiller.component';
//import { UsersSettingsComponent } from './admin-tools/users-settings/users-settings.component';
import { SignaturePadModule } from 'angular2-signaturepad';
//import { InfoImsComponent } from './admin-tools/info-ims/info-ims.component';
import * as fr from '@angular/common/locales/fr';
import { PublicClientApplication, InteractionType } from "@azure/msal-browser";
//import { CalendrierRhComponent } from './rh/calendrier-rh/calendrier-rh.component';
//import { ConfigurationPointageComponent } from './rh/configuration-pointage/configuration-pointage.component';

import {
    MsalInterceptor,
    MsalModule,
    MsalRedirectComponent,
} from "@azure/msal-angular";
import { FactureFormateurComponent } from './finance/facture-formateur/facture-formateur.component';
import { FormulaireIntunsComponent } from './formulaire-admission/formulaire-intuns/formulaire-intuns.component';

import { QuestionnaireSatisfactionComponent } from './pedagogie/questionnaire-satisfaction/questionnaire-satisfaction.component';
import { ProspectsIntunsComponent } from './admission/prospects-intuns/prospects-intuns.component';
import { QuestionnaireFinFormationComponent } from './pedagogie/questionnaire-fin-formation/questionnaire-fin-formation.component';
import { PovFormateurComponent } from './pedagogie/etudiants/list-etudiant/pov-formateur/pov-formateur.component';
import { EntrepriseFormComponent } from './pedagogie/entreprises/entreprise-form/entreprise-form.component';
import { FormulaireExterneSkillsnetComponent } from './skillsnet/externe-skillsnet/formulaire-externe-skillsnet/formulaire-externe-skillsnet.component';
import { POVHorsCommercialComponent } from './skillsnet/matching/povhors-commercial/povhors-commercial.component';
import { ProspectAltFormComponent } from './pedagogie/etudiants/prospect-alt-form/prospect-alt-form.component';
//import { ProspectsAlternablesComponent } from './commercial/prospects-alternables/prospects-alternables.component';
import { AddProspectComponent } from './admission/add-prospect/add-prospect.component';
import { QuestionnaireFormateurComponent } from './pedagogie/questionnaire-formateur/questionnaire-formateur.component';
//import { StageComponent } from './commercial/stage/stage.component';
import { AjoutCollaborateurComponent } from './partenaire/collaborateurs/ajout-collaborateur/ajout-collaborateur.component';
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
//import { AddAgentComponent as AddAgentC } from './agents/add-agent/add-agent.component';
//import { UpdateAgentComponent } from './agents/update-agent/update-agent.component';
//import { ListAgentComponent as ListAgentV2Component } from './agents/list-agent/list-agent.component';
import { VersionNonIframeComponent } from './formulaire-admission/formulaire-admission-international/version-non-iframe/version-non-iframe.component';
import { ConfigurationMailComponent } from './mail-type/configuration-mail/configuration-mail.component';
import { MailTypeComponent } from './mail-type/mail/mail.component';
import { MailAutoComponent } from './mail-type/mail-auto/mail-auto.component';
import { EditorModule } from 'primeng/editor';
import { DocCheckerComponent } from './international/generation-doc/doc-checker/doc-checker.component';
import { GestionComponent } from './project-v2/gestion-des-projects/gestion/gestion.component';
import { MytaskComponent } from './project-v2/mytask/mytask.component';
import { MyprojectComponent } from './project-v2/myproject/myproject.component';
import { DashboardProjectV2Component } from './project-v2/dashboard-project-v2/dashboard-project-v2.component';

//import { ConfigurationPointeuseComponent } from './rh/configuration-pointeuse/configuration-pointeuse.component';
import { IMatchComponent } from './skillsnet/i-match/i-match.component';
//import { ArchivagePointageComponent } from './rh/archivage-pointage/archivage-pointage.component';
//import { GestionMentionServiceComponent } from './agents/gestion-mention-service/gestion-mention-service.component';
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
import { GendocViewComponent } from './gen_doc/gendoc/gendoc-view/gendoc-view.component';
import { FormulaireFrontComponent } from './template/formulaire/formulaire-front/formulaire-front.component';
//import { DashboardAlternanceComponent } from './commercial/dashboard-alternance/dashboard-alternance.component';
import { LinksComponent } from './links/links.component';
import { ImatchEntrepriseComponent } from './skillsnet/i-match/imatch-entreprise/imatch-entreprise.component';
import { ImatchCandidatComponent } from './skillsnet/i-match/imatch-candidat/imatch-candidat.component';
import { CandidatListComponent } from './skillsnet/i-match/imatch-candidat/candidat-list/candidat-list.component';
import { EntrepriseListComponent } from './skillsnet/i-match/imatch-entreprise/entreprise-list/entreprise-list.component';
//import { NewListTicketsComponent } from './ticketing/new-list-tickets/new-list-tickets.component';
import { ReadMoreComponent } from './other/component/read-more/read-more.component';
import { NgModule } from '@angular/core';
import { ListRemboursementComponent } from './remboursement/list-remboursement/list-remboursement.component';
import { DataCleComponent } from './remboursement/list-remboursement/data-cle/data-cle.component';
import { DetailsCandidatComponent } from './remboursement/list-remboursement/details-candidat/details-candidat.component';
import { ContactRemboursementComponent } from './remboursement/list-remboursement/contact/contact.component';
import { DossierRemboursementComponent } from './remboursement/list-remboursement/dossier-remboursement/dossier-remboursement.component';
import { CommentaireSectionComponent } from './remboursement/list-remboursement/commentaire-section/commentaire-section.component';
import { PayementInformationComponent } from './remboursement/list-remboursement/payement-information/payement-information.component';
import { InformationRemboursementComponent } from './remboursement/list-remboursement/information-remboursement/information-remboursement.component';
import { UploadRemboursementDocComponent } from './remboursement/add-remboursement/upload-remboursement-doc/upload-remboursement-doc.component';
import { PauseReadMoreComponent } from './other/component/pause-read-more/pause-read-more.component';
//import { NewCalendrierComponent } from './rh/new-calendrier/new-calendrier.component';
//import { GestionEquipeRhComponent } from './rh/gestion-equipe-rh/gestion-equipe-rh.component';
import { PreviewCandidatureComponent } from './admission/lead/preview-candidature/preview-candidature.component';
import { UploadButtonComponent } from './remboursement/upload-button/upload-button.component';
import { AddRemboursementPublicComponent } from './remboursement/add-remboursement-public/add-remboursement-public.component';
import { CaptchaModule } from 'primeng/captcha';
import { RecaptchaModule } from "ng-recaptcha";
import { NgxCaptchaModule } from 'ngx-captcha';

import { AddRemboussementComponent } from './remboursement/add-remboursement/add-remboussement.component';
import { LogementComponent } from './ims+/logement/logement.component';
import { GestionLogementComponent } from './ims+/gestion-logement/gestion-logement.component';
import { BookingV2Component } from './booking-v2/booking-v2.component';

import { AdminToolsModule } from './admin-tools/admin-tools.module';
import { AdministrationModule } from './administration/administration.module';
import { AgentsModule } from "./agents/agents.module";
import { CommercialModule } from "./commercial/commercial.module";
import { RhModule } from "./rh/rh.module";
import { CriteresComponent } from './crm/criteres/criteres.component';
import { GroupesComponent } from './administration-v1/configuration/groupes/groupes.component';
import { AddGroupeV2Component } from './administration-v1/configuration/groupes/add-groupe-v2/add-groupe-v2.component';
import { InscriptionComponent } from './administration-v1/gestion-des-inscriptions/inscription/inscription/inscription.component';

@NgModule({
    imports: [
        ReactiveFormsModule,
        NgxCaptchaModule,
        CaptchaModule,
        BrowserModule,
        RecaptchaModule,
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
        AdminToolsModule,
        AdministrationModule,
        AgentsModule,
        CommercialModule,
        RhModule,

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
        BlockViewer,
        MediaComponent,
        InscriptionComponent,
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
        //AddAnneeScolaireComponent,
        //ListAnneeScolaireComponent,
        //AddEcoleComponent,
        //ListEcoleComponent,
        //AddCampusComponent,
        //ListCampusComponent,
        //ListDiplomeComponent,
        //AddDiplomeComponent,
        //AddGroupeComponent,
        //ListGroupeComponent,
        //MatieresComponent,
        //AddFormateurComponent,
        //ListFormateursComponent,
        //AddEtudiantComponent,
        //ListEtudiantComponent,
        //AddEntrepriseComponent,
        //ListEntrepriseComponent,
        ExterneComponent,
        GroupesComponent,
        AddGroupeV2Component,
        CriteresComponent,
        SuiviePreinscriptionComponent,
        //ListSeancesComponent,
        //AddSeanceComponent,
        //EmploiDuTempsComponent,
        //EmergementComponent,
        ValidationEmailComponent,
        //ExamenComponent,
        UserProfilComponent,
        //AjoutExamenComponent,
        PartenaireInscriptionComponent,
        FirstConnectionComponent,
        //ProspectsComponent,
        //ReinscritComponent,
        //DetailsEtudiantComponent,
        //NotificationComponent,
        MpOublieComponent,
        ContactComponent,
        InscriptionEntrepriseComponent,
        //TuteurComponent,
        //ListeContratsComponent,
        DemandeEventsComponent,
        ListEventsComponent,
        ArrToStrPipe,
        //MatchingComponent,
        //GestionEquipeComponent,
        //DetailEquipeComponent,
        //DemandeConseillerComponent,
        //UsersSettingsComponent,
        //GestionEtudiantsComponent,
        //InfoImsComponent,
        FactureFormateurComponent,
        //AnnoncesComponent,
        FormulaireIntunsComponent,
        //AjoutTicketComponent,
        //MesOffresComponent,
        //SkillsManagementComponent,
        //ProgressionPedagogiqueComponent,
        QuestionnaireSatisfactionComponent,
        //ResultatComponent,
        ProspectsIntunsComponent,
        QuestionnaireFinFormationComponent,
        //ResultatQFFComponent,
        PovFormateurComponent,
        //PvSemestrielComponent,
        //BulletinComponent,
        //ListEntrepriseCeoComponent,
        // PvAppreciationComponent,
        //AppreciationInputComponent,
        //PvAnnuelComponent,
        //TuteurCeoComponent,
        //EvenementsComponent,
        //ContratsTutelleCeoComponent,
        //ExterneSkillsnetComponent,
        EntrepriseFormComponent,
        FormulaireExterneSkillsnetComponent,
        POVHorsCommercialComponent,
        ProspectAltFormComponent,
        //ProspectsAlternablesComponent,
        AddProspectComponent,
        QuestionnaireFormateurComponent,
        //ResultatQfComponent,
        //StageComponent,
        AjoutCollaborateurComponent,
        VentesComponent,
        ReglementComponent,
        //SourcingComponent,
        EmployabiliteComponent,
        FormationsIntunsComponent,
        EtudiantsIntunsComponent,
        //TeamsIntComponent,
        //MemberIntComponent,
        //OrientationComponent,
        //AdmissionIntComponent,
        //FormationAdmissionComponent,
        //EcoleAdmissionComponent,
        //RentreeScolaireAdmissionComponent,
        //ConsulaireComponent,
        FormulaireAdmissionInternationalComponent,
        DashboardPartenaireComponent,
        //PaiementsComponent,
        //StageCeoComponent,
        //PovPartenaireListProspectsComponent,
        //PovPartenaireAlternantsComponent,
        //AjoutAlternantPartenaireComponent,
        /*DashboardIntComponent,
        BrandsListComponent,

        GenerationDocComponent,
        GenDocInscriptionComponent,
        GenDocPreinscriptionComponent,
        GenDocPaiementPreinscriptionComponent,
        GenDocPaiementPreinscriptionAcompteComponent,
        GenDocPaiementAcompteComponent,
        GenDocDerogationComponent,*/
        //GenDocLettreAcceptationComponent,
        //PerformanceComponent,
        //ListProspectsComponent,
        //LivretGeneratorComponent,
        //ActualiteComponent,
        //DashboardCommercialComponent,
        FormulaireIcbsComponent,
        ResultatsFormulaireIcbsComponent,
        FormAdmissionDubaiComponent,
        //FormAdmissionDubaiResultsComponent,
        //AjoutLeadcrmComponent,
        //ListLeadcrmComponent,
        //CollaborateursComponent,
        //CongesAutorisationsComponent,
        //ActualiteNotificationsComponent,
        //DemandesReclamationsComponent,
        //DashboardRhComponent,
        //LeadsNonAttribuesComponent,
        //MesLeadsComponent,
        //TeamsCrmComponent,
        //MemberCrmComponent,
        //ImportCrmComponent,
        //LeadsNonQualifiesComponent,
        //LeadsPrequalifiesComponent,
        //VentesCRMComponent,
        //LeadsQualifiesComponent,
        //AddAgentC,
        //UpdateAgentComponent,
        //ListAgentV2Component,
        //ConfigurationComponent,
        //DashboardTicketingComponent,
        //PaiementComponent,
        //LeadInformationsPersonnelComponent,
        //LeadProgrammeComponent,
        //LeadSuiviComponent,
        //LeadPaiementsComponent,
        //LeadDossierComponent,
        VersionNonIframeComponent,
        ConfigurationMailComponent,
        MailTypeComponent,
        MailAutoComponent,
        //MyTargetComponent,
        //ConfigurationTargetComponent,
        //DashboardTargetComponent,
        DocCheckerComponent,
        //LeadCandidatureComponent,
        GestionComponent,
        MytaskComponent,
        MyprojectComponent,
        DashboardProjectV2Component,
        //ConfigurationPointeuseComponent,
        IMatchComponent,
        //AjouterUnTicketProjetComponent,
        IMatchComponent,
        //CalendrierRhComponent,
        //ConfigurationPointageComponent,
        //CvComponent,
        //AjoutCvComponent,
        //ArchivagePointageComponent,
        //RendezVousComponent,
        //GestionMentionServiceComponent,
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
        //RendezVousResultatsComponent,
        GendocViewComponent,
        FormulaireFrontComponent,
        //DashboardAlternanceComponent,
        //MesRendezVousComponent,
        //EntrepriseDashboardComponent,
        //SuiviCandidatComponent,
        //InformationsComponent,
        LinksComponent,
        //VoirCvComponent,
        //CalendrierEtudiantComponent,
        ImatchEntrepriseComponent,
        ImatchCandidatComponent,
        //CandidatListComponent,
        EntrepriseListComponent,
        CandidatListComponent,
        //CalenderComponent,
        //NewListTicketsComponent,
        ReadMoreComponent,
        //NewCvthequeInterneComponent,
        // ======= Remboursement
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
        //MatchingViewerComponent,
        //NewEntreprisesComponent,
        //AnnonceViewerComponent,
        //RdvCalendarInterneComponent,
        //SeeCvExterneComponent,
        //VoirDetailsOffreComponent,
        //CvEtudiantComponent,
        //PreinscriptionComponent,
        //InscriptionComponent,
        PauseReadMoreComponent,
        //NewCalendrierComponent,
        //DashboardImatchComponent,
        /*CvPdfPreviewComponent,
        CvPdfHeaderComponent,
        CvPdfHeaderEspicComponent,
        CvPdfHeaderStudinfoComponent,
        CvPdfHeaderAdgComponent,
        CvPdfHeaderMedasupComponent,
        CvPdfHeaderBtechComponent,
        CvPdfSidebarComponent,
        CvPdfContentComponent,*/
        //GestionEquipeRhComponent,
        //CvLoaderPreviewComponent,
        PreviewCandidatureComponent,
        //LeadDocumentsComponent,
        //EvaluationComponent,
        UploadButtonComponent,
        //LeadEvaluationComponent,
        AddRemboursementPublicComponent,


        //DocumentsCandidatureViewerComponent,
        //GestionProduitsComponent,
        AddRemboussementComponent,
        //CrmListComponent,
        LogementComponent,
        GestionLogementComponent,
        BookingV2Component,
        //SuivreLeadComponent,
        //GestionOperationComponent,
        //GestionSrourcesComponent
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
    exports: [
        ReadMoreComponent,
        PauseReadMoreComponent
    ],
    bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule {
    constructor() {
        registerLocaleData(fr.default);
    }
}

