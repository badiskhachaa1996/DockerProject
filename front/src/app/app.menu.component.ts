import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import jwt_decode from "jwt-decode";
import { AuthService } from './services/auth.service';
import { Service } from './models/Service';
import { EtudiantService } from './services/etudiant.service';
import { FormateurService } from './services/formateur.service';
import { CommercialPartenaireService } from './services/commercial-partenaire.service';
import { TeamCommercialService } from './services/team-commercial.service';
import { teamCommercial } from './models/teamCommercial';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { User } from './models/User';
import { METHODS } from 'http';
import { Etudiant } from './models/Etudiant';
import { Formateur } from './models/Formateur';

@Component({
    selector: 'app-menu',
    template: `
        <p-panelMenu [model]="items"></p-panelMenu>
        <!-- <div class="layout-menu-container">  
            ul class="layout-menu" role="menu" (keydown)="onKeydown($event)">
                <li app-menu class="layout-menuitem-category" *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true" role="none">
                    <div class="layout-menuitem-root-text" [attr.aria-label]="item.label">{{item.label}}</div>
                    <ul role="menu">
                        <li app-menuitem *ngFor="let child of item.items" [item]="child" [index]="i" role="none"></li>
                    </ul>
                </li>
            </ul>
        </div> -->
    `
})
export class AppMenuComponent implements OnInit {

    token: any;
    items: MenuItem[];

    constructor(public appMain: AppMainComponent, private userService: AuthService, private ETUService: EtudiantService, private FService: FormateurService, private CService: CommercialPartenaireService, private TCService: TeamCommercialService) { }

