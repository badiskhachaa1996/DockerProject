import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgentsRoutingModule } from './agents-routing.module';
import { AddAgentComponent } from "./add-agent/add-agent.component";
import { GestionMentionServiceComponent } from "./gestion-mention-service/gestion-mention-service.component";
import { ListAgentComponent } from "./list-agent/list-agent.component";
import { UpdateAgentComponent } from "./update-agent/update-agent.component";
import { DropdownModule } from "primeng/dropdown";
import { CheckboxModule } from "primeng/checkbox";
import { MultiSelectModule } from "primeng/multiselect";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { ToastModule } from "primeng/toast";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';


@NgModule({
    declarations: [
        AddAgentComponent,
        GestionMentionServiceComponent,
        ListAgentComponent,
        UpdateAgentComponent
    ],
    exports: [
        AddAgentComponent,
        GestionMentionServiceComponent,
        ListAgentComponent,
        UpdateAgentComponent
    ],
    imports: [
        CommonModule,
        AgentsRoutingModule,
        DropdownModule,
        CheckboxModule,
        MultiSelectModule,
        TableModule,
        DialogModule,
        ToastModule,
        ReactiveFormsModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        TooltipModule
    ]
})
export class AgentsModule { }
