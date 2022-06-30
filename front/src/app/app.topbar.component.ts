import { Component, OnDestroy } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items: MenuItem[];

    constructor(public appMain: AppMainComponent, private router: Router) { }

    //Methode de deconnexion
    onDisconnect()
    {
        localStorage.removeItem('token');
        this.router.navigate(['login']);
    }
}
