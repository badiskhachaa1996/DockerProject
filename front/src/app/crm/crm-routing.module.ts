import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from "../dev-components/guards/auth-guard";
import { CrmListComponent } from './crm-list/crm-list.component';
import { MesLeadsComponent } from './mes-leads/mes-leads.component';
import { SuivreLeadComponent } from './crm-list/suivre-lead/suivre-lead.component';
import { ListLeadcrmComponent } from './leadcrm/list-leadcrm/list-leadcrm.component';
import { AjoutLeadcrmComponent } from './leadcrm/ajout-leadcrm/ajout-leadcrm.component';
import { LeadsNonAttribuesComponent } from './leads-non-attribues/leads-non-attribues.component';
import { GestionOperationComponent } from './gestion-operation/gestion-operation.component';
import { GestionSrourcesComponent } from './gestion-srources/gestion-srources.component';
import { GestionProduitsComponent } from './gestion-produits/gestion-produits.component';
import { DashboardTargetComponent } from './target/dashboard-target/dashboard-target.component';
import { MyTargetComponent } from './target/my-target/my-target.component';
import { ConfigurationTargetComponent } from './target/configuration-target/configuration-target.component';
import { VentesCRMComponent } from './ventes-crm/ventes-crm.component';
import { LeadsQualifiesComponent } from './leads-qualifies/leads-qualifies.component';
import { LeadsPrequalifiesComponent } from './leads-prequalifies/leads-prequalifies.component';
import { LeadsNonQualifiesComponent } from './leads-non-qualifies/leads-non-qualifies.component';
import { TeamsCrmComponent } from './teams-crm/teams-crm.component';
import { MemberCrmComponent } from './teams-crm/member-crm/member-crm.component';
import { ImportCrmComponent } from './import-crm/import-crm.component';
import { ReportingComponent } from './reporting/reporting.component';

const routes: Routes = [
    {
        path: 'liste',
        component: CrmListComponent
    },
    {
        path: 'reporting',
        component: ReportingComponent,
    },
    {
        path: 'leads/update/:id', // Utilisez un paramètre de route pour l'ID ajouter par Nazif
        component: AjoutLeadcrmComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'leads/liste',
        component: ListLeadcrmComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'leads/liste-non-attribue',
        component: LeadsNonAttribuesComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'mes-leads/liste/:id',
        component: MesLeadsComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'teams',
        component: TeamsCrmComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'member',
        component: MemberCrmComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'import',
        component: ImportCrmComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'leads/non-qualifies',
        component: LeadsNonQualifiesComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'leads/pre-qualifies',
        component: LeadsPrequalifiesComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'leads/qualifies',
        component: LeadsQualifiesComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'mes-leads/non-qualifies/:id',
        component: LeadsNonQualifiesComponent,
        canActivate: [AuthGuardService],
    },

    {
        path: 'mes-leads/pre-qualifies/:id',
        component: LeadsPrequalifiesComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'mes-leads/qualifies/:id',
        component: LeadsQualifiesComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'ventes',
        component: VentesCRMComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'target/configuration',
        component: ConfigurationTargetComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'target/my-target',
        component: MyTargetComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'target/dashboard',
        component: DashboardTargetComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'gestion-produits',
        component: GestionProduitsComponent,
        canActivate: [AuthGuardService],
    },

    {
        path: 'gestion-sources',
        component: GestionSrourcesComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'gestion-operations',
        component: GestionOperationComponent,
        canActivate: [AuthGuardService],
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CrmRoutingModule { }
