import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import jwt_decode from "jwt-decode";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { CommercialPartenaire } from 'src/app/models/CommercialPartenaire';
import { Partenaire } from 'src/app/models/Partenaire';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { PartenaireService } from 'src/app/services/partenaire.service';

@Component({
  selector: 'app-list-collaborateur',
  templateUrl: './list-collaborateur.component.html',
  styleUrls: ['./list-collaborateur.component.scss']
})
export class ListCollaborateurComponent implements OnInit {

  partenaire: Partenaire;

  commercialPartenaires: CommercialPartenaire[] = [];

  formAddCommercial: FormGroup;
  showFormAddCommercial: boolean = false;

  formUpdateCommercial: FormGroup;
  showFormUpdateCommercial: boolean = false;

  idCommercialToUpdate: string;
  commercialToUpdate: CommercialPartenaire;

  idUserToUpdate: string;
  userToUpdate: User;

  idPartenaire: string = this.activatedRoute.snapshot.params['id'];

  users: User[] = [];
  dropdownUser: User[] = [];

  token

  civiliteList = [
    { label: 'Mr', value: 'Mr' },
    { label: 'Mme', value: 'Mme' },
    { label: 'Autre', value: 'Autre' },
  ];

  statutList = [
    { label: 'Interne', value: 'Interne' },
    { label: 'Interne admin', value: 'Interne admin' },
    { label: 'Externe', value: 'Externe' }
  ];

  canDelete = false
  gestionCommercial: CommercialPartenaire

  constructor(private partenaireService: PartenaireService, private activatedRoute: ActivatedRoute, private messageService: MessageService,
    private commercialPartenaireService: CommercialPartenaireService, private userService: AuthService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {

    this.token = jwt_decode(localStorage.getItem('token'));
    this.canDelete = (this.token && (this.token['role'] == 'Admin' || this.token['role'] == "Responsable"))
    //Recuperation des données
    this.onGetData();

    //Recuperation des infos du partenaire
    this.partenaireService.getById(this.activatedRoute.snapshot.params['id']).subscribe(
      ((response) => { this.partenaire = response; }),
      ((error) => { console.error(error); })
    );

    //Initialisation des formulaires
    this.onInitFormAddCommercial();
    this.onInitFormUpdateCommercial();
  }


  //Methode d'initialisation du formulaire d'ajout d'un commercial-partenaire
  onInitFormAddCommercial() {
    this.formAddCommercial = this.formBuilder.group({
      civilite: [this.civiliteList[0]],
      firstname: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      lastname: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9+]+$")]],
      email: ['', Validators.required],
      statut: [this.statutList[0], Validators.required],
      password: ['', Validators.required],
      password_confirmed: ['', Validators.required],
    });
  }

  //pour la partie de traitement des erreurs sur le formulaire
  get firstname() { return this.formAddCommercial.get('firstname'); };
  get lastname() { return this.formAddCommercial.get('lastname'); };
  get phone() { return this.formAddCommercial.get('phone'); };

  get password() { return this.formAddCommercial.get('password'); };
  get password_confirmed() { return this.formAddCommercial.get('password_confirmed'); };


