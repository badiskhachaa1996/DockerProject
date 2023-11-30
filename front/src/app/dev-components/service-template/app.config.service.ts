import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppConfig } from '../api-template/appconfig';

@Injectable()
export class ConfigService {

    config: AppConfig = {
        theme: 'lara-light-indigo',
        dark: false,
        inputStyle: 'outlined',
        ripple: true
    };
    // Observable string sources
    private emitUpdateMenu = new Subject<any>();
    // Observable string streams
    changeEmitted$ = this.emitUpdateMenu.asObservable();
    // Service message commands
    emitChange(change: any) {
        this.emitUpdateMenu.next(change);
    }
    private configUpdate = new Subject<AppConfig>();

    configUpdate$ = this.configUpdate.asObservable();

    updateConfig(config: AppConfig) {
        this.config = config;
        this.configUpdate.next(config);
    }

    getConfig() {
        return this.config;
    }
}
