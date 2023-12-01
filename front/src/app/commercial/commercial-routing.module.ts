import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardAlternanceComponent} from "./dashboard-alternance/dashboard-alternance.component";
import {AuthGuardService} from "../dev-components/guards/auth-guard";
import {DashboardCommercialComponent} from "./dashboard-commercial/dashboard-commercial.component";
import {DemandeConseillerComponent} from "./demande-conseiller/demande-conseiller.component";
import {DetailEquipeComponent} from "./detail-equipe/detail-equipe.component";
import {GestionEquipeComponent} from "./gestion-equipe/gestion-equipe.component";
import {ProspectsAlternablesComponent} from "./prospects-alternables/prospects-alternables.component";
import {StageComponent} from "./stage/stage.component";
import {StageCeoComponent} from "./stage-ceo/stage-ceo.component";

const routes: Routes = [
    {
        path: '',
        component: DashboardAlternanceComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: '',
        component: DashboardCommercialComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: '',
        component: DemandeConseillerComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: '',
        component: DemandeConseillerComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: '',
        component: DetailEquipeComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: '',
        component: DetailEquipeComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: '',
        component: GestionEquipeComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: '',
        component: GestionEquipeComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: '',
        component: ProspectsAlternablesComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: '',
        component: StageComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: '',
        component: StageCeoComponent,
        canActivate: [AuthGuardService]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CommercialRoutingModule {
}
