import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from "../dev-components/guards/auth-guard";
import { FormCrmExtComponent } from './form-crm-ext/form-crm-ext.component';

const routes: Routes = [
    {
        path: '',
        component: FormCrmExtComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FormCrmRoutingModule { }
