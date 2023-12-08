import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import jwt_decode from 'jwt-decode';
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
import { AdmissionService } from './services/admission.service';
import { LeadcrmService } from './services/crm/leadcrm.service';
import { MemberCRM } from './models/memberCRM';
import { TeamsCrmService } from './services/crm/teams-crm.service';
import { CandidatureLeadService } from './services/candidature-lead.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-menu',
    template: `
        <div class="nav-burger">
            <a class="p-link layout-menu-button layout-topbar-button" href="#" (click)="appMain.toggleMenu($event)">
                <i class="pi pi-bars"></i>
            </a>
        </div>
        <p-panelMenu [model]="items" *ngIf="showMenu" [style]='{"overflow-x": "hidden","overflow-y": "auto","height":"85vh"}'></p-panelMenu>
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
    `,
})
export class AppMenuComponent implements OnInit {
    token: any;
    items: MenuItem[] = [
        {
            label: 'Espace Personnel',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/'],
        },
        {
            label: 'iMatch',
            icon: 'pi pi-star',
            items: [
                {
                    label: 'Offres',
                    icon: 'pi pi-volume-up',
                    routerLink: ['/skillsnet/offres'],
                },
                {
                    label: 'CV',
                    icon: 'pi pi-volume-up',
                    routerLink: ['/i-match/cv-etudiant'],
                }
            ],
        },
        /*{
            label: 'Signaler un problème technique',
            icon: 'pi pi-fw pi-exclamation-triangle',
            routerLink: ['/ticketing-igs'],
        },*/
    ]
    showMenu = false
    constructor(public appMain: AppMainComponent, private userService: AuthService, private ETUService: EtudiantService,
        private FService: FormateurService, private CService: CommercialPartenaireService, private TCService: TeamCommercialService,
        private AdmissionService: AdmissionService, private TeamCRMService: TeamsCrmService, private CandidatureService: CandidatureLeadService,
        private router: Router) { }