  //Methode d'ajout du commercial
  onAddCommercial() {
    //recupération des données du formulaire
    let civilite = this.formAddCommercial.get('civilite')?.value.value;
    let firstname = this.formAddCommercial.get('firstname')?.value;
    let lastname = this.formAddCommercial.get('lastname')?.value;
    let phone = this.formAddCommercial.get('phone')?.value;
    let email = this.formAddCommercial.get('email')?.value;
    let password = this.formAddCommercial.get('password')?.value;
    let statut = this.formAddCommercial.get('statut')?.value.value;

    //Pour la creation du nouveau formateur, on crée en même temps un user et un formateur
    let newUser = new User(null, firstname, lastname, null, phone, email, email, password, 'Agent', null, null, civilite, null, null, null, null, null, null, null, null, null);

    //Pour la creation du nouveau commercial
    let newCommercialPartenaire = new CommercialPartenaire(null, this.partenaire._id, null, this.generateCode(), statut);

    this.commercialPartenaireService.create({ 'newUser': newUser, 'newCommercialPartenaire': newCommercialPartenaire }).subscribe(
      ((response) => {
        if (response.success) {
          //Recuperation des données apres ajout du commercial
          this.onGetData();

          this.messageService.add({ severity: 'success', summary: 'Ajout reussi' });

          this.formAddCommercial.reset();
          this.showFormAddCommercial = false;

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


  //Methode de recuperation du commercial
  onGetById() {
    this.commercialPartenaireService.getById(this.idCommercialToUpdate).subscribe(
      ((commercialFromDb) => {
        this.commercialToUpdate = commercialFromDb;
        //Recuperation du user à mettre à jour
        this.userService.getInfoById(this.idUserToUpdate).subscribe(
          ((userFromDb) => {
            this.userToUpdate = userFromDb;
            //Suite du traitement patchValue ici
            this.formUpdateCommercial.patchValue({
              civilite: { 'label': this.userToUpdate.civilite, 'value': this.userToUpdate.civilite },
              firstname: this.userToUpdate.firstname,
              lastname: this.userToUpdate.lastname,
              phone: this.userToUpdate.phone,
              email: this.userToUpdate.email,
              statut: { 'label': this.commercialToUpdate.statut, 'value': this.commercialToUpdate.statut }
            });

          }),
          ((error) => { console.error(error); })
        );

      }),
      ((error) => { console.error(error); })
    );
  }


  //Methode d'initialisation du formulaire de mise à jour d'un commercial-partenaire
  onInitFormUpdateCommercial() {
    this.formUpdateCommercial = this.formBuilder.group({
      civilite: [''],
      firstname: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      lastname: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9+]+$")]],
      email: ['', Validators.required],
      statut: ['', Validators.required],
    });
  }


  //pour la partie de traitement des erreurs sur le formulaire
  get firstname_m() { return this.formUpdateCommercial.get('firstname'); };
  get lastname_m() { return this.formUpdateCommercial.get('lastname'); };
  get phone_m() { return this.formUpdateCommercial.get('phone'); };


  //Methode de mise à jour d'un commercial-partenaire
  onUpdateCommercial() {
    //recupération des données du formulaire
    let civilite = this.formUpdateCommercial.get('civilite')?.value.value;
    let firstname = this.formUpdateCommercial.get('firstname')?.value;
    let lastname = this.formUpdateCommercial.get('lastname')?.value;
    let phone = this.formUpdateCommercial.get('phone')?.value;
    let email = this.formUpdateCommercial.get('email')?.value;

    let statut = this.formUpdateCommercial.get('statut')?.value.value;

    //Pour la creation du nouveau formateur, on crée en même temps un user et un formateur
    let newUser = new User(this.userToUpdate._id, firstname, lastname, '', phone, email, null, null, 'Agent', null, null, civilite, null, null, null, null, null, null, null, null, null);

    //Pour la creation du nouveau commercial
    let newCommercialPartenaire = new CommercialPartenaire(this.commercialToUpdate._id, this.commercialToUpdate.partenaire_id, this.commercialToUpdate.user_id, this.commercialToUpdate.code_commercial_partenaire, statut);

    //Requete de mise à jour
    this.commercialPartenaireService.update({ 'userToUpdate': newUser, 'commercialToUpdate': newCommercialPartenaire }).subscribe(
      ((response) => {
        if (response.success) {
          //Recuperation des données apres ajout du commercial
          this.onGetData();

          this.messageService.add({ severity: 'success', summary: 'Modification reussi' });
          this.formUpdateCommercial.reset();
          this.showFormUpdateCommercial = false;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de modification' });
        }
      }),
      ((error) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur lors de la modification, veuillez contacter un administrateur' });
        console.error(error);
      })
    );

  }


  listPartenaire = {}

  //Methode de recuperation des données user et commercial
  onGetData() {
    //Recuperation de la liste des users
    this.userService.getAll().subscribe(
      ((response) => {
        response.forEach(user => {
          this.users[user._id] = user;
        });

      }),
      ((error) => { console.error(error); })
    );

    //Recuperation de la liste des commercials
    if (this.idPartenaire) {
      this.commercialPartenaireService.getAllByPartenaireID(this.idPartenaire).subscribe(
        ((response) => { this.commercialPartenaires = response; }),
        ((error) => { console.error(error); })
      );
    } else {
      this.commercialPartenaireService.getAll().subscribe(
        ((response) => { this.commercialPartenaires = response; }),
        ((error) => { console.error(error); })
      );
    }
    this.partenaireService.getAll().subscribe(data => {
      data.forEach(p => {
        this.listPartenaire[p._id] = p
      })
    })

  }

  exportExcel() {
    let dataExcel = []
    //Clean the data
    this.commercialPartenaires.forEach(p => {
      let user: any = p.user_id
      let partenaire: Partenaire = this.listPartenaire[p.partenaire_id]
      if (user && user.lastname && user.lastname && p.code_commercial_partenaire) {
        let t = {}
        t['NOM'] = user?.lastname.toUpperCase()
        t['Prenom'] = user?.firstname
        t['Code Commercial'] = p?.code_commercial_partenaire
        t['Est Admin'] = (p.isAdmin) ? "Oui" : "Non";
        t['ID'] = p._id
        t['Email'] = user?.email_perso
        t['phone'] = user?.phone
        t['Nationalite'] = user?.nationnalite
        t['password'] = user.password

        t['p_nom'] = partenaire.nom
        t['p_email'] = partenaire.email
        t['services'] = partenaire.Services
        t['Pays'] = partenaire.Pays
        dataExcel.push(t)
      }
    })
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, "partenaires" + '_export_' + new Date().toLocaleDateString("fr-FR") + ".xlsx");

  }


  seePreRecruted(rowData: CommercialPartenaire) {
    this.router.navigate(["/international/partenaire/" + rowData.user_id])
  }

  seeRecruted(rowData: CommercialPartenaire) {
    this.router.navigate(["/etudiants/" + rowData.code_commercial_partenaire])
  }

  delete(rowData: CommercialPartenaire) {
    if (confirm("La suppression de ce commercial, supprimera aussi son compte IMS et enlevera les codes commerciaux de ces prospects\nL'équipe IMS ne sera pas responsable si cela occasione un problème du à la suppression\nEtes-vous sûr de vouloir faire cela ?"))
      this.commercialPartenaireService.delete(rowData._id).subscribe(p => {
        this.commercialPartenaires.forEach((val, index) => {
          if (val._id == rowData._id) {
            this.commercialPartenaires.splice(index, 1)
          }
        })
      })
  }


}
