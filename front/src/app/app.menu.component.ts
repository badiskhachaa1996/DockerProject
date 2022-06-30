import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import jwt_decode from "jwt-decode";
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-menu',
    template: `
        <div class="layout-menu-container">
            <ul class="layout-menu" role="menu" (keydown)="onKeydown($event)">
                <li app-menu class="layout-menuitem-category" *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true" role="none">
                    <div class="layout-menuitem-root-text" [attr.aria-label]="item.label">{{item.label}}</div>
                    <ul role="menu">
                        <li app-menuitem *ngFor="let child of item.items" [item]="child" [index]="i" role="none"></li>
                    </ul>
                </li>
            </ul>
        </div>
    `
})
export class AppMenuComponent implements OnInit {

    model: any[];
    token: any;

    constructor(public appMain: AppMainComponent, private userService: AuthService) { }

    ngOnInit() {
        //Decodage du token
        this.token = jwt_decode(localStorage.getItem('token'));
        this.userService.WhatTheRole(this.token.id).subscribe(
            ((data) => {
                if(data != null && data.type == "Formateur")
                {
                    this.model = [
                        {
                            label: 'Ticketing',
                            items: [
                                {label: 'Suivis de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket']},
                            ]
                        },
                        {
                            label: "Pédagogie", 
                            items: [
                                { label: 'Emploi du temps', icon: 'pi pi-video', routerLink: 'emploi-du-temps/formateur/' + data.data._id },
                            ]
                        }
                    ];
                }

                else if (data != null && this.token.role == "user" && data.type != "Formateur" && data.type != "Commercial" && data.type != "Partenaire") 
                {
                    this.model = [
                        {
                            label: 'Ticketing',
                            items: [
                                {label: 'Suivis de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket']},
                            ]
                        },
                        {
                            label: "Pédagogie", 
                            items: [
                                { label: 'Emploi du temps', icon: 'pi pi-video', routerLink: 'emploi-du-temps/classe/' + data.data.classe_id },
                            ]
                        }
                    ];
                }

                else if (data != null && (this.token.role == "Responsable" || this.token.role == "Agent") && data.type != "Commercial" && data.type != "Partenaire") 
                {
                    this.model = [
                        {
                            label: 'Accueil',
                            items:[
                                {label: 'Tableau de bord',icon: 'pi pi-fw pi-home', routerLink: ['/']}
                            ]
                        },
                        {
                            label: 'Ticketing', icon: 'pi pi-ticket',
                            items: [
                                {label: 'Gestions des tickets', icon: 'pi pi-ticket', routerLink: ['/gestion-tickets']},
                                {label: 'Suivis de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket']},
                                {label: 'Gestions des services', icon: 'pi pi-sitemap', routerLink: ['/admin/gestion-services']},
                            ]
                        },
                        {  
                            label: "Pédagogie", 
                            items: [
                                {label : 'Gestions des matières', icon: 'pi pi-tags', routerLink: ['/matières']},
                                {
                                    label : 'Gestions des séances', icon: 'pi pi-video',
                                    items: [
                                        {label: 'Ajouter une séance', icon: 'pi pi-user-plus', routerLink: ['/ajout-seance']},
                                        {label: 'Voir la liste des séances', icon: 'pi pi-sort-alpha-down', routerLink: ['/seances']},
                                        {label: 'Voir l\'emploi du temps des séances', icon: 'pi pi-calendar', routerLink: ['/emploi-du-temps']},
                                    ]
                                },
                                {
                                    label: 'Gestions des formateurs', icon: 'pi pi-id-card',
                                    items: [
                                        {label: 'Ajouter un formateur', icon: 'pi pi-user-plus', routerLink: ['/ajout-formateur']},
                                        {label: 'Liste des formateurs', icon: 'pi pi-sort-alpha-down', routerLink: ['/formateurs']},
                                    ]
                                },
                                {
                                    label: 'Gestions des étudiants', icon: 'pi pi-users',
                                    items: [
                                            {label: 'Ajouter un étudiant', icon: 'pi pi-user-plus', routerLink: ['/ajout-etudiant']},
                                            {label: 'Liste des étudiants', icon: 'pi pi-sort-alpha-down', routerLink: ['etudiants']},
                                    ]
                                },
                                {
                                    label: 'Gestions des entreprises', icon: 'pi pi-home',
                                    items: [
                                            {label: 'Ajouter une entreprise', icon: 'pi pi-user-plus', routerLink: ['/ajout-entreprise']},
                                            {label: 'Liste des entreprises', icon: 'pi pi-sort-alpha-down', routerLink: ['/entreprises']},
                                    ]
                                }
                            ]
            
                        },
                        {
                            label: 'Administration',
                            items: [
                                {
                                    label: 'Gestions des années scolaires', icon: 'pi pi-calendar',
                                    items: [
                                            {label: 'Ajouter une année scolaire', icon: 'pi pi-calendar-plus', routerLink: ['/ajout-annee-scolaire']},
                                            {label: 'Liste des années scolaires', icon: 'pi pi-sort-alpha-down', routerLink: ['/annee-scolaire']},
                                    ]
                                },
                                {
                                    label: 'Gestions des écoles', icon: 'pi pi-home',
                                    items: [
                                            {label: 'Ajouter une école', icon: 'pi pi-plus-circle', routerLink: ['/ajout-ecole']},
                                            {label: 'Liste des écoles', icon: 'pi pi-sort-alpha-down', routerLink: ['/ecole']},
                                    ]
                                },
                                {
                                    label: 'Gestions des campus', icon: 'pi pi-home',
                                    items: [
                                            {label: 'Ajouter un campus', icon: 'pi pi-plus-circle', routerLink: ['/ajout-campus']},
                                            {label: 'Liste des campus', icon: 'pi pi-sort-alpha-down', routerLink: ['/campus']},
                                    ]
                                },
                                {
                                    label: 'Gestions des diplômes', icon: 'pi pi-bookmark',
                                    items: [
                                        {label: 'Ajouter un diplôme', icon: 'pi pi-plus-circle', routerLink: ['/ajout-diplome']},
                                        {label: 'Liste des diplômes', icon: 'pi pi-sort-alpha-down', routerLink: ['/diplomes']},
                                    ]
                                },
                                {
                                    label: 'Gestions des groupes', icon: 'pi pi-users',
                                    items: [
                                            { label: 'Ajouter un groupe', icon: 'pi pi-plus-circle', routerLink: ['/ajout-groupe']},
                                            { label: 'Liste des groupes', icon: 'pi pi-sort-alpha-down', routerLink: ['/groupes']},
                                    ]
                                },
                                {
                                    label: 'Gestions des agents', icon: 'pi pi-users',
                                    items: [
                                            { label: 'Ajouter un agent', icon: 'pi pi-user-plus', routerLink: ['/admin/ajout-agent']},
                                            { label: 'Liste des agents', icon: 'pi pi-sort-alpha-down', routerLink: ['/admin/agents']},
                                    ]
                                },
                                {
                                    label: 'Admission',
                                    items: [
                                        {label: 'Gestions des préinscriptions', icon: 'pi pi-user-plus', routerLink: ['/gestion-preinscriptions']},
                                    ]
                                },
                            ]
                        }
                    ]
                }

                else 
                {
                    if (data != null && data.type == "Partenaire" || data.type == "Commercial" && this.token.role != "Admin")
                    {
                        if (data.data.statut != "Admin")
                        {
                            this.model = [
                                {
                                    label: 'Ticketing', icon: 'pi pi-ticket',
                                    items: [
                                        {label: 'Gestions des tickets', icon: 'pi pi-ticket', routerLink: ['/gestion-tickets']},
                                        {label: 'Suivis de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket']},
                                    ]
                                },
                                {
                                    label: 'Partenaires',
                                    items: [
                                        {label: 'Gestions des préinscriptions', icon: 'pi pi-users', routerLink: ['gestion-preinscriptions', data.data.code_commercial_partenaire]},
                                        {label: 'Gestion des échanges', icon: 'pi pi-comment'},
                                    ]
                                }
                            ];
                        }

                        else
                        {
                            this.model = [
                                {
                                    label: 'Ticketing', icon: 'pi pi-ticket',
                                    items: [
                                        {label: 'Gestions des tickets', icon: 'pi pi-ticket', routerLink: ['/gestion-tickets']},
                                        {label: 'Suivis de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket']},
                                    ]
                                },
                                {
                                    label: 'Partenaires',
                                    items: [
                                        {label: 'Gestions des préinscriptions', icon: 'pi pi-users', routerLink: ['gestion-preinscriptions', data.data.code_commercial_partenaire]},
                                        {label: 'Gestion des collaborateurs', icon: 'pi pi-users', routerLink: ['collaborateur', data.data.partenaire_id]},
                                        {label: 'Gestion des échanges', icon: 'pi pi-comment'},
                                    ]
                                }
                            ];
                        }
                    }

