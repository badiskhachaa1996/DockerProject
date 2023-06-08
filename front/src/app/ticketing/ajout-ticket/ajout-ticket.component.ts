import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TicketService } from 'src/app/services/ticket.service';
import jwt_decode from "jwt-decode";
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-ajout-ticket',
  templateUrl: './ajout-ticket.component.html',
  styleUrls: ['./ajout-ticket.component.scss']
})
export class AjoutTicketComponent implements OnInit {

  TicketForm = new FormGroup({
    sujet_id: new FormControl('', Validators.required),
    service_id: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    priorite: new FormControl('', Validators.required)
  })
  token;
  sujetDropdown: any[] = [
    { label: 'SUJET1', value: "SUJET1" },
    { label: 'SUJET2', value: "SUJET2" },
  ];
  serviceDropdown: any[] = [
    { label: 'SERVICE1', value: "SERVICE1" },
    { label: 'SERVICE2', value: "SERVICE2" },
  ];;
  // Haute priorité / Moyenne priorité / Basse priorité / Priorité normale
  prioriteDropdown: any[] = [
    { label: 'Priorité normale', value: "Priorité normale" },
    { label: 'Basse priorité', value: "Basse priorité" },
    { label: 'Moyenne priorité', value: "Moyenne priorité" },
    { label: 'Haute priorité', value: "Haute priorité" },
  ];
  onAdd() {
    let documents = []
    if (this.uploadedFiles[0]) {
      documents.push({ path: this.uploadedFiles[0].name, name: this.uploadedFiles[0].name })
    }
    this.TicketService.create({ ...this.TicketForm.value, documents, user_id: this.token.id }).subscribe(data => {
      if (this.uploadedFiles[0]) {
        let formData = new FormData()
        this.ToastService.add({ severity: 'success', summary: 'Création du ticket avec succès' })
        formData.append('id', data._id)
        formData.append('file', this.uploadedFiles[0])
        formData.append('path', this.uploadedFiles[0].name)
        this.TicketService.addFile(formData).subscribe(data => {
          this.ToastService.add({ severity: 'success', summary: 'Envoi de la pièce jointe avec succès' })
        })
      }
    })
  }
  onSelectService() {
    //this.sujetDropdown = []
  }
  uploadedFiles: File[] = []
  onUpload(event: { files: File[] }) {
    this.uploadedFiles = event.files
  }
  constructor(private TicketService: TicketService, private ToastService: MessageService) { }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
  }

}
