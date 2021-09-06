import { Component, Renderer2 } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AuthConfig } from 'angular-oauth2-oidc';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TicketService } from './services/ticket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    animations: [
        trigger('mask-anim', [
            state('void', style({
                opacity: 0
            })),
            state('visible', style({
                opacity: 0.8
            })),
            transition('* => *', animate('250ms cubic-bezier(0, 0, 0.2, 1)'))
        ])
    ]
})
export class AppComponent {

    layout = 'layout-blue';
    layoutMode = 'overlay';
    configDialogActive = false;
    theme = 'turquoise';
    scheme = 'light';
    topbarItemClick: boolean;
    activeTopbarItem: any;
    resetMenu: boolean;
    menuHoverActive: boolean;
    topbarMenuActive: boolean;
    overlayMenuActive: boolean;
    menuClick: boolean;
    connected: Boolean = false;
    overlayMenuMobileActive: boolean;
    authConfig: AuthConfig = {
        issuer: 'https://dev-keycloak.estya.io/auth/realms/ems_sso',
        redirectUri: window.location.origin + "/users",
        clientId: 'ems-Frontend-dev',
        scope: 'openid profile email offline_access ems_sso',
        responseType: 'code',
        // at_hash is not present in JWT token
        disableAtHashCheck: true,
        showDebugInformation: true
    }

    constructor(public renderer: Renderer2,public TicketService:TicketService) {

    }



    outClick() {
        if (!this.topbarItemClick) {
            this.activeTopbarItem = null;
            this.topbarMenuActive = false;
        }
    }

    onLayoutClick() {
        if (!this.topbarItemClick) {
            this.activeTopbarItem = null;
            this.topbarMenuActive = false;
        }

        if (!this.menuClick) {
            if (this.isHorizontal()) {
                this.resetMenu = true;
            }

            if (this.overlayMenuActive || this.overlayMenuMobileActive) {
                this.hideOverlayMenu();
            }

            this.menuHoverActive = false;
        }

        this.topbarItemClick = false;
        this.menuClick = false;
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        } else {
            this.activeTopbarItem = item;
        }

        event.preventDefault();
    }

    onTopbarSubItemClick(event) {
        event.preventDefault();
    }

    changeComponentTheme(event, theme, scheme) {
        this.theme = theme;
        this.scheme = scheme;
        const themeLink: HTMLLinkElement = document.getElementById('theme-css') as HTMLLinkElement;
        themeLink.href = 'assets/theme/' + theme + '/theme-' + scheme + '.css';

        event.preventDefault();
    }

    changeLayoutTheme(event, color, theme, scheme) {
        this.layout = color;
        const layoutLink: HTMLLinkElement = document.getElementById('layout-css') as HTMLLinkElement;
        layoutLink.href = 'assets/layout/css/' + color + '.css';

        this.changeComponentTheme(event, theme, scheme);

        event.preventDefault();
    }

    changeLayoutMode(event, mode) {
        this.layoutMode = mode;
        event.preventDefault();
    }

    onMenuButtonClick(event) {
        this.menuClick = true;
        this.topbarMenuActive = false;

        if (this.layoutMode === 'overlay' && !this.isMobile()) {
            this.overlayMenuActive = !this.overlayMenuActive;
        } else {
            if (!this.isDesktop()) {
                this.overlayMenuMobileActive = !this.overlayMenuMobileActive;
            }
        }

        event.preventDefault();
    }

    onMenuClick($event) {
        this.menuClick = true;
        this.resetMenu = false;
    }

    hideOverlayMenu() {
        this.overlayMenuActive = false;
        this.overlayMenuMobileActive = false;
    }

    isTablet() {
        const width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    isMobile() {
        return window.innerWidth <= 640;
    }

    isOverlay() {
        return this.layoutMode === 'overlay';
    }

    isHorizontal() {
        return this.layoutMode === 'horizontal';
    }

    /*form: FormGroup = new FormGroup({
        file: new FormControl(null, Validators.required)
    })


    onFileChange(event) {
        let reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.form.get('file').setValue({
                    filename: file.name,
                    filetype: file.type,
                    value: reader.result.toString().split(',')[1]
                })
            };
        }
    }
    onSubmit() {
        const formModel = this.form.value;
        console.log(this.form.value.file)
        this.TicketService.storeDoc(this.form.value.file).subscribe((data)=>{
            console.log(data)
        },(error)=>{
            console.error(error)
        })
        console.log(formModel);
    }*/
}
