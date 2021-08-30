import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentification/login/login.component';
import { RegisterComponent } from './authentification/register/register.component';
import { HomeComponent } from './home/home.component';
import { ServiceComponent } from './Gestion_Application/service/service.component';
import { CreateComponent } from './ticket/create/create.component';
import { ListTicketComponent } from './ticket/list-ticket/list-ticket.component';
import { SuiviComponent } from './ticket/suivi/suivi.component';
import { UpdateComponent } from './ticket/update/update.component';
import { EditComponent } from './Gestion_Application/edit/edit.component';
import { EditSujetComponent } from './Gestion_Application/edit-sujet/edit-sujet.component';
import { ListUserComponent } from './authentification/list-user/list-user.component';


const routes: Routes = [
    // { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '', component: ListTicketComponent},
    {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent},
    {path:'service',component:ServiceComponent},
    {path:"ticket/create",component:CreateComponent},
    {path:"ticket/suivi",component:SuiviComponent},
    {path:"ticket/update",component:UpdateComponent},
    {path:"service/edit",component:EditComponent},
    {path:"sujet/edit",component:EditSujetComponent},
    { path: 'home', component: HomeComponent},
    { path: 'listuser', component: ListUserComponent},

    // { path: '**', redirectTo: '/' }
  ];

  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
