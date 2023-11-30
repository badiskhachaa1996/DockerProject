import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardRhComponent} from "./dashboard-rh/dashboard-rh.component";
import {NewCalendrierComponent} from "./new-calendrier/new-calendrier.component";
import {CalendrierRhComponent} from "./calendrier-rh/calendrier-rh.component";
import {ActualiteNotificationsComponent} from "./actualite-notifications/actualite-notifications.component";
import {AuthGuardService} from "../dev-components/guards/auth-guard";
import {ArchivagePointageComponent} from "./archivage-pointage/archivage-pointage.component";
import {CollaborateursComponent} from "./collaborateurs/collaborateurs.component";
import {ConfigurationPointageComponent} from "./configuration-pointage/configuration-pointage.component";
import {ConfigurationPointeuseComponent} from "./configuration-pointeuse/configuration-pointeuse.component";
import {CongesAutorisationsComponent} from "./conges-autorisations/conges-autorisations.component";
import {DemandesReclamationsComponent} from "./demandes-reclamations/demandes-reclamations.component";
import {GestionEquipeRhComponent} from "./gestion-equipe-rh/gestion-equipe-rh.component";

const routes: Routes = [
    {
        path: '',
        component: DashboardRhComponent },
    {
        path: '',
        component: NewCalendrierComponent },
    {
        path: '',
        component: CalendrierRhComponent },
    {
        path: '',
        component: ActualiteNotificationsComponent,
    },
    {
        path: '',
        component: ArchivagePointageComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: '',
        component: CollaborateursComponent
    },
    {
        path: '',
        component: ConfigurationPointageComponent,
        canActivate: [AuthGuardService] },
    {
        path: '',
        component: ConfigurationPointeuseComponent,
        canActivate: [AuthGuardService] },
    {
        path: '',
        component: CongesAutorisationsComponent,
    },
    {
        path: '',
        component: DemandesReclamationsComponent,
    },
    {
        path: '',
        component: GestionEquipeRhComponent,
        canActivate: [AuthGuardService],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RhRoutingModule { }
