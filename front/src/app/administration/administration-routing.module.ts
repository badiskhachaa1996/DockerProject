import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddAnneeScolaireComponent} from "./annees-scolaires/add-annee-scolaire/add-annee-scolaire.component";
import {AuthGuardService} from "../dev-components/guards/auth-guard";
import {ListAnneeScolaireComponent} from "./annees-scolaires/list-annee-scolaire/list-annee-scolaire.component";
import {AddCampusComponent} from "./campus/add-campus/add-campus.component";
import {ListCampusComponent} from "./campus/list-campus/list-campus.component";
import {AddDiplomeComponent} from "./diplomes/add-diplome/add-diplome.component";
import {ListDiplomeComponent} from "./diplomes/list-diplome/list-diplome.component";
import {AddEcoleComponent} from "./ecoles/add-ecole/add-ecole.component";
import {ListEcoleComponent} from "./ecoles/list-ecole/list-ecole.component";
import {AddGroupeComponent} from "./groupes/add-groupe/add-groupe.component";
import {ListGroupeComponent} from "./groupes/list-groupe/list-groupe.component";
import {ReinscritComponent} from "./validation-prospects/reinscrit.component";

const routes: Routes = [
    {
        path: 'ajout-annee-scolaire',
        component: AddAnneeScolaireComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'annee-scolaire',
        component: ListAnneeScolaireComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'ajout-campus',
        component: AddCampusComponent,
        canActivate: [AuthGuardService,],
    },
    {
        path: 'campus',
        component: ListCampusComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'campus/:id',
        component: ListCampusComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'ajout-diplome',
        component: AddDiplomeComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'diplomes',
        component: ListDiplomeComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'diplomes/:id',
        component: ListDiplomeComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'ajout-ecole',
        component: AddEcoleComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'ecole',
        component: ListEcoleComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'ecole/:id',
        component: ListEcoleComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'ajout-groupe',
        component: AddGroupeComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'groupes',
        component: ListGroupeComponent,
        canActivate: [AuthGuardService],
    },
    {
        path: 'validation-inscrit',
        component: ReinscritComponent,
        canActivate: [AuthGuardService],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
