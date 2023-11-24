import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CommercialPartenaire } from 'src/app/models/CommercialPartenaire';
import { Partenaire } from 'src/app/models/Partenaire';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ajout-collaborateur',
  templateUrl: './ajout-collaborateur.component.html',
  styleUrls: ['./ajout-collaborateur.component.scss']
})
export class AjoutCollaborateurComponent implements OnInit {
  paysList = environment.pays;
  civiliteList = [
    { label: 'Mr', value: 'Mr' },
    { label: 'Mme', value: 'Mme' },
    { label: 'Autre', value: 'Autre' },
  ];

  statutList = [
    { label: 'Agent', value: 'Agent' },
    { label: 'Admin', value: 'Admin' }
  ];
  formAddCommercial: FormGroup = new FormGroup({
    civilite: new FormControl(this.civiliteList[0]),
    firstname: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]),
    lastname: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]),
    phone: new FormControl('', [Validators.required, Validators.pattern("^[0-9+]+$")]),
    whatsapp: new FormControl('', [Validators.pattern("^[0-9+]+$")]),
    email: new FormControl('', Validators.required),
    statut: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    password_confirmed: new FormControl('', Validators.required),
    pays: new FormControl([], Validators.required)
  });
  partenaire: Partenaire;
  commercialPartenaires: CommercialPartenaire[] = []
  constructor(private partenaireService: PartenaireService, private activatedRoute: ActivatedRoute, private messageService: MessageService,
    private commercialPartenaireService: CommercialPartenaireService, private userService: AuthService) { }

  ngOnInit(): void {
    this.partenaireService.getById(this.activatedRoute.snapshot.params['id']).subscribe(
      ((response) => { this.partenaire = response; }),
      ((error) => { console.error(error); })
    );
    this.commercialPartenaireService.getAllByPartenaireID(this.activatedRoute.snapshot.params['id']).subscribe(
      ((response) => { this.commercialPartenaires = response; }),
      ((error) => { console.error(error); })
    );
  }

  onAddCommercial() {
    //recupération des données du formulaire
    let civilite = this.formAddCommercial.get('civilite')?.value.value;
    let firstname = this.formAddCommercial.get('firstname')?.value;
    let lastname = this.formAddCommercial.get('lastname')?.value;
    let phone = this.formAddCommercial.get('phone')?.value;
    let email = this.formAddCommercial.get('email')?.value;
    let password = this.formAddCommercial.get('password')?.value;
    let statut = this.formAddCommercial.get('statut')?.value;
    let pays = this.formAddCommercial.get('pays')?.value.join(',');
    let whatsapp = this.formAddCommercial.get('whatsapp')?.value;

    //Pour la creation du nouveau formateur, on crée en même temps un user et un formateur
    let newUser = new User(null, firstname, lastname, null, phone, email, email, password, 'Agent', null, null, civilite);

    //Pour la creation du nouveau commercial
    let newCommercialPartenaire = new CommercialPartenaire(null, this.partenaire._id, null, this.generateCode(), statut, statut == "Admin", pays, whatsapp);

    this.commercialPartenaireService.create({ 'newUser': newUser, 'newCommercialPartenaire': newCommercialPartenaire }).subscribe(
      ((response) => {
        if (response.success) {
          //Recuperation des données apres ajout du commercial

          this.messageService.add({ severity: 'success', summary: 'Ajout reussi' });

          this.formAddCommercial.reset();

        } else {
          console.error(response)
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'ajout', detail: "L'email est peut être déjà utilisé" });
        }
      }),
      ((error) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'ajout, veuillez contacter un administrateur' });
        console.error(error);
      })
    );
  }

  generateCode(): string {
    let n = (this.commercialPartenaires.length + 1).toString().substring(0, 2)
    while (n.length < 2) {
      n = "0" + n
    }
    return this.partenaire.code_partenaire + "C" + n
  }

}
