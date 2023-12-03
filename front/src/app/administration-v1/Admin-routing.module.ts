import { RouterModule, Routes } from "@angular/router";
import { NgModule } from '@angular/core';
import { PreinscriptionComponent } from "./gestion-des-inscriptions/preinscription/preinscription/preinscription.component";
import { InscriptionComponent } from "./gestion-des-inscriptions/inscription/inscription/inscription.component";
import { EvaluationComponent } from "./evaluation/evaluation.component";
import { AuthGuardService } from "../dev-components/guards/auth-guard";

const routes: Routes = [
    { path: 'preinscription', component: PreinscriptionComponent, canActivate: [AuthGuardService], },
    { path: 'inscription', component: InscriptionComponent, canActivate: [AuthGuardService], },
    { path: 'evaluation', component: EvaluationComponent, canActivate: [AuthGuardService], },
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }