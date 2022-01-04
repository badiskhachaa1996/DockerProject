import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import {FullCalendarModule} from 'primeng/fullcalendar';
import { GalleriaModule } from 'primeng/galleria';
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { LightboxModule } from 'primeng/lightbox';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuItemContent, MenuModule } from 'primeng/menu';
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
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SpinnerModule } from 'primeng/spinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { AppComponent } from './app.component';
import { AppMenuComponent, AppSubMenuComponent } from './app.menu.component';
import { AppTopBarComponent } from './app.topbar.component';
import { KeyFilterModule } from 'primeng/keyfilter';
import { AppRoutingModule } from './app.routes';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { CaptchaModule } from 'primeng/captcha';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoginComponent } from './authentification/login/login.component';
import { RegisterComponent } from './authentification/register/register.component';
import { HomeComponent } from './home/home.component';
import { DragDropModule } from 'primeng/dragdrop';
import { ServiceComponent } from './Gestion_Application/service/service.component';
import { CreateComponent } from './ticket/create/create.component';
import { UpdateComponent } from './ticket/update/update.component';
import { ListTicketComponent } from './ticket/list-ticket/list-ticket.component';
import { SuiviComponent } from './ticket/suivi/suivi.component';
import { EditComponent } from './Gestion_Application/edit/edit.component';
import { EditSujetComponent } from './Gestion_Application/edit-sujet/edit-sujet.component';
import { ListUserComponent } from './authentification/list-user/list-user.component';
import { UpdateUserComponent } from './authentification/update/update.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NotificationComponent } from './notification/notification.component'
import {MenuItem} from 'primeng/api';
import { ModifierProfilComponent } from './authentification/modifier-profil/modifier-profil.component';
import { FooterComponent } from './footer/footer.component';
import { IPublicClientApplication, PublicClientApplication, InteractionType, BrowserCacheLocation, LogLevel } from '@azure/msal-browser';
import { MsalGuard, MsalInterceptor, MsalBroadcastService, MsalInterceptorConfiguration, MsalModule, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalGuardConfiguration, MsalRedirectComponent } from '@azure/msal-angular';
import { FirstconnectionComponent } from './authentification/firstconnection/firstconnection.component';
import { ClasseComponent } from './classe/classe.component';
import { AnneeScolaireComponent } from './annee-scolaire/annee-scolaire.component';
import { EcoleComponent } from './ecole/ecole.component';
import { SignComponent } from './presence/sign/sign.component';
import { SeanceComponent } from './seance/seance.component';
import { CalendarComponent } from './seance/calendar/calendar.component';
import { DiplomeComponent } from './diplome/diplome.component';
import { CampusComponent } from './campus/campus.component';
import { FirstInscriptionComponent } from './first-inscription/first-inscription.component';
import { FormateurComponent } from './formateur/formateur.component';
import { MatiereComponent } from './matiere/matiere.component';
import { NotesComponent } from './notes/notes.component';




@NgModule({
    imports: [
        
        BrowserModule,CaptchaModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ColorPickerModule,    
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DropdownModule,
        EditorModule,
        FieldsetModule,
        FileUploadModule,
        FullCalendarModule,
        GalleriaModule,
        InplaceModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
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
        ScrollPanelModule,
        SelectButtonModule,
        SlideMenuModule,
        SliderModule,
        SpinnerModule,
        SplitButtonModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TerminalModule,
        TieredMenuModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        KeyFilterModule,
        VirtualScrollerModule, 
        AppRoutingModule,
        ReactiveFormsModule,
        TriStateCheckboxModule,
        ProgressSpinnerModule,
        DragDropModule,
        FullCalendarModule 
       
    ],
    declarations: [
        AppComponent,
        AppMenuComponent,
        AppSubMenuComponent,
        AppTopBarComponent,
        LoginComponent,
        RegisterComponent,
        HomeComponent,
        ServiceComponent,
        CreateComponent,
        UpdateComponent,
        ListTicketComponent,
        SuiviComponent,
        EditComponent,
        EditSujetComponent,
        ListUserComponent,
        UpdateUserComponent,
        NavbarComponent,
      
        NotificationComponent,
        ModifierProfilComponent,
        FooterComponent,
        FirstconnectionComponent,
        ClasseComponent,
        AnneeScolaireComponent,
        EcoleComponent,
        SignComponent,
        SeanceComponent,
        CalendarComponent,
        DiplomeComponent,
        CampusComponent,
        FirstInscriptionComponent,
        FormateurComponent,
        MatiereComponent,
        NotesComponent,
    

               
    ],
        providers: [  MessageService ,ConfirmationService,ServiceComponent,ListUserComponent,
              {
                provide: MSAL_INSTANCE,
                useFactory: MSALInstanceFactory
              },
              {
                provide: MSAL_GUARD_CONFIG,
                useFactory: MSALGuardConfigFactory
              },
              MsalService,
              MsalGuard,
              MsalBroadcastService],
        bootstrap: [AppComponent]
        })
      export class AppModule { }
       

      export function MSALInstanceFactory(): IPublicClientApplication {
        return new PublicClientApplication({
          auth: {
            // clientId: '6226576d-37e9-49eb-b201-ec1eeb0029b6', // Prod enviroment. Uncomment to use.
            clientId: '25314c92-c369-4273-b8b0-5b3d2096ed05', // PPE testing environment
            // authority: 'https://login.microsoftonline.com/common', // Prod environment. Uncomment to use.
            authority: 'https://login.microsoftonline.com/680e0b0b-c23d-4c18-87b7-b9be3abc45c6', // PPE testing environment.
            redirectUri: '/',
            postLogoutRedirectUri: '/login'
          },
          cache: {
            cacheLocation: BrowserCacheLocation.LocalStorage,
            storeAuthStateInCookie:  window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1, // set to true for IE 11
          },
          system: {
            loggerOptions: {
              loggerCallback,
              logLevel: LogLevel.Info,
              piiLoggingEnabled: false
            }
          }
        });
      }
      export function MSALGuardConfigFactory(): MsalGuardConfiguration {
        return {
          interactionType: InteractionType.Redirect,
          authRequest: {
            scopes: ['user.read']
          }
        };
      }
      export function loggerCallback(logLevel: LogLevel, message: string) {
        //console.log(message);
      }