import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService as ToastService } from 'primeng/api';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { CampusService } from 'src/app/services/campus.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import { AuthService } from 'src/app/services/auth.service';
import { Partenaire } from 'src/app/models/Partenaire';
import { User } from 'src/app/models/User';
import jwt_decode from "jwt-decode";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-partenaire',
  templateUrl: './list-partenaire.component.html',
  styleUrls: ['./list-partenaire.component.scss'],
  providers: [MessageService, ConfirmationService],
  styles: [`
        :host ::ng-deep  .p-frozen-column {
            font-weight: bold;
        }

        :host ::ng-deep .p-datatable-frozen-tbody {
            font-weight: bold;
        }

        :host ::ng-deep .p-progressbar {
            height:.5rem;
        }
    `]
})
export class ListPartenaireComponent implements OnInit {
  FjTopatch: any;
  Ttopatch: any;
  partenaires = []
  users = {}
  token;
  showFormAddPartenaire = false
  statutList = environment.typeUser
  civiliteList = environment.civilite;
  entreprisesList = []
  campusList = []
  formationList = []
  typeSoc = [{ value: "Professionel (Société)" }, { value: "Particulier (Personne)" }]
  formatJuridique = [{ value: "EIRL" }, { value: "EURL" }, { value: "SARL" }, { value: "SA" }, { value: "SAS" }, { value: "SNC" }, { value: "Etudiant IMS" }, { value: "Individuel" }]
  genderMap: any = { 'Monsieur': 'Mr.', 'Madame': 'Mme.', undefined: '', 'other': 'Mel.' };

  registerForm: FormGroup;

  formModifPartenaire: FormGroup;
  partenaireToUpdate: Partenaire;
  idPartenaireToUpdate: string;
  idUserOfPartenaireToUpdate: string;
  showFormModifPartenaire = false;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild('dt') table: Table;

  canDelete = false

  constructor(private formBuilder: FormBuilder, private messageService: ToastService, private partenaireService: PartenaireService, private route: ActivatedRoute, private router: Router, private UserService: AuthService) { }

  ngOnInit(): void {
    let tkn = jwt_decode(localStorage.getItem("token"))
    this.canDelete = (tkn && (tkn['role'] == 'Admin' || tkn['role'] == "Responsable"))
    this.updateList();
    this.onInitFormModifPartenaire()


  }


  updateList() {
    this.partenaireService.getAll().subscribe(data => {
      this.partenaires = data
    })
    this.UserService.getAll().subscribe(dataU => {
      dataU.forEach(u => {
        this.users[u._id] = u
      })
    })
  }

  seePreRecruted(rowData: Partenaire) {
    this.router.navigate(["/gestion-preinscriptions/" + rowData._id])
  }

  seeRecruted(rowData: Partenaire) {
    this.router.navigate(["/etudiants/" + rowData._id])
  }

  seeUnderPartenaire(rowData) {
    this.router.navigate(["/collaborateur/" + rowData._id])
  }

  delete(rowData: Partenaire) {
    if (confirm("La suppression de ce partenaire, supprimera aussi tous les commerciaux/collaborateurs avec leurs comptes IMS et enlevera leurs codes commerciaux de tous leurs prospects\n L'équipe IMS ne sera pas responsable si cela occasione un problème du à la suppresion\nEtes-vous sûr de vouloir faire cela ?"))
      this.partenaireService.delete(rowData._id).subscribe(p => {
        this.partenaires.forEach((val, index) => {
          if (val._id == p._id) {
            this.partenaires.splice(index, 1)
          }
        })
      })
  }


