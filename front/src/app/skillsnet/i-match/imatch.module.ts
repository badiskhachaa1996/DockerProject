import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { MultiSelectModule } from "primeng/multiselect";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FileUploadModule } from "primeng/fileupload";
import { DialogModule } from "primeng/dialog";
import { TabViewModule } from "primeng/tabview";
import { CalendarModule } from "primeng/calendar";
import { SelectButtonModule } from "primeng/selectbutton";
import { SidebarModule } from 'primeng/sidebar';
import { TimelineModule } from 'primeng/timeline';
import { ChartModule } from 'primeng/chart';

import { FullCalendarModule } from 'primeng/fullcalendar';
import { DataViewModule } from 'primeng/dataview';
import { CheckboxModule } from 'primeng/checkbox';
import { StepsModule } from 'primeng/steps';
import { IMatchRoutingModule } from './imatch-routing.module';
import { CvComponent } from './cv/cv.component';
import { AjoutCvComponent } from './cv/ajout-cv/ajout-cv.component';
import { CvPdfPreviewComponent } from './cv/ajout-cv/cv-pdf-preview/cv-pdf-preview.component';
import { CvPdfContentComponent } from './cv/ajout-cv/cv-pdf-preview/cv-pdf-content/cv-pdf-content.component';
import { CvPdfHeaderAdgComponent } from './cv/ajout-cv/cv-pdf-preview/cv-pdf-header/cv-pdf-header-adg/cv-pdf-header-adg.component';
import { CvPdfHeaderBtechComponent } from './cv/ajout-cv/cv-pdf-preview/cv-pdf-header/cv-pdf-header-btech/cv-pdf-header-btech.component';
import { CvPdfHeaderComponent } from './cv/ajout-cv/cv-pdf-preview/cv-pdf-header/cv-pdf-header.component';
import { CvPdfHeaderEspicComponent } from './cv/ajout-cv/cv-pdf-preview/cv-pdf-header/cv-pdf-header-espic/cv-pdf-header-espic.component';
import { CvPdfHeaderMedasupComponent } from './cv/ajout-cv/cv-pdf-preview/cv-pdf-header/cv-pdf-header-medasup/cv-pdf-header-medasup.component';
import { CvPdfHeaderStudinfoComponent } from './cv/ajout-cv/cv-pdf-preview/cv-pdf-header/cv-pdf-header-studinfo/cv-pdf-header-studinfo.component';
import { CvPdfSidebarComponent } from './cv/ajout-cv/cv-pdf-preview/cv-pdf-sidebar/cv-pdf-sidebar.component';
import { CvEtudiantComponent } from './cv-etudiant/cv-etudiant.component';
import { CvLoaderPreviewComponent } from './cv-pdf-preview/cv-loader-preview/cv-loader-preview.component';
import { ImatchCandidatComponent } from './imatch-candidat/imatch-candidat.component';
import { CandidatListComponent } from './imatch-candidat/candidat-list/candidat-list.component';
import { ImatchEntrepriseComponent } from './imatch-entreprise/imatch-entreprise.component';
import { EntrepriseListComponent } from './imatch-entreprise/entreprise-list/entreprise-list.component';
import { MatchingViewerComponent } from './matching-viewer/matching-viewer.component';
import { NewCvthequeInterneComponent } from './new-cvtheque-interne/new-cvtheque-interne.component';
import { RdvCalendarInterneComponent } from './rdv-calendar-interne/rdv-calendar-interne.component';
import { RendezVousComponent } from './rendez-vous/rendez-vous.component';
import { RendezVousResultatsComponent } from './rendez-vous-resultats/rendez-vous-resultats.component';
import { SeeCvExterneComponent } from './see-cv-externe/see-cv-externe.component';
import { IMatchComponent } from './i-match.component';
import { ExterneSkillsnetComponent } from '../externe-skillsnet/externe-skillsnet.component';
import { FieldsetModule } from 'primeng/fieldset';
import { ReadMoreModule } from 'src/app/other/component/read-more/read-more.module';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SkillsManagementModule } from '../skills-management/skills-management.module';
@NgModule({
    declarations: [
        CvComponent,
        AjoutCvComponent,
        CvPdfPreviewComponent,
        CvPdfContentComponent,
        CvPdfHeaderAdgComponent,
        CvPdfHeaderBtechComponent,
        CvPdfHeaderComponent,
        CvPdfHeaderEspicComponent,
        CvPdfHeaderMedasupComponent,
        CvPdfHeaderStudinfoComponent,
        CvPdfSidebarComponent,
        CvEtudiantComponent,
        CvLoaderPreviewComponent,
        MatchingViewerComponent,
        NewCvthequeInterneComponent,
        RdvCalendarInterneComponent,
        RendezVousComponent,
        RendezVousResultatsComponent,
        SeeCvExterneComponent,
        ExterneSkillsnetComponent,
    ],
    imports: [
        CommonModule,
        IMatchRoutingModule,
        TableModule,
        ToastModule,
        MultiSelectModule,
        DropdownModule,
        ReactiveFormsModule,
        FileUploadModule,
        FormsModule,
        DialogModule,
        TabViewModule,
        CalendarModule,
        SelectButtonModule,
        SidebarModule,
        TimelineModule,
        ChartModule,
        FullCalendarModule,
        DataViewModule,
        CheckboxModule,
        StepsModule,
        FieldsetModule,
        ReadMoreModule,
        InputTextModule,
        ButtonModule,
        SkillsManagementModule
    ]
})
export class IMatchModule { }
