import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentification/login/login.component';
import { RegisterComponent } from './authentification/register/register.component';
import { HomeComponent } from './home/home.component';
import { ServiceComponent } from './Gestion_Application/service/service.component';
import { CreateComponent } from './ticket/create/create.component';
import { ListTicketComponent } from './ticket/list-ticket/list-ticket.component';


const routes: Routes = [
    // { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '', component: ListTicketComponent},
    {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent},
    {path:'service',component:ServiceComponent},
    {path:"ticket/create",component:CreateComponent}
    
    // { path: '**', redirectTo: '/' }
  ];

  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
