import {Component, Input, OnInit, AfterViewInit, ViewChild, OnDestroy} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MenuItem } from 'primeng/api';
import { AppComponent } from './app.component';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-menu',
    template: `
        <div *ngIf="isAuth"  class="layout-menu-container" (click)="app.onMenuClick($event)">
            <div class="overlay-menu-button" (click)="app.onMenuButtonClick($event)">
                <div class="overlay-menu-button-bars">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="overlay-menu-button-times">
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div style="width: 280px;" class="layout-menu-wrapper fadeInDown">
                <ul *ngIf="admin" app-submenu [item]="model" root="true" class="layout-menu" visible="true" [reset]="reset"  parentActive="true"></ul>
               

                

                </div>
        </div>
    `
})
export class AppMenuComponent implements OnInit {

    @Input() reset: boolean;

    model: any[];
    modelProspect: any [];
    modelProspEtudiant: any [];
    modelEtudiant: any [];
    admin:boolean;
    adminF:boolean;
    prospect: boolean;
    etudiant:boolean;
    prospectEtudiant:boolean;
    notconnected:boolean=false;
    modelComCONSU: any [];
    modelComEDU: any [];
    modelPartenaireEDU: any [];
    modelPartenaireCONSU: any [];
    modelconnexion:any[];
    idunique:any;
    keycloak: any;
    isAuth: any;
    userInformations: any;
    role:any;
    modelProspectTraining: any [];
    modelProspEtudiantTraining: any [];
    modelEtudiantTraining: any [];
    modelProspectAdg: any [];
    modelProspEtudiantAdg: any [];
    modelEtudiantAdg: any [];
    //apporteur d'affaires
    modelApporteurDaffaires: any[];
    apporteur_d_affaires:Boolean;
    modelF: any [];
    modelA: any [];
    adminA:boolean;
    modelC: any [];
    adminC:boolean;
    modelP: any [];
    adminP:boolean;

    constructor(public app: AppComponent ) { }

