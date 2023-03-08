import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProspectAlternable } from 'src/app/models/ProspectAlternable';
import { AdmissionService } from 'src/app/services/admission.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-prospects-alternables',
  templateUrl: './prospects-alternables.component.html',
  styleUrls: ['./prospects-alternables.component.scss']
})
export class ProspectsAlternablesComponent implements OnInit {

  prospects: ProspectAlternable[] = [];
  formUpdate: FormGroup;
  showFormUpdate: boolean = false;

  formGenerateLink: FormGroup;
  showFormGenerateLink: boolean = false;

  token: any;

  constructor(private admissionService: AdmissionService, private messageService: MessageService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // décodage du token
    this.token = jwt_decode(localStorage.getItem('token'));
    // recuperation de la liste des prospects alternables
    this.admissionService.getProspectsAlt()
    .then((response) => { this.prospects = response; })
    .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Prospects', detail: error.errMsg }); });

    // initialisation du formulaire de génération du lien
    this.formGenerateLink = this.formBuilder.group({
      adresse_mail: ['', Validators.required],
    });
  }

  // méthode d'affichage du formulaire de génération de lien
  onShowFormGenerateLink(): void 
  {
    if(confirm("Vous allez générer un lien pour une demande d'admission, assurez-vous de saisir la bonne adresse mail dans le formulaire !"))
    {
      this.showFormGenerateLink = true;
    }
  }

  // méthode d'envoi du mail de generation du formulaire
  onSendCreationLink(): void
  {
    // recuperation des données du formulaire
    const formValue = this.formGenerateLink.value;

    const idCommercial = this.token.id;
    const email = formValue.adresse_mail;

    // envoi du mail
    this.admissionService.sendCreationLink(idCommercial, email)
    .then((response) => { 
      this.messageService.add({ severity: 'success', summary: 'Génération de formulaire', detail: response.successMsg }); 
      this.formGenerateLink.reset();
      this.showFormGenerateLink = false;
    })
    .catch((error) => { this.messageService.add({ severity: 'error', summary: 'Génération de formulaire', detail: error.errMsg }); });
  }

}