    ngOnInit() {
        //Decoder le token
        this.showMenu = false;
        this.token = jwt_decode(localStorage.getItem('token'));
        if (localStorage.getItem('parentSelected'))
            this.parentSelected = JSON.parse(localStorage.getItem("parentSelected"));
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
                            label: 'Espace Personnel',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/'],
                        },
                    ];
                }
                // menu service pédagogique
                else if (
                    response.role === 'Agent' &&
                    service_id?.label === 'Pédagogie'
                ) {
                    this.items = [
                        {
                            label: 'Espace Personnel',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/'],
                        },
                        /*{
                            label: 'Signaler un problème technique',
                            icon: 'pi pi-fw pi-exclamation-triangle',
                            routerLink: ['/ticketing-igs'],
                        },*/
                        /*{
                            label: 'Ticketing - Ancienne Version',
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
                            ],
                        },*/
                        /*{
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
                            ],
                        },*/
                        {
                            label: 'Pédagogie',
                            icon: 'pi pi-fw pi-folder',
                            items: [
                                {
                                    label: 'Gestion des modules',
                                    icon: 'pi pi-fw pi-tags',
                                    routerLink: ['/pedagogie/matieres'],
                                },
                                {
                                    label: 'Gestion des groupes',
                                    icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'Ajouter un groupe',
                                            icon: 'pi pi-plus-circle',
                                            routerLink: ['/ajout-groupe'],
                                        },
                                        {
                                            label: 'Liste des groupes',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/groupes'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Gestions des séances',
                                    icon: 'pi pi-video',
                                    items: [
                                        {
                                            label: 'Ajouter une séance',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/pedagogie/ajout-seance'],
                                        },
                                        {
                                            label: 'Voir la liste des séances',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/pedagogie/seances'],
                                        },
                                        {
                                            label: "Voir l'emploi du temps des séances",
                                            icon: 'pi pi-calendar',
                                            routerLink: ['/pedagogie/emploi-du-temps'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Gestions des formateurs',
                                    icon: 'pi pi-id-card',
                                    items: [
                                        {
                                            label: 'Ajouter un formateur',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/pedagogie/ajout-formateur'],
                                        },
                                        {
                                            label: 'Liste des formateurs',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/pedagogie/formateurs'],
                                        },
                                    ],
                                },
                                {
                                    label: "Gestion des inscrits en attente d'assignation",
                                    icon: 'pi pi-user-plus',
                                    routerLink: ['/pedagogie/assignation-inscrit'],
                                },
                                {
                                    label: 'Gestions des étudiants',
                                    icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'Ajouter un étudiant',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/pedagogie/ajout-etudiant'],
                                        },
                                        {
                                            label: 'Liste des étudiants',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['pedagogie/etudiants'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Gestions des évaluations',
                                    icon: 'pi pi-copy',
                                    items: [
                                        {
                                            label: 'Ajouter une évaluation',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/pedagogie/ajout-examen'],
                                        },
                                        {
                                            label: 'Liste des évaluations',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/pedagogie/examens'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Gestions des Bulletins de notes',
                                    icon: 'pi pi-pencil',
                                    routerLink: ['/notes'],
                                },
                                {
                                    label: 'Gestions des devoirs',
                                    icon: 'pi pi-book',
                                    routerLink: 'devoirs',
                                },
                            ],
                        },
                        /*{
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
                                            routerLink: ['/skillsnet/ajout-entreprise'],
                                        },
                                        {
                                            label: 'Liste des entreprises',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/pedagogie/entreprises'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Gestion des tuteurs',
                                    icon: 'pi pi-user',
                                    routerLink: ['//pedagogie/tuteur'],
                                },
                                {
                                    label: 'Placement',
                                    icon: 'pi pi-star',
                                    items: [
                                        {
                                            label: 'Alternances',
                                            icon: 'pi pi-list',
                                            routerLink: ['/pedagogie/liste-contrats'],
                                        },
                                        {
                                            label: 'Stages',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/stages'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Gestion des équipes de conseillers',
                                    icon: 'pi pi-users',
                                    routerLink: ['/equipe-commercial'],
                                },
                                {
                                    label: 'Gestion des leads alternables',
                                    icon: 'pi pi-briefcase',
                                    routerLink: ['/prospects-alt'],
                                },
                                {
                                    label: 'Ajouter un dossier',
                                    icon: 'pi pi-user-plus',
                                    routerLink: ['/ajout-lead'],
                                },
                            ],
                        },*/
                        {
                            label: 'Questionnaire',
                            icon: 'pi pi-sort-alpha-down',
                            items: [
                                {
                                    label: 'Questionnaire satisfaction',
                                    icon: 'pi pi-heart',
                                    routerLink: ['/pedagogie/resultat-qs'],
                                },
                                {
                                    label: 'Questionnaire formateur',
                                    icon: 'pi pi-briefcase',
                                    routerLink: ['/pedagogie/resultat-qf'],
                                },
                                {
                                    label: 'Questionnaire fin de formation',
                                    icon: 'pi pi-check-circle',
                                    routerLink: ['pedagogie/resultat-qff'],
                                },
                            ],
                        },
                    ];
                }
                // menu service admission
                else if (
                    response.role === 'Agent' &&
                    service_id?.label === 'Admission'
                ) {
                    this.items = [
                        {
                            label: 'Espace Personnel',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/'],
                        },
                        /*{
                            label: 'Signaler un problème technique',
                            icon: 'pi pi-fw pi-exclamation-triangle',
                            routerLink: ['/ticketing-igs'],
                        },
                        {
                            label: 'Ticketing - Ancienne Version',
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
                            ],
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
                            ],
                        },*/
                        {
                            label: 'Admission',
                            icon: 'pi pi-fw pi-check-circle',
                            items: [
                                {
                                    label: 'Gestions des leads',
                                    icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'En attente de traitement',
                                            icon: 'pi pi-spin pi-spinner',
                                            routerLink: [
                                                '/gestion-preinscriptions-filtered/En attente de traitement',
                                            ],
                                        },
                                        {
                                            label: 'Dossiers traités',
                                            icon: 'pi pi-check-circle',
                                            routerLink: [
                                                '/gestion-preinscriptions-filter/traite',
                                            ],
                                        },
                                        {
                                            label: 'Ajouter un dossier',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-lead'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Dashboard',
                                    icon: 'pi pi-users',
                                    routerLink: ['/gestion-preinscriptions'],
                                },
                                {
                                    label: 'Gestions des leads Intuns',
                                    icon: 'pi pi-user-plus',
                                    routerLink: ['/prospects-intuns'],
                                },
                                {
                                    label: 'Gestion des participantes pour les événements',
                                    icon: 'pi pi-users',
                                    routerLink: ['/list-events'],
                                },
                            ],
                        },

                    ];
                }
                // menu service administration
                else if (
                    response.role === 'Agent' &&
                    service_id?.label === 'Administration'
                ) {
                    this.items = [
                        {
                            label: 'Espace Personnel',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/'],
                        },
                        /*{
                            label: 'Signaler un problème technique',
                            icon: 'pi pi-fw pi-exclamation-triangle',
                            routerLink: ['/ticketing-igs'],
                        },
                        {
                            label: 'Ticketing - Ancienne Version',
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
                            ],
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
                            ],
                        },*/
                        {
                            label: 'Administration',
                            icon: 'pi pi-fw pi-inbox',
                            items: [
                                {
                                    label: 'Gestions des années scolaires',
                                    icon: 'pi pi-calendar',
                                    items: [
                                        {
                                            label: 'Ajouter une année scolaire',
                                            icon: 'pi pi-calendar-plus',
                                            routerLink: [
                                                '/ajout-annee-scolaire',
                                            ],
                                        },
                                        {
                                            label: 'Liste des années scolaires',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/annee-scolaire'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Gestions des écoles',
                                    icon: 'pi pi-home',
                                    items: [
                                        {
                                            label: 'Ajouter une école',
                                            icon: 'pi pi-plus-circle',
                                            routerLink: ['/ajout-ecole'],
                                        },
                                        {
                                            label: 'Liste des écoles',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/ecole'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Gestions des campus',
                                    icon: 'pi pi-home',
                                    items: [
                                        {
                                            label: 'Ajouter un campus',
                                            icon: 'pi pi-plus-circle',
                                            routerLink: ['/ajout-campus'],
                                        },
                                        {
                                            label: 'Liste des campus',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/campus'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Gestions des diplômes',
                                    icon: 'pi pi-bookmark',
                                    items: [
                                        {
                                            label: 'Ajouter un diplôme',
                                            icon: 'pi pi-plus-circle',
                                            routerLink: ['/ajout-diplome'],
                                        },
                                        {
                                            label: 'Liste des diplômes',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/diplomes'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Gestions des agents',
                                    icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'Ajouter un agent',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/admin/ajout-agent'],
                                        },
                                        {
                                            label: 'Liste des agents',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/admin/agents'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Validation des inscrits',
                                    icon: 'pi pi-check-square',
                                    routerLink: ['/validation-inscrit'],
                                },
                            ],
                        },
                        {
                            label: 'Pédagogie',
                            icon: 'pi pi-fw pi-folder',
                            items: [
                                {
                                    label: 'Gestions des étudiants',
                                    icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'Liste des étudiants',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['pedagogie/etudiants'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Gestion des groupes',
                                    icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'Ajouter un groupe',
                                            icon: 'pi pi-plus-circle',
                                            routerLink: ['/ajout-groupe'],
                                        },
                                        {
                                            label: 'Liste des groupes',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/groupes'],
                                        },
                                    ],
                                },
                            ],
                        },
                    ];
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
                                        //{ label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                                        { label: 'Tableau de bord Commercial', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard/commercial'] }
                                    ]
                                },
                                /*{
                                    label: 'Signaler un problème technique',
                                    icon: 'pi pi-fw pi-exclamation-triangle',
                                    routerLink: ['/ticketing-igs'],
                                },*/
                                {
                                    label: 'Leads',
                                    items: [
                                        { label: 'Insérer un lead', icon: 'pi pi-user-plus', routerLink: ['/ajout-lead'] },
                                        { label: 'Liste des Leads', icon: 'pi pi-users', routerLink: ['international/partenaire/', cData?.code_commercial_partenaire] },
                                    ]
                                },
                                {
                                    label: 'Alternants',
                                    items: [
                                        { label: 'Insérer un alternant', icon: 'pi pi-user-plus', routerLink: ['/international/partenaire/ajout-alternant/', cData?.code_commercial_partenaire] },
                                        { label: 'Liste des alternants', icon: 'pi pi-users', routerLink: ['/international/partenaire/alternants/', cData.code_commercial_partenaire] },
                                    ]
                                },
                                {
                                    label: 'Commercials',
                                    items: [
                                        //{ label: 'Insérer un collaborateur', icon: 'pi pi-user-plus', routerLink: ['/ajout-collaborateur'] },
                                        { label: 'Liste des Commercials', icon: 'pi pi-users', routerLink: ['collaborateur', cData.partenaire_id] },
                                    ]
                                },

                                /*{
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
                            },*/
                                {
                                    label: 'Support Marketing',
                                    icon: 'pi pi-briefcase',
                                    routerLink: [
                                        '/international/brands',
                                        cData.partenaire_id,
                                    ],
                                },
                                {
                                    label: 'Effectuer un paiement',
                                    icon: 'pi pi-dollar',
                                },
                                //{ label: 'Dashboard', icon: 'pi pi-chart-line', routerLink: ['/dashboard/partenaire', cData.partenaire_id] },
                                {
                                    label: 'Actualités',
                                    icon: 'pi pi-exclamation-circle',
                                    routerLink: [
                                        '/international/actualite',
                                    ],
                                },
                            ];
                        } else if (cData) {
                            //Commercial considéré Admin dans son Partenaire
                            this.items = [
                                {
                                    label: 'Accueil',
                                    items: [
                                        {
                                            label: 'Espace Personnel',
                                            icon: 'pi pi-fw pi-home',
                                            routerLink: ['/'],
                                        },
                                        {
                                            label: 'Tableau de bord Commercial',
                                            icon: 'pi pi-fw pi-home',
                                            routerLink: [
                                                '/dashboard/commercial',
                                            ],
                                        },
                                    ],
                                },
                                {
                                    label: 'Leads',
                                    items: [
                                        {
                                            label: 'Insérer un lead',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-lead'],
                                        },
                                        {
                                            label: 'Liste des Leads',
                                            icon: 'pi pi-users',
                                            routerLink: [
                                                'international/partenaire/',
                                                cData.partenaire_id,
                                            ],
                                        },
                                    ],
                                },
                                {
                                    label: 'Alternants',
                                    items: [
                                        {
                                            label: 'Insérer un alternant',
                                            icon: 'pi pi-user-plus',
                                            routerLink: [
                                                '/international/partenaire/ajout-alternant/',
                                                cData?.code_commercial_partenaire,
                                            ],
                                        },
                                        {
                                            label: 'Liste des alternants',
                                            icon: 'pi pi-users',
                                            routerLink: [
                                                '/international/partenaire/alternants/',
                                                cData.partenaire_id,
                                            ],
                                        },
                                    ],
                                },
                                {
                                    label: 'Commercials',
                                    items: [
                                        {
                                            label: 'Insérer un commercial',
                                            icon: 'pi pi-user-plus',
                                            routerLink: [
                                                '/ajout-collaborateur',
                                                cData.partenaire_id,
                                            ],
                                        },
                                        {
                                            label: 'Liste des Commercials',
                                            icon: 'pi pi-users',
                                            routerLink: [
                                                'collaborateur',
                                                cData.partenaire_id,
                                            ],
                                        },
                                    ],
                                },

                                {
                                    label: 'Gestion des commissions',
                                    icon: 'pi pi-credit-card',
                                    items: [
                                        {
                                            label: 'Ventes',
                                            icon: 'pi pi-shopping-cart',
                                            routerLink: [
                                                '/commissions/ventes',
                                                cData.partenaire_id,
                                            ],
                                        },
                                        {
                                            label: 'Réglement',
                                            icon: 'pi pi-shopping-cart',
                                            routerLink: [
                                                '/commissions/reglement',
                                                cData.partenaire_id,
                                            ],
                                        },
                                    ],
                                },
                                {
                                    label: 'Support Marketing',
                                    icon: 'pi pi-briefcase',
                                    routerLink: [
                                        '/international/brands',
                                        cData.partenaire_id,
                                    ],
                                },
                                {
                                    label: 'Effectuer un paiement',
                                    icon: 'pi pi-dollar',
                                },
                                {
                                    label: 'Dashboard',
                                    icon: 'pi pi-chart-line',
                                    routerLink: [
                                        '/dashboard/partenaire',
                                        cData.partenaire_id,
                                    ],
                                },
                                {
                                    label: 'Actualités',
                                    icon: 'pi pi-exclamation-circle',
                                    routerLink: [
                                        '/international/actualite',
                                    ],
                                },
                            ];
                        } else {
                            this.items = [
                                {
                                    label: 'Accueil',
                                    items: [
                                        {
                                            label: 'Espace Personnel',
                                            icon: 'pi pi-fw pi-home',
                                            routerLink: ['/'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Leads',
                                    items: [
                                        {
                                            label: 'Insérer un lead',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-lead'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Effectuer un paiement',
                                    icon: 'pi pi-dollar',
                                },
                                {
                                    label: 'Actualités',
                                    icon: 'pi pi-exclamation-circle',
                                    routerLink: [
                                        '/international/actualite',
                                    ],
                                },
                            ];
                        }
                    }
                    );
                }

                // menu service commerciale INTERNE
                else if (
                    response.role === 'Agent' &&
                    service_id?.label === 'Commercial'
                ) {
                    this.items = [
                        {
                            label: 'Espace Personnel',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/'],
                        },
                        /*{
                            label: 'Signaler un problème technique',
                            icon: 'pi pi-fw pi-exclamation-triangle',
                            routerLink: ['/ticketing-igs'],
                        },
                        {
                            label: 'Ticketing - Ancienne Version',
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
                            ],
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
                            ],
                        },*/
                        {
                            label: 'Pédagogie',
                            icon: 'pi pi-fw pi-folder',
                            items: [
                                {
                                    label: 'Gestions des étudiants',
                                    icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'Ajouter un étudiant',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/pedagogie/ajout-etudiant'],
                                        },
                                        {
                                            label: 'Liste des étudiants',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['pedagogie/etudiants'],
                                        },
                                    ],
                                },
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
                                            routerLink: ['/skillsnet/ajout-entreprise'],
                                        },
                                        {
                                            label: 'Liste des entreprises',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/pedagogie/entreprises'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Gestion des tuteurs',
                                    icon: 'pi pi-user',
                                    routerLink: ['//pedagogie/tuteur'],
                                },
                                {
                                    label: 'Placement',
                                    icon: 'pi pi-star',
                                    items: [
                                        {
                                            label: 'Alternances',
                                            icon: 'pi pi-list',
                                            routerLink: ['/pedagogie/liste-contrats'],
                                        },
                                        {
                                            label: 'Stages',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/stages'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Gestion des équipes de conseillers',
                                    icon: 'pi pi-users',
                                    routerLink: ['/equipe-commercial'],
                                },
                                {
                                    label: 'Gestion des leads alternables',
                                    icon: 'pi pi-briefcase',
                                    routerLink: ['/prospects-alt'],
                                },
                                {
                                    label: 'Ajouter un dossier',
                                    icon: 'pi pi-user-plus',
                                    routerLink: ['/ajout-lead'],
                                },
                            ],
                        } /*

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
                                    , routerLink: ['/international/brands']
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
                                    , routerLink: ['/dashboard/partenaire']
                                }, { label: "Actualités", icon: 'pi pi-exclamation-circle', routerLink: ['/international/actualite'] },
                            ]
                        },
                        *//*,

                        {
                            label: 'iMatch',
                            icon: 'pi pi-star',
                            items: [
                                {
                                    label: "Offres",
                                    icon: 'pi pi-volume-up',
                                    routerLink: ['/skillsnet/offres'],
                                },
                                {
                                    label: 'Mes offres',
                                    icon: 'pi pi-user',
                                    routerLink: ['/skillsnet/mes-offres'],
                                },
                                {
                                    label: 'Cvthèque',
                                    icon: 'pi pi-briefcase',
                                    routerLink: ['/i-match/cvtheque-interne']
                                },
                                {
                                    label: 'Gestion des compétences',
                                    icon: 'pi pi-book',
                                    routerLink: ['/skillsnet/skills-management'],
                                },
                                {
                                    label: 'Gestions des externes',
                                    icon: 'pi pi-users',
                                    routerLink: ['/i-match/externe'],
                                },
                                {
                                    label: 'Gestions des événements',
                                    icon: 'pi pi-flag',
                                    routerLink: ['/skillsnet/evenements'],
                                },
                                {
                                    label: 'Cvthèque Externe',
                                    icon: 'pi pi-briefcase',
                                    routerLink: ['/imatch'],
                                },
                                {
                                    label: 'Rendez-vous',
                                    icon: 'pi pi-calendar',
                                    routerLink: ['/imatch/rendez-vous']
                                }
                            ],
                        },*/
                    ];
                }
                // menu service RH
                else if (
                    response.role === 'Agent' &&
                    service_id?.label === 'Ressources Humaines'
                ) {
                    this.items = [
                        {
                            label: 'Espace Personnel',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/'],
                        },
                        /*{
                            label: 'Signaler un problème technique',
                            icon: 'pi pi-fw pi-exclamation-triangle',
                            routerLink: ['/ticketing-igs'],
                        },
                        {
                            label: 'Ticketing - Ancienne Version',
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
                            ],
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
                            ],
                        }*/
                    ];
                }
                // menu service support informatique
                else if (
                    response.role === 'Agent' &&
                    service_id?.label === 'Support Informatique'
                ) {
                    this.items = [
                        {
                            label: 'Espace Personnel',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/'],
                        },
                        /*{
                            label: 'Signaler un problème technique',
                            icon: 'pi pi-fw pi-exclamation-triangle',
                            routerLink: ['/ticketing-igs'],
                        },*/
                        /*{
                            label: 'Ticketing - Ancienne Version',
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
                            ],
                        },*/
                        /*{
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
                            ],
                        },*/
                        {
                            label: 'Pédagogie',
                            icon: 'pi pi-fw pi-folder',
                            items: [
                                {
                                    label: "Gestion des inscrits en attente d'assignation",
                                    icon: 'pi pi-user-plus',
                                    routerLink: ['/pedagogie/assignation-inscrit'],
                                },
                            ],
                        },
                        {
                            label: 'Administration',
                            icon: 'pi pi-fw pi-inbox',
                            items: [
                                {
                                    label: 'Validation des inscrits',
                                    icon: 'pi pi-check-square',
                                    routerLink: ['/validation-inscrit'],
                                },
                            ],
                        },
                    ];
                }
                /* end menus salariés*/

                /* menus alternants intedgroup */
                // menu alternant admin
                if (
                    response.role === 'Admin' &&
                    response.type === 'Alternant'
                ) {
                    this.ETUService.getByUser_id(this.token.id).subscribe({
                        next: (dataEtu: Etudiant) => {
                            this.items = [
                                {
                                    label: 'Espace Personnel',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/'],
                                },
                                /*{
                                    label: 'Signaler un problème technique',
                                    icon: 'pi pi-fw pi-exclamation-triangle',
                                    routerLink: ['/ticketing-igs'],
                                },*/
                                /*{
                                    label: 'Ticketing - Ancienne Version',
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
                                            routerLink: [
                                                '/admin/gestion-services',
                                            ],
                                        },
                                    ],
                                },*/
                                /*{
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
                                    ],
                                },*/
                                {
                                    label: 'Ressources humaines',
                                    icon: 'pi pi-fw pi-users',
                                    items: [
                                        {
                                            label: 'Gestion des ressources humaines',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: [
                                                '/gestion-des-ressources-humaines',
                                            ],
                                        },
                                    ],
                                },
                                {
                                    label: 'Pédagogie',
                                    icon: 'pi pi-fw pi-folder',
                                    items: [
                                        {
                                            label: 'Gestion des groupes',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Ajouter un groupe',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: [
                                                        '/ajout-groupe',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des groupes',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/groupes'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestion des modules',
                                            icon: 'pi pi-fw pi-tags',
                                            routerLink: ['/pedagogie/matieres'],
                                        },
                                        {
                                            label: 'Gestions des séances',
                                            icon: 'pi pi-video',
                                            items: [
                                                {
                                                    label: 'Ajouter une séance',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: [
                                                        '/pedagogie/ajout-seance',
                                                    ],
                                                },
                                                {
                                                    label: 'Voir la liste des séances',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/pedagogie/seances'],
                                                },
                                                {
                                                    label: "Voir l'emploi du temps des séances",
                                                    icon: 'pi pi-calendar',
                                                    routerLink: [
                                                        '/pedagogie/emploi-du-temps',
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des formateurs',
                                            icon: 'pi pi-id-card',
                                            items: [
                                                {
                                                    label: 'Ajouter un formateur',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: [
                                                        '/pedagogie/ajout-formateur',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des formateurs',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/pedagogie/formateurs'],
                                                },
                                            ],
                                        },
                                        {
                                            label: "Gestion des inscrits en attente d'assignation",
                                            icon: 'pi pi-user-plus',
                                            routerLink: [
                                                '/pedagogie/assignation-inscrit',
                                            ],
                                        },
                                        {
                                            label: 'Gestions des étudiants',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Ajouter un étudiant',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: [
                                                        '/pedagogie/ajout-etudiant',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des étudiants',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['pedagogie/etudiants'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des évaluations',
                                            icon: 'pi pi-copy',
                                            items: [
                                                {
                                                    label: 'Ajouter une évaluation',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: [
                                                        '/pedagogie/ajout-examen',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des évaluations',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/pedagogie/examens'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des Bulletins de notes',
                                            icon: 'pi pi-pencil',
                                            routerLink: ['/notes'],
                                        },
                                        {
                                            label: 'Gestions des devoirs',
                                            icon: 'pi pi-book',
                                            routerLink: 'devoirs',
                                        },
                                    ],
                                },
                                {
                                    label: 'Administration',
                                    icon: 'pi pi-fw pi-inbox',
                                    items: [
                                        {
                                            label: 'Gestions des années scolaires',
                                            icon: 'pi pi-calendar',
                                            items: [
                                                {
                                                    label: 'Ajouter une année scolaire',
                                                    icon: 'pi pi-calendar-plus',
                                                    routerLink: [
                                                        '/ajout-annee-scolaire',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des années scolaires',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: [
                                                        '/annee-scolaire',
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des écoles',
                                            icon: 'pi pi-home',
                                            items: [
                                                {
                                                    label: 'Ajouter une école',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: [
                                                        '/ajout-ecole',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des écoles',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/ecole'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des campus',
                                            icon: 'pi pi-home',
                                            items: [
                                                {
                                                    label: 'Ajouter un campus',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: [
                                                        '/ajout-campus',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des campus',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/campus'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des diplômes',
                                            icon: 'pi pi-bookmark',
                                            items: [
                                                {
                                                    label: 'Ajouter un diplôme',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: [
                                                        '/ajout-diplome',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des diplômes',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/diplomes'],
                                                },
                                            ],
                                        },

                                        {
                                            label: 'Gestions des agents',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Ajouter un agent',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: [
                                                        '/admin/ajout-agent',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des agents',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: [
                                                        '/admin/agents',
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Validation des inscrits',
                                            icon: 'pi pi-check-square',
                                            routerLink: ['/validation-inscrit'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Admission',
                                    icon: 'pi pi-fw pi-check-circle',
                                    items: [
                                        {
                                            label: 'Gestions des leads',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'En attente de traitement',
                                                    icon: 'pi pi-spin pi-spinner',
                                                    routerLink: [
                                                        '/gestion-preinscriptions-filtered/En attente de traitement',
                                                    ],
                                                },
                                                {
                                                    label: 'Dossiers traités',
                                                    icon: 'pi pi-check-circle',
                                                    routerLink: [
                                                        '/gestion-preinscriptions-filter/traite',
                                                    ],
                                                },
                                                {
                                                    label: 'Ajouter un dossier',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/ajout-lead'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Dashboard',
                                            icon: 'pi pi-users',
                                            routerLink: [
                                                '/gestion-preinscriptions',
                                            ],
                                        },
                                        {
                                            label: 'Gestions des leads Intuns',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/leads-intuns'],
                                        },
                                        {
                                            label: 'Gestion des participantes pour les événements',
                                            icon: 'pi pi-users',
                                            routerLink: ['/list-events'],
                                        },
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
                                                    routerLink: [
                                                        '/skillsnet/ajout-entreprise',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des entreprises',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: [
                                                        '/pedagogie/entreprises',
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestion des tuteurs',
                                            icon: 'pi pi-user',
                                            routerLink: ['//pedagogie/tuteur'],
                                        },
                                        {
                                            label: 'Placement',
                                            icon: 'pi pi-star',
                                            items: [
                                                {
                                                    label: 'Alternances',
                                                    icon: 'pi pi-list',
                                                    routerLink: [
                                                        '/pedagogie/liste-contrats',
                                                    ],
                                                },
                                                {
                                                    label: 'Stages',
                                                    icon: 'pi pi-briefcase',
                                                    routerLink: ['/stages'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestion des équipes de conseillers',
                                            icon: 'pi pi-users',
                                            routerLink: ['/equipe-commercial'],
                                        },
                                        {
                                            label: 'Gestion des leads alternables',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/leads-alt'],
                                        },
                                        {
                                            label: 'Ajouter un dossier',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-lead'],
                                        },
                                    ],
                                } /*
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
                                            , routerLink: ['/international/brands']
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
                                            icon: 'pi pi-chart-line',
                                            routerLink: ['/dashboard/partenaire']
                                        }, { label: "Actualités", icon: 'pi pi-exclamation-circle', routerLink: ['/international/actualite'] },
                                    ]
                                },*/,
                                /*{
                                    label: 'iMatch',
                                    icon: 'pi pi-star',
                                    items: [
                                        {
                                            label: "Offres",
                                            icon: 'pi pi-volume-up',
                                            routerLink: ['/skillsnet/offres'],
                                        },
                                        {
                                            label: 'Mes offres',
                                            icon: 'pi pi-user',
                                            routerLink: ['/skillsnet/mes-offres'],
                                        },
                                        {
                                            label: 'Cvthèque',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/i-match/cvtheque-interne']
                                        },
                                        {
                                            label: 'Gestion des compétences',
                                            icon: 'pi pi-book',
                                            routerLink: ['/skillsnet/skills-management'],
                                        },
                                        {
                                            label: 'Gestions des externes',
                                            icon: 'pi pi-users',
                                            routerLink: ['/i-match/externe'],
                                        },
                                        {
                                            label: 'Gestions des événements',
                                            icon: 'pi pi-flag',
                                            routerLink: ['/skillsnet/evenements'],
                                        },
                                        {
                                            label: 'Cvthèque Externe',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/imatch'],
                                        },
                                        {
                                            label: 'Rendez-vous',
                                            icon: 'pi pi-calendar',
                                            routerLink: ['/imatch/rendez-vous']
                                        }
                                    ],
                                },*/
                                /*{
                                    label: 'Booking',
                                    icon: 'pi pi-building',
                                    items: [
                                        {
                                            label: 'Logements',
                                            icon: 'pi pi-home',
                                            routerLink: ['/logements'],
                                        },
                                        {
                                            label: 'Gestion des reservations',
                                            icon: 'pi pi-bookmark',
                                            routerLink: [
                                                '/gestion-reservations',
                                            ],
                                        },
                                    ],
                                },
                                {
                                    label: 'Finance',
                                    icon: 'pi pi-money-bill',
                                    items: [
                                        {
                                            label: 'Gestion des factures des formateurs',
                                            icon: 'pi pi-user-edit',
                                            routerLink: ['/facture-formateur'],
                                        },
                                    ],
                                },*/
                                {
                                    label: 'Questionnaire',
                                    icon: 'pi pi-sort-alpha-down',
                                    items: [
                                        {
                                            label: 'Questionnaire satisfaction',
                                            icon: 'pi pi-heart',
                                            routerLink: ['/pedagogie/resultat-qs'],
                                        },
                                        {
                                            label: 'Questionnaire formateur',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/pedagogie/resultat-qf'],
                                        },
                                        {
                                            label: 'Questionnaire fin de formation',
                                            icon: 'pi pi-check-circle',
                                            routerLink: ['pedagogie/resultat-qff'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Étudiant',
                                    icon: 'pi pi-chart-pie',
                                    items: [
                                        {
                                            label: 'Emploi du temps',
                                            icon: 'pi pi-calendar',
                                            routerLink:
                                                'pedagogie/emploi-du-temps/classe/' +
                                                dataEtu.classe_id,
                                        },
                                        /*{
                                            label: 'Booking - Logements',
                                            icon: 'pi pi-home',
                                            routerLink: ['/logements'],
                                        },*/
                                        {
                                            label: 'Assiduité',
                                            icon: 'pi pi-check-square',
                                            routerLink:
                                                'pedagogie/details/' + dataEtu._id,
                                        },
                                    ],
                                },
                            ];
                        },
                        error: (error: any) => {
                            console.error(error);
                        },
                        complete: () => {
                            console.log(
                                "Informations de l'étudiant récupérer avec succès !"
                            );
                        },
                    });
                } else if (response.role === "Admin" && response.type == "Formateur") {
                    this.FService.getByUserId(this.token.id).subscribe({
                        next: (dataF: Formateur) => {
                            this.items = [
                                {
                                    label: 'Espace Personnel',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/'],
                                },
                                /*{
                                    label: 'Signaler un problème technique',
                                    icon: 'pi pi-fw pi-exclamation-triangle',
                                    routerLink: ['/ticketing-igs'],
                                },*/
                                /*{
                                    label: 'Ticketing - Ancienne Version',
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
                                    ],
                                },*/
                                /*{
                                    label: 'Ticketing',
                                    icon: 'pi pi-fw pi-ticket',
                                    items: [
                                        {
                                            label: 'Ajouter un ticket',
                                            icon: 'pi pi-plus',
                                            routerLink: ['/ticketing/gestion/ajout'],
                                        },
                                        {
                                            label: 'Mes tickets',
                                            icon: 'pi pi-inbox',
                                            routerLink: [
                                                '/ticketing/gestion/mes-tickets',
                                            ],
                                        },
                                        {
                                            label: 'Tickets assigné à moi',
                                            icon: 'pi pi-user',
                                            routerLink: ['/ticketing/gestion/assignes'],
                                        },
                                        {
                                            label: 'Gestion des tickets',
                                            icon: 'pi pi-fw pi-folder-open',
                                            items: [
                                                {
                                                    label: 'Tickets non assignés',
                                                    icon: 'pi pi-clock',
                                                    routerLink: [
                                                        '/ticketing/suivi/non-assignes',
                                                    ],
                                                },
                                                {
                                                    label: 'Tickets assignés - En attente de traitement',
                                                    icon: 'pi pi-inbox',
                                                    routerLink: [
                                                        '/ticketing/suivi/attente-de-traitement',
                                                    ],
                                                },
                                                {
                                                    label: 'Tickets traités',
                                                    icon: 'pi pi-check-circle',
                                                    routerLink: [
                                                        '/ticketing/suivi/traite',
                                                    ],
                                                },
                                                {
                                                    label: 'Tickets refusés',
                                                    icon: 'pi pi-check-circle',
                                                    routerLink: [
                                                        '/ticketing/suivi/refuse',
                                                    ],
                                                },
                                            ],
                                        },
                                        /*{
                                            label: 'Configuration',
                                            icon: 'pi pi-cog',
                                            routerLink: ['/ticketing/configuration'],
                                        },
                                        {
                                            label: 'Dashboard',
                                            icon: 'pi pi-home',
                                            routerLink: ['/ticketing/dashboard'],
                                        },
                                    ],
                                },*/
                                /*{
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
                                    ],
                                },*/
                                {
                                    label: 'Ressources humaines',
                                    icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'Les collaborateurs',
                                            icon: 'pi pi-users',
                                            routerLink: ['/rh/collaborateurs'],
                                        },
                                        {
                                            label: 'Gestion des congés, autorisations et absences',
                                            icon: 'pi pi-calendar',
                                            routerLink: ['/rh/conges-autorisations'],
                                        },
                                        {
                                            label: 'Actualité et notifications',
                                            icon: 'pi pi-tags',
                                            routerLink: ['/rh/actualite-notifications'],
                                        },
                                        {
                                            label: 'Gestion des demandes et reclamation',
                                            icon: 'pi pi-check-square',
                                            items: [
                                                {
                                                    label: 'Tickets non assignés',
                                                    icon: 'pi pi-clock',
                                                    routerLink: [
                                                        '/ticketing/suivi/non-assignes/Ressources Humaines',
                                                    ],
                                                },
                                                {
                                                    label: 'Tickets assignés - En attente de traitement',
                                                    icon: 'pi pi-inbox',
                                                    routerLink: [
                                                        '/ticketing/suivi/attente-de-traitement/Ressources Humaines',
                                                    ],
                                                },
                                                {
                                                    label: 'Tickets traités',
                                                    icon: 'pi pi-check-circle',
                                                    routerLink: [
                                                        '/ticketing/suivi/traite/Ressources Humaines',
                                                    ],
                                                },
                                                {
                                                    label: 'Tickets refusés',
                                                    icon: 'pi pi-check-circle',
                                                    routerLink: [
                                                        '/ticketing/suivi/refuse/Ressources Humaines',
                                                    ],
                                                },
                                            ]
                                        },
                                        {
                                            label: 'Calendrier',
                                            icon: 'pi pi-calendar',
                                            routerLink: ['/rh/calendrier'],
                                        },
                                        {
                                            label: 'DashBoard',
                                            icon: 'pi pi-home',
                                            routerLink: ['/rh/dashboard'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Pédagogie',
                                    icon: 'pi pi-fw pi-folder',
                                    items: [
                                        {
                                            label: 'Gestion des modules',
                                            icon: 'pi pi-fw pi-tags',
                                            routerLink: ['/pedagogie/matieres'],
                                        },
                                        {
                                            label: 'Gestion des groupes',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Ajouter un groupe',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: ['/ajout-groupe'],
                                                },
                                                {
                                                    label: 'Liste des groupes',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/groupes'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestion des séances',
                                            icon: 'pi pi-video',
                                            items: [
                                                {
                                                    label: 'Ajouter une séance',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/pedagogie/ajout-seance'],
                                                },
                                                {
                                                    label: 'Voir la liste des séances',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/pedagogie/seances'],
                                                },
                                                {
                                                    label: "Voir l'emploi du temps des séances",
                                                    icon: 'pi pi-calendar',
                                                    routerLink: ['/pedagogie/emploi-du-temps'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des formateurs',
                                            icon: 'pi pi-id-card',
                                            items: [
                                                {
                                                    label: 'Ajouter un formateur',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/pedagogie/ajout-formateur'],
                                                },
                                                {
                                                    label: 'Liste des formateurs',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/pedagogie/formateurs'],
                                                },
                                            ],
                                        },
                                        {
                                            label: "Gestion des inscrits en attente d'assignation",
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/pedagogie/assignation-inscrit'],
                                        },
                                        {
                                            label: 'Gestions des étudiants',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Ajouter un étudiant',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/pedagogie/ajout-etudiant'],
                                                },
                                                {
                                                    label: 'Liste des étudiants',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['pedagogie/etudiants'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des évaluations',
                                            icon: 'pi pi-copy',
                                            items: [
                                                {
                                                    label: 'Ajouter une évaluation',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/pedagogie/ajout-examen'],
                                                },
                                                {
                                                    label: 'Liste des évaluations',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/pedagogie/examens'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des Bulletins de notes',
                                            icon: 'pi pi-pencil',
                                            routerLink: ['/notes'],
                                        },
                                        {
                                            label: 'Gestions des devoirs',
                                            icon: 'pi pi-book',
                                            routerLink: 'devoirs',
                                        },
                                    ],
                                },
                                {
                                    label: 'Administration',
                                    icon: 'pi pi-fw pi-inbox',
                                    items: [
                                        {
                                            label: 'Gestions des années scolaires',
                                            icon: 'pi pi-calendar',
                                            items: [
                                                {
                                                    label: 'Ajouter une année scolaire',
                                                    icon: 'pi pi-calendar-plus',
                                                    routerLink: [
                                                        '/ajout-annee-scolaire',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des années scolaires',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/annee-scolaire'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des écoles',
                                            icon: 'pi pi-home',
                                            items: [
                                                {
                                                    label: 'Ajouter une école',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: ['/ajout-ecole'],
                                                },
                                                {
                                                    label: 'Liste des écoles',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/ecole'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des campus',
                                            icon: 'pi pi-home',
                                            items: [
                                                {
                                                    label: 'Ajouter un campus',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: ['/ajout-campus'],
                                                },
                                                {
                                                    label: 'Liste des campus',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/campus'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des diplômes',
                                            icon: 'pi pi-bookmark',
                                            items: [
                                                {
                                                    label: 'Ajouter un diplôme',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: ['/ajout-diplome'],
                                                },
                                                {
                                                    label: 'Liste des diplômes',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/diplomes'],
                                                },
                                            ],
                                        },

                                        {
                                            label: 'Gestions des agents',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Ajouter un agent',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/admin/ajout-agent'],
                                                },
                                                {
                                                    label: 'Liste des agents',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/admin/agents'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Validation des inscrits',
                                            icon: 'pi pi-check-square',
                                            routerLink: ['/validation-inscrit'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Admission',
                                    icon: 'pi pi-fw pi-check-circle',
                                    items: [
                                        {
                                            label: 'Gestions des Leads',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'En attente de traitement',
                                                    icon: 'pi pi-spin pi-spinner',
                                                    routerLink: [
                                                        '/gestion-preinscriptions-filtered/En attente de traitement',
                                                    ],
                                                },
                                                {
                                                    label: 'Dossiers traités',
                                                    icon: 'pi pi-check-circle',
                                                    routerLink: [
                                                        '/gestion-preinscriptions-filter/traite',
                                                    ],
                                                },
                                                {
                                                    label: 'Ajouter un dossier',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/ajout-lead'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Admission Dubai',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Nouvelle demande admission',
                                                    icon: 'pi pi-pencil',
                                                    routerLink: [
                                                        '/admission/dubai-form',
                                                    ],
                                                },
                                                {
                                                    label: "Liste des demandes d'admission",
                                                    icon: 'pi pi-file-excel',
                                                    routerLink: [
                                                        '/admission/dubai-form-results',
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Dashboard',
                                            icon: 'pi pi-users',
                                            routerLink: ['/gestion-preinscriptions'],
                                        },
                                        {
                                            label: 'Gestions des leads Intuns',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/prospects-intuns'],
                                        },
                                        {
                                            label: 'Gestion des participantes pour les événements',
                                            icon: 'pi pi-users',
                                            routerLink: ['/list-events'],
                                        },
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
                                                    routerLink: ['/skillsnet/ajout-entreprise'],
                                                },
                                                {
                                                    label: 'Liste des entreprises',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/pedagogie/entreprises'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestion des tuteurs',
                                            icon: 'pi pi-user',
                                            routerLink: ['//pedagogie/tuteur'],
                                        },
                                        {
                                            label: 'Placement',
                                            icon: 'pi pi-star',
                                            items: [
                                                {
                                                    label: 'Alternances',
                                                    icon: 'pi pi-list',
                                                    routerLink: ['/pedagogie/liste-contrats'],
                                                },
                                                {
                                                    label: 'Stages',
                                                    icon: 'pi pi-briefcase',
                                                    routerLink: ['/stages'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestion des équipes de conseillers',
                                            icon: 'pi pi-users',
                                            routerLink: ['/equipe-commercial'],
                                        },
                                        {
                                            label: 'Gestion des leads alternables',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/prospects-alt'],
                                        },
                                        {
                                            label: 'Ajouter un dossier',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-lead'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Partenaires',
                                    icon: 'pi pi-share-alt',
                                    items: [
                                        {
                                            label: 'Insérer ',
                                            icon: 'pi pi pi-user-plus',
                                            routerLink: ['/partenaireInscription'],
                                        },
                                        {
                                            label: 'Liste ',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/admin/partenaire'],
                                        },
                                        {
                                            label: 'Support Marketing',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/international/brands'],
                                        },
                                        {
                                            label: 'Gestion des commissions',
                                            icon: 'pi pi-credit-card',
                                            items: [
                                                {
                                                    label: 'Ventes',
                                                    icon: 'pi pi-shopping-cart',
                                                    routerLink: ['/commissions/ventes'],
                                                },
                                                {
                                                    label: 'Réglement',
                                                    icon: 'pi pi-shopping-cart',
                                                    routerLink: [
                                                        '/commissions/reglement',
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Dashboard',
                                            icon: 'pi pi-chart-line',
                                            routerLink: ['/dashboard/partenaire'],
                                        },
                                        {
                                            label: 'Actualités',
                                            icon: 'pi pi-exclamation-circle',
                                            routerLink: [
                                                '/international/actualite/editMode',
                                            ],
                                        },
                                    ],
                                },
                                /*{
                                    label: 'iMatch',
                                    icon: 'pi pi-star',
                                    items: [
                                        {
                                            label: "Offres",
                                            icon: 'pi pi-volume-up',
                                            routerLink: ['/skillsnet/offres'],
                                        },
                                        {
                                            label: 'Mes offres',
                                            icon: 'pi pi-user',
                                            routerLink: ['/skillsnet/mes-offres'],
                                        },
                                        {
                                            label: 'Cvthèque',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/i-match/cvtheque-interne']
                                        },
                                        {
                                            label: 'Gestion des compétences',
                                            icon: 'pi pi-book',
                                            routerLink: ['/skillsnet/skills-management'],
                                        },
                                        {
                                            label: 'Gestions des externes',
                                            icon: 'pi pi-users',
                                            routerLink: ['/i-match/externe'],
                                        },
                                        {
                                            label: 'Gestions des événements',
                                            icon: 'pi pi-flag',
                                            routerLink: ['/skillsnet/evenements'],
                                        },
                                        {
                                            label: 'Cvthèque Externe',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/imatch'],
                                        },
                                        {
                                            label: 'Rendez-vous',
                                            icon: 'pi pi-calendar',
                                            routerLink: ['/imatch/rendez-vous']
                                        }
                                    ],
                                },*/
                                /*{
                                    label: 'Booking',
                                    icon: 'pi pi-building',
                                    items: [
                                        {
                                            label: 'Logements',
                                            icon: 'pi pi-home',
                                            routerLink: ['/logements'],
                                        },
                                        {
                                            label: 'Gestion des reservations',
                                            icon: 'pi pi-bookmark',
                                            routerLink: ['/gestion-reservations'],
                                        },
                                    ],
                                },*/
                                {
                                    label: 'Booking',
                                    icon: ' pi pi-calendar',
                                    items: [
                                        {
                                            label: 'Configuration',
                                            icon: 'pi pi-cog',
                                            routerLink: ['booking/configuration'],
                                        },
                                        {
                                            label: 'Liste des demandes des rendez-vous',
                                            icon: 'pi pi-list',
                                        },
                                        {
                                            label: 'Assigné à moi',
                                            icon: 'pi pi-check-circle',
                                        },
                                        {
                                            label: 'Analytics',
                                            icon: 'pi pi-chart-pie',
                                        },
                                    ],
                                },
                                /*{
                                    label: 'Finance',
                                    icon: 'pi pi-money-bill',
                                    items: [
                                        {
                                            label: 'Gestion des factures des formateurs',
                                            icon: 'pi pi-user-edit',
                                            routerLink: ['/facture-formateur'],
                                        },
                                    ],
                                },*/
                                {
                                    label: 'Questionnaire',
                                    icon: 'pi pi-sort-alpha-down',
                                    items: [
                                        {
                                            label: 'Questionnaire satisfaction',
                                            icon: 'pi pi-heart',
                                            routerLink: ['/pedagogie/resultat-qs'],
                                        },
                                        {
                                            label: 'Questionnaire formateur',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/pedagogie/resultat-qf'],
                                        },
                                        {
                                            label: 'Questionnaire fin de formation',
                                            icon: 'pi pi-check-circle',
                                            routerLink: ['pedagogie/resultat-qff'],
                                        },
                                        {
                                            label: 'Questionnaire ICBS Event title',
                                            icon: 'pi pi-question-circle',
                                            routerLink: ['resultats-icbs'],
                                        },
                                    ],
                                },
                                {
                                    label: 'International',
                                    icon: 'pi pi-globe',
                                    items: [
                                        {
                                            label: 'Insérer un lead',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-lead'],
                                        },
                                        {
                                            label: 'Source',
                                            icon: 'pi pi-send',
                                            routerLink: ['/international/sourcing'],
                                        },
                                        {
                                            label: 'Orientation Leads',
                                            icon: 'pi pi-globe',
                                            routerLink: ['/international/orientation'],
                                        },
                                        {
                                            label: 'Admission Leads',
                                            icon: 'pi pi-users',
                                            routerLink: ['/international/admission'],
                                        },
                                        {
                                            label: 'Paiement',
                                            icon: 'pi pi-money-bill',
                                            routerLink: ['/international/paiement'],
                                        },
                                        {
                                            label: 'Accompagenement Consulaire',
                                            icon: 'pi pi-whatsapp',
                                            routerLink: ['/international/consulaire'],
                                        },
                                        {
                                            label: "Gestion de l'équipe",
                                            icon: 'pi pi-briefcase',
                                            items: [
                                                {
                                                    label: 'Gestion des membres',
                                                    icon: 'pi pi-user',
                                                    routerLink: [
                                                        '/international/member',
                                                    ],
                                                },
                                                {
                                                    label: "Gestion de l'équipe",
                                                    icon: 'pi pi-users',
                                                    routerLink: [
                                                        '/international/teams',
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            label: "Gestion de l'année scolaire",
                                            icon: 'pi pi-calendar',
                                            items: [
                                                {
                                                    label: 'Formations disponibles',
                                                    icon: 'pi pi-briefcase',
                                                    routerLink: [
                                                        '/admission/formations',
                                                    ],
                                                },
                                                {
                                                    label: 'Ecoles',
                                                    icon: 'pi pi-building',
                                                    routerLink: ['/admission/ecoles'],
                                                },
                                                {
                                                    label: 'Rentrées Scolaire',
                                                    icon: 'pi pi-calendar',
                                                    routerLink: ['/admission/rentree'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Dashboard',
                                            icon: 'pi pi-home',
                                            items: [
                                                {
                                                    label: 'Général',
                                                    icon: 'pi pi-chart-bar',
                                                    routerLink: [
                                                        '/international/dashboard',
                                                    ],
                                                },
                                                {
                                                    label: 'Performance équipe',
                                                    icon: 'pi pi-users',
                                                    routerLink: [
                                                        'international/dashboard/performance',
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Génération de documents',
                                            icon: 'pi pi-folder',
                                            routerLink: [
                                                '/international/generation-documents',
                                            ],
                                        },
                                    ],
                                },
                                {
                                    label: 'CRM',
                                    icon: 'pi pi-database',
                                    items: [
                                        /* {
                                             label: 'Insertion',
                                             icon: 'pi pi-user-plus',
                                             items: [
                                                 /*{
                                                  label: 'Ajouter un lead',
                                                  icon: 'pi pi-user-plus',
                                                  routerLink: [
                                                      'crm/leads/ajout',
                                                  ],
                                              }, 
                                                 {
                                                     label: 'Importer',
                                                     icon: 'pi pi-database',
                                                     routerLink: ['crm/import'],
                                                 },
                                             ],
                                         },*/
                                        {
                                            label: 'Liste des leads',
                                            icon: 'pi pi-users',
                                            routerLink: ['crm/liste'],
                                        },
                                        /*{
                                            label: 'Qualification',
                                            icon: 'pi pi-star',
                                            items: [
                                                {
                                                    label: 'Les leads non qualifiés',
                                                    icon: 'pi pi-star-fill',
                                                    routerLink: [
                                                        'crm/leads/non-qualifies',
                                                    ],
                                                },
                                                {
                                                    label: 'Les leads préqualifiés',
                                                    icon: 'pi pi-star',
                                                    routerLink: [
                                                        'crm/leads/pre-qualifies',
                                                    ],
                                                },
                                                {
                                                    label: 'Les leads qualifiés',
                                                    icon: 'pi pi-star',
                                                    routerLink: ['crm/leads/qualifies'],
                                                },
                                                {
                                                    label: 'Les ventes',
                                                    icon: 'pi pi-chart-line',
                                                    routerLink: [''],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Communication',
                                            icon: 'pi pi-share-alt',
                                            items: [
                                                {
                                                    label: 'Facebook',
                                                    icon: 'pi pi-facebook',
                                                    routerLink: [''],
                                                },
                                                {
                                                    label: 'Instagram',
                                                    icon: 'pi pi-instagram',
                                                    routerLink: [''],
                                                },
                                                {
                                                    label: 'WhatsApp',
                                                    icon: 'pi pi-whatsapp',
                                                    routerLink: [''],
                                                },
                                                {
                                                    label: 'ChatBot',
                                                    icon: 'pi pi-comments',
                                                    routerLink: [''],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Target',
                                            icon: 'pi pi-flag',
                                            items: [
                                                {
                                                    label: 'Configuration',
                                                    icon: 'pi pi-cog',
                                                    routerLink: [
                                                        'crm/target/configuration',
                                                    ],
                                                },
                                                {
                                                    label: 'My target',
                                                    icon: 'pi pi-user',
                                                    routerLink: [
                                                        'crm/target/my-target',
                                                    ],
                                                },
                                                {
                                                    label: 'Dashboard Général',
                                                    icon: 'pi pi-chart-pie',
                                                    routerLink: [
                                                        'crm/target/dashboard',
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Mes taches',
                                            icon: 'pi pi-briefcase',
                                            items: [],
                                        },
                                        {
                                            label: 'Support Commercial',
                                            icon: 'pi pi-comment',
                                            items: [
                                                {
                                                    label: 'Mails Type',
                                                    icon: 'pi pi-envelope',
                                                    routerLink: [''],
                                                },
                                                {
                                                    label: 'Discours',
                                                    icon: 'pi pi-comment',
                                                    routerLink: [''],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Pipeline',
                                            icon: 'pi pi-filter',
                                            items: [],
                                        },*/
                                        {
                                            label: 'Configuration',
                                            icon: 'pi pi-cog',
                                            items: [
                                                {
                                                    label: 'Gestion des membres',
                                                    icon: 'pi pi-user',
                                                    routerLink: ['crm/member'],
                                                },
                                                {
                                                    label: 'Gestion des équipes',
                                                    icon: 'pi pi-users',
                                                    routerLink: ['crm/teams'],
                                                },
                                                {
                                                    label: 'Gestion des produits',
                                                    icon: 'pi pi-briefcase',
                                                    routerLink: ['crm/gestion-produits'],
                                                },
                                                {
                                                    label: 'Gestion des sources',
                                                    icon: 'pi pi-map-marker',
                                                    routerLink: [''],
                                                },
                                                {
                                                    label: 'Gestion des opérations',
                                                    icon: 'pi pi-tablet',
                                                    routerLink: [''],
                                                },
                                            ],
                                        },
                                        /* {
                                             label: 'Dashboard',
                                             icon: 'pi pi-tablet',
                                             items: [
                                                 {
                                                     label: 'Equipe',
                                                     icon: 'pi pi-users',
                                                     routerLink: [''],
                                                 },
                                                 {
                                                     label: 'Ma performance',
                                                     icon: 'pi pi-chart-bar',
                                                     routerLink: [''],
                                                 },
                                             ],
                                         },*/
                                    ],
                                },
                                {
                                    label: 'Intuns',
                                    icon: 'pi pi-building',
                                    items: [
                                        {
                                            label: 'Liste des étudiants INTUNS',
                                            icon: 'pi pi-users',
                                            routerLink: ['/intuns/etudiants'],
                                        },
                                        {
                                            label: 'Liste des formations INTUNS',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/intuns/formations'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Gestions des emails',
                                    icon: 'pi pi-envelope',
                                    items: [
                                        {
                                            label: 'Configuration des adresses mails',
                                            icon: 'pi pi-cog',
                                            routerLink: ['/mails/configuration'],
                                        },
                                        {
                                            label: 'Mails types',
                                            icon: 'pi pi-bars',
                                            routerLink: ['/mails/type'],
                                        },
                                        {
                                            label: 'Mails automatisés',
                                            icon: 'pi pi-sync',
                                            routerLink: ['/mails/auto'],
                                        },
                                    ]
                                }
                            ];
                            this.items.push(
                                {
                                    label: 'Pédagogie - Formateur',
                                    icon: 'pi pi-fw pi-folder',
                                    items: [
                                        {
                                            label: 'Emploi du temps',
                                            icon: 'pi pi-calendar',
                                            routerLink:
                                                'pedagogie/emploi-du-temps/formateur/' +
                                                this.token.id,
                                        },
                                        {
                                            label: 'Gestions des évaluations',
                                            icon: 'pi pi-copy',
                                            items: [
                                                {
                                                    label: 'Ajouter une évaluation',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: [
                                                        '/pedagogie/ajout-examen',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des évaluations',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/pedagogie/examens'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Liste de vos étudiants',
                                            icon: 'pi pi-users',
                                            routerLink: '/formateur/etudiants',
                                        },
                                    ],
                                },
                            )
                        },
                        error: function (error: any) {
                            console.error(error);
                        },
                        complete: () => {
                            console.log(
                                'Informations du formateur récupérer avec succès !'
                            );
                        },
                    });

                }
                // menu alternant service pédagogique DONE
                else if (
                    response.role === 'Agent' &&
                    service_id?.label == 'Pédagogie' &&
                    response.type === 'Alternant'
                ) {
                    this.ETUService.getByUser_id(this.token.id).subscribe({
                        next: (dataEtu: Etudiant) => {
                            this.items = [
                                {
                                    label: 'Espace Personnel',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/'],
                                },
                                /*{
                                    label: 'Signaler un problème technique',
                                    icon: 'pi pi-fw pi-exclamation-triangle',
                                    routerLink: ['/ticketing-igs'],
                                },
                                {
                                    label: 'Ticketing - Ancienne Version',
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
                                    ],
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
                                    ],
                                },*/
                                {
                                    label: 'Pédagogie',
                                    icon: 'pi pi-fw pi-folder',
                                    items: [
                                        {
                                            label: 'Gestion des groupes',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Ajouter un groupe',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: [
                                                        '/ajout-groupe',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des groupes',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/groupes'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestion des modules',
                                            icon: 'pi pi-fw pi-tags',
                                            routerLink: ['/pedagogie/matieres'],
                                        },
                                        {
                                            label: 'Gestions des séances',
                                            icon: 'pi pi-video',
                                            items: [
                                                {
                                                    label: 'Ajouter une séance',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: [
                                                        '/pedagogie/ajout-seance',
                                                    ],
                                                },
                                                {
                                                    label: 'Voir la liste des séances',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/pedagogie/seances'],
                                                },
                                                {
                                                    label: "Voir l'emploi du temps des séances",
                                                    icon: 'pi pi-calendar',
                                                    routerLink: [
                                                        '/pedagogie/emploi-du-temps',
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des formateurs',
                                            icon: 'pi pi-id-card',
                                            items: [
                                                {
                                                    label: 'Ajouter un formateur',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: [
                                                        '/pedagogie/ajout-formateur',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des formateurs',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/pedagogie/formateurs'],
                                                },
                                            ],
                                        },
                                        {
                                            label: "Gestion des inscrits en attente d'assignation",
                                            icon: 'pi pi-user-plus',
                                            routerLink: [
                                                '/pedagogie/assignation-inscrit',
                                            ],
                                        },
                                        {
                                            label: 'Gestions des étudiants',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Ajouter un étudiant',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: [
                                                        '/pedagogie/ajout-etudiant',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des étudiants',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['pedagogie/etudiants'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des évaluations',
                                            icon: 'pi pi-copy',
                                            items: [
                                                {
                                                    label: 'Ajouter une évaluation',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: [
                                                        '/pedagogie/ajout-examen',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des évaluations',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/pedagogie/examens'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des Bulletins de notes',
                                            icon: 'pi pi-pencil',
                                            routerLink: ['/notes'],
                                        },
                                        {
                                            label: 'Gestions des devoirs',
                                            icon: 'pi pi-book',
                                            routerLink: 'devoirs',
                                        },
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
                                                    routerLink: [
                                                        '/skillsnet/ajout-entreprise',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des entreprises',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: [
                                                        '/pedagogie/entreprises',
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestion des tuteurs',
                                            icon: 'pi pi-user',
                                            routerLink: ['//pedagogie/tuteur'],
                                        },
                                        {
                                            label: 'Placement',
                                            icon: 'pi pi-star',
                                            items: [
                                                {
                                                    label: 'Alternances',
                                                    icon: 'pi pi-list',
                                                    routerLink: [
                                                        '/pedagogie/liste-contrats',
                                                    ],
                                                },
                                                {
                                                    label: 'Stages',
                                                    icon: 'pi pi-briefcase',
                                                    routerLink: ['/stages'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestion des équipes de conseillers',
                                            icon: 'pi pi-users',
                                            routerLink: ['/equipe-commercial'],
                                        },
                                        {
                                            label: 'Gestion des leads alternables',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/leads-alt'],
                                        },
                                        {
                                            label: 'Ajouter un dossier',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/ajout-lead'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Questionnaire',
                                    icon: 'pi pi-sort-alpha-down',
                                    items: [
                                        {
                                            label: 'Questionnaire satisfaction',
                                            icon: 'pi pi-heart',
                                            routerLink: ['/pedagogie/resultat-qs'],
                                        },
                                        {
                                            label: 'Questionnaire formateur',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/pedagogie/resultat-qf'],
                                        },
                                        {
                                            label: 'Questionnaire fin de formation',
                                            icon: 'pi pi-check-circle',
                                            routerLink: ['pedagogie/resultat-qff'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Étudiant',
                                    icon: 'pi pi-chart-pie',
                                    items: [
                                        {
                                            label: 'Emploi du temps',
                                            icon: 'pi pi-calendar',
                                            routerLink:
                                                'pedagogie/emploi-du-temps/classe/' +
                                                dataEtu.classe_id,
                                        },
                                        /*{
                                            label: 'Booking - Logements',
                                            icon: 'pi pi-home',
                                            routerLink: ['/logements'],
                                        },*/
                                        {
                                            label: 'Assiduité',
                                            icon: 'pi pi-check-square',
                                            routerLink:
                                                'pedagogie/details/' + dataEtu._id,
                                        },
                                    ],
                                },
                            ];
                        },
                        error: (error: any) => {
                            console.error(error);
                        },
                        complete: () => {
                            console.log(
                                " Informations de l'étudiant récupérer avec succès !"
                            );
                        },
                    });
                }
                // menu service admission
                else if (
                    response.role === 'Agent' &&
                    service_id?.label === 'Admission' &&
                    response.type === 'Alternant'
                ) {
                    this.ETUService.getByUser_id(this.token.id).subscribe({
                        next: (dataEtu: Etudiant) => {
                            this.items = [
                                {
                                    label: 'Espace Personnel',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/'],
                                },
                                /*{
                                    label: 'Signaler un problème technique',
                                    icon: 'pi pi-fw pi-exclamation-triangle',
                                    routerLink: ['/ticketing-igs'],
                                },
                                {
                                    label: 'Ticketing - Ancienne Version',
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
                                    ],
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
                                    ],
                                },*/
                                {
                                    label: 'Admission',
                                    icon: 'pi pi-fw pi-check-circle',
                                    items: [
                                        {
                                            label: 'Gestions des leads',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'En attente de traitement',
                                                    icon: 'pi pi-spin pi-spinner',
                                                    routerLink: [
                                                        '/gestion-preinscriptions-filtered/En attente de traitement',
                                                    ],
                                                },
                                                {
                                                    label: 'Dossiers traités',
                                                    icon: 'pi pi-check-circle',
                                                    routerLink: [
                                                        '/gestion-preinscriptions-filter/traite',
                                                    ],
                                                },
                                                {
                                                    label: 'Ajouter un dossier',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/ajout-lead'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Dashboard',
                                            icon: 'pi pi-users',
                                            routerLink: [
                                                '/gestion-preinscriptions',
                                            ],
                                        },
                                        {
                                            label: 'Gestions des leads Intuns',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/leads-intuns'],
                                        },
                                        {
                                            label: 'Gestion des participantes pour les événements',
                                            icon: 'pi pi-users',
                                            routerLink: ['/list-events'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Étudiant',
                                    icon: 'pi pi-chart-pie',
                                    items: [
                                        {
                                            label: 'Emploi du temps',
                                            icon: 'pi pi-calendar',
                                            routerLink:
                                                'pedagogie/emploi-du-temps/classe/' +
                                                dataEtu.classe_id,
                                        },
                                        /*{
                                            label: 'Booking - Logements',
                                            icon: 'pi pi-home',
                                            routerLink: ['/logements'],
                                        },*/
                                        {
                                            label: 'Assiduité',
                                            icon: 'pi pi-check-square',
                                            routerLink:
                                                'pedagogie/details/' + dataEtu._id,
                                        },
                                    ],
                                },
                            ];
                        },
                        error: (error: any) => {
                            console.error(error);
                        },
                        complete: () => {
                            console.log(
                                " Informations de l'étudiant récupérer avec succès !"
                            );
                        },
                    });
                } else if (
                    response.role === 'Agent' &&
                    service_id?.label === 'Event'
                ) {
                    this.ETUService.getByUser_id(this.token.id).subscribe({
                        next: (dataEtu: Etudiant) => {
                            this.items = [
                                {
                                    label: 'Espace Personnel',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/'],
                                },
                                /*{
                                    label: 'Signaler un problème technique',
                                    icon: 'pi pi-fw pi-exclamation-triangle',
                                    routerLink: ['/ticketing-igs'],
                                },
                                {
                                    label: 'Ticketing - Ancienne Version',
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
                                    ],
                                },*/
                                {
                                    label: 'Admission',
                                    icon: 'pi pi-fw pi-check-circle',
                                    items: [
                                        {
                                            label: 'Gestion des participantes pour les événements',
                                            icon: 'pi pi-users',
                                            routerLink: ['/list-events'],
                                        },
                                    ],
                                },
                            ];
                            if (dataEtu)
                                this.items.push({
                                    label: 'Étudiant',
                                    icon: 'pi pi-chart-pie',
                                    items: [
                                        {
                                            label: 'Emploi du temps',
                                            icon: 'pi pi-calendar',
                                            routerLink:
                                                'pedagogie/emploi-du-temps/classe/' +
                                                dataEtu.classe_id,
                                        },
                                        /*{
                                            label: 'Booking - Logements',
                                            icon: 'pi pi-home',
                                            routerLink: ['/logements'],
                                        },*/
                                        {
                                            label: 'Assiduité',
                                            icon: 'pi pi-check-square',
                                            routerLink:
                                                'pedagogie/details/' + dataEtu._id,
                                        },
                                    ],
                                });
                        },
                        error: (error: any) => {
                            console.error(error);
                        },
                        complete: () => {
                            console.log(
                                " Informations de l'étudiant récupérer avec succès !"
                            );
                        },
                    });
                }
                // menu service administration
                else if (
                    response.role === 'Agent' &&
                    service_id?.label === 'Administration' &&
                    response.type === 'Alternant'
                ) {
                    this.ETUService.getByUser_id(this.token.id).subscribe({
                        next: (dataEtu: Etudiant) => {
                            this.items = [
                                {
                                    label: 'Espace Personnel',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/'],
                                },
                                /*{
                                    label: 'Signaler un problème technique',
                                    icon: 'pi pi-fw pi-exclamation-triangle',
                                    routerLink: ['/ticketing-igs'],
                                },
                                {
                                    label: 'Ticketing - Ancienne Version',
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
                                    ],
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
                                    ],
                                },*/
                                {
                                    label: 'Administration',
                                    icon: 'pi pi-fw pi-inbox',
                                    items: [
                                        {
                                            label: 'Gestions des années scolaires',
                                            icon: 'pi pi-calendar',
                                            items: [
                                                {
                                                    label: 'Ajouter une année scolaire',
                                                    icon: 'pi pi-calendar-plus',
                                                    routerLink: [
                                                        '/ajout-annee-scolaire',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des années scolaires',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: [
                                                        '/annee-scolaire',
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des écoles',
                                            icon: 'pi pi-home',
                                            items: [
                                                {
                                                    label: 'Ajouter une école',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: [
                                                        '/ajout-ecole',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des écoles',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/ecole'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des campus',
                                            icon: 'pi pi-home',
                                            items: [
                                                {
                                                    label: 'Ajouter un campus',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: [
                                                        '/ajout-campus',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des campus',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/campus'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des diplômes',
                                            icon: 'pi pi-bookmark',
                                            items: [
                                                {
                                                    label: 'Ajouter un diplôme',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: [
                                                        '/ajout-diplome',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des diplômes',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/diplomes'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des agents',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Ajouter un agent',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: [
                                                        '/admin/ajout-agent',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des agents',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: [
                                                        '/admin/agents',
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Validation des inscrits',
                                            icon: 'pi pi-check-square',
                                            routerLink: ['/validation-inscrit'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Pédagogie',
                                    icon: 'pi pi-fw pi-folder',
                                    items: [
                                        {
                                            label: 'Gestions des étudiants',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Liste des étudiants',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['pedagogie/etudiants'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestion des groupes',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Ajouter un groupe',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: [
                                                        '/ajout-groupe',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des groupes',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/groupes'],
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    label: 'Étudiant',
                                    icon: 'pi pi-chart-pie',
                                    items: [
                                        {
                                            label: 'Emploi du temps',
                                            icon: 'pi pi-calendar',
                                            routerLink:
                                                'pedagogie/emploi-du-temps/classe/' +
                                                dataEtu.classe_id,
                                        },
                                        /*{
                                            label: 'Booking - Logements',
                                            icon: 'pi pi-home',
                                            routerLink: ['/logements'],
                                        },*/
                                        {
                                            label: 'Assiduité',
                                            icon: 'pi pi-check-square',
                                            routerLink:
                                                'pedagogie/details/' + dataEtu._id,
                                        },
                                    ],
                                },
                            ];
                        },
                        error: (error: any) => {
                            console.error(error);
                        },
                        complete: () => {
                            console.log(
                                " Informations de l'étudiant récupérer avec succès !"
                            );
                        },
                    });
                }
                // menu service commerciale
                else if (
                    response.role === 'Agent' &&
                    service_id?.label === 'Commercial' &&
                    response.type === 'Alternant'
                ) {
                    this.ETUService.getByUser_id(this.token.id).subscribe({
                        next: (dataEtu: Etudiant) => {
                            this.items = [
                                {
                                    label: 'Espace Personnel',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/'],
                                },
                                /*{
                                    label: 'Signaler un problème technique',
                                    icon: 'pi pi-fw pi-exclamation-triangle',
                                    routerLink: ['/ticketing-igs'],
                                },
                                {
                                    label: 'Ticketing - Ancienne Version',
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
                                    ],
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
                                    ],
                                },*/
                                {
                                    label: 'Pédagogie',
                                    icon: 'pi pi-fw pi-folder',
                                    items: [
                                        {
                                            label: 'Gestions des étudiants',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Ajouter un étudiant',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: [
                                                        '/pedagogie/ajout-etudiant',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des étudiants',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['pedagogie/etudiants'],
                                                },
                                            ],
                                        },
                                    ],
                                } /*
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
                                            , routerLink: ['/international/brands']
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
                                            , routerLink: ['/dashboard/partenaire']
                                        }, { label: "Actualités", icon: 'pi pi-exclamation-circle', routerLink: ['/international/actualite'] },
                                    ]
                                },*/,
                                /*{
                                    label: 'iMatch',
                                    icon: 'pi pi-star',
                                    items: [
                                        {
                                            label: "Offres",
                                            icon: 'pi pi-volume-up',
                                            routerLink: ['/skillsnet/offres'],
                                        },
                                        {
                                      label: 'Mes offres',
                                      icon: 'pi pi-user',
                                      routerLink: ['/skillsnet/mes-offres'],
                                  },
                                        {
                                            label: 'Cvthèque',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/i-match/cvtheque-interne']
                                        },
                                        {
                                            label: 'Gestion des compétences',
                                            icon: 'pi pi-book',
                                            routerLink: ['/skillsnet/skills-management'],
                                        },
                                        {
                                            label: 'Gestions des externes',
                                            icon: 'pi pi-users',
                                            routerLink: ['/i-match/externe'],
                                        },
                                        {
                                            label: 'Gestions des événements',
                                            icon: 'pi pi-flag',
                                            routerLink: ['/skillsnet/evenements'],
                                        },
                                        {
                                            label: 'Cvthèque Externe',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/imatch'],
                                        },
                                        {
                                            label: 'Rendez-vous',
                                            icon: 'pi pi-calendar',
                                            routerLink: ['/imatch/rendez-vous']
                                        }
                                    ],
                                },*/
                                {
                                    label: 'Étudiant',
                                    icon: 'pi pi-chart-pie',
                                    items: [
                                        {
                                            label: 'Emploi du temps',
                                            icon: 'pi pi-calendar',
                                            routerLink:
                                                'pedagogie/emploi-du-temps/classe/' +
                                                dataEtu.classe_id,
                                        },
                                        /*{
                                            label: 'Booking - Logements',
                                            icon: 'pi pi-home',
                                            routerLink: ['/logements'],
                                        },*/
                                        {
                                            label: 'Assiduité',
                                            icon: 'pi pi-check-square',
                                            routerLink:
                                                'pedagogie/details/' + dataEtu._id,
                                        },
                                    ],
                                },
                            ];
                        },
                        error: (error: any) => {
                            console.error(error);
                        },
                        complete: () => {
                            console.log(
                                " Informations de l'étudiant récupérer avec succès !"
                            );
                        },
                    });
                }
                // menu service RH
                else if (
                    response.role === 'Agent' &&
                    service_id?.label === 'Ressources Humaines' &&
                    response.type === 'Alternant'
                ) {
                    this.ETUService.getByUser_id(this.token.id).subscribe({
                        next: (dataEtu: Etudiant) => {
                            this.items = [
                                {
                                    label: 'Espace Personnel',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/'],
                                },
                                /*{
                                    label: 'Signaler un problème technique',
                                    icon: 'pi pi-fw pi-exclamation-triangle',
                                    routerLink: ['/ticketing-igs'],
                                },
                                {
                                    label: 'Ticketing - Ancienne Version',
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
                                    ],
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
                                    ],
                                },*/
                                {
                                    label: 'Ressources humaines',
                                    icon: 'pi pi-fw pi-users',
                                    items: [
                                        {
                                            label: 'Gestion des ressources humaines',
                                            icon: 'pi pi-fw pi-list',
                                            routerLink: [
                                                '/gestion-des-ressources-humaines',
                                            ],
                                        },
                                    ],
                                },
                                {
                                    label: 'Étudiant',
                                    icon: 'pi pi-chart-pie',
                                    items: [
                                        {
                                            label: 'Emploi du temps',
                                            icon: 'pi pi-calendar',
                                            routerLink:
                                                'pedagogie/emploi-du-temps/classe/' +
                                                dataEtu.classe_id,
                                        },
                                        /*{
                                            label: 'Booking - Logements',
                                            icon: 'pi pi-home',
                                            routerLink: ['/logements'],
                                        },*/
                                        {
                                            label: 'Assiduité',
                                            icon: 'pi pi-check-square',
                                            routerLink:
                                                'pedagogie/details/' + dataEtu._id,
                                        },
                                    ],
                                },
                            ];
                        },
                        error: (error: any) => {
                            console.error(error);
                        },
                        complete: () => {
                            console.log(
                                " Informations de l'étudiant récupérer avec succès !"
                            );
                        },
                    });
                }
                // menu service support informatique
                else if (
                    response.role === 'Agent' &&
                    service_id?.label === 'Support Informatique' &&
                    response.type === 'Alternant'
                ) {
                    this.ETUService.getByUser_id(this.token.id).subscribe({
                        next: (dataEtu: Etudiant) => {
                            this.items = [
                                {
                                    label: 'Espace Personnel',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/'],
                                },
                                /*{
                                    label: 'Signaler un problème technique',
                                    icon: 'pi pi-fw pi-exclamation-triangle',
                                    routerLink: ['/ticketing-igs'],
                                },*/
                                {
                                    label: 'Développeur',
                                    icon: 'pi pi-fw pi-cog',
                                    items: [
                                        {
                                            label: 'Gestion des utilisateurs',
                                            icon: 'pi pi-fw pi-user',
                                            routerLink: [
                                                '/gestion-des-utilisateurs',
                                            ],
                                        },
                                        {
                                            label: 'Analyseur de doublon',
                                            icon: 'pi pi-fw pi-server',
                                            routerLink: ['/analyseur-doublons'],
                                        },
                                        {
                                            label: 'Connexion des étudiants',
                                            icon: 'pi pi-fw pi-sign-in',
                                            routerLink: ['pedagogie/gestion-etudiants'],
                                        },
                                        {
                                            label: 'Infos IMS',
                                            icon: 'pi pi-fw pi-info-circle',
                                            routerLink: ['/infos-ims'],
                                        },
                                        {
                                            label: 'Template Code',
                                            icon: 'pi pi-copy',
                                            items: [
                                                {
                                                    label: 'Formulaire',
                                                    icon: 'pi pi-align-center',
                                                    routerLink: ['/template/formulaire/GH4'],
                                                },
                                            ]
                                        },
                                    ],
                                },
                                /*{
                                    label: 'Ticketing - Ancienne Version',
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
                                            routerLink: [
                                                '/admin/gestion-services',
                                            ],
                                        },
                                    ],
                                },*/
                                /*{
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
                                    ],
                                },*/
                                {
                                    label: 'Pédagogie',
                                    icon: 'pi pi-fw pi-folder',
                                    items: [
                                        {
                                            label: "Gestion des inscrits en attente d'assignation",
                                            icon: 'pi pi-user-plus',
                                            routerLink: [
                                                '/pedagogie/assignation-inscrit',
                                            ],
                                        },
                                    ],
                                },
                                {
                                    label: 'Administration',
                                    icon: 'pi pi-fw pi-inbox',
                                    items: [
                                        {
                                            label: 'Validation des inscrits',
                                            icon: 'pi pi-check-square',
                                            routerLink: ['/validation-inscrit'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Étudiant',
                                    icon: 'pi pi-chart-pie',
                                    items: [
                                        {
                                            label: 'Emploi du temps',
                                            icon: 'pi pi-calendar',
                                            routerLink:
                                                'pedagogie/emploi-du-temps/classe/' +
                                                dataEtu.classe_id,
                                        },
                                        /*{
                                            label: 'Booking - Logements',
                                            icon: 'pi pi-home',
                                            routerLink: ['/logements'],
                                        },*/
                                        {
                                            label: 'Assiduité',
                                            icon: 'pi pi-check-square',
                                            routerLink:
                                                'pedagogie/details/' + dataEtu._id,
                                        },
                                    ],
                                },
                            ];
                        },
                        error: (error: any) => {
                            console.error(error);
                        },
                        complete: () => {
                            console.log(
                                " Informations de l'étudiant récupérer avec succès !"
                            );
                        },
                    });
                } else if (
                    response.role == 'Responsable' &&
                    service_id?.label === 'Gestion des partenaires et des leads'
                ) {
                    this.items = [
                        {
                            label: 'Espace Personnel',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/'],
                        },
                        /*{
                            label: 'Signaler un problème technique',
                            icon: 'pi pi-fw pi-exclamation-triangle',
                            routerLink: ['/ticketing-igs'],
                        },*/
                        /*

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
                                    , routerLink: ['/international/brands']
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
                                    , routerLink: ['/dashboard/partenaire']
                                }, { label: "Actualités", icon: 'pi pi-exclamation-circle', routerLink: ['/international/actualite'] },
                            ]
                        },*/ {
                            label: 'International',
                            icon: 'pi pi-globe',
                            items: [
                                {
                                    label: 'Insérer un lead',
                                    icon: 'pi pi-user-plus',
                                    routerLink: ['/ajout-lead'],
                                },
                                {
                                    label: 'Source',
                                    icon: 'pi pi-send',
                                    routerLink: ['/international/sourcing'],
                                },
                                {
                                    label: 'Orientation Leads',
                                    icon: 'pi pi-globe',
                                    routerLink: ['/international/orientation'],
                                },
                                {
                                    label: 'Admission Leads',
                                    icon: 'pi pi-users',
                                    routerLink: ['/international/admission'],
                                },
                                {
                                    label: 'Paiement',
                                    icon: 'pi pi-money-bill',
                                    routerLink: ['/international/paiement'],
                                },
                                {
                                    label: 'Accompagenement Consulaire',
                                    icon: 'pi pi-whatsapp',
                                    routerLink: ['/international/consulaire'],
                                },
                                {
                                    label: "Gestion de l'équipe",
                                    icon: 'pi pi-briefcase',
                                    items: [
                                        {
                                            label: 'Gestion des membres',
                                            icon: 'pi pi-user',
                                            routerLink: [
                                                '/international/member',
                                            ],
                                        },
                                        {
                                            label: "Gestion de l'équipe",
                                            icon: 'pi pi-users',
                                            routerLink: [
                                                '/international/teams',
                                            ],
                                        },
                                    ],
                                },
                                {
                                    label: "Gestion de l'année scolaire",
                                    icon: 'pi pi-calendar',
                                    items: [
                                        {
                                            label: 'Formations disponibles',
                                            icon: 'pi pi-briefcase',
                                            routerLink: [
                                                '/admission/formations',
                                            ],
                                        },
                                        {
                                            label: 'Ecoles',
                                            icon: 'pi pi-building',
                                            routerLink: ['/admission/ecoles'],
                                        },
                                        {
                                            label: 'Rentrées Scolaire',
                                            icon: 'pi pi-calendar',
                                            routerLink: ['/admission/rentree'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Dashboard',
                                    icon: 'pi pi-home',
                                    items: [
                                        {
                                            label: 'Général',
                                            icon: 'pi pi-chart-bar',
                                            routerLink: [
                                                '/international/dashboard',
                                            ],
                                        },
                                        {
                                            label: 'Performance équipe',
                                            icon: 'pi pi-users',
                                            routerLink: [
                                                'international/dashboard/performance',
                                            ],
                                        },
                                    ],
                                },
                                {
                                    label: 'Génération de documents',
                                    icon: 'pi pi-folder',
                                    routerLink: [
                                        '/international/generation-documents',
                                    ],
                                },
                            ],
                        },
                    ];
                } else if (response?.type?.startsWith('Externe')) {
                    this.items = [
                        {
                            label: 'Espace Personnel',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/'],
                        },
                        {
                            label: 'iMatch',
                            icon: 'pi pi-star',
                            items: [
                                {
                                    label: 'Offres',
                                    icon: 'pi pi-volume-up',
                                    routerLink: ['/skillsnet/offres'],
                                },
                                {
                                    label: 'CV',
                                    icon: 'pi pi-volume-up',
                                    routerLink: ['/i-match/cv-etudiant'],
                                }
                            ],
                        },
                    ]
                }
                /* end menus role */

                /* menus internes */
                // menu étudiant
                if (
                    (response.type === 'Initial' ||
                        response.type === 'Alternant') &&
                    response.role === 'user'
                ) {
                    this.ETUService.getByUser_id(this.token.id).subscribe({
                        next: (dataEtu: Etudiant) => {
                            this.items = [
                                {
                                    label: 'Espace Personnel',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/'],
                                },
                                {
                                    label: 'Pédagogie',
                                    icon: 'pi pi-fw pi-folder',
                                    items: [
                                        {
                                            label: 'Emploi du temps',
                                            icon: 'pi pi-calendar',
                                            routerLink:
                                                'pedagogie/emploi-du-temps/classe/' +
                                                dataEtu.classe_id,
                                        },
                                    ],
                                },
                                {
                                    label: 'iMatch',
                                    icon: 'pi pi-star',
                                    items: [
                                        {
                                            label: 'Offres',
                                            icon: 'pi pi-volume-up',
                                            routerLink: ['/skillsnet/offres'],
                                        },
                                        {
                                            label: 'CV',
                                            icon: 'pi pi-volume-up',
                                            routerLink: ['/i-match/cv-etudiant'],
                                        },
                                        /*{
                                            label: 'Mes Matching',
                                            icon: 'pi pi-link',
                                            routerLink: [
                                                '/matching-externe/' +
                                                this.token.id,
                                            ],
                                        }*/
                                    ],
                                },
                                {
                                    label: 'Étudiant',
                                    icon: 'pi pi-chart-pie',
                                    items: [
                                        {
                                            label: 'Emploi du temps',
                                            icon: 'pi pi-calendar',
                                            routerLink:
                                                'pedagogie/emploi-du-temps/classe/' +
                                                dataEtu.classe_id,
                                        },
                                        /*{
                                            label: 'Booking - Logements',
                                            icon: 'pi pi-home',
                                            routerLink: ['/logements'],
                                        },*/
                                        {
                                            label: 'Assiduité',
                                            icon: 'pi pi-check-square',
                                            routerLink:
                                                'pedagogie/details/' + dataEtu._id,
                                        },
                                    ],
                                },
                            ];
                        },
                        error: (error: any) => {
                            console.error(error);
                            this.items = [
                                {
                                    label: 'Espace Personnel',
                                    icon: 'pi pi-fw pi-home',
                                    routerLink: ['/'],
                                },
                                {
                                    label: 'iMatch',
                                    icon: 'pi pi-star',
                                    items: [
                                        {
                                            label: 'Offres',
                                            icon: 'pi pi-volume-up',
                                            routerLink: ['/skillsnet/offres'],
                                        },
                                        {
                                            label: 'CV',
                                            icon: 'pi pi-volume-up',
                                            routerLink: ['/i-match/cv-etudiant'],
                                        }
                                    ],
                                },
                            ];
                        },
                        complete: () => {
                            console.log(
                                " Informations de l'étudiant récupérer avec succès !"
                            );
                        },
                    });
                }



                /* end menus internes */

                /* menus externes */
                // menu ceo entreprise
                if (
                    (response.type === 'CEO Entreprise') &&
                    response.role === 'user'
                ) {
                    this.items = [
                        {
                            label: 'Espace Personnel',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/'],
                        }, {
                            label: 'iMatch',
                            icon: 'pi pi-star',
                            items: [
                                {
                                    label: "Offres",
                                    icon: 'pi pi-volume-up',
                                    routerLink: ['/skillsnet/offres'],
                                },
                                {
                                    label: 'Cvthèque',
                                    icon: 'pi pi-list',
                                    routerLink: ['/i-match/cvtheque-interne']
                                },
                            ],
                        },
                    ];
                }
                /*end menus externes */
                //WIP Nouveau Menu avec roles_list :
                let services_list = [];
                let service_dic = {};
                response.roles_list.forEach((val) => {
                    if (!service_dic[val.module])
                        service_dic[val.module] = val.role
                })
                services_list = Object.keys(service_dic)
                if ((services_list.length != 0 || new Date(response.date_creation) > new Date(2023, 7, 5)) && response.role != 'Admin' && service_id?.label != 'Event' && response.type != "Prospect" && !response.type && response.type != 'CEO Entreprise' && response.type != 'Formateur' && !response?.type?.startsWith('Externe'))
                    this.items = [
                        {
                            label: 'Espace Personnel',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/'],
                        },
                        /*{
                            label: 'Signaler un problème technique',
                            icon: 'pi pi-fw pi-exclamation-triangle',
                            routerLink: ['/ticketing-igs'],
                        },*/
                    ]
                if (response.haveNewAccess) {
                    //1
                    //console.log('haveNewAccess', this.items)
                    if (response.role == 'user') {
                        this.items = [
                            {
                                label: 'Espace Personnel',
                                icon: 'pi pi-fw pi-home',
                                routerLink: ['/'],
                            }
                        ]
                        if (response.type == 'Collaborateur') {
                        } else if (response.type == 'Responsable' || response.type_supp.includes('Responsable')) {
                            services_list.push('Ressources Humaines')
                        }
                    }
                    else if (response.role == 'Admin') {

                        if (response.type == 'Collaborateur') {
                        } else if (response.type == 'Responsable' || response.type_supp.includes('Responsable')) {
                            services_list.push('Ressources Humaines')
                        }
                    }

                }
                //menu formateur
                if (response.type === 'Formateur' && response.role === 'user') {
                    this.FService.getByUserId(this.token.id).subscribe({
                        next: (dataF: Formateur) => {
                            this.items.push(
                                {
                                    label: 'Pédagogie - Formateur',
                                    icon: 'pi pi-fw pi-folder',
                                    items: [
                                        {
                                            label: 'Emploi du temps',
                                            icon: 'pi pi-calendar',
                                            routerLink:
                                                'pedagogie/emploi-du-temps/formateur/' +
                                                this.token.id,
                                        },
                                        {
                                            label: 'Gestions des évaluations',
                                            icon: 'pi pi-copy',
                                            items: [
                                                {
                                                    label: 'Ajouter une évaluation',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: [
                                                        '/pedagogie/ajout-examen',
                                                    ],
                                                },
                                                {
                                                    label: 'Liste des évaluations',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/pedagogie/examens'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Liste de vos étudiants',
                                            icon: 'pi pi-users',
                                            routerLink: '/formateur/etudiants',
                                        },
                                    ],
                                },
                            );
                        },
                        error: function (error: any) {
                            console.error(error);
                        },
                        complete: () => {
                            console.log(
                                'Informations du formateur récupérer avec succès !'
                            );
                        },
                    });
                }
                if (services_list.includes('Partenaire')) {
                    if (service_dic['Partenaire'] != "Spectateur") {
                        this.items.push(
                            {
                                label: 'Partenaires',
                                icon: 'pi pi-share-alt',
                                items: [
                                    {
                                        label: 'Insérer ',
                                        icon: 'pi pi pi-user-plus',
                                        routerLink: ['/partenaireInscription']
                                    },
                                    {
                                        label: 'Liste ',
                                        icon: 'pi pi-sort-alpha-down',
                                        routerLink: ['/admin/partenaire']
                                    },
                                    {
                                        label: 'Support Marketing',
                                        icon: 'pi pi-briefcase'
                                        , routerLink: ['/international/brands']
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
                                    },/* {
                                        label: 'Ticketing',
                                        icon: 'pi pi-fw pi-ticket',
                                        items: [
                                            {
                                                label: 'Ajouter un ticket',
                                                icon: 'pi pi-plus',
                                                routerLink: ['/ticketing/gestion/ajout']
                                            },
                                            {
                                                label: 'Mes tickets envoyé',
                                                icon: 'pi pi-inbox',
                                                routerLink: ['/ticketing/gestion/mes-tickets']
                                            }
                                        ]
                                    },*/
                                    {
                                        label: 'Dashboard',
                                        icon: 'pi pi-chart-line'
                                        , routerLink: ['/dashboard/partenaire']
                                    }, { label: "Actualités", icon: 'pi pi-exclamation-circle', routerLink: ['rh/actualite-notifications'] },
                                ]
                            },
                        )
                    } else {
                        this.items.push(
                            {
                                label: 'Partenaires',
                                icon: 'pi pi-share-alt',
                                items: [
                                    {
                                        label: 'Liste ',
                                        icon: 'pi pi-sort-alpha-down',
                                        routerLink: ['/admin/partenaire']
                                    },
                                    {
                                        label: 'Support Marketing',
                                        icon: 'pi pi-briefcase'
                                        , routerLink: ['/international/brands']
                                    },
                                    {
                                        label: 'Dashboard',
                                        icon: 'pi pi-chart-line'
                                        , routerLink: ['/dashboard/partenaire']
                                    }, {
                                        label: "Actualités",
                                        icon: 'pi pi-exclamation-circle',
                                        routerLink: ['/international/actualite']
                                    },
                                ]
                            }, /*{
                            label: 'Ticketing',
                            icon: 'pi pi-fw pi-ticket',
                            items: [
                                {
                                    label: 'Ajouter un ticket',
                                    icon: 'pi pi-plus',
                                    routerLink: ['/ticketing/gestion/ajout']
                                },
                                {
                                    label: 'Mes tickets envoyé',
                                    icon: 'pi pi-inbox',
                                    routerLink: ['/ticketing/gestion/mes-tickets']
                                }
                            ]
                        }*/
                        )
                    }
                }
                /*if (services_list.includes('Ticketing')) {
                    let role = service_dic['Ticketing']
                    if (role == "Super-Admin") {
                        this.items.push({
                            label: 'Ticketing',
                            icon: 'pi pi-fw pi-ticket',
                            items: [
                                {
                                    label: 'Ajouter un ticket',
                                    icon: 'pi pi-plus',
                                    routerLink: ['/ticketing/gestion/ajout'],
                                },
                                {
                                    label: 'Mes tickets envoyé',
                                    icon: 'pi pi-inbox',
                                    routerLink: [
                                        '/ticketing/gestion/mes-tickets',
                                    ],
                                },
                                {
                                    label: 'Tickets assigné à moi',
                                    icon: 'pi pi-user',
                                    routerLink: ['/ticketing/gestion/assignes'],
                                },
                                {
                                    label: 'Gestion des tickets',
                                    icon: 'pi pi-fw pi-folder-open',
                                    items: [
                                        {
                                            label: 'Tickets non assignés',
                                            icon: 'pi pi-clock',
                                            routerLink: [
                                                '/ticketing/suivi/non-assignes',
                                            ],
                                        },
                                        {
                                            label: 'Tickets assignés - En attente de traitement',
                                            icon: 'pi pi-inbox',
                                            routerLink: [
                                                '/ticketing/suivi/attente-de-traitement',
                                            ],
                                        },
                                        {
                                            label: 'Tickets traités',
                                            icon: 'pi pi-check-circle',
                                            routerLink: [
                                                '/ticketing/suivi/traite',
                                            ],
                                        },
                                        {
                                            label: 'Tickets refusés',
                                            icon: 'pi pi-check-circle',
                                            routerLink: [
                                                '/ticketing/suivi/refuse',
                                            ],
                                        },
                                    ],
                                },
                                {
                                    label: 'Configuration',
                                    icon: 'pi pi-cog',
                                    routerLink: ['/ticketing/configuration'],
                                },
                                {
                                    label: 'Dashboard',
                                    icon: 'pi pi-home',
                                    routerLink: ['/ticketing/dashboard'],
                                },
                            ],
                        });
                    } else if (role == 'Admin') {
                        this.items.push({
                            label: 'Ticketing',
                            icon: 'pi pi-fw pi-ticket',
                            items: [
                                {
                                    label: 'Ajouter un ticket',
                                    icon: 'pi pi-plus',
                                    routerLink: ['/ticketing/gestion/ajout'],
                                },
                                {
                                    label: 'Mes tickets envoyé',
                                    icon: 'pi pi-inbox',
                                    routerLink: [
                                        '/ticketing/gestion/mes-tickets',
                                    ],
                                },
                                {
                                    label: 'Tickets assigné à moi',
                                    icon: 'pi pi-user',
                                    routerLink: ['/ticketing/gestion/assignes'],
                                },
                                {
                                    label: 'Gestion des tickets',
                                    icon: 'pi pi-fw pi-folder-open',
                                    items: [
                                        {
                                            label: 'Tickets non assignés',
                                            icon: 'pi pi-clock',
                                            routerLink: [
                                                '/ticketing/suivi/non-assignes',
                                            ],
                                        },
                                        {
                                            label: 'Tickets assignés - En attente de traitement',
                                            icon: 'pi pi-inbox',
                                            routerLink: [
                                                '/ticketing/suivi/attente-de-traitement',
                                            ],
                                        },
                                        {
                                            label: 'Tickets traités',
                                            icon: 'pi pi-check-circle',
                                            routerLink: [
                                                '/ticketing/suivi/traite',
                                            ],
                                        },
                                        {
                                            label: 'Tickets refusés',
                                            icon: 'pi pi-check-circle',
                                            routerLink: [
                                                '/ticketing/suivi/refuse',
                                            ],
                                        },
                                    ],
                                },
                                {
                                    label: 'Dashboard',
                                    icon: 'pi pi-home',
                                    routerLink: ['/ticketing/dashboard'],
                                },
                            ],
                        });
                    } else if (role == 'Agent') {
                        this.items.push({
                            label: 'Ticketing',
                            icon: 'pi pi-fw pi-ticket',
                            items: [
                                {
                                    label: 'Ajouter un ticket',
                                    icon: 'pi pi-plus',
                                    routerLink: ['/ticketing/gestion/ajout'],
                                },
                                {
                                    label: 'Mes tickets envoyé',
                                    icon: 'pi pi-inbox',
                                    routerLink: [
                                        '/ticketing/gestion/mes-tickets',
                                    ],
                                },
                                {
                                    label: 'Tickets assigné à moi',
                                    icon: 'pi pi-user',
                                    routerLink: ['/ticketing/gestion/assignes'],
                                },
                            ],
                        });
                    } else {
                        this.items.push({
                            label: 'Ticketing',
                            icon: 'pi pi-fw pi-ticket',
                            items: [
                                {
                                    label: 'Ajouter un ticket',
                                    icon: 'pi pi-plus',
                                    routerLink: ['/ticketing/gestion/ajout'],
                                },
                                {
                                    label: 'Mes tickets envoyé',
                                    icon: 'pi pi-inbox',
                                    routerLink: [
                                        '/ticketing/gestion/mes-tickets',
                                    ],
                                },
                            ],
                        });
                    }
                }*/
                if (services_list.includes('International')) {
                    let role = service_dic['International']
                    if (role == "Super-Admin")
                        this.items.push(
                            {
                                label: 'International',
                                icon: 'pi pi-globe',
                                items: [
                                    {
                                        label: 'Insérer un lead',
                                        icon: 'pi pi-user-plus',
                                        routerLink: ['/ajout-lead']
                                    },
                                    {
                                        label: 'Source',
                                        icon: 'pi pi-send',
                                        routerLink: ['/international/sourcing']
                                    },
                                    {
                                        label: 'Orientation Leads',
                                        icon: 'pi pi-globe',
                                        routerLink: ['/international/orientation']
                                    },
                                    {
                                        label: 'Admission Leads',
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
                                                label: 'Performance équipe',
                                                icon: 'pi pi-users',
                                                routerLink: ['international/dashboard/performance']
                                            }
                                        ]
                                    },
                                    { label: "Génération de documents", icon: 'pi pi-folder', routerLink: ['/international/generation-documents'] },

                                ],
                            }
                        )
                    else if (role == "Admin")
                        this.items.push(
                            {
                                label: 'International',
                                icon: 'pi pi-globe',
                                items: [
                                    {
                                        label: 'Insérer un lead',
                                        icon: 'pi pi-user-plus',
                                        routerLink: ['/ajout-lead']
                                    },
                                    {
                                        label: 'Source',
                                        icon: 'pi pi-send',
                                        routerLink: ['/international/sourcing']
                                    },
                                    {
                                        label: 'Orientation Leads',
                                        icon: 'pi pi-globe',
                                        routerLink: ['/international/orientation']
                                    },
                                    {
                                        label: 'Admission Leads',
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
                                        label: 'Gestion de l\'équipe',//LECTURE
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
                                        label: 'Gestion de l\'année scolaire',//LECTURE
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
                                                label: 'Performance équipe',
                                                icon: 'pi pi-users',
                                                routerLink: ['international/dashboard/performance']
                                            }
                                        ]
                                    },
                                    { label: "Génération de documents", icon: 'pi pi-folder', routerLink: ['/international/generation-documents'] },

                                ],
                            },
                        )

                    else if (role == "Agent")
                        this.items.push(
                            {
                                label: 'International',
                                icon: 'pi pi-globe',
                                items: [
                                    {
                                        label: 'Insérer un lead',
                                        icon: 'pi pi-user-plus',
                                        routerLink: ['/ajout-lead']
                                    },
                                    {
                                        label: 'Source', //Lecture
                                        icon: 'pi pi-send',
                                        routerLink: ['/international/sourcing']
                                    },
                                    {
                                        label: 'Orientation Leads', //Orientation
                                        icon: 'pi pi-globe',
                                        routerLink: ['/international/orientation']
                                    },
                                    {
                                        label: 'Admission Leads', //Admission
                                        icon: 'pi pi-users',
                                        routerLink: ['/international/admission']
                                    },
                                    {
                                        label: 'Paiement',
                                        icon: 'pi pi-money-bill',
                                        routerLink: ['/international/paiement']
                                    },
                                    {
                                        label: 'Accompagenement Consulaire', //Orientation
                                        icon: 'pi pi-whatsapp',
                                        routerLink: ['/international/consulaire']
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
                                                label: 'Performance équipe',
                                                icon: 'pi pi-users',
                                                routerLink: ['international/dashboard/performance']
                                            }
                                        ]
                                    },
                                    { label: "Génération de documents", icon: 'pi pi-folder', routerLink: ['/international/generation-documents'] },

                                ],
                            },
                        )
                    else
                        this.items.push({
                            label: 'International',
                            icon: 'pi pi-globe',
                            items: [
                                {
                                    label: 'Source', //Lecture
                                    icon: 'pi pi-send',
                                    routerLink: ['/international/sourcing'],
                                },
                                {
                                    label: 'Orientation Leads', //Lecture
                                    icon: 'pi pi-globe',
                                    routerLink: ['/international/orientation'],
                                },
                                {
                                    label: 'Accompagenement Consulaire', //Lecture
                                    icon: 'pi pi-whatsapp',
                                    routerLink: ['/international/consulaire'],
                                },

                                {
                                    label: "Gestion de l'équipe", //Lecture
                                    icon: 'pi pi-briefcase',
                                    items: [
                                        {
                                            label: 'Gestion des membres',
                                            icon: 'pi pi-user',
                                            routerLink: [
                                                '/international/member',
                                            ],
                                        },
                                        {
                                            label: "Gestion de l'équipe",
                                            icon: 'pi pi-users',
                                            routerLink: [
                                                '/international/teams',
                                            ],
                                        },
                                    ],
                                },
                            ],
                        });
                }
                if (response.type == "Prospect") {
                    this.AdmissionService.getByUserId(this.token.id).subscribe(p => {
                        this.CandidatureService.getByLead(p?._id).subscribe(c => {
                            this.showMenu = false
                            let t1 = "Fiche de Renseignement ✅"
                            let t2 = "Demande de candidature ❌"
                            let t3 = "Dossier de candidature ❌"
                            if (c != null)
                                t2 = "Demande de candidature ✅"
                            if (!isCHECK3(p.documents_dossier))
                                t3 = "Dossier de candidature ✅"
                            this.items = [
                                {
                                    label: t1,
                                    icon: "pi pi-id-card",
                                    routerLink: ['/admission/lead-informations/' + p._id]
                                },
                                {
                                    label: t2,
                                    icon: "pi pi-list",
                                    routerLink: ['/admission/lead-candidature/' + p._id]
                                },
                                {
                                    label: t3,
                                    icon: "pi pi-briefcase",
                                    routerLink: ['/admission/lead-dossier/' + p._id]
                                },
                                {
                                    label: 'Evaluation',
                                    icon: "pi pi-pencil",
                                    routerLink: ['/admission/lead-evaluation']
                                },
                                {
                                    label: "Suivre ma candidature",
                                    icon: "pi pi-list",
                                    routerLink: ['/admission/lead-suivi/' + p._id]
                                },
                                {
                                    label: "Paiements",
                                    icon: "pi pi-credit-card",
                                    routerLink: ['/admission/lead-paiements/' + p._id]
                                },
                                {
                                    label: "Documents Administratifs",
                                    icon: "pi pi-file",
                                    routerLink: ['/admission/lead-documents/' + p._id]
                                },
                            ]
                            setTimeout(() => this.showMenu = true, 0);
                        })
                    })
                }
                if (services_list.includes('Mailing')) {
                    let role = service_dic['Mailing']
                    if (role == "Super-Admin") {
                        this.items.push(
                            {
                                label: 'Gestions des emails',
                                icon: 'pi pi-envelope',
                                items: [
                                    {
                                        label: 'Configuration des adresses mails',
                                        icon: 'pi pi-cog',
                                        routerLink: ['/mails/configuration']
                                    },
                                    {
                                        label: 'Mails types',
                                        icon: 'pi pi-bars',
                                        routerLink: ['/mails/type']
                                    },
                                    {
                                        label: 'Mails automatisés',
                                        icon: 'pi pi-sync',
                                        routerLink: ['/mails/auto']
                                    },
                                ]
                            }
                        )
                    } else if (role == "Admin") {
                        this.items.push(
                            {
                                label: 'Gestions des emails',
                                icon: 'pi pi-envelope',
                                items: [
                                    {
                                        label: 'Mails types',
                                        icon: 'pi pi-bars',
                                        routerLink: ['/mails/type']
                                    },
                                    {
                                        label: 'Mails automatisés',
                                        icon: 'pi pi-sync',
                                        routerLink: ['/mails/auto']
                                    },
                                ]
                            }
                        )
                    }
                }
                if (services_list.includes('CRM')) {
                    let role = service_dic['CRM']
                    this.TeamCRMService.MIgetByUSERID(this.token.id).subscribe(member => {
                        this.showMenu = false
                        if (role == 'Super-Admin') {
                            this.items.push(
                                {
                                    label: 'CRM',
                                    icon: 'pi pi-database',
                                    items: [
                                        /*{
                                            label: 'Insertion',
                                            icon: 'pi pi-user-plus',
                                            items: [
                                                /*{
                                                label: 'Ajouter un lead',
                                                icon: 'pi pi-user-plus',
                                                routerLink: [
                                                    'crm/leads/ajout',
                                                ],
                                            }, 
                                                {
                                                    label: 'Importer',
                                                    icon: 'pi pi-database',
                                                    routerLink: ['crm/import'],
                                                },
                                            ],
                                        },*/
                                        {
                                            label: 'Liste des leads',
                                            icon: 'pi pi-users',
                                            routerLink: ['crm/liste'],
                                        },/*
                                        {
                                            label: 'Qualification',
                                            icon: 'pi pi-star',
                                            items: [
                                                {
                                                    label: 'Les leads non qualifiés',
                                                    icon: 'pi pi-star-fill',
                                                    routerLink: [
                                                        'crm/leads/non-qualifies',
                                                    ],
                                                },
                                                {
                                                    label: 'Les leads préqualifiés',
                                                    icon: 'pi pi-star',
                                                    routerLink: [
                                                        'crm/leads/pre-qualifies',
                                                    ],
                                                },
                                                {
                                                    label: 'Les leads qualifiés',
                                                    icon: 'pi pi-star',
                                                    routerLink: [
                                                        'crm/leads/qualifies',
                                                    ],
                                                },
                                                {
                                                    label: 'Les ventes',
                                                    icon: 'pi pi-chart-line',
                                                    routerLink: [''],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Communication',
                                            icon: 'pi pi-share-alt',
                                            items: [
                                                {
                                                    label: 'Facebook',
                                                    icon: 'pi pi-facebook',
                                                    routerLink: [''],
                                                },
                                                {
                                                    label: 'Instagram',
                                                    icon: 'pi pi-instagram',
                                                    routerLink: [''],
                                                },
                                                {
                                                    label: 'WhatsApp',
                                                    icon: 'pi pi-whatsapp',
                                                    routerLink: [''],
                                                },
                                                {
                                                    label: 'ChatBot',
                                                    icon: 'pi pi-comments',
                                                    routerLink: [''],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Target',
                                            icon: 'pi pi-flag',
                                            items: [
                                                {
                                                    label: 'Configuration',
                                                    icon: 'pi pi-cog',
                                                    routerLink: [
                                                        'crm/target/configuration',
                                                    ],
                                                },
                                                {
                                                    label: 'My target',
                                                    icon: 'pi pi-user',
                                                    routerLink: [
                                                        'crm/target/my-target',
                                                    ],
                                                },
                                                {
                                                    label: 'Dashboard Général',
                                                    icon: 'pi pi-chart-pie',
                                                    routerLink: [
                                                        'crm/target/dashboard',
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Mes taches',
                                            icon: 'pi pi-briefcase',
                                            items: [],
                                        },
                                        {
                                            label: 'Support Commercial',
                                            icon: 'pi pi-comment',
                                            items: [
                                                {
                                                    label: 'Mails Type',
                                                    icon: 'pi pi-envelope',
                                                    routerLink: [''],
                                                },
                                                {
                                                    label: 'Discours',
                                                    icon: 'pi pi-comment',
                                                    routerLink: [''],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Pipeline',
                                            icon: 'pi pi-filter',
                                            items: [],
                                        },
                                        */{
                                            label: 'Configuration',
                                            icon: 'pi pi-cog',
                                            items: [
                                                {
                                                    label: 'Gestion des membres',
                                                    icon: 'pi pi-user',
                                                    routerLink: ['crm/member'],
                                                },
                                                {
                                                    label: 'Gestion des équipes',
                                                    icon: 'pi pi-users',
                                                    routerLink: ['crm/teams'],
                                                },
                                                {
                                                    label: 'Gestion des critères',
                                                    icon: 'pi pi-users',
                                                    routerLink: ['crm-criteres'],
                                                },
                                                {
                                                    label: 'Gestion des produits',
                                                    icon: 'pi pi-briefcase',
                                                    routerLink: ['crm/gestion-produits'],
                                                },
                                                {
                                                    label: 'Gestion des sources',
                                                    icon: 'pi pi-map-marker',
                                                    routerLink: ['crm/gestion-sources'],
                                                },
                                                {
                                                    label: 'Gestion des opérations',
                                                    icon: 'pi pi-tablet',
                                                    routerLink: ['crm/gestion-operations'],
                                                },
                                            ],
                                        },/*
                                        {
                                            label: 'Dashboard',
                                            icon: 'pi pi-tablet',
                                            items: [
                                                {
                                                    label: 'Equipe',
                                                    icon: 'pi pi-users',
                                                    routerLink: [''],
                                                },
                                                {
                                                    label: 'Ma performance',
                                                    icon: 'pi pi-chart-bar',
                                                    routerLink: [''],
                                                },
                                            ],
                                        },*/
                                    ],
                                });
                        } else if (role == 'Admin') {
                            this.items.push({
                                label: 'CRM',
                                icon: 'pi pi-database',
                                items: [
                                    /*{
                                        label: 'Insertion',
                                        icon: 'pi pi-user-plus',
                                        items: [
                                            /*{
                                                label: 'Ajouter un lead',
                                                icon: 'pi pi-user-plus',
                                                routerLink: [
                                                    'crm/leads/ajout',
                                                ],
                                            },
                                            {
                                                label: 'Importer',
                                                icon: 'pi pi-database',
                                                routerLink: ['crm/import'],
                                            },
                                        ],
                                    },*/
                                    {
                                        label: 'Liste des leads',
                                        icon: 'pi pi-users',
                                        routerLink: ['crm/liste'],
                                    },
                                    {
                                        label: 'Qualification',
                                        icon: 'pi pi-star',
                                        items: [
                                            {
                                                label: 'Les leads non qualifiés',
                                                icon: 'pi pi-star-fill',
                                                routerLink: [
                                                    'crm/leads/non-qualifies',
                                                ],
                                            },
                                            {
                                                label: 'Les leads préqualifiés',
                                                icon: 'pi pi-star',
                                                routerLink: [
                                                    'crm/leads/pre-qualifies',
                                                ],
                                            },
                                            {
                                                label: 'Les leads qualifiés',
                                                icon: 'pi pi-star',
                                                routerLink: [
                                                    'crm/leads/qualifies',
                                                ],
                                            },
                                            {
                                                label: 'Les ventes',
                                                icon: 'pi pi-chart-line',
                                                routerLink: [''],
                                            },
                                        ],
                                    },
                                    {
                                        label: 'Communication',
                                        icon: 'pi pi-share-alt',
                                        items: [
                                            {
                                                label: 'Facebook',
                                                icon: 'pi pi-facebook',
                                                routerLink: [''],
                                            },
                                            {
                                                label: 'Instagram',
                                                icon: 'pi pi-instagram',
                                                routerLink: [''],
                                            },
                                            {
                                                label: 'WhatsApp',
                                                icon: 'pi pi-whatsapp',
                                                routerLink: [''],
                                            },
                                            {
                                                label: 'ChatBot',
                                                icon: 'pi pi-comments',
                                                routerLink: [''],
                                            },
                                        ],
                                    },
                                    {
                                        label: 'Target',
                                        icon: 'pi pi-flag',
                                        items: [
                                            {
                                                label: 'Configuration',
                                                icon: 'pi pi-cog',
                                                routerLink: [
                                                    'crm/target/configuration',
                                                ],
                                            },
                                            {
                                                label: 'My target',
                                                icon: 'pi pi-user',
                                                routerLink: [
                                                    'crm/target/my-target',
                                                ],
                                            },
                                            {
                                                label: 'Dashboard Général',
                                                icon: 'pi pi-chart-pie',
                                                routerLink: [
                                                    'crm/target/dashboard',
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        label: 'Mes taches',
                                        icon: 'pi pi-briefcase',
                                        items: [],
                                    },
                                    {
                                        label: 'Support Commercial',
                                        icon: 'pi pi-comment',
                                        items: [
                                            {
                                                label: 'Mails Type',
                                                icon: 'pi pi-envelope',
                                                routerLink: [''],
                                            },
                                            {
                                                label: 'Discours',
                                                icon: 'pi pi-comment',
                                                routerLink: [''],
                                            },
                                        ],
                                    },
                                    {
                                        label: 'Pipeline',
                                        icon: 'pi pi-filter',
                                        items: [],
                                    },
                                    {
                                        label: 'Dashboard',
                                        icon: 'pi pi-tablet',
                                        items: [
                                            {
                                                label: 'Equipe',
                                                icon: 'pi pi-users',
                                                routerLink: [''],
                                            },
                                            {
                                                label: 'Ma performance',
                                                icon: 'pi pi-chart-bar',
                                                routerLink: [''],
                                            },
                                        ],
                                    },
                                ],
                            });
                        } else if (role == 'Agent') {
                            this.items.push({
                                label: 'CRM',
                                icon: 'pi pi-database',
                                items: [
                                    {
                                        label: 'Insertion',
                                        icon: 'pi pi-user-plus',
                                        items: [
                                            /*{
                                                label: 'Ajouter un lead',
                                                icon: 'pi pi-user-plus',
                                                routerLink: [
                                                    'crm/leads/ajout',
                                                ],
                                            }, */
                                            {
                                                label: 'Importer',
                                                icon: 'pi pi-database',
                                                routerLink: ['crm/import'],
                                            },
                                        ],
                                    },
                                    {
                                        label: 'Liste des leads',
                                        icon: 'pi pi-users',
                                        items: [
                                            {
                                                label: 'Mes Leads',
                                                icon: 'pi pi-user',
                                                routerLink: [
                                                    'crm/mes-leads/liste/' +
                                                    member?._id,
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        label: 'Qualification',
                                        icon: 'pi pi-star',
                                        items: [
                                            {
                                                label: 'Les leads non qualifiés',
                                                icon: 'pi pi-star-fill',
                                                routerLink: [
                                                    'crm/leads/non-qualifies',
                                                ],
                                            },
                                            {
                                                label: 'Les leads préqualifiés',
                                                icon: 'pi pi-star',
                                                routerLink: [
                                                    'crm/leads/pre-qualifies',
                                                ],
                                            },
                                            {
                                                label: 'Les leads qualifiés',
                                                icon: 'pi pi-star',
                                                routerLink: [
                                                    'crm/leads/qualifies',
                                                ],
                                            },
                                            {
                                                label: 'Les ventes',
                                                icon: 'pi pi-chart-line',
                                                routerLink: [''],
                                            },
                                        ],
                                    },
                                    {
                                        label: 'Communication',
                                        icon: 'pi pi-share-alt',
                                        items: [
                                            {
                                                label: 'Facebook',
                                                icon: 'pi pi-facebook',
                                                routerLink: [''],
                                            },
                                            {
                                                label: 'Instagram',
                                                icon: 'pi pi-instagram',
                                                routerLink: [''],
                                            },
                                            {
                                                label: 'WhatsApp',
                                                icon: 'pi pi-whatsapp',
                                                routerLink: [''],
                                            },
                                            {
                                                label: 'ChatBot',
                                                icon: 'pi pi-comments',
                                                routerLink: [''],
                                            },
                                        ],
                                    },
                                    {
                                        label: 'Target',
                                        icon: 'pi pi-flag',
                                        items: [
                                            {
                                                label: 'Configuration',
                                                icon: 'pi pi-cog',
                                                routerLink: [
                                                    'crm/target/configuration',
                                                ],
                                            },
                                            {
                                                label: 'My target',
                                                icon: 'pi pi-user',
                                                routerLink: [
                                                    'crm/target/my-target',
                                                ],
                                            },
                                            {
                                                label: 'Dashboard Général',
                                                icon: 'pi pi-chart-pie',
                                                routerLink: [
                                                    'crm/target/dashboard',
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        label: 'Mes taches',
                                        icon: 'pi pi-briefcase',
                                        items: [],
                                    },
                                    {
                                        label: 'Support Commercial',
                                        icon: 'pi pi-comment',
                                        items: [
                                            {
                                                label: 'Mails Type',
                                                icon: 'pi pi-envelope',
                                                routerLink: [''],
                                            },
                                            {
                                                label: 'Discours',
                                                icon: 'pi pi-comment',
                                                routerLink: [''],
                                            },
                                        ],
                                    },
                                    {
                                        label: 'Pipeline',
                                        icon: 'pi pi-filter',
                                        items: [],
                                    },
                                    {
                                        label: 'Dashboard',
                                        icon: 'pi pi-tablet',
                                        items: [
                                            {
                                                label: 'Ma performance',
                                                icon: 'pi pi-chart-bar',
                                                routerLink: [''],
                                            },
                                        ],
                                    },
                                ],
                            });
                        } else {
                            this.items.push({
                                label: 'CRM',
                                icon: 'pi pi-database',
                                items: [
                                    {
                                        label: 'Liste des leads',
                                        icon: 'pi pi-users',
                                        items: [
                                            {
                                                label: 'Tout les leads',
                                                icon: 'pi pi-users',
                                                routerLink: [
                                                    'crm/leads/liste',
                                                ],
                                            },
                                            {
                                                label: 'Leads non attribués',
                                                icon: 'pi pi-user-edit',
                                                routerLink: [
                                                    'crm/leads/liste-non-attribue',
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        label: 'Support Commercial',
                                        icon: 'pi pi-comment',
                                        items: [
                                            {
                                                label: 'Mails Type',
                                                icon: 'pi pi-envelope',
                                                routerLink: [''],
                                            },
                                            {
                                                label: 'Discours',
                                                icon: 'pi pi-comment',
                                                routerLink: [''],
                                            },
                                        ],
                                    },
                                    {
                                        label: 'Pipeline',
                                        icon: 'pi pi-filter',
                                        items: [],
                                    },
                                    {
                                        label: 'Dashboard',
                                        icon: 'pi pi-tablet',
                                        items: [
                                            {
                                                label: 'Equipe',
                                                icon: 'pi pi-users',
                                                routerLink: [''],
                                            },
                                        ],
                                    },
                                ],
                            });
                        }
                        setTimeout(() => (this.showMenu = true), 0);
                    }
                    );
                }
                if (services_list.includes('Admission')) {
                    this.items.push({
                        label: 'Admission',
                        icon: 'pi pi-fw pi-check-circle',
                        items: [
                            {
                                label: 'Gestions des Leads',
                                icon: 'pi pi-users',
                                items: [
                                    {
                                        label: 'En attente de traitement',
                                        icon: 'pi pi-spin pi-spinner',
                                        routerLink: [
                                            '/gestion-preinscriptions-filtered/En attente de traitement',
                                        ],
                                    },
                                    {
                                        label: 'Dossiers traités',
                                        icon: 'pi pi-check-circle',
                                        routerLink: [
                                            '/gestion-preinscriptions-filter/traite',
                                        ],
                                    },
                                    {
                                        label: 'Ajouter un dossier',
                                        icon: 'pi pi-user-plus',
                                        routerLink: ['/ajout-lead'],
                                    },
                                ],
                            },
                            {
                                label: 'Admission Dubai',
                                icon: 'pi pi-users',
                                items: [
                                    {
                                        label: 'Nouvelle demande admission',
                                        icon: 'pi pi-pencil',
                                        routerLink: ['/admission/dubai-form'],
                                    },
                                    {
                                        label: "Liste des demandes d'admission",
                                        icon: 'pi pi-file-excel',
                                        routerLink: [
                                            '/admission/dubai-form-results',
                                        ],
                                    },
                                ],
                            },
                            {
                                label: 'Dashboard',
                                icon: 'pi pi-users',
                                routerLink: ['/gestion-preinscriptions'],
                            },
                            {
                                label: 'Gestions des leads Intuns',
                                icon: 'pi pi-user-plus',
                                routerLink: ['/prospects-intuns'],
                            },
                            {
                                label: 'Gestion des participantes pour les événements',
                                icon: 'pi pi-users',
                                routerLink: ['/list-events'],
                            },
                        ],
                    });
                }
                if (
                    services_list.includes('Commercial') ||
                    services_list.includes('Commerciale')
                ) {
                    this.items.push({
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
                                        routerLink: ['/skillsnet/ajout-entreprise'],
                                    },
                                    {
                                        label: 'Liste des entreprises',
                                        icon: 'pi pi-sort-alpha-down',
                                        routerLink: ['/pedagogie/entreprises'],
                                    },
                                ],
                            },
                            {
                                label: 'Gestion des tuteurs',
                                icon: 'pi pi-user',
                                routerLink: ['//pedagogie/tuteur'],
                            },
                            {
                                label: 'Placement',
                                icon: 'pi pi-star',
                                items: [
                                    {
                                        label: 'Alternances',
                                        icon: 'pi pi-list',
                                        routerLink: ['/pedagogie/liste-contrats'],
                                    },
                                    {
                                        label: 'Stages',
                                        icon: 'pi pi-briefcase',
                                        routerLink: ['/stages'],
                                    },
                                ],
                            },
                            {
                                label: 'Gestion des équipes de conseillers',
                                icon: 'pi pi-users',
                                routerLink: ['/equipe-commercial'],
                            },
                            {
                                label: 'Gestion des leads alternables',
                                icon: 'pi pi-briefcase',
                                routerLink: ['/prospects-alt'],
                            },
                            {
                                label: 'Ajouter un dossier',
                                icon: 'pi pi-user-plus',
                                routerLink: ['/ajout-lead'],
                            },
                        ],
                    });
                }
                if (
                    services_list.includes('Pédagogie') ||
                    services_list.includes('Pedagogie')
                ) {
                    this.items.push(
                        {
                            label: 'Pédagogie',
                            icon: 'pi pi-fw pi-folder',
                            items: [
                                {
                                    label: 'Gestion des modules',
                                    icon: 'pi pi-fw pi-tags',
                                    routerLink: ['/pedagogie/matieres'],
                                },
                                {
                                    label: 'Gestion des groupes',
                                    icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'Ajouter un groupe',
                                            icon: 'pi pi-plus-circle',
                                            routerLink: ['/ajout-groupe'],
                                        },
                                        {
                                            label: 'Liste des groupes',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/groupes'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Gestion des séances',
                                    icon: 'pi pi-video',
                                    items: [
                                        {
                                            label: 'Ajouter une séance',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/pedagogie/ajout-seance'],
                                        },
                                        {
                                            label: 'Voir la liste des séances',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/pedagogie/seances'],
                                        },
                                        {
                                            label: "Voir l'emploi du temps des séances",
                                            icon: 'pi pi-calendar',
                                            routerLink: ['/pedagogie/emploi-du-temps'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Gestions des formateurs',
                                    icon: 'pi pi-id-card',
                                    items: [
                                        {
                                            label: 'Ajouter un formateur',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/pedagogie/ajout-formateur'],
                                        },
                                        {
                                            label: 'Liste des formateurs',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/pedagogie/formateurs'],
                                        },
                                    ],
                                },
                                {
                                    label: "Gestion des inscrits en attente d'assignation",
                                    icon: 'pi pi-user-plus',
                                    routerLink: ['/pedagogie/assignation-inscrit'],
                                },
                                {
                                    label: 'Gestions des étudiants',
                                    icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'Ajouter un étudiant',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/pedagogie/ajout-etudiant'],
                                        },
                                        {
                                            label: 'Liste des étudiants',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['pedagogie/etudiants'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Gestions des évaluations',
                                    icon: 'pi pi-copy',
                                    items: [
                                        {
                                            label: 'Ajouter une évaluation',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/pedagogie/ajout-examen'],
                                        },
                                        {
                                            label: 'Liste des évaluations',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/pedagogie/examens'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Gestions des Bulletins de notes',
                                    icon: 'pi pi-pencil',
                                    routerLink: ['/notes'],
                                },
                                {
                                    label: 'Gestions des devoirs',
                                    icon: 'pi pi-book',
                                    routerLink: 'devoirs',
                                },
                            ],
                        },
                        {
                            label: 'Questionnaire',
                            icon: 'pi pi-sort-alpha-down',
                            items: [
                                {
                                    label: 'Questionnaire satisfaction',
                                    icon: 'pi pi-heart',
                                    routerLink: ['/pedagogie/resultat-qs'],
                                },
                                {
                                    label: 'Questionnaire formateur',
                                    icon: 'pi pi-briefcase',
                                    routerLink: ['/pedagogie/resultat-qf'],
                                },
                                {
                                    label: 'Questionnaire fin de formation',
                                    icon: 'pi pi-check-circle',
                                    routerLink: ['pedagogie/resultat-qff'],
                                },
                                {
                                    label: 'Questionnaire ICBS Event title',
                                    icon: 'pi pi-question-circle',
                                    routerLink: ['resultats-icbs'],
                                },
                            ],
                        }
                    );
                }
                if (services_list.includes('Administration')) {
                    this.items.push(
                        {
                            label: 'Administration V2',
                            icon: 'pi pi-users',
                            items: [

                                {
                                    label: 'Préinscription - Admission',
                                    icon: 'pi pi-prime',
                                    routerLink: ['/administration/preinscription']
                                },
                                {
                                    label: 'Inscription',
                                    icon: 'pi pi-prime',
                                    routerLink: ['/administration/inscription']
                                },
                                {
                                    label: 'Paramètres',
                                    icon: 'pi pi-cog',
                                    items: [
                                        {
                                            label: 'Session',
                                            icon: 'pi pi-prime',
                                            routerLink: ['/admission/rentree']
                                        },
                                        {
                                            label: 'Ecole',
                                            icon: 'pi pi-list',
                                            routerLink: ['/admission/ecoles']
                                        },
                                        {
                                            label: 'Campus',
                                            icon: 'pi pi-map-marker',
                                            routerLink: ['/administrations/campus']
                                        },
                                        {
                                            label: 'Formation',
                                            icon: 'pi pi-prime',
                                            routerLink: ['/admission/formations']
                                        },
                                        {
                                            label: 'Groupes',
                                            icon: 'pi pi-users',
                                            routerLink: ['/new-groupes']
                                        },
                                        {
                                            label: 'Evaluations',
                                            icon: 'pi pi-prime',
                                            routerLink: ['/administration/evaluation']
                                        },
                                    ]
                                },
                            ]
                        }
                    )
                }
                if (services_list.includes('iMatch')) {
                    let role = service_dic['iMatch']
                    if (role == "Super-Admin") {
                        this.items.push(
                            {
                                label: 'iMatch',
                                icon: 'pi pi-star',
                                items: [
                                    {
                                        label: 'Entreprise',
                                        icon: 'pi pi-building',
                                        routerLink: ['/skillsnet/entreprise']
                                    },
                                    {
                                        label: "Offres",
                                        icon: 'pi pi-volume-up',
                                        routerLink: ['/skillsnet/offres'],
                                    },
                                    /*{
                                        label: 'Mes offres',
                                        icon: 'pi pi-user',
                                        routerLink: ['/skillsnet/mes-offres'],
                                    },*/
                                    {
                                        label: 'Cvthèque',
                                        icon: 'pi pi-list',
                                        routerLink: ['/i-match/cvtheque-interne']
                                    },
                                    {
                                        label: 'Reporting',
                                        icon: 'pi pi-chart-line',
                                        routerLink: ['/skillsnet/reporting']
                                    },
                                    /*{
                                        label: 'Gestion des compétences',
                                        icon: 'pi pi-book',
                                        routerLink: ['/skillsnet/skills-management'],
                                    },
                                    {
                                        label: 'Gestions des externes',
                                        icon: 'pi pi-users',
                                        routerLink: ['/i-match/externe'],
                                    },
                                    {
                                        label: 'Gestions des événements',
                                        icon: 'pi pi-flag',
                                        routerLink: ['/skillsnet/evenements'],
                                    },*/
                                    /*{
                                        label: 'Cvthèque Externe',
                                        icon: 'pi pi-briefcase',
                                        routerLink: ['/imatch'],
                                    },*/
                                    /*{
                                        label: 'Rendez-vous',
                                        icon: 'pi pi-calendar',
                                        routerLink: ['/imatch/rendez-vous']
                                    }*/
                                ],
                            },
                        )
                    } else
                        this.items.push({
                            label: 'iMatch',
                            icon: 'pi pi-star',
                            items: [
                                {
                                    label: 'Gestions des entreprises',
                                    icon: 'pi pi-home',
                                    items: [
                                        {
                                            label: 'Ajouter une entreprise',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/skillsnet/ajout-entreprise']
                                        },
                                        {
                                            label: 'Liste des entreprises',
                                            icon: 'pi pi-sort-alpha-down',
                                            routerLink: ['/pedagogie/entreprises']
                                        },
                                    ]
                                },
                                {
                                    label: 'Générateur de documents',
                                    icon: 'pi pi-folder',
                                    routerLink: ['/genDoc']
                                },
                            ],
                        })
                }
                if (services_list.includes('Générateur de Document')) {
                    let role = service_dic['Générateur de Document']
                    if (role == "Agent") {
                        this.items.push({
                            label: "Genérateur de documents",
                            icon: 'pi pi-folder-open',
                            items: [
                                {
                                    label: 'Documents',
                                    icon: 'pi pi-folder',
                                    routerLink: ['/genDoc']
                                },
                            ]
                        })
                    } else if (role == "Super-Admin") {
                        this.items.push({
                            label: "Genérateur de documents",
                            icon: 'pi pi-folder-open',
                            items: [
                                {
                                    label: 'Campus',
                                    icon: 'pi pi-home',
                                    routerLink: ['/genCampus']
                                },
                                {
                                    label: "Ecoles",
                                    icon: 'pi pi-building',
                                    routerLink: ['/genschools']
                                },
                                {
                                    label: 'Formation',
                                    icon: 'pi pi-align-justify',
                                    routerLink: ['/genFormation']
                                },
                                {
                                    label: 'Documents',
                                    icon: 'pi pi-folder',
                                    routerLink: ['/genDoc']
                                },
                            ]
                        })
                    } else if (role == "Admin") {
                        this.items.push({
                            label: "Genérateur de documents",
                            icon: 'pi pi-folder-open',
                            items: [
                                {
                                    label: 'Formation',
                                    icon: 'pi pi-align-justify',
                                    routerLink: ['/genFormation']
                                },
                                {
                                    label: 'Documents',
                                    icon: 'pi pi-folder',
                                    routerLink: ['/genDoc']
                                },
                            ]
                        })
                    } else if (role == "Spectateur") {
                        this.items.push({
                            label: "Genérateur de documents",
                            icon: 'pi pi-folder-open',
                            items: [
                                {
                                    label: 'Documents',
                                    icon: 'pi pi-folder',
                                    routerLink: ['/genDoc']
                                },
                            ]
                        })
                    }


                }
                if (services_list.includes('Ressources Humaines')) {
                    this.items.push(
                        {
                            label: 'Ressources humaines',
                            icon: 'pi pi-users',
                            items: [
                                {
                                    label: 'Dashboard',
                                    icon: 'pi pi-home',
                                    routerLink: ['/rh/dashboard'],
                                },
                                {
                                    label: 'Demandes',
                                    icon: 'pi pi-calendar',
                                    routerLink: ['/rh/conges-autorisations'],
                                },
                                {
                                    label: 'Collaborateurs',
                                    icon: 'pi pi-users',
                                    routerLink: ['/rh/collaborateurs'],
                                },

                                {
                                    label: 'Calendrier',
                                    icon: 'pi pi-calendar',
                                    routerLink: ['/rh/calendrier'],
                                },

                            ],
                        }
                    )
                }
                if (services_list.includes('Admin IMS') || (response.role == 'Admin' && response.haveNewAccess)) {
                    this.items.push(
                        {
                            label: "Admin IMS",
                            icon: 'pi pi-star',
                            items: [
                                {
                                    label: 'Project',
                                    icon: 'pi pi-list',
                                    items: [
                                        {
                                            label: "Gestion de Projet",
                                            icon: 'pi pi-database',
                                            routerLink: ['/gestion-project']
                                        },
                                        {
                                            label: 'Mes Tâches',
                                            icon: 'pi ppi-bookmark',
                                            routerLink: ['/mytask']
                                        },
                                        {
                                            label: 'Mes projets',
                                            icon: 'pi pi-briefcase',
                                            routerLink: ['/myproject']
                                        },
                                        {
                                            label: 'Dashboard',
                                            icon: 'pi pi-chart-bar',
                                            routerLink: ['/dashboard-project-v2']
                                        }
                                    ]
                                },
                                {
                                    label: 'Booking V2',
                                    icon: 'pi pi-building',
                                    items: [
                                        {
                                            label: 'Configuration',
                                            icon: 'pi pi-cog',
                                            routerLink: ['booking/configuration'],
                                        },
                                        {
                                            label: 'Liste des demandes des rendez-vous',
                                            icon: 'pi pi-list',
                                            routerLink: ['gestion-reservations']
                                        },
                                        {
                                            label: 'Logements',
                                            icon: 'pi pi-building',
                                            routerLink: ['logements']
                                        }
                                    ]
                                },
                                {
                                    label: 'Remboursement',
                                    icon: 'pi pi-dollar',
                                    items: [
                                        {
                                            label: 'Ajouter',
                                            icon: 'pi pi-plus-circle',
                                            routerLink: ['/ajout-remboursement'],
                                        },
                                        {
                                            label: 'Liste',
                                            icon: 'pi pi-fw pi-tags',
                                            routerLink: ['/remboursements'],
                                        },
                                    ]
                                },

                                {
                                    label: 'Evaluation Lead',
                                    icon: 'pi pi-pencil',
                                    routerLink: ['/admission/lead-evaluation']
                                },
                                {
                                    label: "Pointeuse",
                                    icon: 'pi pi-camera',
                                    items: [
                                        {
                                            label: "Configuration",
                                            icon: 'pi pi-cog',
                                            routerLink: ['/pointeuse/configuration']
                                        }, {
                                            label: "Activités",
                                            icon: 'pi pi-desktop',
                                            routerLink: ['/pointage/configuration']
                                        },
                                        {
                                            label: "Historique",
                                            icon: 'pi pi-book',
                                            routerLink: ['/pointage/archivage']
                                        },
                                    ]

                                },
                                {
                                    label: 'Gestion RH',
                                    icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'Gestion des équipes',
                                            icon: 'pi pi-users',
                                            routerLink: ['/rh/teams']
                                        }
                                    ]
                                }, {
                                    label: 'Ancien Administration',
                                    icon: 'pi pi-fw pi-inbox',
                                    items: [
                                        {
                                            label: 'Gestions des années scolaires',
                                            icon: 'pi pi-calendar',
                                            items: [
                                                {
                                                    label: 'Ajouter une année scolaire',
                                                    icon: 'pi pi-calendar-plus',
                                                    routerLink: ['/ajout-annee-scolaire'],
                                                },
                                                {
                                                    label: 'Liste des années scolaires',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/annee-scolaire'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des écoles',
                                            icon: 'pi pi-home',
                                            items: [
                                                {
                                                    label: 'Ajouter une école',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: ['/ajout-ecole'],
                                                },
                                                {
                                                    label: 'Liste des écoles',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/ecole'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des campus',
                                            icon: 'pi pi-home',
                                            items: [
                                                {
                                                    label: 'Ajouter un campus',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: ['/ajout-campus'],
                                                },
                                                {
                                                    label: 'Liste des campus',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/campus'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Gestions des diplômes',
                                            icon: 'pi pi-bookmark',
                                            items: [
                                                {
                                                    label: 'Ajouter un diplôme',
                                                    icon: 'pi pi-plus-circle',
                                                    routerLink: ['/ajout-diplome'],
                                                },
                                                {
                                                    label: 'Liste des diplômes',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/diplomes'],
                                                },
                                            ],
                                        },

                                        {
                                            label: 'Gestions des agents',
                                            icon: 'pi pi-users',
                                            items: [
                                                {
                                                    label: 'Ajouter un agent',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: ['/admin/ajout-agent'],
                                                },
                                                {
                                                    label: 'Liste des agents',
                                                    icon: 'pi pi-sort-alpha-down',
                                                    routerLink: ['/admin/agents'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Validation des inscrits',
                                            icon: 'pi pi-check-square',
                                            routerLink: ['/validation-inscrit'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Ticketing',
                                    icon: 'pi pi-ticket',
                                    routerLink: ['/ticketing/configuration']
                                },
                                {
                                    label: 'Configuration des mentions et services',
                                    icon: 'pi pi-cog',
                                    routerLink: ['/configuration/service-mention']
                                },
                                {
                                    label: 'Gestion des Agents',
                                    icon: 'pi pi-users',
                                    items: [
                                        {
                                            label: 'Ajouter un agent',
                                            icon: 'pi pi-plus',
                                            routerLink: ['/agent/ajout'],
                                        },
                                        {
                                            label: 'Liste des agents',
                                            icon: 'pi pi-users',
                                            routerLink: ['/agent/list'],
                                        },
                                    ],
                                },
                                {
                                    label: 'Actualité et notifications',
                                    icon: 'pi pi-tags',
                                    routerLink: ['/rh/actualite-notifications'],
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
                                            routerLink: ['pedagogie/gestion-etudiants'],
                                        },
                                        {
                                            label: 'Infos IMS',
                                            icon: 'pi pi-fw pi-info-circle',
                                            routerLink: ['/infos-ims'],
                                        },
                                        {
                                            label: 'Template Code',
                                            icon: 'pi pi-copy',
                                            items: [
                                                {
                                                    label: 'Formulaire',
                                                    icon: 'pi pi-align-center',
                                                    routerLink: ['/template/formulaire/GH4'],
                                                },
                                            ]
                                        },
                                    ],
                                },
                                {
                                    label: 'Support',
                                    icon: 'pi pi-cog',
                                    items: [
                                        {
                                            label: 'Étudiants en attente de leur compte IMS',
                                            icon: 'pi pi-user-plus',
                                            routerLink: ['/assign-ims'],
                                        },
                                    ],
                                },
                                {
                                    label: 'iMatch',
                                    icon: 'pi pi-briefcase',
                                    items: [{
                                        label: 'Mes offres',
                                        icon: 'pi pi-user',
                                        routerLink: ['/skillsnet/mes-offres'],
                                    }, {
                                        label: 'Gestion des compétences',
                                        icon: 'pi pi-book',
                                        routerLink: ['/skillsnet/skills-management'],
                                    },
                                    {
                                        label: 'Gestions des externes',
                                        icon: 'pi pi-users',
                                        routerLink: ['/i-match/externe'],
                                    },
                                    {
                                        label: 'Gestions des événements',
                                        icon: 'pi pi-flag',
                                        routerLink: ['/skillsnet/evenements'],
                                    }
                                        , {
                                        label: 'Rendez-vous',
                                        icon: 'pi pi-calendar',
                                        routerLink: ['/imatch/rendez-vous']
                                    }, {
                                        label: 'Cvthèque Externe',
                                        icon: 'pi pi-briefcase',
                                        routerLink: ['/imatch'],
                                    },
                                    ]
                                },
                                {
                                    label: 'CRM',
                                    icon: 'pi pi-database',
                                    items: [
                                        {
                                            label: 'Insertion',
                                            icon: 'pi pi-user-plus',
                                            items: [
                                                {
                                                    label: 'Ajouter un lead',
                                                    icon: 'pi pi-user-plus',
                                                    routerLink: [
                                                        'crm/leads/ajout',
                                                    ],
                                                },
                                                {
                                                    label: 'Importer',
                                                    icon: 'pi pi-database',
                                                    routerLink: ['crm/import'],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Liste des leads',
                                            icon: 'pi pi-users',
                                            routerLink: ['crm/liste'],
                                        },
                                        {
                                            label: 'Qualification',
                                            icon: 'pi pi-star',
                                            items: [
                                                {
                                                    label: 'Les leads non qualifiés',
                                                    icon: 'pi pi-star-fill',
                                                    routerLink: [
                                                        'crm/leads/non-qualifies',
                                                    ],
                                                },
                                                {
                                                    label: 'Les leads préqualifiés',
                                                    icon: 'pi pi-star',
                                                    routerLink: [
                                                        'crm/leads/pre-qualifies',
                                                    ],
                                                },
                                                {
                                                    label: 'Les leads qualifiés',
                                                    icon: 'pi pi-star',
                                                    routerLink: ['crm/leads/qualifies'],
                                                },
                                                {
                                                    label: 'Les ventes',
                                                    icon: 'pi pi-chart-line',
                                                    routerLink: [''],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Communication',
                                            icon: 'pi pi-share-alt',
                                            items: [
                                                {
                                                    label: 'Facebook',
                                                    icon: 'pi pi-facebook',
                                                    routerLink: [''],
                                                },
                                                {
                                                    label: 'Instagram',
                                                    icon: 'pi pi-instagram',
                                                    routerLink: [''],
                                                },
                                                {
                                                    label: 'WhatsApp',
                                                    icon: 'pi pi-whatsapp',
                                                    routerLink: [''],
                                                },
                                                {
                                                    label: 'ChatBot',
                                                    icon: 'pi pi-comments',
                                                    routerLink: [''],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Target',
                                            icon: 'pi pi-flag',
                                            items: [
                                                {
                                                    label: 'Configuration',
                                                    icon: 'pi pi-cog',
                                                    routerLink: [
                                                        'crm/target/configuration',
                                                    ],
                                                },
                                                {
                                                    label: 'My target',
                                                    icon: 'pi pi-user',
                                                    routerLink: [
                                                        'crm/target/my-target',
                                                    ],
                                                },
                                                {
                                                    label: 'Dashboard Général',
                                                    icon: 'pi pi-chart-pie',
                                                    routerLink: [
                                                        'crm/target/dashboard',
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Mes taches',
                                            icon: 'pi pi-briefcase',
                                            items: [],
                                        },
                                        {
                                            label: 'Support Commercial',
                                            icon: 'pi pi-comment',
                                            items: [
                                                {
                                                    label: 'Mails Type',
                                                    icon: 'pi pi-envelope',
                                                    routerLink: [''],
                                                },
                                                {
                                                    label: 'Discours',
                                                    icon: 'pi pi-comment',
                                                    routerLink: [''],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Pipeline',
                                            icon: 'pi pi-filter',
                                            items: [],
                                        },
                                        {
                                            label: 'Configuration',
                                            icon: 'pi pi-cog',
                                            items: [
                                                {
                                                    label: 'Gestion des membres',
                                                    icon: 'pi pi-user',
                                                    routerLink: ['crm/member'],
                                                },
                                                {
                                                    label: 'Gestion des équipes',
                                                    icon: 'pi pi-users',
                                                    routerLink: ['crm/teams'],
                                                },
                                                {
                                                    label: 'Gestion des produits',
                                                    icon: 'pi pi-briefcase',
                                                    routerLink: ['crm/gestion-produits'],
                                                },
                                                {
                                                    label: 'Gestion des sources',
                                                    icon: 'pi pi-map-marker',
                                                    routerLink: [''],
                                                },
                                                {
                                                    label: 'Gestion des opérations',
                                                    icon: 'pi pi-tablet',
                                                    routerLink: [''],
                                                },
                                            ],
                                        },
                                        {
                                            label: 'Dashboard',
                                            icon: 'pi pi-tablet',
                                            items: [
                                                {
                                                    label: 'Equipe',
                                                    icon: 'pi pi-users',
                                                    routerLink: [''],
                                                },
                                                {
                                                    label: 'Ma performance',
                                                    icon: 'pi pi-chart-bar',
                                                    routerLink: [''],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ]
                        },
                    )
                }
                if (services_list.includes('Booking')) {
                    this.items.push({
                        label: 'Booking',
                        icon: ' pi pi-calendar',
                        items: [
                            {
                                label: 'Configuration',
                                icon: 'pi pi-cog',
                                routerLink: ['booking/configuration'],
                            },
                            {
                                label: 'Liste des demandes des rendez-vous',
                                icon: 'pi pi-list',
                            },
                            {
                                label: 'Assigné à moi',
                                icon: 'pi pi-check-circle',
                            },
                            {
                                label: 'Analytics',
                                icon: 'pi pi-chart-pie',
                            },
                        ],
                    })
                }
                if (services_list.includes('Questionnaire')) {
                    this.items.push({
                        label: 'Questionnaire',
                        icon: 'pi pi-sort-alpha-down',
                        items: [
                            {
                                label: 'Questionnaire satisfaction',
                                icon: 'pi pi-heart',
                                routerLink: ['/pedagogie/resultat-qs'],
                            },
                            {
                                label: 'Questionnaire formateur',
                                icon: 'pi pi-briefcase',
                                routerLink: ['/pedagogie/resultat-qf'],
                            },
                            {
                                label: 'Questionnaire fin de formation',
                                icon: 'pi pi-check-circle',
                                routerLink: ['pedagogie/resultat-qff'],
                            },
                            {
                                label: 'Questionnaire ICBS Event title',
                                icon: 'pi pi-question-circle',
                                routerLink: ['resultats-icbs'],
                            },
                            {
                                label: 'Formulaire Mobilité internationale',
                                icon: 'pi pi-car',
                                items: [
                                    {
                                        label: 'Configuration',
                                        icon: 'pi pi-cog',
                                        routerLink: ['formulaireMI/configuration'],
                                    },
                                    {
                                        label: 'Résultats',
                                        icon: 'pi pi-list',
                                        routerLink: ['formulaireMI/resultats'],
                                    }
                                ]
                            }
                        ],
                    },)
                }
                if (services_list.includes('Intuns')) {
                    this.items.push(
                        {
                            label: 'Intuns',
                            icon: 'pi pi-building',
                            items: [
                                {
                                    label: 'Liste des étudiants INTUNS',
                                    icon: 'pi pi-users',
                                    routerLink: ['/intuns/etudiants'],
                                },
                                {
                                    label: 'Liste des formations INTUNS',
                                    icon: 'pi pi-briefcase',
                                    routerLink: ['/intuns/formations'],
                                },
                            ],
                        },
                    )
                }
                if (services_list.includes('Gestions des emails')) {
                    this.items.push(
                        {
                            label: 'Gestions des emails',
                            icon: 'pi pi-envelope',
                            items: [
                                {
                                    label: 'Configuration des adresses mails',
                                    icon: 'pi pi-cog',
                                    routerLink: ['/mails/configuration'],
                                },
                                {
                                    label: 'Mails types',
                                    icon: 'pi pi-bars',
                                    routerLink: ['/mails/type'],
                                },
                                {
                                    label: 'Mails automatisés',
                                    icon: 'pi pi-sync',
                                    routerLink: ['/mails/auto'],
                                },
                            ]
                        }
                    )
                }
                if (services_list.includes('Remboursement')) {
                    this.items.push(
                        {
                            label: 'Remboursement',
                            icon: 'pi pi-dollar',
                            items: [
                                {
                                    label: 'Ajouter ',
                                    icon: 'pi pi-plus-circle',
                                    routerLink: ['/ajout-remboursement'],
                                },
                                {
                                    label: 'Remboursements',
                                    icon: 'pi pi-fw pi-tags',
                                    routerLink: ['/remboursements'],
                                },
                            ]
                        },
                    )
                }
                setTimeout(() => {
                    this.commandMaker(this.items)
                    this.boldMenu(this.items, true)
                    this.items = Object.assign([], this.items);
                    this.showMenu = true
                }, 1);
                //this.showMenu=true
            },
            error: (error: any) => {
                console.error(error);
            },
            complete: () => {
                console.log('Récupération des infos du user connecté réussi');
            },
        });
    }
    treeNavigation: MenuItem[] = []
    childSelect: string = this.router.url;
    parentSelected = []
    commandMaker(items) {
        items.forEach(item => {
            if (item.routerLink) {
                item.command = (event) => {
                    this.clickMenu(event, 'CHILD')
                }
            } else if (item.items) {
                item.command = (event) => {
                    this.clickMenu(event, 'PARENT')
                }
                this.commandMaker(item.items)
            }
        })
        return items
    }
    clickMenu(event, position) {
        if (position == 'CHILD') {
            this.childSelect = event.item.routerLink[0]
            this.parentSelected = []
            this.treeNavigation.forEach(item => {
                if (item.items && this.cleanParents(item.items))
                    this.parentSelected.push(item.label)
            })
            localStorage.setItem('parentSelected', JSON.stringify(this.parentSelected))
            this.boldMenu(this.items, true)
            this.treeNavigation = []
        } else
            this.treeNavigation.push(event.item)
        //console.log(event, position)
    }
    cleanParents(items: MenuItem[]): boolean {
        let r = false
        items.forEach(item => {
            if (item.routerLink && item.routerLink[0] == this.childSelect) {
                r = true
            }
            else if (item.items)
                r = this.cleanParents(item.items)
        })
        return r
    }
    boldMenu(items: MenuItem[], first = false) {
        items.forEach(item => {
            if (item.routerLink && item.routerLink[0] == this.childSelect) {
                item.style = { 'font-weight': 700 };
            } else if (item.items) {
                if (this.parentSelected.includes(item.label)) {
                    item.style = { 'font-weight': 900 };
                } else
                    if (first)
                        item.style = { 'font-weight': 700 };
                    else
                        item.style = { 'font-weight': 400 };
                this.boldMenu(item.items)
            } else
                item.style = { 'font-weight': 400 };
        })
    }
}

function isCHECK3(documents) {
    let r = false

    let documentsObligatoires = ['CV', "Pièce d'identité", "Dernier diplôme obtenu",
        "Relevés de note de deux dernières année"]
    documents.forEach(val => {
        if (documentsObligatoires.includes(val.nom) && !val.path)
            r = true
    })
    return r
}
