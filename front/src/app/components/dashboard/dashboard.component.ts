import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/productservice';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';
import { EtudiantService } from 'src/app/services/etudiant.service';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

    items: MenuItem[];

    products: Product[];

    chartData: any;

    chartOptions: any;

    subscription: Subscription;

    config: AppConfig;

    user: User;

    token;
    isAdmin = false
    isAgent = false
    isAdmission = false
    isPedagogie = false
    isEtudiant = false
    isFormateur = false
    isCommercial = false
    isReinscrit = false
    isUnknow = false

    constructor(private productService: ProductService, public configService: ConfigService, private UserService: AuthService, private EtuService: EtudiantService) { }

    ngOnInit() {
        this.token = jwt_decode(localStorage.getItem('token'));
        this.UserService.getPopulate(this.token.id).subscribe(dataUser => {
            if (dataUser) {
                this.isAdmin = dataUser.role == "Admin"
                this.isAgent = dataUser.role == "Agent" || dataUser.role == "Responsable"
                let service: any = dataUser.service_id
                if (this.isAgent && service != null) {
                    this.isAdmission = service.label.includes('Admission')
                    this.isPedagogie = service.label.includes('dagogie')
                }
                this.isEtudiant = dataUser.type == "Etudiant"
                this.isFormateur = dataUser.type == "Formateur"
                this.isCommercial = dataUser.type == "Commercial"
                if (this.isEtudiant) {
                    this.EtuService.getByUser_id(this.token.id).subscribe(dataEtu => {
                        this.isReinscrit = (dataEtu && dataEtu.classe_id == null)
                        this.isEtudiant = !this.isReinscrit
                    })
                }
                this.isUnknow = !(this.isAdmin || this.isAgent || this.isEtudiant || this.isFormateur || this.isCommercial)
            }
        })







        //SAKAI Default
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
            this.updateChartOptions();
        });
        this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: '#2f4860',
                    borderColor: '#2f4860',
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: '#00bb7e',
                    borderColor: '#00bb7e',
                    tension: .4
                }
            ]
        };
    }

    SCIENCE() {
        console.log("PAS TOUCHE")

    }

    updateChartOptions() {
        if (this.config.dark)
            this.applyDarkTheme();
        else
            this.applyLightTheme();

    }

    applyDarkTheme() {
        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
            }
        };
    }

    applyLightTheme() {
        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
            }
        };
    }
}
