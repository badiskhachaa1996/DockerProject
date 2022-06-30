import { Component, OnInit } from '@angular/core';
import { SujetService } from 'src/app/services/sujet.service';
import { Sujet } from 'src/app/models/Sujet';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Service } from 'src/app/models/Service';
import { ServService } from 'src/app/services/service.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-gestion-services',
  templateUrl: './gestion-services.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./gestion-services.component.scss']
})
export class GestionServicesComponent implements OnInit {
  serviceForm: FormGroup = new FormGroup({
    label: new FormControl('', [Validators.required]),
  });
  sujetForm: FormGroup = new FormGroup({
    label: new FormControl('', [Validators.required])
  });

  get label() { return this.serviceForm.get('label'); }
  
  currentService = null;
  message = '';
  //label = '';

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
    let service = new Service(this.serviceForm.value.label, null, true);

    this.ServiceService.addService(service).subscribe(
      ((response) => {
        this.ServiceService.getAll().subscribe(
          ((data) => { this.services = data; this.showFormAddService = false;}),
          ((error) => { console.log(error) })
        );
      }), 
      ((error) => { this.messageService.add({ severity: 'error', summary: 'Gestion de service', detail: 'Impossible d\'ajouter votre service.' }); })
    );
  }

  saveSujet() {
    let sujet = new Sujet(this.sujetForm.value.label, this.currentService._id)

    this.SjtService.addSujet(sujet).subscribe((data) => {
      this.sujetShow.push(data)
      this.sujetList.push(data);
      this.messageService.add({ severity: 'success', summary: 'Gestion de sujet', detail: 'Votre sujet a bien été ajouté' });
      this.showFormAddSujet=false;
      this.sujetForm.reset();
    }, (error) => {
      console.error(error)
    });
  }

  loadServiceSujet(){
    this.ServiceService.getAll()
    .subscribe(
      data => {
        this.services = data;
      },
      error => {
        console.error(error);
      });
    this.SjtService.getAll()
      .subscribe(
        data => {
          this.sujets = data;
          this.sujetList=[];
          if (!data.message) {
            data.forEach(sujet => {
              this.sujetList.push(sujet);
            });
          }
        },
        error => {
          console.error(error);
        });
  }

  constructor(private ServiceService: ServService,
    private messageService: MessageService,
    private SjtService: SujetService) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'label', header: 'Sujet' },
    ];
    this.loadServiceSujet()
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
    this.loadServiceSujet()
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
    this.showFormUpdateService=true;
    this.showFormAddService=false;
  }

  toggleFormSujetUpdate() {
    this.showFormUpdateSujet=true;
    this.showFormAddSujet=false;
  }

  modifyService(id) {
    let req = {
      id: this.Service._id,
      label: this.serviceForm.value.label
    }
    this.ServiceService.update(req).subscribe((data) => {
      this.services.splice(this.services.indexOf(this.Service), 1, data)
      this.serviceForm.reset();
      this.showFormUpdateService=false;
      this.loadServiceSujet()
      this.messageService.add({ severity: 'success', summary: 'Modification du service', detail: 'Le service a bien été modifié' });
    }, (error) => {
      console.error(error)
    });
  }
  modifySujet() {
    let req = {
      id: this.Sujet._id,
      label: this.sujetForm.value.label
    }

    this.SjtService.update(req).subscribe((data) => {
      this.sujetShow.splice(this.sujetShow.indexOf(this.Sujet), 1, data)
      this.showFormUpdateSujet=false;
      this.sujetForm.reset();
      this.messageService.add({ severity: 'success', summary: 'Modification du sujet', detail: 'Le sujet a bien été modifié' });
      this.loadServiceSujet()
    }, (error) => {
      console.error(error)
    });
  }
  
  hide(service :Service){
    this.ServiceService.hide(service._id).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des services', detail: service.label + ' est désactiver de la liste de services.' });
      this.loadServiceSujet()
    }, (error) => {
      console.error(error)
    });
  }

  show(service :Service){
    this.ServiceService.show(service._id).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des services', detail: service.label + ' est activer dans la liste des services.' });
      this.loadServiceSujet()
    }, (error) => {
      console.error(error)
    });
  }

  getColor(bol :boolean){
    if(!bol){
      return "gray";
    }
  }

}
