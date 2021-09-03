import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Service } from 'src/app/models/Service';
import { ServService } from 'src/app/services/service.service';
import { MessageService } from 'primeng/api';
import { SujetService } from 'src/app/services/sujet.service';
import { Sujet } from 'src/app/models/Sujet';

import { Message } from 'src/app/models/Message';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  serviceForm: FormGroup = new FormGroup({
    label: new FormControl('', [Validators.required]),
  });
  sujetForm: FormGroup = new FormGroup({
    label: new FormControl('', [Validators.required])
  });
  // test: Test;
  currentService = null;
  message = '';
  label = '';

  Service: Service;
  Sujet: Sujet;

  services: any = [];
  sujets: any = [];

  currentIndex = -1;
  first = 0;
  rows = 10;

  sujetList = [];
  sujetShow = [];
  serviceList = [];

  cols: any[];

  currentSujet = null;

  showFormAddService: boolean = false;
  showFormUpdateService: boolean = false;

  showFormAddSujet: boolean = false;
  showFormUpdateSujet: boolean = false;

  saveService() {
    let service = {
      label: this.serviceForm.value.label
    };

    this.ServService.addService(service).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion de service/Service', detail: 'Creation de service réussie' });
      try {
        this.services.push(data)
      } catch (e) {
        this.services = [data]
      }
      this.showFormAddService=false;
      this.serviceForm.reset();
    }, (error) => {
      if (error.status == 400) {
        //Bad Request (service deja existant)
        // this.messageService.add({severity:'error', summary:'Message d\'inscription', detail:'Le nom de service est deja existant'});
      }
      console.log(error)
    });
  }

  saveSujet() {
    let sujet = new Sujet(this.sujetForm.value.label, this.currentService._id)

    this.SujetService.addSujet(sujet).subscribe((data) => {
      this.sujetShow.push(data)
      this.sujetList.push(data);
      this.messageService.add({ severity: 'success', summary: 'Gestion de sujet', detail: 'Creation de sujet réussie' });
      this.showFormAddSujet=false;
      this.sujetForm.reset();
    }, (error) => {
      if (error.status == 400) {
        //Bad Request (service deja existant)
        //  this.messageService.add({severity:'error', summary:'Message d\'inscription', detail:'Le nom du sujet est deja existant'});
      }
      console.log(error)
    });
  }

  Services() {
    this.ServService.getAll()
      .subscribe(
        data => {
          this.services = data;
        },
        error => {
          console.log(error);
        });
  }

  Sujets() {
    this.SujetService.getAll()
      .subscribe(
        data => {
          this.sujets = data;
        },
        error => {
          console.log(error);
        });
  }

  constructor(private ServService: ServService,
    private router: Router,
    private messageService: MessageService,
    private SujetService: SujetService) { }

  ngOnInit(): void {

    this.cols = [
      { field: 'label', header: 'Sujet' },
    ];
    this.SujetService.getAll().subscribe((data) => {
      if (!data.message) {
        data.forEach(sujet => {
          this.sujetList.push(sujet);
        });
      }
    })
    this.Services();
  }

  editSujet(data) {
    this.sujetForm.patchValue({ label: data.label })
    this.Sujet = data;
  }

  
  editService(data) {
    this.serviceForm.patchValue({ label: data.label })
    this.Service = data;
  }

  onRowSelect($event) {
    this.sujetShow = []
    this.sujetList.forEach(sujet => {
      if (sujet.service_id == this.currentService._id) {
        this.sujetShow.push(sujet)
      }
    });
  }

  onRowUnselect($event) {
    this.currentService = null
  }

  toggleFormServiceAdd() {
    this.showFormAddService=!this.showFormAddService;
    this.showFormUpdateService=false;
    this.serviceForm.reset();
  }

  toggleFormSujetAdd() {
    this.showFormAddSujet=!this.showFormAddSujet
    this.showFormUpdateSujet=false;
    this.sujetForm.reset();
  }

  toggleFormServiceUpdate() {
    this.showFormUpdateService=!this.showFormUpdateService;
    this.showFormAddService=false;
  }

  toggleFormSujetUpdate() {
    this.showFormUpdateSujet=!this.showFormUpdateSujet
    this.showFormAddSujet=false;
  }

  modifyService(id) {
    let req = {
      id: this.Service._id,
      label: this.serviceForm.value.label
    }
    this.ServService.update(req).subscribe((data) => {
      this.services.splice(this.services.indexOf(this.Service), 1, data)
      this.serviceForm.reset();
      this.showFormUpdateService=false;
      this.messageService.add({ severity: 'success', summary: 'Modification du Service', detail: 'Modification réussie' });
    }, (error) => {
      console.log(error)
    });
  }
  modifySujet() {
    let req = {
      id: this.Sujet._id,
      label: this.sujetForm.value.label
    }

    this.SujetService.update(req).subscribe((data) => {
      this.sujetShow.splice(this.sujetShow.indexOf(this.Sujet), 1, data)
      this.showFormUpdateSujet=false;
      this.sujetForm.reset();
    }, (error) => {
      console.log(error)
    });
  }





}
