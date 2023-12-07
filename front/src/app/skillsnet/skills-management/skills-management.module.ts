import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TooltipModule } from 'primeng/tooltip';
import { SkillsManagementComponent } from './skills-management.component';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';


@NgModule({
    declarations: [
        SkillsManagementComponent,
    ],
    exports: [
        SkillsManagementComponent
    ],
    imports: [
        CommonModule,
        TooltipModule,
        DialogModule,
        ToastModule,
        ButtonModule,
        InputTextModule,
        FormsModule,
        TableModule,
        ReactiveFormsModule
    ]
})
export class SkillsManagementModule { }
