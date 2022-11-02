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

    modelAdmin: any = [];
    model: any[];
    token: any;
    isAgent: Boolean = false
    isReponsable: Boolean = false
    isAdmin: Boolean = false
    isAdmission: Boolean = false
    isPedagogie: Boolean = false
    isEtudiant: Boolean = false
    isFormateur: Boolean = false
    isCommercial: Boolean = false
    isTuteurAlternance: Boolean = false;
    isCeoEntreprise: Boolean = false;
    isEvent = false
    isAdministration: Boolean = false;
    isConseiller: teamCommercial = null

    constructor(public appMain: AppMainComponent, private userService: AuthService, private ETUService: EtudiantService, private FService: FormateurService, private CService: CommercialPartenaireService, private TCService: TeamCommercialService) { }

    ngOnInit() {
        //Decodage du token
        this.token = jwt_decode(localStorage.getItem('token'));

        this.modelAdmin = [
            {
                label: 'Accueil',
                items: [
                    { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                label: 'Ticketing', icon: 'pi pi-ticket',
                items: [
                    { label: 'Gestions des tickets', icon: 'pi pi-ticket', routerLink: ['/gestion-tickets'] },
                    { label: 'Suivi de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket'] },
                    { label: 'Gestions des services', icon: 'pi pi-sitemap', routerLink: ['/admin/gestion-services'] },
                ]
            },
            {
                label: "Pédagogie",
                items: [
                    { label: 'Gestions des modules', icon: 'pi pi-tags', routerLink: ['/matieres'] },
                    {
                        label: 'Gestions des séances', icon: 'pi pi-video',
                        items: [
                            { label: 'Ajouter une séance', icon: 'pi pi-user-plus', routerLink: ['/ajout-seance'] },
                            { label: 'Voir la liste des séances', icon: 'pi pi-sort-alpha-down', routerLink: ['/seances'] },
                            { label: 'Voir l\'emploi du temps des séances', icon: 'pi pi-calendar', routerLink: ['/emploi-du-temps'] },
                        ]
                    },
                    {
                        label: 'Gestions des formateurs', icon: 'pi pi-id-card',
                        items: [
                            { label: 'Ajouter un formateur', icon: 'pi pi-user-plus', routerLink: ['/ajout-formateur'] },
                            { label: 'Liste des formateurs', icon: 'pi pi-sort-alpha-down', routerLink: ['/formateurs'] },
                        ]
                    },
                    { label: 'Gestion des inscrits en attente d\'assignation', icon: 'pi pi-user-plus', routerLink: ['/assignation-inscrit'] },
                    {
                        label: 'Gestions des étudiants', icon: 'pi pi-users',
                        items: [
                            { label: 'Ajouter un étudiant', icon: 'pi pi-user-plus', routerLink: ['/ajout-etudiant'] },
                            { label: 'Liste des étudiants', icon: 'pi pi-sort-alpha-down', routerLink: ['etudiants'] },
                        ]
                    },
                    {
                        label: 'Gestions des entreprises', icon: 'pi pi-home',
                        items: [
                            { label: 'Ajouter une entreprise', icon: 'pi pi-user-plus', routerLink: ['/ajout-entreprise'] },
                            { label: 'Liste des entreprises', icon: 'pi pi-sort-alpha-down', routerLink: ['/entreprises'] },
                        ]
                    },
                    {
                        label: 'Gestions des examens', icon: 'pi pi-copy', items: [
                            { label: 'Ajouter un examen', icon: 'pi pi-user-plus', routerLink: ['/ajout-examen'] },
                            { label: 'Liste des examens', icon: 'pi pi-sort-alpha-down', routerLink: ['/examens'] },
                        ]
                    },
                    { label: 'Gestions des notes', icon: 'pi pi-pencil', routerLink: ['/notes'] },
                ]

            },
            {
                label: 'Administration',
                items: [
                    {
                        label: 'Gestions des années scolaires', icon: 'pi pi-calendar',
                        items: [
                            { label: 'Ajouter une année scolaire', icon: 'pi pi-calendar-plus', routerLink: ['/ajout-annee-scolaire'] },
                            { label: 'Liste des années scolaires', icon: 'pi pi-sort-alpha-down', routerLink: ['/annee-scolaire'] },
                        ]
                    },
                    {
                        label: 'Gestions des écoles', icon: 'pi pi-home',
                        items: [
                            { label: 'Ajouter une école', icon: 'pi pi-plus-circle', routerLink: ['/ajout-ecole'] },
                            { label: 'Liste des écoles', icon: 'pi pi-sort-alpha-down', routerLink: ['/ecole'] },
                        ]
                    },
                    {
                        label: 'Gestions des campus', icon: 'pi pi-home',
                        items: [
                            { label: 'Ajouter un campus', icon: 'pi pi-plus-circle', routerLink: ['/ajout-campus'] },
                            { label: 'Liste des campus', icon: 'pi pi-sort-alpha-down', routerLink: ['/campus'] },
                        ]
                    },
                    {
                        label: 'Gestions des diplômes', icon: 'pi pi-bookmark',
                        items: [
                            { label: 'Ajouter un diplôme', icon: 'pi pi-plus-circle', routerLink: ['/ajout-diplome'] },
                            { label: 'Liste des diplômes', icon: 'pi pi-sort-alpha-down', routerLink: ['/diplomes'] },
                        ]
                    },
                    {
                        label: 'Gestions des groupes', icon: 'pi pi-users',
                        items: [
                            { label: 'Ajouter un groupe', icon: 'pi pi-plus-circle', routerLink: ['/ajout-groupe'] },
                            { label: 'Liste des groupes', icon: 'pi pi-sort-alpha-down', routerLink: ['/groupes'] },
                        ]
                    },
                    {
                        label: 'Gestions des agents', icon: 'pi pi-users',
                        items: [
                            { label: 'Ajouter un agent', icon: 'pi pi-user-plus', routerLink: ['/admin/ajout-agent'] },
                            { label: 'Liste des agents', icon: 'pi pi-sort-alpha-down', routerLink: ['/admin/agents'] },
                        ]
                    },
                    { label: 'Validation des inscrits', icon: 'pi pi-check-square', routerLink: ['/validation-inscrit'] },
                ]
            },
            {
                label: 'Admission',
                items: [
                    { label: 'Gestions des prospects', icon: 'pi pi-user-plus', routerLink: ['/gestion-preinscriptions'] },
                    { label: 'Gestion des participantes pour les événements', icon: 'pi pi-users', routerLink: ['/list-events'] }
                ],
            },
            {
                label: 'Alternance',
                items: [
                    { label: 'Liste des contrats Alternance', icon: 'pi pi-list', routerLink: ['/liste-contrats'] },

                ],
            },
            {
                label: 'Partenaires',
                items: [
                    {
                        label: 'Gestions des collaborateurs', icon: 'pi pi-users',
                        items: [
                            // {label: 'Ajouter un collaborateurs', icon: 'pi pi pi-user-plus', routerLink: ['/ajout-de-collaborateur']},
                            { label: 'Liste des collaborateurs', icon: 'pi pi-sort-alpha-down', routerLink: ['/collaborateur'] },
                        ]
                    },
                    {
                        label: 'Gestions des partenaires', icon: 'pi pi-users',
                        items: [
                            { label: 'Liste des partenaires', icon: 'pi pi-sort-alpha-down', routerLink: ['/admin/partenaire'] },
                        ]
                    },
                ]
            }, {
                label: 'Commercial',
                items: [
                    { label: 'Gestion des tuteurs', icon: 'pi pi-user', routerLink: ['/tuteur'] },
                    { label: 'Gestion des equipes de conseillers', icon: 'pi pi-users', routerLink: ['/equipe-commercial'] }
                ]
            }, {
                label: 'Support',
                items: [
                    { label: 'Etudiants en attente de leur compte IMS', icon: 'pi pi-user-plus', routerLink: ['/assign-ims'] },
                ]
            },
            {
                label: 'Booking',
                items: [
                    { label: 'Logements', icon: 'pi pi-home', routerLink: ['/logements'] },
                    { label: 'Gestion des reservations', icon: 'pi pi-bookmark', routerLink: ['/gestion-reservations'] },
                ]
            },
            {
                label: 'SkillsNet',
                items: [
                    { label: 'Missions', icon: 'pi pi-briefcase', routerLink: ['/missions'] },
                    { label: 'Mes missions', icon: 'pi pi-user', routerLink: ['/mes-missions'] },
                ]
            },
        ];

        this.userService.getPopulate(this.token.id).subscribe(dataUser => {
            if (dataUser) {
                this.isAdmin = dataUser.role == "Admin"
                this.isAgent = dataUser.role == "Agent"
                this.isReponsable = dataUser.role == "Responsable"
                this.isCeoEntreprise = dataUser.type == "CEO Entreprise"
                this.isTuteurAlternance = dataUser.type == "Tuteur"

                let service: any = dataUser.service_id
                if ((this.isAgent || this.isReponsable) && service != null) {
                    this.isAdmission = service.label.includes('Admission')
                    this.isPedagogie = service.label.includes('dagogie')
                    this.isEvent = service.label.includes('Event')
                    this.isAdministration = service.label.includes('dministration')
                }
                this.isEtudiant = dataUser.type == "Etudiant" || dataUser.type == "Initial" || dataUser.type == "Alternant";
                this.isFormateur = dataUser.type == "Formateur"
                this.isCommercial = dataUser.type == "Commercial"
                this.TCService.getMyTeam().subscribe(team => {
                    if (team) {
                        this.isConseiller = team
                        this.isCommercial = false
                    }
                })
                if (this.isAdmin) {
                    this.model = this.modelAdmin
                    if (dataUser.email == 'test.admin@estya.com' || dataUser.email == 'i.sall@estya.com') {
                        this.model.push({
                            label: 'Gestion service bancaire',
                            items: [
                                {
                                    label: ' Gestion des comptes', icon: 'pi pi-wallet',
                                    items: [
                                        //{ label: 'Compte légal', icon: 'pi pi-check-circle', },
                                        //{ label: 'Bénéficiaire effectif ultime', icon: 'pi pi-users',  },
                                        { label: 'Mon compte', icon: ' pi pi-user', routerLink: ['/mon-compte-bancaire'] },
                                        { label: 'Ajouter un nouveau compte individuel', icon: ' pi pi-plus', routerLink: ['/new-individual-account'] },
                                        { label: 'Liste des comptes', icon: ' pi pi-wallet', routerLink: ['/list-accounts'] },
                                    ]
                                },
                                {
                                    label: 'Gestions des transaction', icon: 'pi pi-directions ',
                                    items: [
                                        { label: 'Paiement', icon: ' pi pi-credit-card', routerLink: ['/payment'] },
                                    ]
                                },
                            ]

                        });
                    }
                } else if (this.isFormateur) {
                    //Formateur
                    this.FService.getByUserId(this.token.id).subscribe(dataF => {
                        if (dataF) {
                            this.model = [
                                {
                                    label: 'Ticketing',
                                    items: [
                                        { label: 'Suivi de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket'] },
                                    ]
                                },
                                {
                                    label: "Pédagogie",
                                    items: [
                                        { label: 'Emploi du temps', icon: 'pi pi-video', routerLink: 'emploi-du-temps/formateur/' + this.token.id },
                                    ]
                                },
                                {
                                    label: 'Gestions des examens', icon: 'pi pi-copy', items: [
                                        { label: 'Ajouter un examen', icon: 'pi pi-user-plus', routerLink: ['/ajout-examen'] },
                                        { label: 'Liste des examens', icon: 'pi pi-sort-alpha-down', routerLink: ['/examens'] },
                                    ]
                                },
                                { label: 'Gestions des notes', icon: 'pi pi-pencil', routerLink: ['/notes'] },
                            ];
                        }
                    })
                }

                else if (this.isEtudiant && !this.isAgent && !this.isReponsable) {
                    //Etudiant
                    this.ETUService.getByUser_id(this.token.id).subscribe(dataEtu => {
                        if (dataEtu && dataEtu.classe_id) {
                            this.model = [
                                {
                                    label: 'Ticketing',
                                    items: [
                                        { label: 'Suivi de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket'] },
                                    ]
                                },
                                {
                                    label: "Pédagogie",
                                    items: [
                                        { label: 'Emploi du temps', icon: 'pi pi-video', routerLink: 'emploi-du-temps/classe/' + dataEtu.classe_id },
                                    ]
                                },
                                {
                                    label: 'Booking',
                                    items: [
                                        { label: 'Logements', icon: 'pi pi-home', routerLink: ['/logements'] },
                                    ]
                                },
                            ];
                        } else {
                            this.model = [
                                {
                                    label: 'Ticketing',
                                    items: [
                                        { label: 'Suivi de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket'] },
                                    ]
                                }
                            ];
                        }
                    })
                }

                else if (this.isCommercial) {
                    this.CService.getByUserId(this.token.id).subscribe(cData => {
                        if (cData && cData.statut != "Admin") {
                            //Commercial Normal
                            this.model = [
                                {
                                    label: 'Ticketing', icon: 'pi pi-ticket',
                                    items: [
                                        { label: 'Gestions des tickets', icon: 'pi pi-ticket', routerLink: ['/gestion-tickets'] },
                                        { label: 'Suivi de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket'] },
                                    ]
                                },
                                {
                                    label: 'Partenaires',
                                    items: [
                                        { label: 'Gestions des prospects', icon: 'pi pi-users', routerLink: ['gestion-preinscriptions', cData.code_commercial_partenaire] },
                                        //{ label: 'Gestion des échanges', icon: 'pi pi-comment' },
                                    ]
                                },
                                {
                                    label: 'SkillsNet',
                                    items: [
                                        { label: 'Missions', icon: 'pi pi-briefcase', routerLink: ['/missions'] },
                                        { label: 'Mes missions', icon: 'pi pi-user', routerLink: ['/mes-missions'] },
                                    ]
                                }
                            ];
                        }

                        else {
                            //Commercial considéré Admin dans son Partenaire
                            this.model = [
                                {
                                    label: 'Ticketing', icon: 'pi pi-ticket',
                                    items: [
                                        { label: 'Gestions des tickets', icon: 'pi pi-ticket', routerLink: ['/gestion-tickets'] },
                                        { label: 'Suivi de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket'] },
                                    ]
                                },
                                {
                                    label: 'Partenaires',
                                    items: [
                                        { label: 'Gestions des prospects', icon: 'pi pi-users', routerLink: ['gestion-preinscriptions', cData.code_commercial_partenaire] },
                                        { label: 'Gestion des collaborateurs', icon: 'pi pi-users', routerLink: ['collaborateur', cData.partenaire_id] },
                                        //{ label: 'Gestion des échanges', icon: 'pi pi-comment' },
                                    ]
                                },
                                {
                                    label: 'SkillsNet',
                                    items: [
                                        { label: 'Missions', icon: 'pi pi-briefcase', routerLink: ['/missions'] },
                                        { label: 'Mes missions', icon: 'pi pi-user', routerLink: ['/mes-missions'] },
                                    ]
                                },
                            ];
                        }
                    })
                } else if (this.isConseiller) {
                    this.model = [
                        {
                            label: 'Ticketing', icon: 'pi pi-ticket',
                            items: [
                                { label: 'Gestions des tickets', icon: 'pi pi-ticket', routerLink: ['/gestion-tickets'] },
                                { label: 'Suivi de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket'] },
                            ]
                        },
                        {
                            label: 'Conseiller',
                            items: [
                                { label: "Liste des demandes", icon: 'pi pi-exclamation-triangle', routerLink: ['/liste-demande-commercial', this.isConseiller._id] },
                                { label: "Liste des affectations", icon:'pi pi-users', routerLink: ['/detail-equipe-commercial', this.isConseiller._id]}

                            ]
                        }
                    ];
                } else if (this.isAdmission) {
                    if (this.isAgent) {
                        this.model = [
                            {
                                label: 'Accueil',
                                items: [
                                    { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                                ]
                            },
                            {
                                label: 'Ticketing', icon: 'pi pi-ticket',
                                items: [
                                    { label: 'Gestions des tickets', icon: 'pi pi-ticket', routerLink: ['/gestion-tickets'] },
                                    { label: 'Suivi de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket'] },
                                ]
                            },
                            {
                                label: 'Admission',
                                items: [
                                    { label: 'Gestions des prospects', icon: 'pi pi-user-plus', routerLink: ['/gestion-preinscriptions'] },
                                ]
                            }
                        ]
                    } else if (this.isReponsable) {
                        this.model = [
                            {
                                label: 'Accueil',
                                items: [
                                    { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                                ]
                            },
                            {
                                label: 'Ticketing', icon: 'pi pi-ticket',
                                items: [
                                    { label: 'Gestions des tickets', icon: 'pi pi-ticket', routerLink: ['/gestion-tickets'] },
                                    { label: 'Suivi de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket'] },
                                ]
                            },
                            {
                                label: 'Admission',
                                items: [
                                    { label: 'Gestions des prospects', icon: 'pi pi-user-plus', routerLink: ['/gestion-preinscriptions'] },
                                ]
                            },
                            {
                                label: 'Partenaires',
                                items: [
                                    { label: 'Ajouter un partenaires', icon: 'pi pi pi-user-plus', routerLink: ['/admin/ajout-de-partenaire'] },
                                    { label: 'Liste des partenaires', icon: 'pi pi-sort-alpha-down', routerLink: ['/admin/partenaire'] },
                                    { label: 'Gestion des collaborateurs', icon: 'pi pi-users', routerLink: ['collaborateur'] },
                                    //{ label: 'Gestion des échanges', icon: 'pi pi-comment' },
                                ]
                            }
                        ]
                    }
                } else if (this.isTuteurAlternance) {

                    this.model = [
                        {
                            label: 'Accueil',
                            items: [
                                { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                            ]
                        },
                        {
                            label: 'Ticketing', icon: 'pi pi-ticket',
                            items: [

                                { label: 'Suivi de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket'] },

                            ]
                        },
                        {
                            label: "Contrats Alternances",
                            items: [
                                { label: 'Listes des alternants', icon: 'pi pi-list', routerLink: ['/liste-contrats/'] },
                            ]
                        },
                        {
                            label: 'SkillsNet',
                            items: [
                                { label: 'Missions', icon: 'pi pi-briefcase', routerLink: ['/missions'] },
                                { label: 'Mes missions', icon: 'pi pi-user', routerLink: ['/mes-missions'] },
                                { label: 'Les missions de mon entreprise', icon: 'pi pi-building', routerLink: ['/entreprise-missions'] },
                            ]
                        },
                    ]


                }

                else if (this.isCeoEntreprise) {

                    this.model = [
                        {
                            label: 'Accueil',
                            items: [
                                { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                            ]
                        },
                        {
                            label: 'Ticketing', icon: 'pi pi-ticket',
                            items: [

                                { label: 'Suivi de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket'] },

                            ]
                        },
                        {
                            label: "Tutelle d'Alternants & Stagiaires",
                            items: [
                                { label: 'Liste de tous les alternants ', icon: 'pi pi-list', routerLink: ['/liste-contrats/'] },
                                { label: 'Liste des tuteurs', icon: 'pi pi-list', routerLink: ['/tuteur'] },
                                { label: 'Mes alternants', icon: 'pi pi-list', routerLink: ['/liste-contrats/' + this.token.id] },
                            ]
                        },
                        {
                            label: 'SkillsNet',
                            items: [
                                { label: 'Missions', icon: 'pi pi-briefcase', routerLink: ['/missions'] },
                                { label: 'Mes missions', icon: 'pi pi-user', routerLink: ['/mes-missions'] },
                                { label: 'Les missions de mon entreprise', icon: 'pi pi-building', routerLink: ['/entreprise-missions'] },
                            ]
                        },
                    ]


                } else if (this.isPedagogie) {
                    this.model = [
                        {
                            label: 'Accueil',
                            items: [
                                { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                            ]
                        },
                        {
                            label: 'Ticketing', icon: 'pi pi-ticket',
                            items: [
                                { label: 'Gestions des tickets', icon: 'pi pi-ticket', routerLink: ['/gestion-tickets'] },
                                { label: 'Suivi de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket'] },
                                { label: 'Gestions des services', icon: 'pi pi-sitemap', routerLink: ['/admin/gestion-services'] },
                            ]
                        },
                        {
                            label: "Pédagogie",
                            items: [
                                { label: 'Gestions des modules', icon: 'pi pi-tags', routerLink: ['/matieres'] },
                                {
                                    label: 'Gestions des séances', icon: 'pi pi-video',
                                    items: [
                                        { label: 'Ajouter une séance', icon: 'pi pi-user-plus', routerLink: ['/ajout-seance'] },
                                        { label: 'Voir la liste des séances', icon: 'pi pi-sort-alpha-down', routerLink: ['/seances'] },
                                        { label: 'Voir l\'emploi du temps des séances', icon: 'pi pi-calendar', routerLink: ['/emploi-du-temps'] },
                                    ]
                                },
                                {
                                    label: 'Gestions des formateurs', icon: 'pi pi-id-card',
                                    items: [
                                        { label: 'Ajouter un formateur', icon: 'pi pi-user-plus', routerLink: ['/ajout-formateur'] },
                                        { label: 'Liste des formateurs', icon: 'pi pi-sort-alpha-down', routerLink: ['/formateurs'] },
                                    ]
                                },
                                { label: 'Gestion des inscrits en attente d\'assignation', icon: 'pi pi-user-plus', routerLink: ['/assignation-inscrit'] },
                                {
                                    label: 'Gestions des étudiants', icon: 'pi pi-users',
                                    items: [
                                        { label: 'Ajouter un étudiant', icon: 'pi pi-user-plus', routerLink: ['/ajout-etudiant'] },
                                        { label: 'Liste des étudiants', icon: 'pi pi-sort-alpha-down', routerLink: ['etudiants'] },
                                    ]
                                },
                                {
                                    label: 'Gestions des entreprises', icon: 'pi pi-home',
                                    items: [
                                        { label: 'Ajouter une entreprise', icon: 'pi pi-user-plus', routerLink: ['/ajout-entreprise'] },
                                        { label: 'Liste des entreprises', icon: 'pi pi-sort-alpha-down', routerLink: ['/entreprises'] },
                                    ]
                                },
                                {
                                    label: 'Gestions des examens', icon: 'pi pi-copy', items: [
                                        { label: 'Ajouter un examen', icon: 'pi pi-user-plus', routerLink: ['/ajout-examen'] },
                                        { label: 'Liste des examens', icon: 'pi pi-sort-alpha-down', routerLink: ['/examens'] },
                                    ]
                                },
                                { label: 'Gestions des notes', icon: 'pi pi-pencil', routerLink: ['/notes'] },
                                {
                                    label: 'Gestions des diplômes', icon: 'pi pi-bookmark',
                                    items: [
                                        { label: 'Ajouter un diplôme', icon: 'pi pi-plus-circle', routerLink: ['/ajout-diplome'] },
                                        { label: 'Liste des diplômes', icon: 'pi pi-sort-alpha-down', routerLink: ['/diplomes'] },
                                    ]
                                },
                                {
                                    label: 'Gestions des groupes', icon: 'pi pi-users',
                                    items: [
                                        { label: 'Ajouter un groupe', icon: 'pi pi-plus-circle', routerLink: ['/ajout-groupe'] },
                                        { label: 'Liste des groupes', icon: 'pi pi-sort-alpha-down', routerLink: ['/groupes'] },
                                    ]
                                },
                            ]

                        },
                        {
                            label: 'Administration',
                            items: [
                                {
                                    label: 'Gestions des années scolaires', icon: 'pi pi-calendar',
                                    items: [
                                        { label: 'Ajouter une année scolaire', icon: 'pi pi-calendar-plus', routerLink: ['/ajout-annee-scolaire'] },
                                        { label: 'Liste des années scolaires', icon: 'pi pi-sort-alpha-down', routerLink: ['/annee-scolaire'] },
                                    ]
                                },
                                {
                                    label: 'Gestions des écoles', icon: 'pi pi-home',
                                    items: [
                                        { label: 'Ajouter une école', icon: 'pi pi-plus-circle', routerLink: ['/ajout-ecole'] },
                                        { label: 'Liste des écoles', icon: 'pi pi-sort-alpha-down', routerLink: ['/ecole'] },
                                    ]
                                },
                                {
                                    label: 'Gestions des campus', icon: 'pi pi-home',
                                    items: [
                                        { label: 'Ajouter un campus', icon: 'pi pi-plus-circle', routerLink: ['/ajout-campus'] },
                                        { label: 'Liste des campus', icon: 'pi pi-sort-alpha-down', routerLink: ['/campus'] },
                                    ]
                                },

                                {
                                    label: 'Gestions des agents', icon: 'pi pi-users',
                                    items: [
                                        { label: 'Ajouter un agent', icon: 'pi pi-user-plus', routerLink: ['/admin/ajout-agent'] },
                                        { label: 'Liste des agents', icon: 'pi pi-sort-alpha-down', routerLink: ['/admin/agents'] },
                                    ]
                                },
                                { label: 'Validation des inscrits', icon: 'pi pi-check-square', routerLink: ['/validation-inscrit'] },
                            ]
                        },
                    ]
                }
                else if (this.isEvent) {
                    this.model = [
                        {
                            label: 'Accueil',
                            items: [
                                { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                            ]
                        },
                        {
                            label: 'Ticketing', icon: 'pi pi-ticket',
                            items: [

                                { label: 'Suivi de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket'] },

                            ]
                        },
                        {
                            label: "Evenementiels",
                            items: [

                                { label: 'Gestion des participantes pour les événements', icon: 'pi pi-envelope', routerLink: ['/list-events'] },
                            ]
                        },
                    ]
                } else if (this.isAdministration) {
                    this.model = [
                        {
                            label: 'Accueil',
                            items: [
                                { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                            ]
                        },
                        {
                            label: 'Ticketing', icon: 'pi pi-ticket',
                            items: [

                                { label: 'Suivi de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket'] },

                            ]
                        },
                        {
                            label: 'Administration',
                            items: [
                                {
                                    label: 'Gestions des années scolaires', icon: 'pi pi-calendar',
                                    items: [
                                        { label: 'Ajouter une année scolaire', icon: 'pi pi-calendar-plus', routerLink: ['/ajout-annee-scolaire'] },
                                        { label: 'Liste des années scolaires', icon: 'pi pi-sort-alpha-down', routerLink: ['/annee-scolaire'] },
                                    ]
                                },
                                {
                                    label: 'Gestions des écoles', icon: 'pi pi-home',
                                    items: [
                                        { label: 'Ajouter une école', icon: 'pi pi-plus-circle', routerLink: ['/ajout-ecole'] },
                                        { label: 'Liste des écoles', icon: 'pi pi-sort-alpha-down', routerLink: ['/ecole'] },
                                    ]
                                },
                                {
                                    label: 'Gestions des campus', icon: 'pi pi-home',
                                    items: [
                                        { label: 'Ajouter un campus', icon: 'pi pi-plus-circle', routerLink: ['/ajout-campus'] },
                                        { label: 'Liste des campus', icon: 'pi pi-sort-alpha-down', routerLink: ['/campus'] },
                                    ]
                                },
                                {
                                    label: 'Gestions des diplômes', icon: 'pi pi-bookmark',
                                    items: [
                                        { label: 'Ajouter un diplôme', icon: 'pi pi-plus-circle', routerLink: ['/ajout-diplome'] },
                                        { label: 'Liste des diplômes', icon: 'pi pi-sort-alpha-down', routerLink: ['/diplomes'] },
                                    ]
                                },
                                {
                                    label: 'Gestions des groupes', icon: 'pi pi-users',
                                    items: [
                                        { label: 'Ajouter un groupe', icon: 'pi pi-plus-circle', routerLink: ['/ajout-groupe'] },
                                        { label: 'Liste des groupes', icon: 'pi pi-sort-alpha-down', routerLink: ['/groupes'] },
                                    ]
                                },
                                {
                                    label: 'Gestions des agents', icon: 'pi pi-users',
                                    items: [
                                        { label: 'Ajouter un agent', icon: 'pi pi-user-plus', routerLink: ['/admin/ajout-agent'] },
                                        { label: 'Liste des agents', icon: 'pi pi-sort-alpha-down', routerLink: ['/admin/agents'] },
                                    ]
                                },
                                { label: 'Validations des inscrits', icon: 'pi pi-check-square', routerLink: ['/validation-inscrit'] },
                            ]
                        },
                        {
                            label: "Pédagogie",
                            items: [
                                {
                                    label: 'Gestions des étudiants', icon: 'pi pi-users',
                                    items: [
                                        { label: 'Liste des étudiants', icon: 'pi pi-sort-alpha-down', routerLink: ['etudiants'] },
                                    ]
                                },
                            ]
                        }
                    ]
                } else {
                    this.model = [
                        {
                            label: 'Ticketing',
                            items: [
                                { label: 'Suivi de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket'] },
                            ]
                        }
                    ]
                    console.error("Aucun Menu disponible")
                }
            } else {
                console.error("Aucun Utilisteur trouvé")
            }
        })



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
        //             {label: 'Suivi de mes tickets', icon: 'pi pi-check-circle', routerLink: ['/suivi-ticket']},
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
        const nodeElement = (<HTMLDivElement>event.target);
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            event.preventDefault();
        }
    }
}
