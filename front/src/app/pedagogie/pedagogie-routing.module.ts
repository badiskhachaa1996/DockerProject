import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';
import { ProspectsComponent } from './assignation-groupe/prospects.component';
import { ContratsTutelleCeoComponent } from './entreprises/contrats-tutelle-ceo/contrats-tutelle-ceo.component';
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
import { AuthGuardService } from "../dev-components/guards/auth-guard";
import { QuestionnaireFormateurComponent } from "./questionnaire-formateur/questionnaire-formateur.component";
import { CeoEntrepriseGuard } from "../dev-components/guards/ceo-entreprise.guard";
import { TuteurEntrepriseGuard } from "../dev-components/guards/tuteur-entreprise.guard";
const routes: Routes = [
    {
        path: 'etudiants',
        component: ListEtudiantComponent
    },
    {
        path: 'entreprises',
        component: ListEntrepriseComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'details/:id',
        component: DetailsEtudiantComponent,
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
    { path: 'livret', component: LivretGeneratorComponent, canActivate: [AuthGuardService] },
    { path: 'livret/:id', component: LivretGeneratorComponent, canActivate: [AuthGuardService] },
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
        path: 'assignation-inscrit',
        component: ProspectsComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'seances',
        component: ListSeancesComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'ajout-seance',
        component: AddSeanceComponent,
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
    }, {
        path: 'pv-annuel/:classe_id',
        component: PvAnnuelComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'pv-semestriel/:semestre/:classe_id',
        component: PvSemestrielComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'pv-appreciation/:semestre/:classe_id',
        component: PvAppreciationComponent,
        canActivate: [AuthGuardService],
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
    {
        path: 'ajout-etudiant',
        component: AddEtudiantComponent,
        canActivate: [AuthGuardService],
    },

    {
        path: 'etudiants/:code',
        component: ListEtudiantComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'gestion-etudiants',
        component: GestionEtudiantsComponent,
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
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PedagogieRoutingModule { }