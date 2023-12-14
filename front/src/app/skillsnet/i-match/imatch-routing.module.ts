import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';
import { CvComponent } from './cv/cv.component';
import { AjoutCvComponent } from './cv/ajout-cv/ajout-cv.component';
import { CvEtudiantComponent } from './cv-etudiant/cv-etudiant.component';
import { NewCvthequeInterneComponent } from './new-cvtheque-interne/new-cvtheque-interne.component';
import { RendezVousResultatsComponent } from './rendez-vous-resultats/rendez-vous-resultats.component';
import { AuthGuardService } from "src/app/dev-components/guards/auth-guard";
import { ExterneSkillsnetComponent } from "../externe-skillsnet/externe-skillsnet.component";
const routes: Routes = [
    { path: 'generateur-cv', component: AjoutCvComponent, canActivate: [AuthGuardService], },
    { path: 'generateur-cv/:id', component: AjoutCvComponent, canActivate: [AuthGuardService], },
    { path: 'externe', component: ExterneSkillsnetComponent, canActivate: [AuthGuardService] },
    { path: 'cv-etudiant', component: CvEtudiantComponent, canActivate: [AuthGuardService] },
    { path: 'cvtheque-interne', component: NewCvthequeInterneComponent, canActivate: [AuthGuardService] },
    { path: 'imatch/rendez-vous', component: RendezVousResultatsComponent, canActivate: [AuthGuardService], },

]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IMatchRoutingModule { }