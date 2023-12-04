import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddAgentComponent as AddAgentV2Component} from "./add-agent/add-agent.component";
import {AuthGuardService} from "../dev-components/guards/auth-guard";
import {ListAgentComponent as ListAgentV2Component} from "./list-agent/list-agent.component";
import {UpdateAgentComponent} from "./update-agent/update-agent.component";
import {GestionMentionServiceComponent} from "./gestion-mention-service/gestion-mention-service.component";

const routes: Routes = [
    {
        path: '',
        component: AddAgentV2Component,
        canActivate: [AuthGuardService],
    },
    {
        path: '',
        component: ListAgentV2Component,
        canActivate: [AuthGuardService],
    },
    {
        path: '',
        component: UpdateAgentComponent,
        canActivate: [AuthGuardService],
    },
    {
      path: '',
      component: GestionMentionServiceComponent,
      canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgentsRoutingModule { }
