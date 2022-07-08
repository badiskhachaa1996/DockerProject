import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Formateur } from 'src/app/models/Formateur';
import { User } from 'src/app/models/User';
import { FormateurService } from 'src/app/services/formateur.service';
import { ServService } from 'src/app/services/service.service';
import { MatiereService } from 'src/app/services/matiere.service';
import { SeanceService } from 'src/app/services/seance.service';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import { CampusService } from 'src/app/services/campus.service';
import { DiplomeService } from 'src/app/services/diplome.service';

@Component({
  selector: 'app-add-formateur',
  templateUrl: './add-formateur.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./add-formateur.component.scss']
})
export class AddFormateurComponent implements OnInit {

  typeFormateur = [
    { label: 'Interne', value: true },
    { label: 'Externe', value: false },
  ];

  fr = environment.fr;

  formAddFormateur: FormGroup;
  showFormAddFormateur: boolean = false;

  users: User[] = [];
  civiliteList = environment.civilite;

  typeContratList = [
    { label: 'CDI', value: 'CDI' },
    { label: 'CDD', value: 'CDD' },
    { label: 'Prestation et Vacation', value: 'Prestation et Vacation' },
    //{ label: 'Vacation', value: 'Vacation' },
    { label: 'Sous-traitance', value: 'Sous-traitance' },
    /*{ label: "Contrat d'apprentissage", value: "Contrat d'apprentissage" },
    { label: "Contrat de professionalisation", value: "Contrat de professionalisation" },*/
  ];
  prestataireList = [
    { label: 'EliteLabs', value: 'EliteLabs' },
    { label: 'Autre', value: 'Autre' }
  ];
  matiereList = [];
  matiereDic = {};
  dropdownCampus = []
  volumeHList = [];
  affichePrestataire: string;
  tempVolumeCons = null;
  userList: any = {};
  serviceDic = []
  seanceNB = {};
  jury_diplomesList = []


  genderMap: any = { 'Monsieur': 'Mr.', 'Madame': 'Mme.', undefined: '', 'other': 'Mel.' };
  token;
  diplomesListe = [];

  onAddJ_diplome() {
    console.log(this.jury_diplomesList)
    this.jury_diplomesList.push({ titre: "", cout_h: 0 })
  }

  changeCout(i, event, type) {

    if (type == "cout_h") {
      this.jury_diplomesList[i][type] = parseInt(event.target.value);
    } else {
      this.jury_diplomesList[i][type] = event.value.titre;
    }
    console.log(this.jury_diplomesList)
  }
  deleteJ_diplome(i) {

    this.jury_diplomesList.splice(i)

  }

  constructor(private formateurService: FormateurService, private formBuilder: FormBuilder, private messageService: MessageService, private router: Router,
    private ServService: ServService, private diplomeService: DiplomeService, private MatiereService: MatiereService, private SeanceService: SeanceService, private CampusService: CampusService) { }

  ngOnInit(): void {


    this.diplomeService.getAll().subscribe(data => {
      this.diplomesListe = data
      data.forEach(formation => {

        this.diplomesListe[formation._id] = formation;
      })

      console.log(this.diplomesListe)
    })
    this.getUserList()

    //Initialisation du formulaire d'ajout de formateur
    this.onInitFormAddFormateur();

    this.MatiereService.getMatiereList().subscribe((data) => {
      this.matiereList = data
    })
    this.MatiereService.getAll().subscribe(data => {
      data.forEach(m => {
        this.matiereDic[m._id] = m
      });
    })

    this.ServService.getAll().subscribe((services) => {
      services.forEach(serv => {
        this.serviceDic[serv._id] = serv;
      });
    })

    this.SeanceService.getAll().subscribe(data => {
      data.forEach(seance => {
        if (this.seanceNB[seance.formateur_id] != null) {
          this.seanceNB[seance.formateur_id] += 1
        }
        else {
          this.seanceNB[seance.formateur_id] = 0
        }
      })
    })

    this.CampusService.getAll().subscribe((cData) => {
      cData.forEach(c => {
        this.dropdownCampus.push({ label: c.libelle, value: c._id })
      });
    })

  }


