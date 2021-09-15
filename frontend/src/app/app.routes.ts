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
import { UpdateUserComponent } from './authentification/update/update.component';
import { ResetMdpComponent } from './authentification/reset-mdp/reset-mdp.component';
import {NotificationComponent} from './notification/notification.component';
import { ModifierProfilComponent } from './authentification/modifier-profil/modifier-profil.component';

const routes: Routes = [
    // { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '', component: ListTicketComponent},
  
    { path:'login',component:LoginComponent},
    { path:'register',component:RegisterComponent},
    { path:'service',component:ServiceComponent},
    { path:'ticket/suivi',component:SuiviComponent},
    { path:'home', component: HomeComponent},
    { path:'listUser', component: ListUserComponent},
    { path: 'reset', component: ResetMdpComponent},
    { path: 'notification', component: NotificationComponent},
    { path: 'modification', component: ModifierProfilComponent },
  

    // { path: '**', redirectTo: '/' }
  ];

  
  @NgModule({   
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