                    else
                    {
                        //Menu admin
                        if(this.token.role=="Admin")
                        {
                            this.model = [
                                {
                                    label: 'Accueil',
                                    items:[
                                        {label: 'Tableau de bord',icon: 'pi pi-fw pi-home', routerLink: ['/']}
                                    ]
                                },
                                {
                                    label: 'Ticketing', icon: 'pi pi-ticket',
                                    items: [
                                        {label: 'Gestions des tickets', icon: 'pi pi-ticket', routerLink: ['/gestion-tickets']},
                                        {label: 'Suivis de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket']},
                                        {label: 'Gestions des services', icon: 'pi pi-sitemap', routerLink: ['/admin/gestion-services']},
                                    ]
                                },
                                {  
                                    label: "Pédagogie", 
                                    items: [
                                        {label : 'Gestions des matières', icon: 'pi pi-tags', routerLink: ['/matières']},
                                        {
                                            label : 'Gestions des séances', icon: 'pi pi-video',
                                            items: [
                                                {label: 'Ajouter une séance', icon: 'pi pi-user-plus', routerLink: ['/ajout-seance']},
                                                {label: 'Voir la liste des séances', icon: 'pi pi-sort-alpha-down', routerLink: ['/seances']},
                                                {label: 'Voir l\'emploi du temps des séances', icon: 'pi pi-calendar', routerLink: ['/emploi-du-temps']},
                                            ]
                                        },
                                        {
                                            label: 'Gestions des formateurs', icon: 'pi pi-id-card',
                                            items: [
                                                {label: 'Ajouter un formateur', icon: 'pi pi-user-plus', routerLink: ['/ajout-formateur']},
                                                {label: 'Liste des formateurs', icon: 'pi pi-sort-alpha-down', routerLink: ['/formateurs']},
                                            ]
                                        },
                                        {label: 'Gestion des prospects', icon: 'pi pi-user-plus', routerLink: ['/prospects']},
                                        {
                                            label: 'Gestions des étudiants', icon: 'pi pi-users',
                                            items: [
                                                    {label: 'Ajouter un étudiant', icon: 'pi pi-user-plus', routerLink: ['/ajout-etudiant']},
                                                    {label: 'Liste des étudiants', icon: 'pi pi-sort-alpha-down', routerLink: ['etudiants']},
                                            ]
                                        },
                                        {
                                            label: 'Gestions des entreprises', icon: 'pi pi-home',
                                            items: [
                                                    {label: 'Ajouter une entreprise', icon: 'pi pi-user-plus', routerLink: ['/ajout-entreprise']},
                                                    {label: 'Liste des entreprises', icon: 'pi pi-sort-alpha-down', routerLink: ['/entreprises']},
                                            ]
                                        },
                                        {label : 'Gestions des examens', icon: 'pi pi-copy', routerLink: ['/examens']},
                                        {label : 'Gestions des notes', icon: 'pi pi-pencil', routerLink: ['/notes']},
                                    ]
                    
                                },
                                {
                                    label: 'Administration',
                                    items: [
                                        {
                                            label: 'Gestions des années scolaires', icon: 'pi pi-calendar',
                                            items: [
                                                    {label: 'Ajouter une année scolaire', icon: 'pi pi-calendar-plus', routerLink: ['/ajout-annee-scolaire']},
                                                    {label: 'Liste des années scolaires', icon: 'pi pi-sort-alpha-down', routerLink: ['/annee-scolaire']},
                                            ]
                                        },
                                        {
                                            label: 'Gestions des écoles', icon: 'pi pi-home',
                                            items: [
                                                    {label: 'Ajouter une école', icon: 'pi pi-plus-circle', routerLink: ['/ajout-ecole']},
                                                    {label: 'Liste des écoles', icon: 'pi pi-sort-alpha-down', routerLink: ['/ecole']},
                                            ]
                                        },
                                        {
                                            label: 'Gestions des campus', icon: 'pi pi-home',
                                            items: [
                                                    {label: 'Ajouter un campus', icon: 'pi pi-plus-circle', routerLink: ['/ajout-campus']},
                                                    {label: 'Liste des campus', icon: 'pi pi-sort-alpha-down', routerLink: ['/campus']},
                                            ]
                                        },
                                        {
                                            label: 'Gestions des diplômes', icon: 'pi pi-bookmark',
                                            items: [
                                                {label: 'Ajouter un diplôme', icon: 'pi pi-plus-circle', routerLink: ['/ajout-diplome']},
                                                {label: 'Liste des diplômes', icon: 'pi pi-sort-alpha-down', routerLink: ['/diplomes']},
                                            ]
                                        },
                                        {
                                            label: 'Gestions des groupes', icon: 'pi pi-users',
                                            items: [
                                                    { label: 'Ajouter un groupe', icon: 'pi pi-plus-circle', routerLink: ['/ajout-groupe']},
                                                    { label: 'Liste des groupes', icon: 'pi pi-sort-alpha-down', routerLink: ['/groupes']},
                                            ]
                                        },
                                        {
                                            label: 'Gestions des agents', icon: 'pi pi-users',
                                            items: [
                                                    { label: 'Ajouter un agent', icon: 'pi pi-user-plus', routerLink: ['/admin/ajout-agent']},
                                                    { label: 'Liste des agents', icon: 'pi pi-sort-alpha-down', routerLink: ['/admin/agents']},
                                            ]
                                        },
                                    ]
                                },
                                {
                                    label: 'Admission',
                                    items: [
                                        {label: 'Gestions des préinscriptions', icon: 'pi pi-user-plus', routerLink: ['/gestion-preinscriptions']},
                                    ]
                                },
                                {
                                    label: 'Partenaires',
                                    items: [
                                        {
                                            label: 'Gestions des collaborateurs', icon: 'pi pi-users',
                                            items: [
                                                    // {label: 'Ajouter un collaborateurs', icon: 'pi pi pi-user-plus', routerLink: ['/ajout-de-collaborateur']},
                                                    {label: 'Liste des collaborateurs', icon: 'pi pi-sort-alpha-down', routerLink: ['/collaborateur']},
                                            ]
                                        },
                                        {
                                            label: 'Gestions des partenaires', icon: 'pi pi-users',
                                            items: [
                                                    {label: 'Ajouter un partenaires', icon: 'pi pi pi-user-plus', routerLink: ['/admin/ajout-de-partenaire']},
                                                    {label: 'Liste des partenaires', icon: 'pi pi-sort-alpha-down', routerLink: ['/admin/partenaire']},
                                            ]
                                        },
                                    ]
                                },
                            ];
                        }
                    }
                }

            }),
            ((error) => { console.log(error); })
        );

        // this.model = [
        //     {
        //         label: 'Accueil',
        //         items:[
        //             {label: 'Tableau de bord',icon: 'pi pi-fw pi-home', routerLink: ['/']}
        //         ]
        //     },
        //     {
        //         label: 'Ticketing', icon: 'pi pi-ticket',
        //         items: [
        //             {label: 'Gestions des tickets', icon: 'pi pi-ticket', routerLink: ['/gestion-tickets']},
        //             {label: 'Suivis de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket']},
        //             {label: 'Gestions des services', icon: 'pi pi-sitemap', routerLink: ['/admin/gestion-services']},
        //         ]
        //     },
        //     {  
        //         label: "Pédagogie", 
        //         items: [
        //             {label : 'Gestions des matières', icon: 'pi pi-tags', routerLink: ['/matières']},
        //             {
        //                 label : 'Gestions des séances', icon: 'pi pi-video',
        //                 items: [
        //                     {label: 'Ajouter une séance', icon: 'pi pi-user-plus', routerLink: ['/ajout-seance']},
        //                     {label: 'Voir la liste des séances', icon: 'pi pi-sort-alpha-down', routerLink: ['/seances']},
        //                     {label: 'Voir l\'emploi du temps des séances', icon: 'pi pi-calendar', routerLink: ['/emploi-du-temps']},
        //                 ]
        //             },
        //             {
        //                 label: 'Gestions des formateurs', icon: 'pi pi-id-card',
        //                 items: [
        //                     {label: 'Ajouter un formateur', icon: 'pi pi-user-plus', routerLink: ['/ajout-formateur']},
        //                     {label: 'Liste des formateurs', icon: 'pi pi-sort-alpha-down', routerLink: ['/formateurs']},
        //                 ]
        //             },
        //             {
        //                 label: 'Gestions des étudiants', icon: 'pi pi-users',
        //                 items: [
        //                         {label: 'Ajouter un étudiant', icon: 'pi pi-user-plus', routerLink: ['/ajout-etudiant']},
        //                         {label: 'Liste des étudiants', icon: 'pi pi-sort-alpha-down', routerLink: ['etudiants']},
        //                 ]
        //             },
        //             {
        //                 label: 'Gestions des entreprises', icon: 'pi pi-home',
        //                 items: [
        //                         {label: 'Ajouter une entreprise', icon: 'pi pi-user-plus', routerLink: ['/ajout-entreprise']},
        //                         {label: 'Liste des entreprises', icon: 'pi pi-sort-alpha-down', routerLink: ['/entreprises']},
        //                 ]
        //             },
        //             {label : 'Gestions des examens', icon: 'pi pi-copy', routerLink: ['/examens']},
        //             {label : 'Gestions des notes', icon: 'pi pi-pencil', routerLink: ['/notes']},
        //         ]

        //     },
        //     {
        //         label: 'Administration',
        //         items: [
        //             {
        //                 label: 'Gestions des années scolaires', icon: 'pi pi-calendar',
        //                 items: [
        //                         {label: 'Ajouter une année scolaire', icon: 'pi pi-calendar-plus', routerLink: ['/ajout-annee-scolaire']},
        //                         {label: 'Liste des années scolaires', icon: 'pi pi-sort-alpha-down', routerLink: ['/annee-scolaire']},
        //                 ]
        //             },
        //             {
        //                 label: 'Gestions des écoles', icon: 'pi pi-home',
        //                 items: [
        //                         {label: 'Ajouter une école', icon: 'pi pi-plus-circle', routerLink: ['/ajout-ecole']},
        //                         {label: 'Liste des écoles', icon: 'pi pi-sort-alpha-down', routerLink: ['/ecole']},
        //                 ]
        //             },
        //             {
        //                 label: 'Gestions des campus', icon: 'pi pi-home',
        //                 items: [
        //                         {label: 'Ajouter un campus', icon: 'pi pi-plus-circle', routerLink: ['/ajout-campus']},
        //                         {label: 'Liste des campus', icon: 'pi pi-sort-alpha-down', routerLink: ['/campus']},
        //                 ]
        //             },
        //             {
        //                 label: 'Gestions des diplômes', icon: 'pi pi-bookmark',
        //                 items: [
        //                     {label: 'Ajouter un diplôme', icon: 'pi pi-plus-circle', routerLink: ['/ajout-diplome']},
        //                     {label: 'Liste des diplômes', icon: 'pi pi-sort-alpha-down', routerLink: ['/diplomes']},
        //                 ]
        //             },
        //             {
        //                 label: 'Gestions des groupes', icon: 'pi pi-users',
        //                 items: [
        //                         { label: 'Ajouter un groupe', icon: 'pi pi-plus-circle', routerLink: ['/ajout-groupe']},
        //                         { label: 'Liste des groupes', icon: 'pi pi-sort-alpha-down', routerLink: ['/groupes']},
        //                 ]
        //             },
        //             {
        //                 label: 'Gestions des agents', icon: 'pi pi-users',
        //                 items: [
        //                         { label: 'Ajouter un agent', icon: 'pi pi-user-plus', routerLink: ['/admin/ajout-agent']},
        //                         { label: 'Liste des agents', icon: 'pi pi-sort-alpha-down', routerLink: ['/admin/agents']},
        //                 ]
        //             },
        //         ]
        //     },
        //     {
        //         label: 'Admission',
        //         items: [
        //             {label: 'Gestions des préinscriptions', icon: 'pi pi-user-plus', routerLink: ['/gestion-preinscriptions']},
        //         ]
        //     },
        //     {
        //         label: 'Partenaires',
        //         items: [
        //             {
        //                 label: 'Gestions des collaborateurs', icon: 'pi pi-users',
        //                 items: [
        //                         // {label: 'Ajouter un collaborateurs', icon: 'pi pi pi-user-plus', routerLink: ['/ajout-de-collaborateur']},
        //                         {label: 'Liste des collaborateurs', icon: 'pi pi-sort-alpha-down', routerLink: ['/collaborateur']},
        //                 ]
        //             },
        //             {
        //                 label: 'Gestions des partenaires', icon: 'pi pi-users',
        //                 items: [
        //                         {label: 'Ajouter un partenaires', icon: 'pi pi pi-user-plus', routerLink: ['/admin/ajout-de-partenaire']},
        //                         {label: 'Liste des partenaires', icon: 'pi pi-sort-alpha-down', routerLink: ['/admin/partenaire']},
        //                 ]
        //             },
        //         ]
        //     },
        //     /*{
        //         label:'Prime Blocks',
        //         items:[
        //             {label: 'Free Blocks', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks'], badge: 'NEW'},
        //             {label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: ['https://www.primefaces.org/primeblocks-ng'], target: '_blank'},
        //         ]
        //     },
        //     {label:'Utilities',
        //         items:[
        //             {label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['/icons']},
        //             {label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: ['https://www.primefaces.org/primeflex/'], target: '_blank'},
        //         ]
        //     },
        //     {
        //         label: 'Pages',
        //         items: [
        //             {label: 'Crud', icon: 'pi pi-fw pi-user-edit', routerLink: ['/pages/crud']},
        //             {label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/pages/timeline']},
        //             {label: 'Landing', icon: 'pi pi-fw pi-globe', routerLink: ['pages/landing']},
        //             {label: 'Login', icon: 'pi pi-fw pi-sign-in', routerLink: ['pages/login']},
        //             {label: 'Error', icon: 'pi pi-fw pi-times-circle', routerLink: ['pages/error']},
        //             {label: 'Not Found', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['pages/notfound']},
        //             {label: 'Access Denied', icon: 'pi pi-fw pi-lock', routerLink: ['pages/access']},
        //             {label: 'Empty', icon: 'pi pi-fw pi-circle', routerLink: ['/pages/empty']}
        //         ]
        //     },
        //     {
        //         label: 'Hierarchy',
        //         items: [
        //             {
        //                 label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
        //                 items: [
        //                     {
        //                         label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
        //                         items: [
        //                             {label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark'},
        //                             {label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark'},
        //                             {label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark'},
        //                         ]
        //                     },
        //                     {
        //                         label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
        //                         items: [
        //                             {label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark'}
        //                         ]
        //                     },
        //                 ]
        //             },
        //             {
        //                 label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
        //                 items: [
        //                     {
        //                         label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
        //                         items: [
        //                             {label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark'},
        //                             {label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark'},
        //                         ]
        //                     },
        //                     {
        //                         label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
        //                         items: [
        //                             {label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark'},
        //                         ]
        //                     },
        //                 ]
        //             }
        //         ]
        //     },
        //     {
        //         label:'Get Started',
        //         items:[
        //             {
        //                 label: 'Documentation', icon: 'pi pi-fw pi-question', routerLink: ['/documentation']
        //             },
        //             {
        //                 label: 'View Source', icon: 'pi pi-fw pi-search', url: ['https://github.com/primefaces/sakai-ng'], target: '_blank'
        //             }
        //         ]
        //     }*/
        // ];
    }

    onKeydown(event: KeyboardEvent) {
        const nodeElement = (<HTMLDivElement> event.target);
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            event.preventDefault();
        }
    }
}