  //Methode d'initialisation du formulaire d'ajout de nouveau formateur
  onInitFormAddFormateur() {
    this.formAddFormateur = this.formBuilder.group({
      civilite: [this.civiliteList[0]],
      firstname: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      lastname: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      indicatif: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9+]+$")]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@estya+\\.com$")]],
      pays_adresse: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      ville_adresse: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      rue_adresse: ['', Validators.required],
      numero_adresse: ['', Validators.required],
      postal_adresse: ['', Validators.required],
      type_contrat: [this.typeContratList[0], Validators.required],
      taux_h: ['', Validators.required],
      taux_j: [''],
      prestataire_id: [this.prestataireList[0]],
      volume_h: this.formBuilder.array([]),
      remarque: [''],
      campus: [""],
      monday_available: [false],
      tuesday_available: [false],
      wednesday_available: [false],
      thursday_available: [false],
      friday_available: [false],
      monday_h_debut: [""],
      tuesday_h_debut: [""],
      wednesday_h_debut: [""],
      thursday_h_debut: [""],
      friday_h_debut: [""],
      monday_h_fin: [""],
      tuesday_h_fin: [""],
      wednesday_h_fin: [""],
      thursday_h_fin: [""],
      friday_h_fin: [""],
      monday_remarque: [""],
      tuesday_remarque: [""],
      wednesday_remarque: [""],
      thursday_remarque: [""],
      friday_remarque: [""],
      absences: [''],
      nda: [""],
      IsJury: [""],
    });
  }


  //pour la partie de traitement des erreurs sur le formulaire
  get civilite() { return this.formAddFormateur.get('civilite'); };
  get firstname() { return this.formAddFormateur.get('firstname'); };
  get lastname() { return this.formAddFormateur.get('lastname'); };
  get indicatif() { return this.formAddFormateur.get('indicatif'); };
  get phone() { return this.formAddFormateur.get('phone'); };
  get email() { return this.formAddFormateur.get('email'); };
  get pays_adresse() { return this.formAddFormateur.get('pays_adresse'); };
  get ville_adresse() { return this.formAddFormateur.get('ville_adresse'); };
  get rue_adresse() { return this.formAddFormateur.get('rue_adresse'); };
  get numero_adresse() { return this.formAddFormateur.get('numero_adresse'); };
  get postal_adresse() { return this.formAddFormateur.get('postal_adresse'); };
  get type_contrat() { return this.formAddFormateur.get('type_contrat'); };
  get taux_h() { return this.formAddFormateur.get('taux_h'); };
  get prestataire_id() { return this.formAddFormateur.get('prestataire_id'); };
  get campus() { return this.formAddFormateur.get('campus'); };
  get nda() { return this.formAddFormateur.get('nda'); };
  get IsJury() { return this.formAddFormateur.get('IsJury'); };

  //Methode d'ajout du nouveau formateur dans la base de données
  onAddFormateur() {
    //recupération des données du formulaire
    let civilite = this.formAddFormateur.get('civilite')?.value.value;
    let firstname = this.formAddFormateur.get('firstname')?.value;
    let lastname = this.formAddFormateur.get('lastname')?.value;
    let indicatif = this.formAddFormateur.get('indicatif')?.value;
    let phone = this.formAddFormateur.get('phone')?.value;
    let email = this.formAddFormateur.get('email')?.value;
    let pays_adresse = this.formAddFormateur.get('pays_adresse')?.value;
    let ville_adresse = this.formAddFormateur.get('ville_adresse')?.value;
    let rue_adresse = this.formAddFormateur.get('rue_adresse')?.value;
    let numero_adresse = this.formAddFormateur.get('numero_adresse')?.value;
    let postal_adresse = this.formAddFormateur.get('postal_adresse')?.value;

    let type_contrat = this.formAddFormateur.get('type_contrat')?.value.value;
    let taux_h = this.formAddFormateur.get('taux_h')?.value;
    let taux_j = this.formAddFormateur.get('taux_j')?.value;
    let prestataire_id = this.formAddFormateur.get('prestataire_id')?.value.value;
    let tempVH = this.formAddFormateur.get('volume_h').value ? this.formAddFormateur.get('volume_h').value : [];
    let volumeH = {};
    let volumeH_ini = {};
    let campus = this.campus.value
    let nda = this.formAddFormateur.get('nda')?.value;
    this.volumeHList.forEach((VH, index) => {
      volumeH[tempVH[index]] = VH
      volumeH_ini[tempVH[index]] = 0;
    });
    let remarque = this.formAddFormateur.get('remarque')?.value;

    let monday_available = {
      state: this.formAddFormateur.get('monday_available').value,
      h_debut: this.formAddFormateur.get('monday_h_debut').value,
      h_fin: this.formAddFormateur.get('monday_h_fin').value,
      remarque: this.formAddFormateur.get('monday_remarque').value,
    }
    let tuesday_available = {
      state: this.formAddFormateur.get('tuesday_available').value,
      h_debut: this.formAddFormateur.get('tuesday_h_debut').value,
      h_fin: this.formAddFormateur.get('tuesday_h_fin').value,
      remarque: this.formAddFormateur.get('tuesday_remarque').value,
    }
    let wednesday_available = {
      state: this.formAddFormateur.get('wednesday_available').value,
      h_debut: this.formAddFormateur.get('wednesday_h_debut').value,
      h_fin: this.formAddFormateur.get('wednesday_h_fin').value,
      remarque: this.formAddFormateur.get('wednesday_remarque').value,
    }
    let thursday_available = {
      state: this.formAddFormateur.get('thursday_available').value,
      h_debut: this.formAddFormateur.get('thursday_h_debut').value,
      h_fin: this.formAddFormateur.get('thursday_h_fin').value,
      remarque: this.formAddFormateur.get('thursday_remarque').value,
    }
    let friday_available = {
      state: this.formAddFormateur.get('friday_available').value,
      h_debut: this.formAddFormateur.get('friday_h_debut').value,
      h_fin: this.formAddFormateur.get('friday_h_fin').value,
      remarque: this.formAddFormateur.get('friday_remarque').value,
    }

    let absences = this.formAddFormateur.get('absences').value

    //Pour la creation du nouveau formateur, on crée en même temps un user et un formateur
    let newUser = new User(null, firstname, lastname, indicatif, phone, email, null, null, 'user', null, null, civilite, null, null, 'formateur', null, pays_adresse, ville_adresse, rue_adresse, numero_adresse, postal_adresse);

    //création et envoie du nouvelle objet formateur
    let newFormateur = new Formateur(null, '', type_contrat, taux_h, taux_j, prestataire_id, volumeH, volumeH_ini, monday_available, tuesday_available, wednesday_available, thursday_available, friday_available, remarque, campus, nda,
      this.jury_diplomesList, absences);
    this.formateurService.create({ 'newUser': newUser, 'newFormateur': newFormateur }).subscribe(
      ((response) => {
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: 'Ajout de formateur', detail: response.success });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'ajout du formateur', detail: response.error });
        }
      }),
      ((error) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'ajout du formateur', detail: error });
        console.error(error);
      })
    );
    this.onInitFormAddFormateur();
    this.showFormAddFormateur = false;
    this.resetAddFormateur();

  }


  onGetStatut() {
    //recupère le statut et l'affecte à la variable affichePrestataire pour determiné s'il faut ou non afficher le champs prestataire
    return this.formAddFormateur.get('type_contrat').value.value;
  }


  getVolumeH() {
    return this.formAddFormateur.get('volume_h') as FormArray;
  }

  onAddMatiere() {
    const tempControl = this.formBuilder.control('', Validators.required);
    this.getVolumeH().push(tempControl);
  }

  changeVolumeH(i, event) {
    this.volumeHList[i] = parseInt(event.target.value);
  }

  deleteMatiereAdd(i) {
    this.volumeHList.splice(i, 1)
    let FArray: [] = this.formAddFormateur.get('volume_h').value;
    FArray.splice(i, 1)
    this.formAddFormateur.setControl('volume_h', this.formBuilder.array(FArray))
  }

  getUserList() {
    this.formateurService.getAllUser().subscribe((data) => {
      this.userList = data;
    }, error => {
      console.error(error)
    })
  }

  showCalendar(rowData) {
    this.router.navigate(['/calendrier/formateur/' + rowData.user_id])
  }

  sendCalendar(rowData) {
    this.formateurService.sendEDT(rowData._id).subscribe(data => {
      this.messageService.add({ severity: 'success', summary: 'Envoie des emplois du temps', detail: "L'emploi du temps a bien été envoyé" })
    }, error => {
      console.error(error)
      this.messageService.add({ severity: 'error', summary: 'Erreur avec les emplois du temps', detail: "Contacté un Admin" })
    })
  }
  resetAddFormateur() {
    this.formAddFormateur.reset()
    this.formAddFormateur.patchValue({
      civilite: this.civiliteList[0], type_contrat: this.typeContratList[0],
      prestataire_id: this.prestataireList[0], volume_h: [],
      remarque: ""
    })
    this.formAddFormateur.setControl('volume_h', this.formBuilder.array([]))
  }

}