  //Permet de vider les filtres
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }



  //Méthode de récupération du partenaire à modifier
  onGetbyId(rowData: Partenaire) {


    for (var i = 0; i < this.formatJuridique.length; i++) {
      if (this.formatJuridique[i].value === rowData.format_juridique) {
        this.FjTopatch = i
      }
    }

    for (var i = 0; i < this.typeSoc.length; i++) {
      if (this.typeSoc[i].value === rowData.type) {
        this.Ttopatch = i
      }
    }


    this.idPartenaireToUpdate = rowData._id;
    this.formModifPartenaire.patchValue({
      nomSoc: rowData.nom,
      phonePartenaire: rowData.phone,
      emailPartenaire: rowData.email,
      number_TVA: rowData.number_TVA,
      SIREN: rowData.SIREN,
      SIRET: rowData.SIRET,
      format_juridique: this.formatJuridique[this.FjTopatch],
      type: this.typeSoc[this.Ttopatch],
      APE: rowData.APE,
      Services: rowData.Services,
      Pays: rowData.Pays,
      WhatsApp: rowData.WhatsApp,
      indicatif: rowData.indicatifPhone,
      indicatif_whatsapp: rowData.indicatifWhatsapp,
    });
  }

  //Méthode d'initialisation du formulaire de modification d'un partenaire
  onInitFormModifPartenaire() {
    this.formModifPartenaire = this.formBuilder.group({
      nomSoc: ['', [Validators.required]],
      type: ['', [Validators.required]],
      format_juridique: ['', [Validators.required]],
      indicatif: ['', [Validators.required, Validators.pattern('[- +()0-9]+')]],
      phonePartenaire: ['', [Validators.required, Validators.pattern('[- +()0-9]+')]],
      indicatif_whatsapp: ['', [Validators.required, Validators.pattern('[- +()0-9]+')]],
      WhatsApp: ['', [Validators.pattern('[- +()0-9]+')]],
      emailPartenaire: ['', [Validators.required, Validators.email]],
      number_TVA: ['', [Validators.required, Validators.pattern('[- +()0-9]+')]],
      SIREN: ['', [Validators.pattern('[- +()0-9]+')]],
      SIRET: ['', [Validators.pattern('[- +()0-9]+')]],
      APE: [''],
      Services: ['', [Validators.required]],
      Pays: ['', [Validators.required]],
    });

  };

  //Traitement du formulaire de modification 
  get nomSoc_m() { return this.formModifPartenaire.get('nomSoc'); }
  get type_m() { return this.formModifPartenaire.get('type'); }
  get format_juridique_m() { return this.formModifPartenaire.get('format_juridique'); }
  get indicatif_m() { return this.formModifPartenaire.get('indicatif'); }
  get phonePartenaire_m() { return this.formModifPartenaire.get('phonePartenaire'); };
  get indicatif_whatsapp_m() { return this.formModifPartenaire.get('indicatif_whatsapp'); };
  get WhatsApp_m() { return this.formModifPartenaire.get('WhatsApp'); };
  get emailPartenaire_m() { return this.formModifPartenaire.get('emailPartenaire'); };
  get number_TVA_m() { return this.formModifPartenaire.get('number_TVA'); };
  get SIREN_m() { return this.formModifPartenaire.get('SIREN'); };
  get SIRET_m() { return this.formModifPartenaire.get('SIRET'); };
  get APE_m() { return this.formModifPartenaire.get('APE'); };
  get Services_m() { return this.formModifPartenaire.get('Services'); };
  get Pays_m() { return this.formModifPartenaire.get('Pays'); };


  //Méthode de modification d'un partenaire
  onModdifPartenaire() {
    let nomSoc_m = this.formModifPartenaire.get('nomSoc').value;
    let type_m = this.formModifPartenaire.get('type').value;
    let format_juridique_m = this.formModifPartenaire.get('format_juridique').value;
    let indicatif_m = this.formModifPartenaire.get('indicatif').value;
    let phonePartenaire_m = this.formModifPartenaire.get('phonePartenaire').value;
    let indicatif_whatsapp_m = this.formModifPartenaire.get('indicatif_whatsapp').value;
    let WhatsApp_m = this.formModifPartenaire.get('WhatsApp').value;
    let emailPartenaire_m = this.formModifPartenaire.get('emailPartenaire').value;
    let number_TVA_m = this.formModifPartenaire.get('number_TVA').value;
    let SIREN_m = this.formModifPartenaire.get('SIREN').value;
    let SIRET_m = this.formModifPartenaire.get('SIRET').value;
    let APE_m = this.formModifPartenaire.get('APE').value;
    let Services_m = this.formModifPartenaire.get('Services').value;
    let Pays_m = this.formModifPartenaire.get('Pays').value;
    console.log(format_juridique_m.value,)
    this.partenaireToUpdate = new Partenaire(
      this.idPartenaireToUpdate,
      null,
      null,
      nomSoc_m,
      phonePartenaire_m,
      emailPartenaire_m,
      number_TVA_m,
      SIREN_m,
      SIRET_m,
      format_juridique_m.value,
      type_m.value,
      APE_m,
      Services_m,
      Pays_m,
      WhatsApp_m,
      indicatif_m,
      indicatif_whatsapp_m,
    );
    console.log(this.partenaireToUpdate);

    this.partenaireService.updatePartenaire(this.partenaireToUpdate).subscribe(
      ((reponses) => {
        this.messageService.add({ severity: 'success', summary: 'Modification du partenaire', detail: 'Le partenaire a bien été modifié. ' });
        this.partenaireService.getAll().subscribe(
          ((reponses) => {
            this.partenaires = reponses;
          }),
          ((error) => { console.error(error); })
        );
      }),
      ((error) => { console.error(error); })
    );

    this.formModifPartenaire.reset();
    this.showFormModifPartenaire = false;
  }

  onRedirect() {
    this.router.navigate(['partenaireInscription']);
  }

}