    ngOnInit() {
        //Decoder le token
        this.token = jwt_decode(localStorage.getItem('token'));
        // Récupération du user connecter
        this.userService.getPopulate(this.token.id).subscribe({
            next: (response: User) => {
                //Récupération du service du user connecter
                let { service_id }: any = response;
                /* menus salariés */

                // menu générale admin
                if (response.role === 'Admin') {
                    this.items = [
                        {
                            label: 'Tableau de bord',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/'],
                        },
                        {
                            label: 'Développeur',
                            icon: 'pi pi-fw pi-cog',
                            items: [
                                {
                                    label: 'Gestion des utilisateurs',
                                    icon: 'pi pi-fw pi-user',
                                    routerLink: ['/gestion-des-utilisateurs'],

                                },
                                {
                                    label: 'Analyseur de doublon',
                                    icon: 'pi pi-fw pi-server',
                                    routerLink: ['/analyseur-doublons'],
                                },
                                {
                                    label: 'Connexion des étudiants',
                                    icon: 'pi pi-fw pi-sign-in',
                                    routerLink: ['/gestion-etudiants'],
                                },
                                {
                                    label: 'Infos IMS',
                                    icon: 'pi pi-fw pi-info-circle',
                                    routerLink: ['/infos-ims'],
                                }
                            ]
                        },
                        {
                            label: 'Ticketing',
                            icon: 'pi pi-fw pi-ticket',
                            items: [
                                {
                                    label: 'Gestion des tickets',
                                    icon: 'pi pi-fw pi-folder-open',
                                    routerLink: ['/gestion-tickets'],
                                },
                                {
                                    label: 'Suivi des tickets',
                                    icon: 'pi pi-fw pi-check-circle',
                                    routerLink: ['/suivi-ticket'],
                                },
                                {
                                    label: 'Gestion des services',
                                    icon: 'pi pi-fw pi-sitemap',
                                    routerLink: ['/admin/gestion-services'],
                                },
                            ]
                        },
                        {
                            label: 'Projet',
                            icon: 'pi pi-fw pi-shield',
                            items: [
                                {
                                    label: 'Gestion des activités projets',
                                    icon: 'pi pi-fw pi-check-circle',
                                    routerLink: ['/task-management'],
                                },
                                {
                                    label: 'Mes activités projets',
                                    icon: 'pi pi-fw pi-list',
                                    routerLink: ['/my-tasks'],
                                },
                                {
                                    label: 'Gestion des équipes',
                                    icon: 'pi pi-fw pi-users',
                                    routerLink: ['/team'],
                                },
                            ]
                        },
                        {
                            label: 'Ressources humaines',
                            icon: 'pi pi-fw pi-users',
                            items: [
                                {
                                    label: 'Gestion des ressources humaines',
                                    icon: 'pi pi-fw pi-list',
                                    routerLink: ['/gestion-des-ressources-humaines'],

                                },
                            ]
                        },
                        {
                            label: 'Pédagogie',
                            icon: 'pi pi-fw pi-folder',
                            items: [
                                {
                                    label: 'Gestion des modules',
                                    icon: 'pi pi-fw pi-tags',
                                    routerLink: ['/matieres'],

                                },
                                {
                                    label: 'Gestions des groupes',
                                    icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'Ajouter un groupe',
                                            icon: 'pi pi-plus-circle',
                                            routerLink: ['/ajout-groupe']
                                        },
                                        {
                                            label: 'Liste des groupes',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/groupes']
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestions des séances',
                                    icon: 'pi pi-video',
                                    items: [
                                        {
                                            label: 'Ajouter une séance',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-seance'],
                                        },
                                        {
                                            label: 'Voir la liste des séances',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/seances'],
                                        },
                                        {
                                            label: 'Voir l\'emploi du temps des séances',
                                            icon: 'pi pi-calendar',
                                            routerLink: ['/emploi-du-temps'],
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestions des formateurs',
                                    icon: 'pi pi-id-card',
                                    items: [
                                        {
                                            label: 'Ajouter un formateur',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-formateur']
                                        },
                                        {
                                            label: 'Liste des formateurs',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/formateurs']
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestion des inscrits en attente d\'assignation',
                                    icon: 'pi pi-user-plus',
                                    routerLink: ['/assignation-inscrit']
                                },
                                {
                                    label: 'Gestions des étudiants', icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'Ajouter un étudiant',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-etudiant']
                                        },
                                        {
                                            label: 'Liste des étudiants',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['etudiants']
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestions des évaluations',
                                    icon: 'pi pi-copy',
                                    items: [
                                        {
                                            label: 'Ajouter une évaluation',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-examen']
                                        },
                                        {
                                            label: 'Liste des évaluations',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/examens']
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestions des Bulletins de notes',
                                    icon: 'pi pi-pencil',
                                    routerLink: ['/notes']
                                },
                                {
                                    label: 'Gestions des devoirs',
                                    icon: 'pi pi-book',
                                    routerLink: 'devoirs'
                                }
                            ]
                        },
                        {
                            label: 'Administration',
                            icon: 'pi pi-fw pi-inbox',
                            items: [
                                {
                                    label: 'Gestions des années scolaires',
                                    icon: 'pi pi-calendar',
                                    items:
                                        [
                                            {
                                                label: 'Ajouter une année scolaire',
                                                icon: 'pi pi-calendar-plus',
                                                routerLink: ['/ajout-annee-scolaire']
                                            },
                                            {
                                                label: 'Liste des années scolaires',
                                                icon: 'pi pi-sort-alpha-down',
                                                routerLink: ['/annee-scolaire']
                                            },
                                        ]
                                },
                                {
                                    label: 'Gestions des écoles',
                                    icon: 'pi pi-home',
                                    items: [
                                        {
                                            label: 'Ajouter une école',
                                            icon: 'pi pi-plus-circle',
                                            routerLink: ['/ajout-ecole']
                                        },
                                        {
                                            label: 'Liste des écoles',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/ecole']
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestions des campus',
                                    icon: 'pi pi-home',
                                    items: [
                                        {
                                            label: 'Ajouter un campus',
                                            icon: 'pi pi-plus-circle',
                                            routerLink: ['/ajout-campus']
                                        },
                                        {
                                            label: 'Liste des campus',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/campus']
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestions des diplômes',
                                    icon: 'pi pi-bookmark',
                                    items: [
                                        {
                                            label: 'Ajouter un diplôme',
                                            icon: 'pi pi-plus-circle',
                                            routerLink: ['/ajout-diplome']
                                        },
                                        {
                                            label: 'Liste des diplômes',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/diplomes']
                                        },
                                    ]
                                },

                                {
                                    label: 'Gestions des agents',
                                    icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'Ajouter un agent',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/admin/ajout-agent']
                                        },
                                        {
                                            label: 'Liste des agents',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/admin/agents']
                                        },
                                    ]
                                },
                                {
                                    label: 'Validation des inscrits',
                                    icon: 'pi pi-check-square',
                                    routerLink: ['/validation-inscrit']
                                },

                            ]
                        },
                        {
                            label: 'Admission',
                            icon: 'pi pi-fw pi-check-circle',
                            items: [
                                {
                                    label: 'Gestions des prospects',
                                    icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'En attente de traitement',
                                            icon: 'pi pi-spin pi-spinner',
                                            routerLink: ['/gestion-preinscriptions-filtered/En attente de traitement']
                                        },
                                        {
                                            label: 'Dossiers traités',
                                            icon: 'pi pi-check-circle',
                                            routerLink: ['/gestion-preinscriptions-filter/traite']
                                        },
                                        {
                                            label: 'Ajouter un dossier',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-prospect']
                                        },
                                    ]
                                },
                                {
                                    label: 'Dashboard',
                                    icon: 'pi pi-users',
                                    routerLink: ['/gestion-preinscriptions']
                                },
                                {
                                    label: 'Gestions des prospects Intuns',
                                    icon: 'pi pi-user-plus',
                                    routerLink: ['/prospects-intuns']
                                },
                                {
                                    label: 'Gestion des participantes pour les événements',
                                    icon: 'pi pi-users',
                                    routerLink: ['/list-events']
                                }
                            ],
                        },
                        {
                            label: 'Commerciale',
                            icon: 'pi pi-fw pi-briefcase',
                            items: [
                                {
                                    label: 'Gestions des entreprises',
                                    icon: 'pi pi-home',
                                    items: [
                                        {
                                            label: 'Ajouter une entreprise',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-entreprise']
                                        },
                                        {
                                            label: 'Liste des entreprises',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/entreprises']
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestion des tuteurs',
                                    icon: 'pi pi-user',
                                    routerLink: ['/tuteur']
                                },
                                {
                                    label: 'Placement',
                                    icon: 'pi pi-star',
                                    items: [
                                        {
                                            label: 'Alternances',
                                            icon: 'pi pi-list',
                                            routerLink: ['/liste-contrats']
                                        },
                                        {
                                            label: 'Stages',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/stages']
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestion des équipes de conseillers',
                                    icon: 'pi pi-users',
                                    routerLink: ['/equipe-commercial']
                                },
                                {
                                    label: 'Gestion des prospects alternables',
                                    icon: 'pi pi-briefcase',
                                    routerLink: ['/prospects-alt']
                                },
                                {
                                    label: 'Ajouter un dossier',
                                    icon: 'pi pi-user-plus',
                                    routerLink: ['/ajout-prospect']
                                },

                            ]

                        },
                        {
                            label: 'Partenaires',
                            icon: 'pi pi-share-alt',
                            items: [
                                {
                                    label: 'Insérer un Partenaire',
                                    icon: 'pi pi pi-user-plus',
                                    routerLink: ['/partenaireInscription']
                                },
                                {
                                    label: 'Liste des partenaires',
                                    icon: 'pi pi-sort-alpha-down',
                                    routerLink: ['/admin/partenaire']
                                },
                                {
                                    label: 'Support Marketing',
                                    icon: 'pi pi-briefcase'
                                },
                                {
                                    label: 'Gestion des commissions',
                                    icon: 'pi pi-credit-card',
                                    items: [
                                        {
                                            label: "Ventes",
                                            icon: 'pi pi-shopping-cart',
                                            routerLink: ['/commissions/ventes']
                                        },
                                        {
                                            label: "Réglement",
                                            icon: 'pi pi-shopping-cart',
                                            routerLink: ['/commissions/reglement']
                                        }
                                    ]
                                },
                                {
                                    label: 'Dashboard',
                                    icon: 'pi pi-chart-line'
                                },
                            ]
                        },
                        {
                            label: 'Skillsnet',
                            icon: 'pi pi-star',
                            items: [
                                {
                                    label: 'Offres d\'emplois',
                                    icon: 'pi pi-volume-up',
                                    routerLink: ['/offres']
                                },
                                {
                                    label: 'Mes offres',
                                    icon: 'pi pi-user',
                                    routerLink: ['/mes-offres']
                                },
                                {
                                    label: 'Cvthèque',
                                    icon: 'pi pi-briefcase',
                                    routerLink: ['/cvtheque']
                                },
                                {
                                    label: 'Gestion des compétences',
                                    icon: 'pi pi-book',
                                    routerLink: ['/skills-management']
                                },
                                {
                                    label: "Gestions des externes",
                                    icon: 'pi pi-users',
                                    routerLink: ['/skillsnet/externe']
                                },
                                {
                                    label: "Gestions des événements",
                                    icon: 'pi pi-flag',
                                    routerLink: ['/evenements']
                                }
                            ]
                        },
                        {
                            label: 'Support',
                            icon: 'pi pi-cog',
                            items: [
                                {
                                    label: 'Étudiants en attente de leur compte IMS',
                                    icon: 'pi pi-user-plus',
                                    routerLink: ['/assign-ims']
                                },

                            ]
                        },
                        {
                            label: 'Booking',
                            icon: 'pi pi-building',
                            items: [
                                {
                                    label: 'Logements',
                                    icon: 'pi pi-home',
                                    routerLink: ['/logements']
                                },
                                {
                                    label: 'Gestion des reservations',
                                    icon: 'pi pi-bookmark',
                                    routerLink: ['/gestion-reservations']
                                },
                            ]
                        },
                        {
                            label: 'Finance',
                            icon: 'pi pi-money-bill',
                            items: [
                                {
                                    label: 'Gestion des factures des formateurs',
                                    icon: "pi pi-user-edit",
                                    routerLink: ['/facture-formateur']
                                }
                            ]
                        },
                        {
                            label: 'Questionnaire',
                            icon: 'pi pi-sort-alpha-down',
                            items: [
                                {
                                    label: 'Questionnaire satisfaction',
                                    icon: 'pi pi-heart',
                                    routerLink: ['resultat-qs']
                                },
                                {
                                    label: 'Questionnaire formateur',
                                    icon: 'pi pi-briefcase',
                                    routerLink: ['resultat-qf']
                                },
                                {
                                    label: 'Questionnaire fin de formation',
                                    icon: 'pi pi-check-circle',
                                    routerLink: ['resultat-qff']
                                },
                            ]
                        },
                        {
                            label: 'International',
                            icon: 'pi pi-globe',
                            items: [
                                {
                                    label: 'Insérer un prospect',
                                    icon: 'pi pi-user-plus',
                                    routerLink: ['/ajout-prospect']
                                },
                                {
                                    label: 'Source',
                                    icon: 'pi pi-send',
                                    routerLink: ['/international/sourcing']
                                },
                                {
                                    label: 'Orientation Prospects',
                                    icon: 'pi pi-globe',
                                    routerLink: ['/international/orientation']
                                },
                                {
                                    label: 'Admission Prospects',
                                    icon: 'pi pi-users',
                                    routerLink: ['/international/admission']
                                },
                                {
                                    label: 'Paiement',
                                    icon: 'pi pi-money-bill',
                                    routerLink: ['/international/paiement']
                                },
                                {
                                    label: 'Accompagenement Consulaire',
                                    icon: 'pi pi-whatsapp',
                                    routerLink: ['/international/consulaire']
                                },
                                {
                                    label: 'Gestion de l\'équipe',
                                    icon: 'pi pi-briefcase',
                                    items: [
                                        {
                                            label: 'Gestion des membres',
                                            icon: 'pi pi-user',
                                            routerLink: ['/international/member']
                                        },
                                        {
                                            label: 'Gestion de l\'équipe',
                                            icon: 'pi pi-users',
                                            routerLink: ['/international/teams']
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestion de l\'année scolaire',
                                    icon: 'pi pi-calendar',
                                    items: [
                                        {
                                            label: 'Formations disponibles',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/admission/formations']
                                        },
                                        {
                                            label: 'Ecoles',
                                            icon: 'pi pi-building',
                                            routerLink: ['/admission/ecoles']
                                        },
                                        {
                                            label: 'Rentrées Scolaire',
                                            icon: 'pi pi-calendar',
                                            routerLink: ['/admission/rentree']
                                        },
                                    ]
                                }, {
                                    label: 'Dashboard',
                                    icon: 'pi pi-home',
                                    items: [
                                        {
                                            label: 'Général',
                                            icon: 'pi pi-chart-bar',
                                            routerLink: ['/international/dashboard']
                                        },
                                        {
                                            label: 'Performance scolaire',
                                            icon: 'pi pi-users'
                                        }
                                    ]
                                },
                            ],
                        },
                        {
                            label: "Intuns",
                            icon: 'pi pi-building',
                            items: [
                                {
                                    label: "Liste des étudiants INTUNS",
                                    icon: 'pi pi-users',
                                    routerLink: ['/intuns/etudiants']
                                },
                                {
                                    label: "Liste des formations INTUNS",
                                    icon: 'pi pi-briefcase',
                                    routerLink: ['/intuns/formations']
                                }
                            ]
                        }
                    ];
                }
                // menu service pédagogique
                else if (response.role === 'Agent' && service_id?.label === 'Pédagogie') {
                    this.items = [
                        {
                            label: 'Tableau de bord',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/'],
                        },
                        {
                            label: 'Ticketing',
                            icon: 'pi pi-fw pi-ticket',
                            items: [
                                {
                                    label: 'Gestion des tickets',
                                    icon: 'pi pi-fw pi-folder-open',
                                    routerLink: ['/gestion-tickets'],
                                },
                                {
                                    label: 'Suivi des tickets',
                                    icon: 'pi pi-fw pi-check-circle',
                                    routerLink: ['/suivi-ticket'],
                                },
                            ]
                        },
                        {
                            label: 'Projet',
                            icon: 'pi pi-fw pi-shield',
                            items: [
                                {
                                    label: 'Gestion des activités projets',
                                    icon: 'pi pi-fw pi-check-circle',
                                    routerLink: ['/task-management'],
                                },
                                {
                                    label: 'Mes activités projets',
                                    icon: 'pi pi-fw pi-list',
                                    routerLink: ['/my-tasks'],
                                },
                            ]
                        },
                        {
                            label: 'Pédagogie',
                            icon: 'pi pi-fw pi-folder',
                            items: [
                                {
                                    label: 'Gestion des modules',
                                    icon: 'pi pi-fw pi-tags',
                                    routerLink: ['/matieres'],

                                },
                                {
                                    label: 'Gestions des séances',
                                    icon: 'pi pi-video',
                                    items: [
                                        {
                                            label: 'Ajouter une séance',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-seance'],
                                        },
                                        {
                                            label: 'Voir la liste des séances',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/seances'],
                                        },
                                        {
                                            label: 'Voir l\'emploi du temps des séances',
                                            icon: 'pi pi-calendar',
                                            routerLink: ['/emploi-du-temps'],
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestions des formateurs',
                                    icon: 'pi pi-id-card',
                                    items: [
                                        {
                                            label: 'Ajouter un formateur',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-formateur']
                                        },
                                        {
                                            label: 'Liste des formateurs',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/formateurs']
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestion des inscrits en attente d\'assignation',
                                    icon: 'pi pi-user-plus',
                                    routerLink: ['/assignation-inscrit']
                                },
                                {
                                    label: 'Gestions des étudiants', icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'Ajouter un étudiant',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-etudiant']
                                        },
                                        {
                                            label: 'Liste des étudiants',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['etudiants']
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestions des évaluations',
                                    icon: 'pi pi-copy',
                                    items: [
                                        {
                                            label: 'Ajouter une évaluation',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-examen']
                                        },
                                        {
                                            label: 'Liste des évaluations',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/examens']
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestions des Bulletins de notes',
                                    icon: 'pi pi-pencil',
                                    routerLink: ['/notes']
                                },
                                {
                                    label: 'Gestions des devoirs',
                                    icon: 'pi pi-book',
                                    routerLink: 'devoirs'
                                }
                            ]
                        },
                        {
                            label: 'Commerciale',
                            icon: 'pi pi-fw pi-briefcase',
                            items: [
                                {
                                    label: 'Gestions des entreprises',
                                    icon: 'pi pi-home',
                                    items: [
                                        {
                                            label: 'Ajouter une entreprise',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-entreprise']
                                        },
                                        {
                                            label: 'Liste des entreprises',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/entreprises']
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestion des tuteurs',
                                    icon: 'pi pi-user',
                                    routerLink: ['/tuteur']
                                },
                                {
                                    label: 'Placement',
                                    icon: 'pi pi-star',
                                    items: [
                                        {
                                            label: 'Alternances',
                                            icon: 'pi pi-list',
                                            routerLink: ['/liste-contrats']
                                        },
                                        {
                                            label: 'Stages',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/stages']
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestion des équipes de conseillers',
                                    icon: 'pi pi-users',
                                    routerLink: ['/equipe-commercial']
                                },
                                {
                                    label: 'Gestion des prospects alternables',
                                    icon: 'pi pi-briefcase',
                                    routerLink: ['/prospects-alt']
                                },
                                {
                                    label: 'Ajouter un dossier',
                                    icon: 'pi pi-user-plus',
                                    routerLink: ['/ajout-prospect']
                                },

                            ]
                        },
                        {
                            label: 'Questionnaire',
                            icon: 'pi pi-sort-alpha-down',
                            items: [
                                {
                                    label: 'Questionnaire satisfaction',
                                    icon: 'pi pi-heart',
                                    routerLink: ['resultat-qs']
                                },
                                {
                                    label: 'Questionnaire formateur',
                                    icon: 'pi pi-briefcase',
                                    routerLink: ['resultat-qf']
                                },
                                {
                                    label: 'Questionnaire fin de formation',
                                    icon: 'pi pi-check-circle',
                                    routerLink: ['resultat-qff']
                                },
                            ]
                        },

                    ]
                }
                // menu service admission
                else if (response.role === 'Agent' && service_id?.label === 'Admission') {
                    this.items = [
                        {
                            label: 'Tableau de bord',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/'],
                        },
                        {
                            label: 'Ticketing',
                            icon: 'pi pi-fw pi-ticket',
                            items: [
                                {
                                    label: 'Gestion des tickets',
                                    icon: 'pi pi-fw pi-folder-open',
                                    routerLink: ['/gestion-tickets'],
                                },
                                {
                                    label: 'Suivi des tickets',
                                    icon: 'pi pi-fw pi-check-circle',
                                    routerLink: ['/suivi-ticket'],
                                },
                            ]
                        },
                        {
                            label: 'Projet',
                            icon: 'pi pi-fw pi-shield',
                            items: [
                                {
                                    label: 'Gestion des activités projets',
                                    icon: 'pi pi-fw pi-check-circle',
                                    routerLink: ['/task-management'],
                                },
                                {
                                    label: 'Mes activités projets',
                                    icon: 'pi pi-fw pi-list',
                                    routerLink: ['/my-tasks'],
                                },
                            ]
                        },
                        {
                            label: 'Admission',
                            icon: 'pi pi-fw pi-check-circle',
                            items: [
                                {
                                    label: 'Gestions des prospects',
                                    icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'En attente de traitement',
                                            icon: 'pi pi-spin pi-spinner',
                                            routerLink: ['/gestion-preinscriptions-filtered/En attente de traitement']
                                        },
                                        {
                                            label: 'Dossiers traités',
                                            icon: 'pi pi-check-circle',
                                            routerLink: ['/gestion-preinscriptions-filter/traite']
                                        },
                                        {
                                            label: 'Ajouter un dossier',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-prospect']
                                        },
                                    ]
                                },
                                {
                                    label: 'Dashboard',
                                    icon: 'pi pi-users',
                                    routerLink: ['/gestion-preinscriptions']
                                },
                                {
                                    label: 'Gestions des prospects Intuns',
                                    icon: 'pi pi-user-plus',
                                    routerLink: ['/prospects-intuns']
                                },
                                {
                                    label: 'Gestion des participantes pour les événements',
                                    icon: 'pi pi-users',
                                    routerLink: ['/list-events']
                                }
                            ],
                        },

                    ]
                }
                // menu service administration
                else if (response.role === 'Agent' && service_id?.label === 'Administration') {
                    this.items = [
                        {
                            label: 'Tableau de bord',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/'],
                        },
                        {
                            label: 'Ticketing',
                            icon: 'pi pi-fw pi-ticket',
                            items: [
                                {
                                    label: 'Gestion des tickets',
                                    icon: 'pi pi-fw pi-folder-open',
                                    routerLink: ['/gestion-tickets'],
                                },
                                {
                                    label: 'Suivi des tickets',
                                    icon: 'pi pi-fw pi-check-circle',
                                    routerLink: ['/suivi-ticket'],
                                },
                            ]
                        },
                        {
                            label: 'Projet',
                            icon: 'pi pi-fw pi-shield',
                            items: [
                                {
                                    label: 'Gestion des activités projets',
                                    icon: 'pi pi-fw pi-check-circle',
                                    routerLink: ['/task-management'],
                                },
                                {
                                    label: 'Mes activités projets',
                                    icon: 'pi pi-fw pi-list',
                                    routerLink: ['/my-tasks'],
                                },
                            ]
                        },
                        {
                            label: 'Administration',
                            icon: 'pi pi-fw pi-inbox',
                            items: [
                                {
                                    label: 'Gestions des années scolaires',
                                    icon: 'pi pi-calendar',
                                    items:
                                        [
                                            {
                                                label: 'Ajouter une année scolaire',
                                                icon: 'pi pi-calendar-plus',
                                                routerLink: ['/ajout-annee-scolaire']
                                            },
                                            {
                                                label: 'Liste des années scolaires',
                                                icon: 'pi pi-sort-alpha-down',
                                                routerLink: ['/annee-scolaire']
                                            },
                                        ]
                                },
                                {
                                    label: 'Gestions des écoles',
                                    icon: 'pi pi-home',
                                    items: [
                                        {
                                            label: 'Ajouter une école',
                                            icon: 'pi pi-plus-circle',
                                            routerLink: ['/ajout-ecole']
                                        },
                                        {
                                            label: 'Liste des écoles',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/ecole']
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestions des campus',
                                    icon: 'pi pi-home',
                                    items: [
                                        {
                                            label: 'Ajouter un campus',
                                            icon: 'pi pi-plus-circle',
                                            routerLink: ['/ajout-campus']
                                        },
                                        {
                                            label: 'Liste des campus',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/campus']
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestions des diplômes',
                                    icon: 'pi pi-bookmark',
                                    items: [
                                        {
                                            label: 'Ajouter un diplôme',
                                            icon: 'pi pi-plus-circle',
                                            routerLink: ['/ajout-diplome']
                                        },
                                        {
                                            label: 'Liste des diplômes',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/diplomes']
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestions des agents',
                                    icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'Ajouter un agent',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/admin/ajout-agent']
                                        },
                                        {
                                            label: 'Liste des agents',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/admin/agents']
                                        },
                                    ]
                                },
                                {
                                    label: 'Validation des inscrits',
                                    icon: 'pi pi-check-square',
                                    routerLink: ['/validation-inscrit']
                                },

                            ]
                        },
                        {
                            label: 'Pédagogie',
                            icon: 'pi pi-fw pi-folder',
                            items: [
                                {
                                    label: 'Gestions des étudiants', icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'Liste des étudiants',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['etudiants']
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestions des groupes',
                                    icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'Ajouter un groupe',
                                            icon: 'pi pi-plus-circle',
                                            routerLink: ['/ajout-groupe']
                                        },
                                        {
                                            label: 'Liste des groupes',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/groupes']
                                        },
                                    ]
                                },
                            ]
                        },
                    ]
                }
                // Menu Commerciale Externe / Partenaire
                else if (response.role === 'Agent' && response.type === 'Commercial' && !response.service_id) {
                    this.CService.getByUserId(this.token.id).subscribe(cData => {
                        if (cData && cData.statut != "Admin") {
                            //Commercial Normal
                            this.items = [
                                {
                                    label: 'Accueil',
                                    items: [
                                        { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                                    ]
                                },
                                {
                                    label: 'Prospects',
                                    items: [
                                        { label: 'Insérer un prospect', icon: 'pi pi-user-plus', routerLink: ['/ajout-prospect'] },
                                        { label: 'Liste des Prospects', icon: 'pi pi-users', routerLink: ['international/partenaire/', this.token.id] },
                                    ]
                                },
                                {
                                    label: 'Alternants',
                                    items: [
                                        { label: 'Insérer un alternant', icon: 'pi pi-user-plus', routerLink: ['/international/partenaire/ajout-alternant/', cData?.code_commercial_partenaire] },
                                        { label: 'Liste des alternants', icon: 'pi pi-users', routerLink: ['/international/partenaire/alternants/', this.token.id] },
                                    ]
                                },
                                {
                                    label: 'Collaborateurs',
                                    items: [
                                        //{ label: 'Insérer un collaborateur', icon: 'pi pi-user-plus', routerLink: ['/ajout-collaborateur'] },
                                        { label: 'Liste des collaborateurs', icon: 'pi pi-users', routerLink: ['collaborateur', cData.partenaire_id] },
                                    ]
                                },

                                {
                                    label: 'Gestion des commissions',
                                    icon: 'pi pi-credit-card',
                                    items: [
                                        {
                                            label: "Ventes",
                                            icon: 'pi pi-shopping-cart',
                                            routerLink: ['/commissions/ventes', cData.partenaire_id]
                                        },
                                        {
                                            label: "Réglement",
                                            icon: 'pi pi-shopping-cart',
                                            routerLink: ['/commissions/reglement', cData.partenaire_id]
                                        }
                                    ]
                                },
                                { label: 'Support Marketing', icon: 'pi pi-briefcase' },
                                { label: 'Effectuer un paiement', icon: 'pi pi-dollar' },
                                { label: 'Dashboard', icon: 'pi pi-chart-line' },
                            ];
                        }

                        else {
                            //Commercial considéré Admin dans son Partenaire
                            this.items = [
                                {
                                    label: 'Accueil',
                                    items: [
                                        { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                                    ]
                                },
                                {
                                    label: 'Prospects',
                                    items: [
                                        { label: 'Insérer un prospect', icon: 'pi pi-user-plus', routerLink: ['/ajout-prospect'] },
                                        { label: 'Liste des Prospects', icon: 'pi pi-users', routerLink: ['international/partenaire/', this.token.id] },
                                    ]
                                },
                                {
                                    label: 'Alternants',
                                    items: [
                                        { label: 'Insérer un alternant', icon: 'pi pi-user-plus', routerLink: ['/international/partenaire/ajout-alternant/', cData?.code_commercial_partenaire] },
                                        { label: 'Liste des alternants', icon: 'pi pi-users', routerLink: ['/international/partenaire/alternants/', this.token.id] },
                                    ]
                                },
                                {
                                    label: 'Collaborateurs',
                                    items: [
                                        { label: 'Insérer un collaborateur', icon: 'pi pi-user-plus', routerLink: ['/ajout-collaborateur', cData.partenaire_id] },
                                        { label: 'Liste des collaborateurs', icon: 'pi pi-users', routerLink: ['collaborateur', cData.partenaire_id] },
                                    ]
                                },

                                {
                                    label: 'Gestion des commissions',
                                    icon: 'pi pi-credit-card',
                                    items: [
                                        {
                                            label: "Ventes",
                                            icon: 'pi pi-shopping-cart',
                                            routerLink: ['/commissions/ventes', cData.partenaire_id]
                                        },
                                        {
                                            label: "Réglement",
                                            icon: 'pi pi-shopping-cart',
                                            routerLink: ['/commissions/reglement', cData.partenaire_id]
                                        }
                                    ]
                                },
                                { label: 'Support Marketing', icon: 'pi pi-briefcase' },
                                { label: 'Effectuer un paiement', icon: 'pi pi-dollar' },
                                { label: 'Dashboard', icon: 'pi pi-chart-line' },
                            ];
                        }
                    })

                }

                // menu service commerciale INTERNE
                else if (response.role === 'Agent' && service_id?.label === 'Commercial') {
                    this.items = [
                        {
                            label: 'Tableau de bord',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/'],
                        },
                        {
                            label: 'Ticketing',
                            icon: 'pi pi-fw pi-ticket',
                            items: [
                                {
                                    label: 'Gestion des tickets',
                                    icon: 'pi pi-fw pi-folder-open',
                                    routerLink: ['/gestion-tickets'],
                                },
                                {
                                    label: 'Suivi des tickets',
                                    icon: 'pi pi-fw pi-check-circle',
                                    routerLink: ['/suivi-ticket'],
                                },
                            ]
                        },
                        {
                            label: 'Projet',
                            icon: 'pi pi-fw pi-shield',
                            items: [
                                {
                                    label: 'Gestion des activités projets',
                                    icon: 'pi pi-fw pi-check-circle',
                                    routerLink: ['/task-management'],
                                },
                                {
                                    label: 'Mes activités projets',
                                    icon: 'pi pi-fw pi-list',
                                    routerLink: ['/my-tasks'],
                                },
                            ]
                        },
                        {
                            label: 'Pédagogie',
                            icon: 'pi pi-fw pi-folder',
                            items: [
                                {
                                    label: 'Gestions des étudiants', icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'Ajouter un étudiant',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-etudiant']
                                        },
                                        {
                                            label: 'Liste des étudiants',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['etudiants']
                                        },
                                    ]
                                },
                            ]
                        },
                        {
                            label: 'Commerciale',
                            icon: 'pi pi-fw pi-briefcase',
                            items: [
                                {
                                    label: 'Gestions des entreprises',
                                    icon: 'pi pi-home',
                                    items: [
                                        {
                                            label: 'Ajouter une entreprise',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-entreprise']
                                        },
                                        {
                                            label: 'Liste des entreprises',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/entreprises']
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestion des tuteurs',
                                    icon: 'pi pi-user',
                                    routerLink: ['/tuteur']
                                },
                                {
                                    label: 'Placement',
                                    icon: 'pi pi-star',
                                    items: [
                                        {
                                            label: 'Alternances',
                                            icon: 'pi pi-list',
                                            routerLink: ['/liste-contrats']
                                        },
                                        {
                                            label: 'Stages',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/stages']
                                        },
                                    ]
                                },
                                {
                                    label: 'Gestion des équipes de conseillers',
                                    icon: 'pi pi-users',
                                    routerLink: ['/equipe-commercial']
                                },
                                {
                                    label: 'Gestion des prospects alternables',
                                    icon: 'pi pi-briefcase',
                                    routerLink: ['/prospects-alt']
                                },
                                {
                                    label: 'Ajouter un dossier',
                                    icon: 'pi pi-user-plus',
                                    routerLink: ['/ajout-prospect']
                                },

                            ]

                        },
                        {
                            label: 'Partenaires',
                            icon: 'pi pi-share-alt',
                            items: [
                                {
                                    label: 'Insérer un Partenaire',
                                    icon: 'pi pi pi-user-plus',
                                    routerLink: ['/partenaireInscription']
                                },
                                {
                                    label: 'Liste des partenaires',
                                    icon: 'pi pi-sort-alpha-down',
                                    routerLink: ['/admin/partenaire']
                                },
                                {
                                    label: 'Support Marketing',
                                    icon: 'pi pi-briefcase'
                                },
                                {
                                    label: 'Gestion des commissions',
                                    icon: 'pi pi-credit-card',
                                    items: [
                                        {
                                            label: "Ventes",
                                            icon: 'pi pi-shopping-cart',
                                            routerLink: ['/commissions/ventes']
                                        },
                                        {
                                            label: "Réglement",
                                            icon: 'pi pi-shopping-cart',
                                            routerLink: ['/commissions/reglement']
                                        }
                                    ]
                                },
                                {
                                    label: 'Dashboard',
                                    icon: 'pi pi-chart-line'
                                },
                            ]
                        },
                        {
                            label: 'Skillsnet',
                            icon: 'pi pi-star',
                            items: [
                                {
                                    label: 'Offres d\'emplois',
                                    icon: 'pi pi-volume-up',
                                    routerLink: ['/offres']
                                },
                                {
                                    label: 'Mes offres',
                                    icon: 'pi pi-user',
                                    routerLink: ['/mes-offres']
                                },
                                {
                                    label: 'Cvthèque',
                                    icon: 'pi pi-briefcase',
                                    routerLink: ['/cvtheque']
                                },
                                {
                                    label: 'Gestion des compétences',
                                    icon: 'pi pi-book',
                                    routerLink: ['/skills-management']
                                },
                                {
                                    label: "Gestions des externes",
                                    icon: 'pi pi-users',
                                    routerLink: ['/skillsnet/externe']
                                },
                                {
                                    label: "Gestions des événements",
                                    icon: 'pi pi-flag',
                                    routerLink: ['/evenements']
                                }
                            ]
                        },
                    ]
                }
                // menu service RH
                else if (response.role === 'Agent' && service_id?.label === 'Ressources Humaines') {
                    this.items = [
                        {
                            label: 'Tableau de bord',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/'],
                        },
                        {
                            label: 'Ticketing',
                            icon: 'pi pi-fw pi-ticket',
                            items: [
                                {
                                    label: 'Gestion des tickets',
                                    icon: 'pi pi-fw pi-folder-open',
                                    routerLink: ['/gestion-tickets'],
                                },
                                {
                                    label: 'Suivi des tickets',
                                    icon: 'pi pi-fw pi-check-circle',
                                    routerLink: ['/suivi-ticket'],
                                },
                            ]
                        },
                        {
                            label: 'Projet',
                            icon: 'pi pi-fw pi-shield',
                            items: [
                                {
                                    label: 'Gestion des activités projets',
                                    icon: 'pi pi-fw pi-check-circle',
                                    routerLink: ['/task-management'],
                                },
                                {
                                    label: 'Mes activités projets',
                                    icon: 'pi pi-fw pi-list',
                                    routerLink: ['/my-tasks'],
                                },
                            ]
                        },
                        {
                            label: 'Ressources humaines',
                            icon: 'pi pi-fw pi-users',
                            items: [
                                {
                                    label: 'Gestion des ressources humaines',
                                    icon: 'pi pi-fw pi-list',
                                    routerLink: ['/gestion-des-ressources-humaines'],

                                },
                            ]
                        },
                    ]
                }
                // menu service support informatique
                else if (response.role === 'Agent' && service_id?.label === 'Support Informatique') {
                    this.items = [
                        {
                            label: 'Tableau de bord',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/'],
                        },
                        {
                            label: 'Développeur',
                            icon: 'pi pi-fw pi-cog',
                            items: [
                                {
                                    label: 'Gestion des utilisateurs',
                                    icon: 'pi pi-fw pi-user',
                                    routerLink: ['/gestion-des-utilisateurs'],

                                },
                                {
                                    label: 'Analyseur de doublon',
                                    icon: 'pi pi-fw pi-server',
                                    routerLink: ['/analyseur-doublons'],
                                },
                                {
                                    label: 'Connexion des étudiants',
                                    icon: 'pi pi-fw pi-sign-in',
                                    routerLink: ['/gestion-etudiants'],
                                },
                                {
                                    label: 'Infos IMS',
                                    icon: 'pi pi-fw pi-info-circle',
                                    routerLink: ['/infos-ims'],
                                }
                            ]
                        },
                        {
                            label: 'Ticketing',
                            icon: 'pi pi-fw pi-ticket',
                            items: [
                                {
                                    label: 'Gestion des tickets',
                                    icon: 'pi pi-fw pi-folder-open',
                                    routerLink: ['/gestion-tickets'],
                                },
                                {
                                    label: 'Suivi des tickets',
                                    icon: 'pi pi-fw pi-check-circle',
                                    routerLink: ['/suivi-ticket'],
                                },
                                {
                                    label: 'Gestion des services',
                                    icon: 'pi pi-fw pi-sitemap',
                                    routerLink: ['/admin/gestion-services'],
                                },
                            ]
                        },
                        {
                            label: 'Projet',
                            icon: 'pi pi-fw pi-shield',
                            items: [
                                {
                                    label: 'Gestion des activités projets',
                                    icon: 'pi pi-fw pi-check-circle',
                                    routerLink: ['/task-management'],
                                },
                                {
                                    label: 'Mes activités projets',
                                    icon: 'pi pi-fw pi-list',
                                    routerLink: ['/my-tasks'],
                                },
                                {
                                    label: 'Gestion des équipes',
                                    icon: 'pi pi-fw pi-users',
                                    routerLink: ['/team'],
                                },
                            ]
                        },
                        {
                            label: 'Pédagogie',
                            icon: 'pi pi-fw pi-folder',
                            items: [
                                {
                                    label: 'Gestion des inscrits en attente d\'assignation',
                                    icon: 'pi pi-user-plus',
                                    routerLink: ['/assignation-inscrit']
                                },
                            ]
                        },
                        {
                            label: 'Administration',
                            icon: 'pi pi-fw pi-inbox',
                            items: [
                                {
                                    label: 'Validation des inscrits',
                                    icon: 'pi pi-check-square',
                                    routerLink: ['/validation-inscrit']
                                },

                            ]
                        },
                        {
                            label: 'Support',
                            icon: 'pi pi-cog',
                            items: [
                                {
                                    label: 'Étudiants en attente de leur compte IMS',
                                    icon: 'pi pi-user-plus',
                                    routerLink: ['/assign-ims']
                                },

                            ]
                        },
                    ]
                }
                /* end menus salariés*/

                /* menus alternants intedgroup */
                // menu alternant admin 
                if (response.role === 'Admin' && response.type === 'Alternant') {
                    this.ETUService.getByUser_id(this.token.id).subscribe({
                        next: (dataEtu: Etudiant) => {
                            this.items = [
                                {
                                    label: 'Tableau de bord',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/'],
                                },
                                {
                                    label: 'Développeur',
                                    icon: 'pi pi-fw pi-cog',
                                    items: [
                                        {
                                            label: 'Gestion des utilisateurs',
                                            icon: 'pi pi-fw pi-user',
                                            routerLink: ['/gestion-des-utilisateurs'],

                                        },
                                        {
                                            label: 'Analyseur de doublon',
                                            icon: 'pi pi-fw pi-server',
                                            routerLink: ['/analyseur-doublons'],
                                        },
                                        {
                                            label: 'Connexion des étudiants',
                                            icon: 'pi pi-fw pi-sign-in',
                                            routerLink: ['/gestion-etudiants'],
                                        },
                                        {
                                            label: 'Infos IMS',
                                            icon: 'pi pi-fw pi-info-circle',
                                            routerLink: ['/infos-ims'],
                                        }
                                    ]
                                },
                                {
                                    label: 'Ticketing',
                                    icon: 'pi pi-fw pi-ticket',
                                    items: [
                                        {
                                            label: 'Gestion des tickets',
                                            icon: 'pi pi-fw pi-folder-open',
                                            routerLink: ['/gestion-tickets'],
                                        },
                                        {
                                            label: 'Suivi des tickets',
                                            icon: 'pi pi-fw pi-check-circle',
                                            routerLink: ['/suivi-ticket'],
                                        },
                                        {
                                            label: 'Gestion des services',
                                            icon: 'pi pi-fw pi-sitemap',
                                            routerLink: ['/admin/gestion-services'],
                                        },
                                    ]
                                },
                                {
                                    label: 'Projet',
                                    icon: 'pi pi-fw pi-shield',
                                    items: [
                                        {
                                            label: 'Gestion des activités projets',
                                            icon: 'pi pi-fw pi-check-circle',
                                            routerLink: ['/task-management'],
                                        },
                                        {
                                            label: 'Mes activités projets',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/my-tasks'],
                                        },
                                        {
                                            label: 'Gestion des équipes',
                                            icon: 'pi pi-fw pi-users',
                                            routerLink: ['/team'],
                                        },
                                    ]
                                },
                                {
                                    label: 'Ressources humaines',
                                    icon: 'pi pi-fw pi-users',
                                    items: [
                                        {
                                            label: 'Gestion des ressources humaines',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/gestion-des-ressources-humaines'],

                                        },
                                    ]
                                },
                                {
                                    label: 'Pédagogie',
                                    icon: 'pi pi-fw pi-folder',
                                    items: [
                                        {
                                            label: 'Gestions des groupes',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Ajouter un groupe',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: ['/ajout-groupe']
                                                },
                                                {
                                                    label: 'Liste des groupes',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/groupes']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Gestion des modules',
                                            icon: 'pi pi-fw pi-tags',
                                            routerLink: ['/matieres'],

                                        },
                                        {
                                            label: 'Gestions des séances',
                                            icon: 'pi pi-video',
                                            items: [
                                                {
                                                    label: 'Ajouter une séance',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/ajout-seance'],
                                                },
                                                {
                                                    label: 'Voir la liste des séances',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/seances'],
                                                },
                                                {
                                                    label: 'Voir l\'emploi du temps des séances',
                                                    icon: 'pi pi-calendar',
                                                    routerLink: ['/emploi-du-temps'],
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Gestions des formateurs',
                                            icon: 'pi pi-id-card',
                                            items: [
                                                {
                                                    label: 'Ajouter un formateur',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/ajout-formateur']
                                                },
                                                {
                                                    label: 'Liste des formateurs',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/formateurs']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Gestion des inscrits en attente d\'assignation',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/assignation-inscrit']
                                        },
                                        {
                                            label: 'Gestions des étudiants', icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Ajouter un étudiant',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/ajout-etudiant']
                                                },
                                                {
                                                    label: 'Liste des étudiants',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['etudiants']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Gestions des évaluations',
                                            icon: 'pi pi-copy',
                                            items: [
                                                {
                                                    label: 'Ajouter une évaluation',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/ajout-examen']
                                                },
                                                {
                                                    label: 'Liste des évaluations',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/examens']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Gestions des Bulletins de notes',
                                            icon: 'pi pi-pencil',
                                            routerLink: ['/notes']
                                        },
                                        {
                                            label: 'Gestions des devoirs',
                                            icon: 'pi pi-book',
                                            routerLink: 'devoirs'
                                        }
                                    ]
                                },
                                {
                                    label: 'Administration',
                                    icon: 'pi pi-fw pi-inbox',
                                    items: [
                                        {
                                            label: 'Gestions des années scolaires',
                                            icon: 'pi pi-calendar',
                                            items:
                                                [
                                                    {
                                                        label: 'Ajouter une année scolaire',
                                                        icon: 'pi pi-calendar-plus',
                                                        routerLink: ['/ajout-annee-scolaire']
                                                    },
                                                    {
                                                        label: 'Liste des années scolaires',
                                                        icon: 'pi pi-sort-alpha-down',
                                                        routerLink: ['/annee-scolaire']
                                                    },
                                                ]
                                        },
                                        {
                                            label: 'Gestions des écoles',
                                            icon: 'pi pi-home',
                                            items: [
                                                {
                                                    label: 'Ajouter une école',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: ['/ajout-ecole']
                                                },
                                                {
                                                    label: 'Liste des écoles',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/ecole']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Gestions des campus',
                                            icon: 'pi pi-home',
                                            items: [
                                                {
                                                    label: 'Ajouter un campus',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: ['/ajout-campus']
                                                },
                                                {
                                                    label: 'Liste des campus',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/campus']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Gestions des diplômes',
                                            icon: 'pi pi-bookmark',
                                            items: [
                                                {
                                                    label: 'Ajouter un diplôme',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: ['/ajout-diplome']
                                                },
                                                {
                                                    label: 'Liste des diplômes',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/diplomes']
                                                },
                                            ]
                                        },

                                        {
                                            label: 'Gestions des agents',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Ajouter un agent',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/admin/ajout-agent']
                                                },
                                                {
                                                    label: 'Liste des agents',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/admin/agents']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Validation des inscrits',
                                            icon: 'pi pi-check-square',
                                            routerLink: ['/validation-inscrit']
                                        },

                                    ]
                                },
                                {
                                    label: 'Admission',
                                    icon: 'pi pi-fw pi-check-circle',
                                    items: [
                                        {
                                            label: 'Gestions des prospects',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'En attente de traitement',
                                                    icon: 'pi pi-spin pi-spinner',
                                                    routerLink: ['/gestion-preinscriptions-filtered/En attente de traitement']
                                                },
                                                {
                                                    label: 'Dossiers traités',
                                                    icon: 'pi pi-check-circle',
                                                    routerLink: ['/gestion-preinscriptions-filter/traite']
                                                },
                                                {
                                                    label: 'Ajouter un dossier',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/ajout-prospect']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Dashboard',
                                            icon: 'pi pi-users',
                                            routerLink: ['/gestion-preinscriptions']
                                        },
                                        {
                                            label: 'Gestions des prospects Intuns',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/prospects-intuns']
                                        },
                                        {
                                            label: 'Gestion des participantes pour les événements',
                                            icon: 'pi pi-users',
                                            routerLink: ['/list-events']
                                        }
                                    ],
                                },
                                {
                                    label: 'Commerciale',
                                    icon: 'pi pi-fw pi-briefcase',
                                    items: [
                                        {
                                            label: 'Gestions des entreprises',
                                            icon: 'pi pi-home',
                                            items: [
                                                {
                                                    label: 'Ajouter une entreprise',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/ajout-entreprise']
                                                },
                                                {
                                                    label: 'Liste des entreprises',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/entreprises']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Gestion des tuteurs',
                                            icon: 'pi pi-user',
                                            routerLink: ['/tuteur']
                                        },
                                        {
                                            label: 'Placement',
                                            icon: 'pi pi-star',
                                            items: [
                                                {
                                                    label: 'Alternances',
                                                    icon: 'pi pi-list',
                                                    routerLink: ['/liste-contrats']
                                                },
                                                {
                                                    label: 'Stages',
                                                    icon: 'pi pi-briefcase',
                                                    routerLink: ['/stages']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Gestion des équipes de conseillers',
                                            icon: 'pi pi-users',
                                            routerLink: ['/equipe-commercial']
                                        },
                                        {
                                            label: 'Gestion des prospects alternables',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/prospects-alt']
                                        },
                                        {
                                            label: 'Ajouter un dossier',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-prospect']
                                        },

                                    ]

                                },
                                {
                                    label: 'Partenaires',
                                    icon: 'pi pi-share-alt',
                                    items: [
                                        {
                                            label: 'Insérer un Partenaire',
                                            icon: 'pi pi pi-user-plus',
                                            routerLink: ['/partenaireInscription']
                                        },
                                        {
                                            label: 'Liste des partenaires',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/admin/partenaire']
                                        },
                                        {
                                            label: 'Support Marketing',
                                            icon: 'pi pi-briefcase'
                                        },
                                        {
                                            label: 'Gestion des commissions',
                                            icon: 'pi pi-credit-card',
                                            items: [
                                                {
                                                    label: "Ventes",
                                                    icon: 'pi pi-shopping-cart',
                                                    routerLink: ['/commissions/ventes']
                                                },
                                                {
                                                    label: "Réglement",
                                                    icon: 'pi pi-shopping-cart',
                                                    routerLink: ['/commissions/reglement']
                                                }
                                            ]
                                        },
                                        {
                                            label: 'Dashboard',
                                            icon: 'pi pi-chart-line'
                                        },
                                    ]
                                },
                                {
                                    label: 'Skillsnet',
                                    icon: 'pi pi-star',
                                    items: [
                                        {
                                            label: 'Offres d\'emplois',
                                            icon: 'pi pi-volume-up',
                                            routerLink: ['/offres']
                                        },
                                        {
                                            label: 'Mes offres',
                                            icon: 'pi pi-user',
                                            routerLink: ['/mes-offres']
                                        },
                                        {
                                            label: 'Cvthèque',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/cvtheque']
                                        },
                                        {
                                            label: 'Gestion des compétences',
                                            icon: 'pi pi-book',
                                            routerLink: ['/skills-management']
                                        },
                                        {
                                            label: "Gestions des externes",
                                            icon: 'pi pi-users',
                                            routerLink: ['/skillsnet/externe']
                                        },
                                        {
                                            label: "Gestions des événements",
                                            icon: 'pi pi-flag',
                                            routerLink: ['/evenements']
                                        }
                                    ]
                                },
                                {
                                    label: 'Support',
                                    icon: 'pi pi-cog',
                                    items: [
                                        {
                                            label: 'Étudiants en attente de leur compte IMS',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/assign-ims']
                                        },

                                    ]
                                },
                                {
                                    label: 'Booking',
                                    icon: 'pi pi-building',
                                    items: [
                                        {
                                            label: 'Logements',
                                            icon: 'pi pi-home',
                                            routerLink: ['/logements']
                                        },
                                        {
                                            label: 'Gestion des reservations',
                                            icon: 'pi pi-bookmark',
                                            routerLink: ['/gestion-reservations']
                                        },
                                    ]
                                },
                                {
                                    label: 'Finance',
                                    icon: 'pi pi-money-bill',
                                    items: [
                                        {
                                            label: 'Gestion des factures des formateurs',
                                            icon: "pi pi-user-edit",
                                            routerLink: ['/facture-formateur']
                                        }
                                    ]
                                },
                                {
                                    label: 'Questionnaire',
                                    icon: 'pi pi-sort-alpha-down',
                                    items: [
                                        {
                                            label: 'Questionnaire satisfaction',
                                            icon: 'pi pi-heart',
                                            routerLink: ['resultat-qs']
                                        },
                                        {
                                            label: 'Questionnaire formateur',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['resultat-qf']
                                        },
                                        {
                                            label: 'Questionnaire fin de formation',
                                            icon: 'pi pi-check-circle',
                                            routerLink: ['resultat-qff']
                                        },
                                    ]
                                },
                                {
                                    label: 'Étudiant',
                                    icon: 'pi pi-chart-pie',
                                    items: [
                                        { label: 'Emploi du temps', icon: 'pi pi-calendar', routerLink: 'emploi-du-temps/classe/' + dataEtu.classe_id },
                                        { label: 'Booking - Logements', icon: 'pi pi-home', routerLink: ['/logements'] },
                                        { label: "Assiduité", icon: 'pi pi-check-square', routerLink: 'details/' + dataEtu._id }
                                    ]
                                }
                            ];
                        },
                        error: (error: any) => { console.log(error); },
                        complete: () => { console.log("Informations de l'étudiant récupérer avec succès !") }
                    });

                }
                // menu alternant service pédagogique DONE
                else if (response.role === 'Agent' && service_id?.label == 'Pédagogie' && response.type === 'Alternant') {
                    this.ETUService.getByUser_id(this.token.id).subscribe({
                        next: (dataEtu: Etudiant) => {
                            this.items = [
                                {
                                    label: 'Tableau de bord',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/'],
                                },
                                {
                                    label: 'Ticketing',
                                    icon: 'pi pi-fw pi-ticket',
                                    items: [
                                        {
                                            label: 'Gestion des tickets',
                                            icon: 'pi pi-fw pi-folder-open',
                                            routerLink: ['/gestion-tickets'],
                                        },
                                        {
                                            label: 'Suivi des tickets',
                                            icon: 'pi pi-fw pi-check-circle',
                                            routerLink: ['/suivi-ticket'],
                                        },
                                    ]
                                },
                                {
                                    label: 'Projet',
                                    icon: 'pi pi-fw pi-shield',
                                    items: [
                                        {
                                            label: 'Gestion des activités projets',
                                            icon: 'pi pi-fw pi-check-circle',
                                            routerLink: ['/task-management'],
                                        },
                                        {
                                            label: 'Mes activités projets',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/my-tasks'],
                                        },
                                    ]
                                },
                                {
                                    label: 'Pédagogie',
                                    icon: 'pi pi-fw pi-folder',
                                    items: [
                                        {
                                            label: 'Gestions des groupes',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Ajouter un groupe',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: ['/ajout-groupe']
                                                },
                                                {
                                                    label: 'Liste des groupes',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/groupes']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Gestion des modules',
                                            icon: 'pi pi-fw pi-tags',
                                            routerLink: ['/matieres'],

                                        },
                                        {
                                            label: 'Gestions des séances',
                                            icon: 'pi pi-video',
                                            items: [
                                                {
                                                    label: 'Ajouter une séance',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/ajout-seance'],
                                                },
                                                {
                                                    label: 'Voir la liste des séances',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/seances'],
                                                },
                                                {
                                                    label: 'Voir l\'emploi du temps des séances',
                                                    icon: 'pi pi-calendar',
                                                    routerLink: ['/emploi-du-temps'],
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Gestions des formateurs',
                                            icon: 'pi pi-id-card',
                                            items: [
                                                {
                                                    label: 'Ajouter un formateur',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/ajout-formateur']
                                                },
                                                {
                                                    label: 'Liste des formateurs',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/formateurs']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Gestion des inscrits en attente d\'assignation',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/assignation-inscrit']
                                        },
                                        {
                                            label: 'Gestions des étudiants', icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Ajouter un étudiant',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/ajout-etudiant']
                                                },
                                                {
                                                    label: 'Liste des étudiants',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['etudiants']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Gestions des évaluations',
                                            icon: 'pi pi-copy',
                                            items: [
                                                {
                                                    label: 'Ajouter une évaluation',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/ajout-examen']
                                                },
                                                {
                                                    label: 'Liste des évaluations',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/examens']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Gestions des Bulletins de notes',
                                            icon: 'pi pi-pencil',
                                            routerLink: ['/notes']
                                        },
                                        {
                                            label: 'Gestions des devoirs',
                                            icon: 'pi pi-book',
                                            routerLink: 'devoirs'
                                        }
                                    ]
                                },
                                {
                                    label: 'Commerciale',
                                    icon: 'pi pi-fw pi-briefcase',
                                    items: [
                                        {
                                            label: 'Gestions des entreprises',
                                            icon: 'pi pi-home',
                                            items: [
                                                {
                                                    label: 'Ajouter une entreprise',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/ajout-entreprise']
                                                },
                                                {
                                                    label: 'Liste des entreprises',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/entreprises']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Gestion des tuteurs',
                                            icon: 'pi pi-user',
                                            routerLink: ['/tuteur']
                                        },
                                        {
                                            label: 'Placement',
                                            icon: 'pi pi-star',
                                            items: [
                                                {
                                                    label: 'Alternances',
                                                    icon: 'pi pi-list',
                                                    routerLink: ['/liste-contrats']
                                                },
                                                {
                                                    label: 'Stages',
                                                    icon: 'pi pi-briefcase',
                                                    routerLink: ['/stages']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Gestion des équipes de conseillers',
                                            icon: 'pi pi-users',
                                            routerLink: ['/equipe-commercial']
                                        },
                                        {
                                            label: 'Gestion des prospects alternables',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/prospects-alt']
                                        },
                                        {
                                            label: 'Ajouter un dossier',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-prospect']
                                        },

                                    ]
                                },
                                {
                                    label: 'Questionnaire',
                                    icon: 'pi pi-sort-alpha-down',
                                    items: [
                                        {
                                            label: 'Questionnaire satisfaction',
                                            icon: 'pi pi-heart',
                                            routerLink: ['resultat-qs']
                                        },
                                        {
                                            label: 'Questionnaire formateur',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['resultat-qf']
                                        },
                                        {
                                            label: 'Questionnaire fin de formation',
                                            icon: 'pi pi-check-circle',
                                            routerLink: ['resultat-qff']
                                        },
                                    ]
                                },
                                {
                                    label: 'Étudiant',
                                    icon: 'pi pi-chart-pie',
                                    items: [
                                        { label: 'Emploi du temps', icon: 'pi pi-calendar', routerLink: 'emploi-du-temps/classe/' + dataEtu.classe_id },
                                        { label: 'Booking - Logements', icon: 'pi pi-home', routerLink: ['/logements'] },
                                        { label: "Assiduité", icon: 'pi pi-check-square', routerLink: 'details/' + dataEtu._id }
                                    ]
                                }
                            ]
                        },
                        error: (error: any) => { console.log(error); },
                        complete: () => { console.log(" Informations de l'étudiant récupérer avec succès !"); },
                    });

                }
                // menu service admission 
                else if (response.role === 'Agent' && service_id?.label === 'Admission' && response.type === 'Alternant') {
                    this.ETUService.getByUser_id(this.token.id).subscribe({
                        next: (dataEtu: Etudiant) => {
                            this.items = [
                                {
                                    label: 'Tableau de bord',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/'],
                                },
                                {
                                    label: 'Ticketing',
                                    icon: 'pi pi-fw pi-ticket',
                                    items: [
                                        {
                                            label: 'Gestion des tickets',
                                            icon: 'pi pi-fw pi-folder-open',
                                            routerLink: ['/gestion-tickets'],
                                        },
                                        {
                                            label: 'Suivi des tickets',
                                            icon: 'pi pi-fw pi-check-circle',
                                            routerLink: ['/suivi-ticket'],
                                        },
                                    ]
                                },
                                {
                                    label: 'Projet',
                                    icon: 'pi pi-fw pi-shield',
                                    items: [
                                        {
                                            label: 'Gestion des activités projets',
                                            icon: 'pi pi-fw pi-check-circle',
                                            routerLink: ['/task-management'],
                                        },
                                        {
                                            label: 'Mes activités projets',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/my-tasks'],
                                        },
                                    ]
                                },
                                {
                                    label: 'Admission',
                                    icon: 'pi pi-fw pi-check-circle',
                                    items: [
                                        {
                                            label: 'Gestions des prospects',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'En attente de traitement',
                                                    icon: 'pi pi-spin pi-spinner',
                                                    routerLink: ['/gestion-preinscriptions-filtered/En attente de traitement']
                                                },
                                                {
                                                    label: 'Dossiers traités',
                                                    icon: 'pi pi-check-circle',
                                                    routerLink: ['/gestion-preinscriptions-filter/traite']
                                                },
                                                {
                                                    label: 'Ajouter un dossier',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/ajout-prospect']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Dashboard',
                                            icon: 'pi pi-users',
                                            routerLink: ['/gestion-preinscriptions']
                                        },
                                        {
                                            label: 'Gestions des prospects Intuns',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/prospects-intuns']
                                        },
                                        {
                                            label: 'Gestion des participantes pour les événements',
                                            icon: 'pi pi-users',
                                            routerLink: ['/list-events']
                                        }
                                    ],
                                },
                                {
                                    label: 'Étudiant',
                                    icon: 'pi pi-chart-pie',
                                    items: [
                                        { label: 'Emploi du temps', icon: 'pi pi-calendar', routerLink: 'emploi-du-temps/classe/' + dataEtu.classe_id },
                                        { label: 'Booking - Logements', icon: 'pi pi-home', routerLink: ['/logements'] },
                                        { label: "Assiduité", icon: 'pi pi-check-square', routerLink: 'details/' + dataEtu._id }
                                    ]
                                }
                            ]
                        },
                        error: (error: any) => { console.log(error); },
                        complete: () => { console.log(" Informations de l'étudiant récupérer avec succès !"); },
                    });


                }
                else if (response.role === 'Agent' && service_id?.label === 'Event') {
                    this.ETUService.getByUser_id(this.token.id).subscribe({
                        next: (dataEtu: Etudiant) => {
                            this.items = [
                                {
                                    label: 'Tableau de bord',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/'],
                                },
                                {
                                    label: 'Ticketing',
                                    icon: 'pi pi-fw pi-ticket',
                                    items: [
                                        {
                                            label: 'Gestion des tickets',
                                            icon: 'pi pi-fw pi-folder-open',
                                            routerLink: ['/gestion-tickets'],
                                        },
                                        {
                                            label: 'Suivi des tickets',
                                            icon: 'pi pi-fw pi-check-circle',
                                            routerLink: ['/suivi-ticket'],
                                        },
                                    ]
                                },
                                {
                                    label: 'Admission',
                                    icon: 'pi pi-fw pi-check-circle',
                                    items: [
                                        {
                                            label: 'Gestion des participantes pour les événements',
                                            icon: 'pi pi-users',
                                            routerLink: ['/list-events']
                                        }
                                    ],
                                }
                            ]
                            if (dataEtu)
                                this.items.push({
                                    label: 'Étudiant',
                                    icon: 'pi pi-chart-pie',
                                    items: [
                                        { label: 'Emploi du temps', icon: 'pi pi-calendar', routerLink: 'emploi-du-temps/classe/' + dataEtu.classe_id },
                                        { label: 'Booking - Logements', icon: 'pi pi-home', routerLink: ['/logements'] },
                                        { label: "Assiduité", icon: 'pi pi-check-square', routerLink: 'details/' + dataEtu._id }
                                    ]
                                })

                        },
                        error: (error: any) => { console.log(error); },
                        complete: () => { console.log(" Informations de l'étudiant récupérer avec succès !"); },
                    });


                }
                // menu service administration 
                else if (response.role === 'Agent' && service_id?.label === 'Administration' && response.type === 'Alternant') {
                    this.ETUService.getByUser_id(this.token.id).subscribe({
                        next: (dataEtu: Etudiant) => {
                            this.items = [
                                {
                                    label: 'Tableau de bord',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/'],
                                },
                                {
                                    label: 'Ticketing',
                                    icon: 'pi pi-fw pi-ticket',
                                    items: [
                                        {
                                            label: 'Gestion des tickets',
                                            icon: 'pi pi-fw pi-folder-open',
                                            routerLink: ['/gestion-tickets'],
                                        },
                                        {
                                            label: 'Suivi des tickets',
                                            icon: 'pi pi-fw pi-check-circle',
                                            routerLink: ['/suivi-ticket'],
                                        },
                                    ]
                                },
                                {
                                    label: 'Projet',
                                    icon: 'pi pi-fw pi-shield',
                                    items: [
                                        {
                                            label: 'Gestion des activités projets',
                                            icon: 'pi pi-fw pi-check-circle',
                                            routerLink: ['/task-management'],
                                        },
                                        {
                                            label: 'Mes activités projets',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/my-tasks'],
                                        },
                                    ]
                                },
                                {
                                    label: 'Administration',
                                    icon: 'pi pi-fw pi-inbox',
                                    items: [
                                        {
                                            label: 'Gestions des années scolaires',
                                            icon: 'pi pi-calendar',
                                            items:
                                                [
                                                    {
                                                        label: 'Ajouter une année scolaire',
                                                        icon: 'pi pi-calendar-plus',
                                                        routerLink: ['/ajout-annee-scolaire']
                                                    },
                                                    {
                                                        label: 'Liste des années scolaires',
                                                        icon: 'pi pi-sort-alpha-down',
                                                        routerLink: ['/annee-scolaire']
                                                    },
                                                ]
                                        },
                                        {
                                            label: 'Gestions des écoles',
                                            icon: 'pi pi-home',
                                            items: [
                                                {
                                                    label: 'Ajouter une école',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: ['/ajout-ecole']
                                                },
                                                {
                                                    label: 'Liste des écoles',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/ecole']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Gestions des campus',
                                            icon: 'pi pi-home',
                                            items: [
                                                {
                                                    label: 'Ajouter un campus',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: ['/ajout-campus']
                                                },
                                                {
                                                    label: 'Liste des campus',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/campus']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Gestions des diplômes',
                                            icon: 'pi pi-bookmark',
                                            items: [
                                                {
                                                    label: 'Ajouter un diplôme',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: ['/ajout-diplome']
                                                },
                                                {
                                                    label: 'Liste des diplômes',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/diplomes']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Gestions des agents',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Ajouter un agent',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/admin/ajout-agent']
                                                },
                                                {
                                                    label: 'Liste des agents',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/admin/agents']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Validation des inscrits',
                                            icon: 'pi pi-check-square',
                                            routerLink: ['/validation-inscrit']
                                        },

                                    ]
                                },
                                {
                                    label: 'Pédagogie',
                                    icon: 'pi pi-fw pi-folder',
                                    items: [
                                        {
                                            label: 'Gestions des étudiants', icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Liste des étudiants',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['etudiants']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Gestions des groupes',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Ajouter un groupe',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: ['/ajout-groupe']
                                                },
                                                {
                                                    label: 'Liste des groupes',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/groupes']
                                                },
                                            ]
                                        },
                                    ]
                                },
                                {
                                    label: 'Étudiant',
                                    icon: 'pi pi-chart-pie',
                                    items: [
                                        { label: 'Emploi du temps', icon: 'pi pi-calendar', routerLink: 'emploi-du-temps/classe/' + dataEtu.classe_id },
                                        { label: 'Booking - Logements', icon: 'pi pi-home', routerLink: ['/logements'] },
                                        { label: "Assiduité", icon: 'pi pi-check-square', routerLink: 'details/' + dataEtu._id }
                                    ]
                                }
                            ]
                        },
                        error: (error: any) => { console.log(error); },
                        complete: () => { console.log(" Informations de l'étudiant récupérer avec succès !"); },
                    });

                }
                // menu service commerciale
                else if (response.role === 'Agent' && service_id?.label === 'Commercial' && response.type === 'Alternant') {
                    this.ETUService.getByUser_id(this.token.id).subscribe({
                        next: (dataEtu: Etudiant) => {
                            this.items = [
                                {
                                    label: 'Tableau de bord',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/'],
                                },
                                {
                                    label: 'Ticketing',
                                    icon: 'pi pi-fw pi-ticket',
                                    items: [
                                        {
                                            label: 'Gestion des tickets',
                                            icon: 'pi pi-fw pi-folder-open',
                                            routerLink: ['/gestion-tickets'],
                                        },
                                        {
                                            label: 'Suivi des tickets',
                                            icon: 'pi pi-fw pi-check-circle',
                                            routerLink: ['/suivi-ticket'],
                                        },
                                    ]
                                },
                                {
                                    label: 'Projet',
                                    icon: 'pi pi-fw pi-shield',
                                    items: [
                                        {
                                            label: 'Gestion des activités projets',
                                            icon: 'pi pi-fw pi-check-circle',
                                            routerLink: ['/task-management'],
                                        },
                                        {
                                            label: 'Mes activités projets',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/my-tasks'],
                                        },
                                    ]
                                },
                                {
                                    label: 'Pédagogie',
                                    icon: 'pi pi-fw pi-folder',
                                    items: [
                                        {
                                            label: 'Gestions des étudiants', icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Ajouter un étudiant',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/ajout-etudiant']
                                                },
                                                {
                                                    label: 'Liste des étudiants',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['etudiants']
                                                },
                                            ]
                                        },
                                    ]
                                },
                                {
                                    label: 'Partenaires',
                                    icon: 'pi pi-share-alt',
                                    items: [
                                        {
                                            label: 'Insérer un Partenaire',
                                            icon: 'pi pi pi-user-plus',
                                            routerLink: ['/partenaireInscription']
                                        },
                                        {
                                            label: 'Liste des partenaires',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/admin/partenaire']
                                        },
                                        {
                                            label: 'Support Marketing',
                                            icon: 'pi pi-briefcase'
                                        },
                                        {
                                            label: 'Gestion des commissions',
                                            icon: 'pi pi-credit-card',
                                            items: [
                                                {
                                                    label: "Ventes",
                                                    icon: 'pi pi-shopping-cart',
                                                    routerLink: ['/commissions/ventes']
                                                },
                                                {
                                                    label: "Réglement",
                                                    icon: 'pi pi-shopping-cart',
                                                    routerLink: ['/commissions/reglement']
                                                }
                                            ]
                                        },
                                        {
                                            label: 'Dashboard',
                                            icon: 'pi pi-chart-line'
                                        },
                                    ]
                                },
                                {
                                    label: 'Skillsnet',
                                    icon: 'pi pi-star',
                                    items: [
                                        {
                                            label: 'Offres d\'emplois',
                                            icon: 'pi pi-volume-up',
                                            routerLink: ['/offres']
                                        },
                                        {
                                            label: 'Mes offres',
                                            icon: 'pi pi-user',
                                            routerLink: ['/mes-offres']
                                        },
                                        {
                                            label: 'Cvthèque',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/cvtheque']
                                        },
                                        {
                                            label: 'Gestion des compétences',
                                            icon: 'pi pi-book',
                                            routerLink: ['/skills-management']
                                        },
                                        {
                                            label: "Gestions des externes",
                                            icon: 'pi pi-users',
                                            routerLink: ['/skillsnet/externe']
                                        },
                                        {
                                            label: "Gestions des événements",
                                            icon: 'pi pi-flag',
                                            routerLink: ['/evenements']
                                        }
                                    ]
                                },
                                {
                                    label: 'Étudiant',
                                    icon: 'pi pi-chart-pie',
                                    items: [
                                        { label: 'Emploi du temps', icon: 'pi pi-calendar', routerLink: 'emploi-du-temps/classe/' + dataEtu.classe_id },
                                        { label: 'Booking - Logements', icon: 'pi pi-home', routerLink: ['/logements'] },
                                        { label: "Assiduité", icon: 'pi pi-check-square', routerLink: 'details/' + dataEtu._id }
                                    ]
                                }
                            ]
                        },
                        error: (error: any) => { console.log(error); },
                        complete: () => { console.log(" Informations de l'étudiant récupérer avec succès !"); },
                    });
                }
                // menu service RH
                else if (response.role === 'Agent' && service_id?.label === 'Ressources Humaines' && response.type === 'Alternant') {
                    this.ETUService.getByUser_id(this.token.id).subscribe({
                        next: (dataEtu: Etudiant) => {
                            this.items = [
                                {
                                    label: 'Tableau de bord',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/'],
                                },
                                {
                                    label: 'Ticketing',
                                    icon: 'pi pi-fw pi-ticket',
                                    items: [
                                        {
                                            label: 'Gestion des tickets',
                                            icon: 'pi pi-fw pi-folder-open',
                                            routerLink: ['/gestion-tickets'],
                                        },
                                        {
                                            label: 'Suivi des tickets',
                                            icon: 'pi pi-fw pi-check-circle',
                                            routerLink: ['/suivi-ticket'],
                                        },
                                    ]
                                },
                                {
                                    label: 'Projet',
                                    icon: 'pi pi-fw pi-shield',
                                    items: [
                                        {
                                            label: 'Gestion des activités projets',
                                            icon: 'pi pi-fw pi-check-circle',
                                            routerLink: ['/task-management'],
                                        },
                                        {
                                            label: 'Mes activités projets',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/my-tasks'],
                                        },
                                    ]
                                },
                                {
                                    label: 'Ressources humaines',
                                    icon: 'pi pi-fw pi-users',
                                    items: [
                                        {
                                            label: 'Gestion des ressources humaines',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/gestion-des-ressources-humaines'],

                                        },
                                    ]
                                },
                                {
                                    label: 'Étudiant',
                                    icon: 'pi pi-chart-pie',
                                    items: [
                                        { label: 'Emploi du temps', icon: 'pi pi-calendar', routerLink: 'emploi-du-temps/classe/' + dataEtu.classe_id },
                                        { label: 'Booking - Logements', icon: 'pi pi-home', routerLink: ['/logements'] },
                                        { label: "Assiduité", icon: 'pi pi-check-square', routerLink: 'details/' + dataEtu._id }
                                    ]
                                }
                            ]
                        },
                        error: (error: any) => { console.log(error); },
                        complete: () => { console.log(" Informations de l'étudiant récupérer avec succès !"); },
                    });
                }
                // menu service support informatique
                else if (response.role === 'Agent' && service_id?.label === 'Support Informatique' && response.type === 'Alternant') {
                    this.ETUService.getByUser_id(this.token.id).subscribe({
                        next: (dataEtu: Etudiant) => {
                            this.items = [
                                {
                                    label: 'Tableau de bord',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/'],
                                },
                                {
                                    label: 'Développeur',
                                    icon: 'pi pi-fw pi-cog',
                                    items: [
                                        {
                                            label: 'Gestion des utilisateurs',
                                            icon: 'pi pi-fw pi-user',
                                            routerLink: ['/gestion-des-utilisateurs'],

                                        },
                                        {
                                            label: 'Analyseur de doublon',
                                            icon: 'pi pi-fw pi-server',
                                            routerLink: ['/analyseur-doublons'],
                                        },
                                        {
                                            label: 'Connexion des étudiants',
                                            icon: 'pi pi-fw pi-sign-in',
                                            routerLink: ['/gestion-etudiants'],
                                        },
                                        {
                                            label: 'Infos IMS',
                                            icon: 'pi pi-fw pi-info-circle',
                                            routerLink: ['/infos-ims'],
                                        }
                                    ]
                                },
                                {
                                    label: 'Ticketing',
                                    icon: 'pi pi-fw pi-ticket',
                                    items: [
                                        {
                                            label: 'Gestion des tickets',
                                            icon: 'pi pi-fw pi-folder-open',
                                            routerLink: ['/gestion-tickets'],
                                        },
                                        {
                                            label: 'Suivi des tickets',
                                            icon: 'pi pi-fw pi-check-circle',
                                            routerLink: ['/suivi-ticket'],
                                        },
                                        {
                                            label: 'Gestion des services',
                                            icon: 'pi pi-fw pi-sitemap',
                                            routerLink: ['/admin/gestion-services'],
                                        },
                                    ]
                                },
                                {
                                    label: 'Projet',
                                    icon: 'pi pi-fw pi-shield',
                                    items: [
                                        {
                                            label: 'Gestion des activités projets',
                                            icon: 'pi pi-fw pi-check-circle',
                                            routerLink: ['/task-management'],
                                        },
                                        {
                                            label: 'Mes activités projets',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: ['/my-tasks'],
                                        },
                                        {
                                            label: 'Gestion des équipes',
                                            icon: 'pi pi-fw pi-users',
                                            routerLink: ['/team'],
                                        },
                                    ]
                                },
                                {
                                    label: 'Pédagogie',
                                    icon: 'pi pi-fw pi-folder',
                                    items: [
                                        {
                                            label: 'Gestion des inscrits en attente d\'assignation',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/assignation-inscrit']
                                        },
                                    ]
                                },
                                {
                                    label: 'Administration',
                                    icon: 'pi pi-fw pi-inbox',
                                    items: [
                                        {
                                            label: 'Validation des inscrits',
                                            icon: 'pi pi-check-square',
                                            routerLink: ['/validation-inscrit']
                                        },

                                    ]
                                },
                                {
                                    label: 'Support',
                                    icon: 'pi pi-cog',
                                    items: [
                                        {
                                            label: 'Étudiants en attente de leur compte IMS',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/assign-ims']
                                        },

                                    ]
                                },
                                {
                                    label: 'Étudiant',
                                    icon: 'pi pi-chart-pie',
                                    items: [
                                        { label: 'Emploi du temps', icon: 'pi pi-calendar', routerLink: 'emploi-du-temps/classe/' + dataEtu.classe_id },
                                        { label: 'Booking - Logements', icon: 'pi pi-home', routerLink: ['/logements'] },
                                        { label: "Assiduité", icon: 'pi pi-check-square', routerLink: 'details/' + dataEtu._id }
                                    ]
                                }
                            ]
                        },
                        error: (error: any) => { console.log(error); },
                        complete: () => { console.log(" Informations de l'étudiant récupérer avec succès !"); },
                    });
                }
                /* end menus alternants intedgroup */

                /* menus internes */
                // menu étudiant
                if ((response.type === 'Initial' || response.type === 'Alternant') && response.role === 'user') {
                    this.ETUService.getByUser_id(this.token.id).subscribe({
                        next: (dataEtu: Etudiant) => {
                            this.items = [
                                {
                                    label: 'Tableau de bord',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/'],
                                },
                                {
                                    label: 'Ticketing',
                                    icon: 'pi pi-fw pi-ticket',
                                    items: [
                                        {
                                            label: 'Suivi des tickets',
                                            icon: 'pi pi-fw pi-check-circle',
                                            routerLink: ['/suivi-ticket'],
                                        },
                                    ]
                                },
                                {
                                    label: "Pédagogie",
                                    icon: 'pi pi-fw pi-folder',
                                    items: [
                                        {
                                            label: 'Emploi du temps',
                                            icon: 'pi pi-calendar',
                                            routerLink: 'emploi-du-temps/classe/' + dataEtu.classe_id
                                        }

                                    ]
                                },
                                {
                                    label: 'Booking',
                                    icon: 'pi pi-building',
                                    items: [
                                        {
                                            label: 'Logements',
                                            icon: 'pi pi-home',
                                            routerLink: ['/logements']
                                        },
                                    ]
                                },
                                {
                                    label: 'SkillsNet',
                                    icon: 'pi pi-star',
                                    items: [
                                        {
                                            label: 'Offres',
                                            icon: 'pi pi-volume-up',
                                            routerLink: ['/offres']
                                        },
                                        {
                                            label: 'Mes Matching',
                                            icon: 'pi pi-link',
                                            routerLink: ['/matching-externe/' + this.token.id]
                                        },
                                    ]

                                },
                                {
                                    label: 'Étudiant',
                                    icon: 'pi pi-chart-pie',
                                    items: [
                                        { label: 'Emploi du temps', icon: 'pi pi-calendar', routerLink: 'emploi-du-temps/classe/' + dataEtu.classe_id },
                                        { label: 'Booking - Logements', icon: 'pi pi-home', routerLink: ['/logements'] },
                                        { label: "Assiduité", icon: 'pi pi-check-square', routerLink: 'details/' + dataEtu._id }
                                    ]
                                }
                            ];
                        },
                        error: (error: any) => { console.log(error); },
                        complete: () => { console.log(" Informations de l'étudiant récupérer avec succès !"); },
                    });
                }

                //menu formateur
                if (response.type === 'Formateur' && response.role === 'user') {
                    this.FService.getByUserId(this.token.id).subscribe({
                        next: (dataF: Formateur) => {
                            this.items = [
                                {
                                    label: 'Accueil',
                                    icon: 'pi pi-fw pi-home',
                                    items: [
                                        {
                                            label: 'Tableau de bord',
                                            icon: 'pi pi-fw pi-home',
                                            routerLink: ['/']
                                        }
                                    ]
                                },
                                {
                                    label: 'Ticketing',
                                    icon: 'pi pi-fw pi-ticket',
                                    items: [
                                        {
                                            label: 'Suivi de mes tickets',
                                            icon: 'pi pi-check-circle',
                                            routerLink: ['/suivi-ticket']
                                        },
                                    ]
                                },
                                {
                                    label: "Pédagogie",
                                    icon: 'pi pi-fw pi-folder',
                                    items: [
                                        {
                                            label: 'Emploi du temps',
                                            icon: 'pi pi-calendar',
                                            routerLink: 'emploi-du-temps/formateur/' + this.token.id
                                        },
                                        {
                                            label: 'Gestions des évaluations',
                                            icon: 'pi pi-copy',
                                            items: [
                                                {
                                                    label: 'Ajouter une évaluation',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/ajout-examen']
                                                },
                                                {
                                                    label: 'Liste des évaluations',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/examens']
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Liste de vos étudiants',
                                            icon: 'pi pi-users',
                                            routerLink: '/formateur/etudiants'
                                        },
                                        /*{ 
                                            label: 'Gestions des devoirs', 
                                            icon: 'pi pi-book', 
                                            routerLink: 'devoirs' 
                                        }*/
                                    ]
                                }
                            ]
                        },
                        error: function (error: any) { console.log(error) },
                        complete: () => {
                            console.log("Informations du formateur récupérer avec succès !");
                        },
                    })
                }

                /* end menus internes */

                /* menus externes */
                // menu ceo entreprise
                if (response.type === 'CEO Entreprise' && response.role === 'user') {
                    this.items = [
                        {
                            label: 'Accueil',
                            icon: 'pi pi-fw pi-home',
                            items: [
                                {
                                    label: 'Tableau de bord',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/']
                                },
                                {
                                    label: 'Tuteurs',
                                    icon: 'pi pi-users',
                                    routerLink: ['/tuteur-ceo']
                                },
                            ]
                        },
                        {
                            label: 'Ticketing',
                            icon: 'pi pi-ticket',
                            items: [

                                {
                                    label: 'Mes tickets',
                                    icon: 'pi pi-ticket',
                                    routerLink: ['/suivi-ticket']
                                },

                            ]
                        },
                        {
                            label: "Alternance",
                            icon: 'pi pi-briefcase',
                            items: [
                                {
                                    label: 'Alternants par entreprises',
                                    icon: 'pi pi-file',
                                    routerLink: ['/liste-entreprises-ceo']
                                },
                                {
                                    label: 'Alternants sous ma tutelle',
                                    icon: 'pi pi-file-excel',
                                    routerLink: ['/liste-contrats-ceo/']
                                },
                            ]
                        },
                        {
                            label: "Stage",
                            icon: 'pi pi-briefcase',
                            items: [
                                {
                                    label: 'Stage par entreprises',
                                    icon: 'pi pi-file',
                                    routerLink: [`/stages/${this.token.id}`]
                                },
                                {
                                    label: 'Stage sous ma tutelle',
                                    icon: 'pi pi-file-excel',
                                    // routerLink: ['/liste-contrats-ceo/']
                                },
                            ]
                        },
                        {
                            label: 'SkillsNet',
                            icon: 'pi pi-star',
                            items: [
                                {
                                    label: 'Offres',
                                    icon: 'pi pi-volume-up',
                                    routerLink: ['/offres']
                                },
                                {
                                    label: 'Mes offres',
                                    icon: 'pi pi-user',
                                    routerLink: ['/mes-offres']
                                },
                                {
                                    label: 'Cvthèque',
                                    icon: 'pi pi-briefcase',
                                    routerLink: ['/cvtheque']
                                },
                            ]
                        },
                    ]
                }
                /*end menus externes */
            },
            error: (error: any) => {
                console.log(error);
            },
            complete: () => { console.log("Récupération des infos du user connecté réussi"); }
        });

    }
}
