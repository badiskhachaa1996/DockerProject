import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Service } from 'src/app/models/Service';
import { ServService } from 'src/app/services/service.service';

@Component({
  selector: 'app-gestion-mention-service',
  templateUrl: './gestion-mention-service.component.html',
  styleUrls: ['./gestion-mention-service.component.scss']
})
export class GestionMentionServiceComponent implements OnInit {
  serviceForm: FormGroup = new FormGroup({
    label: new FormControl('', [Validators.required]),
  });

  get label() { return this.serviceForm.get('label'); }

  services: Service[] = []
  Service: Service

  showFormAddService: boolean = false;
  showFormUpdateService: boolean = false;
  constructor(private ServiceService: ServService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.ServiceService.getAll()
      .subscribe(
        data => {
          this.services = data;
          this.services.forEach((element, idx) => {
            element.index = idx
          });
        },
        error => {
          console.error(error);
        });
  }

  saveService() {
    let service = new Service(this.serviceForm.value.label, null, true);

    this.ServiceService.addService(service).subscribe(
      ((response) => {
        this.ServiceService.getAll().subscribe(
          ((data) => { this.services = data; this.showFormAddService = false; this.messageService.add({ severity: 'success', summary: 'Création du Service avec succès' }) }),
          ((error) => { console.error(error) })
        );
      }),
      ((error) => { this.messageService.add({ severity: 'error', summary: 'Gestion de service', detail: 'Impossible d\'ajouter votre service.' }); })
    );
  }


  editService(data) {
    this.serviceForm.patchValue({ label: data.label })
    this.Service = data;
  }

  modifyService() {
    let req = {
      id: this.Service._id,
      label: this.serviceForm.value.label
    }
    this.ServiceService.update(req).subscribe((data) => {
      this.services.splice(this.services.indexOf(this.Service), 1, data)
      this.serviceForm.reset();
      this.showFormUpdateService = false;
      this.ServiceService.getAll()
        .subscribe(
          data => {
            this.services = data;
          },
          error => {
            console.error(error);
          });
      this.messageService.add({ severity: 'success', summary: 'Modification du service', detail: 'Le service a bien été modifié' });
    }, (error) => {
      console.error(error)
    });
  }

  toggleFormServiceAdd() {
    this.showFormAddService = !this.showFormAddService;
    this.showFormUpdateService = false;
    this.serviceForm.reset();
  }

  toggleFormServiceUpdate() {
    this.showFormUpdateService = true;
    this.showFormAddService = false;
  }

  deleteService(rowData) {
    this.ServiceService.delete(rowData._id).subscribe(s => {
      this.services.splice(this.services.indexOf(rowData), 1)
      this.messageService.add({ severity: "success", summary: "Suppression du service avec succès" })
    })
  }

  onRowReorder(event) {
    this.services.forEach((s, idx) => {
      s.index = idx
      this.ServiceService.update({ ...s, id: s._id }).subscribe(r => {
      })
    })
  }

}
