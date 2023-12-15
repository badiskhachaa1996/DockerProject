import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjouterUnTicketProjetComponent } from "./ajouter-un-ticket-projet/ajouter-un-ticket-projet.component";
import { AuthGuardService } from "../dev-components/guards/auth-guard";
import { ConfigurationComponent } from "./configuration/configuration.component";
import { DashboardTicketingComponent } from "./dashboard-ticketing/dashboard-ticketing.component";
import { NewListTicketsComponent } from "./new-list-tickets/new-list-tickets.component";
import { NotificationComponent } from "./notification/notification.component";
import { AutomatisationTicketingComponent } from './automatisation-ticketing/automatisation-ticketing.component';

const routes: Routes = [
    {
        path: 'Ajouter-un-ticket-projet',
        component: AjouterUnTicketProjetComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'configuration',
        component: ConfigurationComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'dashboard',
        component: DashboardTicketingComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'mes-tickets',
        component: NewListTicketsComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'mes-tickets-services',
        component: NewListTicketsComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'mes-tickets/:ticket_id',
        component: NewListTicketsComponent,
        canActivate: [AuthGuardService]
    },
    {
        path: 'notifications',
        component: NotificationComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'automatisation',
        component: AutomatisationTicketingComponent,
        canActivate: [AuthGuardService]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TicketingRoutingModule { }
