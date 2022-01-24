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
import { NotificationComponent } from './notification/notification.component';
import { ModifierProfilComponent } from './authentification/modifier-profil/modifier-profil.component';
import { FirstconnectionComponent } from './authentification/firstconnection/firstconnection.component';
import { ClasseComponent } from './classe/classe.component';
import { AnneeScolaireComponent } from './annee-scolaire/annee-scolaire.component';
import { EcoleComponent } from './ecole/ecole.component';
import { SignComponent } from './presence/sign/sign.component';
import { SeanceComponent } from './seance/seance.component';
import { CalendarComponent } from './seance/calendar/calendar.component';
import { DiplomeComponent } from './diplome/diplome.component';
import { CampusComponent } from './campus/campus.component';
import { FirstInscriptionComponent } from './first-inscription/first-inscription.component';
import { FormateurComponent } from './formateur/formateur.component';
const routes: Routes = [
  // { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', component: ListTicketComponent },

    { path:'login',component:LoginComponent},
    { path:'register',component:RegisterComponent},
    { path:'service',component:ServiceComponent},
    { path:'ticket/suivi',component:SuiviComponent},
    { path:'home', component: HomeComponent},
    { path:'listUser', component: ListUserComponent},
    { path:'anneeScolaire', component: AnneeScolaireComponent},
    { path: 'notification', component: NotificationComponent},
    { path: 'profil', component: ModifierProfilComponent },
    { path: 'profil/creation',component:FirstconnectionComponent},
    { path: 'classe',component:ClasseComponent},
    { path:'ecoles', component: EcoleComponent},
    {path: 'sign',component:SignComponent},
    {path: 'sign/:id',component:SignComponent},
    { path:'seance', component: SeanceComponent },
    { path: 'seance/calendrier', component: CalendarComponent },
    { path: 'diplome', component: DiplomeComponent },
    { path: 'diplome/:id', component: DiplomeComponent },
    { path:'ecoles/:id', component: EcoleComponent},
    
    { path:'campus', component: CampusComponent},
    { path:'campus/:id', component: CampusComponent},
    {path:'firstInscription',component:FirstInscriptionComponent},
    { path: '**', redirectTo: '/' }
  ];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