    ngOnInit() {
        if (this.isAuth) {

            // role not authorised so redirect to home page

            this.model = [
                {
                    label: 'Estya Ticketing', icon: 'pi pi-ticket',
                    items: [
                        { label: 'Gestions des tickets', icon: 'pi pi-ticket ', routerLink: '/' },
                        { label: 'Suivi de mes tickets', icon: 'pi pi-check-circle', routerLink: '/ticket/suivi' },
                        { label: 'Gestions des services', icon: 'pi pi-sitemap', routerLink: '/service' },
                    ]
                },
                {
                    label: 'Pédagogie', icon: 'pi pi-fw pi-desktop',
                    items: [
                        { label: 'Liste des apprenants', icon: 'pi pi-fw pi-users', routerLink: ['../listeEtudiants'] },
                        { label: 'Gestion des classes', icon: 'pi pi-fw pi-cog', routerLink: ['../classe'] },
                        { label: 'Gestion des matières', icon: 'pi pi-tags', routerLink: ['/matieres'] },
                        { label: 'Gestion des séances', icon: 'pi pi-video', routerLink: ['/seance'] },
                        { label: 'Gestion des formateurs', icon: 'pi pi-users', routerLink: ['/formateurs'] },
                        { label: 'Gestion des alternants', icon: 'pi pi-users', routerLink: ['/alternants'] },
                        { label: 'Gestion des entreprises', icon: 'pi pi-desktop', routerLink: ['/entreprises'] },
                    ]
                },
                {
                    label: 'Finances', icon: 'pi pi-fw pi-dollar',
                    items: [
                        { label: 'Liste des paiements', icon: 'pi pi-fw pi-dollar', routerLink: ['../Listedespaiements'] },
                    ]
                },
                {
                    label: 'Administration', icon: 'pi pi-cog',
                    items: [
                        { label: 'Gestion des années scolaires', icon: 'pi pi-calendar-times', routerLink: '/anneeScolaire' },
                        { label: 'Gestion des écoles', icon: 'pi pi-home', routerLink: '/ecoles' },
                        { label: 'Gestion des campus', icon: 'pi pi-th-large', routerLink: '/campus' },
                        { label: 'Gestion des diplômes', icon: 'pi pi-ellipsis-v', routerLink: '/diplome' },
                        { label: 'Gestion des classes', icon: 'pi pi-desktop', routerLink: '/classe' },
                        { label: 'Gestion du staff', icon: 'pi pi-users', routerLink: '/listUser' },
                    ]
                }
            ];
        }
    }
}

}
}
@Component({
    /* tslint:disable:component-selector */
    selector: '[app-submenu]',
    /* tslint:enable:component-selector */
    template: `
        <ng-template ngFor let-child let-i="index" [ngForOf]="(root ? item : item.items)">
            <li [ngClass]="{'active-rootmenuitem': isActive(i) && app.isHorizontal(),
            'active-menuitem': ((routeItems && child.label === routeItems[0].label && app.isHorizontal())
            || (isActive(i) && !app.isHorizontal()))}"
                [class]="child.badgeStyleClass" *ngIf="child.visible === false ? false : true">
                <a [href]="child.url||'#'" (click)="itemClick($event,child,i)" (mouseenter)="onMouseEnter(i)"
                   *ngIf="!child.routerLink" [ngClass]="child.styleClass"
                   [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
                    <i [ngClass]="child.icon" class="layout-menuitem-icon"></i>
                    <span class="layout-menuitem-text">{{child.label}}</span>
                    <i class="pi pi-fw pi-angle-down layout-submenu-toggler" *ngIf="child.items"></i>
                </a>
                <a (click)="itemClick($event,child,i)" (mouseenter)="onMouseEnter(i)" *ngIf="child.routerLink"
                   [routerLink]="child.routerLink" routerLinkActive="active-menuitem-routerlink" [fragment]="child.fragment"
                   [routerLinkActiveOptions]="{exact: true}" [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target">
                    <i [ngClass]="child.icon" class="layout-menuitem-icon"></i>
                    <span class="layout-menuitem-text">{{child.label}}</span>
                    <i class="pi pi-fw pi-angle-down layout-submenu-toggler" *ngIf="child.items"></i>
                </a>
                <ul app-submenu [item]="child" *ngIf="child.items" [visible]="isActive(i)" [reset]="reset"
                    [parentActive]="isActive(i)" [ngStyle]="{'padding':isActive(i) && root ? '':'0'}"
                    [@children]="(app.isHorizontal())&&root ? isActive(i) ?
                    'visible' : 'hidden' : isActive(i) ? 'visibleAnimated' : 'hiddenAnimated'"></ul>
            </li>
        </ng-template>
    `,
    animations: [
        trigger('children', [
            state('hiddenAnimated', style({
                height: '0px'
            })),
            state('visibleAnimated', style({
                height: '*'
            })),
            state('visible', style({
                height: '*',
                'z-index': 100
            })),
            state('hidden', style({
                height: '0px',
                'z-index': '*'
            })),
            transition('visibleAnimated => hiddenAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hiddenAnimated => visibleAnimated', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppSubMenuComponent implements OnDestroy {

    @Input() item: MenuItem;

    @Input() root: boolean;

    @Input() visible: boolean;

    _parentActive: boolean;

    _reset: boolean;

    activeIndex: number;

    subscription: Subscription;

    routeItems: MenuItem[];

    constructor(public app: AppComponent, public appMenu: AppMenuComponent) {}

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    itemClick(event: Event, item: MenuItem, index: number) {
        if (this.root) {
            this.app.menuHoverActive = !this.app.menuHoverActive;
        }
        // avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return true;
        }

        // activate current item and deactivate active sibling if any
        this.activeIndex = (this.activeIndex === index) ? null : index;

        // execute command
        if (item.command) {
            item.command({ originalEvent: event, item });
        }

        // prevent hash change
        if (item.items || (!item.url && !item.routerLink)) {
            event.preventDefault();
        }

        // hide menu
        if (!item.items) {
            if (this.app.isHorizontal()) {
                this.app.resetMenu = true;
            } else {
                this.app.resetMenu = false;
            }

            this.app.overlayMenuActive = false;
            this.app.overlayMenuMobileActive = false;
            this.app.menuHoverActive = !this.app.menuHoverActive;
        }
    }

    onMouseEnter(index: number) {
        if (this.root && this.app.menuHoverActive && this.app.isHorizontal()
            && !this.app.isMobile() && !this.app.isTablet()) {
            this.activeIndex = index;
        }
    }

    isActive(index: number): boolean {
        return this.activeIndex === index;
    }

    @Input() get reset(): boolean {
        return this._reset;
    }

    set reset(val: boolean) {
        this._reset = val;
        if (this._reset && this.app.isHorizontal()) {
            this.activeIndex = null;
        }
    }

    @Input() get parentActive(): boolean {
        return this._parentActive;
    }
    set parentActive(val: boolean) {
        this._parentActive = val;
        if (!this._parentActive) {
            this.activeIndex = null;
        }
    }}
