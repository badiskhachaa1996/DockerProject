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
import { FieldsetModule } from 'primeng/fieldset';
import { PedagogieRoutingModule } from './pedagogie-routing.module';
import { ProspectsComponent } from './assignation-groupe/prospects.component';
import { ContratsTutelleCeoComponent } from './entreprises/contrats-tutelle-ceo/contrats-tutelle-ceo.component';
import { EntrepriseFormComponent } from './entreprises/entreprise-form/entreprise-form.component';
import { InscriptionEntrepriseComponent } from './entreprises/inscription-entreprise/inscription-entreprise.component';
import { ListEntrepriseCeoComponent } from './entreprises/list-entreprise-ceo/list-entreprise-ceo.component';
import { ListEntrepriseComponent } from './entreprises/list-entreprise/list-entreprise.component';
import { ListeContratsComponent } from './entreprises/liste-contrats/liste-contrats.component';
import { AddEtudiantComponent } from './etudiants/add-etudiant/add-etudiant.component';
import { DetailsEtudiantComponent } from './etudiants/details-etudiant/details-etudiant.component';
import { GestionEtudiantsComponent } from './etudiants/gestion-etudiants/gestion-etudiants.component';
import { ListEtudiantComponent } from './etudiants/list-etudiant/list-etudiant.component';
import { AjoutExamenComponent } from './examen/ajout-examen/ajout-examen.component';
import { ExamenComponent } from './examen/list-examen/examen.component';
import { AddFormateurComponent } from './formateurs/add-formateur/add-formateur.component';
import { AppreciationInputComponent } from './formateurs/appreciation-input/appreciation-input.component';
import { ListFormateursComponent } from './formateurs/list-formateurs/list-formateurs.component';
import { ProgressionPedagogiqueComponent } from './formateurs/progression-pedagogique/progression-pedagogique.component';
import { LivretGeneratorComponent } from './livret-generator/livret-generator.component';
import { MatieresComponent } from './matieres/matieres.component';
import { BulletinComponent } from './notes/bulletin/bulletin.component';
import { PvAnnuelComponent } from './notes/pv-annuel/pv-annuel.component';
import { PvAppreciationComponent } from './notes/pv-appreciation/pv-appreciation.component';
import { PvSemestrielComponent } from './notes/pv-semestriel/pv-semestriel.component';
import { ResultatQFFComponent } from './questionnaire-fin-formation/resultat-qff/resultat-qff.component';
import { ResultatQfComponent } from './questionnaire-formateur/resultat-qf/resultat-qf.component';
import { ResultatComponent } from './questionnaire-satisfaction/resultat/resultat.component';
import { AddSeanceComponent } from './seances/add-seance/add-seance.component';
import { EmergementComponent } from './seances/emergement/emergement.component';
import { EmploiDuTempsComponent } from './seances/emploi-du-temps/emploi-du-temps.component';
import { ListSeancesComponent } from './seances/list-seances/list-seances.component';
import { TuteurCeoComponent } from './tuteur-ceo/tuteur-ceo.component';
import { TuteurComponent } from './tuteur/tuteur.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
@NgModule({
    declarations: [
        ProspectsComponent,
        ContratsTutelleCeoComponent,
        ListEntrepriseCeoComponent,
        ListEntrepriseComponent,
        ListeContratsComponent,
        AddEtudiantComponent,
        DetailsEtudiantComponent,
        GestionEtudiantsComponent,
        ListEtudiantComponent,
        AjoutExamenComponent,
        ExamenComponent,
        AddFormateurComponent,
        AppreciationInputComponent,
        ListFormateursComponent,
        ProgressionPedagogiqueComponent,
        LivretGeneratorComponent,
        MatieresComponent,
        BulletinComponent,
        PvAnnuelComponent,
        PvAppreciationComponent,
        PvSemestrielComponent,
        ResultatQFFComponent,
        ResultatQfComponent,
        ResultatComponent,
        AddSeanceComponent,
        EmergementComponent,
        EmploiDuTempsComponent,
        ListSeancesComponent,
        TuteurComponent,
        TuteurCeoComponent
    ],
    exports: [
        ProspectsComponent,
        ContratsTutelleCeoComponent,
        ListEntrepriseCeoComponent,
        ListEntrepriseComponent,
        ListeContratsComponent,
        AddEtudiantComponent,
        DetailsEtudiantComponent,
        GestionEtudiantsComponent,
        ListEtudiantComponent,
        AjoutExamenComponent,
        ExamenComponent,
        AddFormateurComponent,
        AppreciationInputComponent,
        ListFormateursComponent,
        ProgressionPedagogiqueComponent,
        LivretGeneratorComponent,
        MatieresComponent,
        BulletinComponent,
        PvAnnuelComponent,
        PvAppreciationComponent,
        PvSemestrielComponent,
        ResultatQFFComponent,
        ResultatQfComponent,
        ResultatComponent,
        AddSeanceComponent,
        EmergementComponent,
        EmploiDuTempsComponent,
        ListSeancesComponent,
        TuteurComponent,
        TuteurCeoComponent
    ],
    imports: [
        CommonModule,
        PedagogieRoutingModule,
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
        ConfirmDialogModule,
        DividerModule
    ]
})
export class PedagogieModule { }
