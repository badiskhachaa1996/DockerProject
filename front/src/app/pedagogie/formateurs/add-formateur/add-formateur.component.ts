import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormArray } from '@angular/forms';
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
import { EntrepriseService } from 'src/app/services/entreprise.service';

@Component({
  selector: 'app-add-formateur',
  templateUrl: './add-formateur.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./add-formateur.component.scss']
})
export class AddFormateurComponent implements OnInit {
  display = false
  typeFormateur = [
    { label: 'Interne', value: true },
    { label: 'Externe', value: false },
  ];

  fr = environment.fr;

  formAddFormateur: UntypedFormGroup;

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
  prestataireList = [];
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

  showUploadFile: Formateur = null

  onAddJ_diplome() {
    this.jury_diplomesList.push({ diplome_id: "", cout_h: 0 })
  }

  changeCout(i, event, type) {
    if (type == "cout_h") {
      this.jury_diplomesList[i][type] = parseInt(event.target.value);
    } else {
      this.jury_diplomesList[i][type] = event.value._id;
    }
  }
  deleteJ_diplome(i) {
    this.jury_diplomesList.splice(i, 1)
  }

  onAddMatiere() {
    this.volumeHList.push({ volume_init: 0, matiere_id: this.matiereList[0].items[0].value, cout_h: 0 })
  }

  changeVolumeH(i, event, type) {
    if (type == "volume_init")
      this.volumeHList[i][type] = parseInt(event.target.value);
    else if (type == "matiere_id") {
      this.volumeHList[i][type] = event.value;
      this.volumeHList[i]["volume_init"] = parseInt(this.matiereDic[event.value].volume_init)
    }
    else if (type == "cout_h")
      this.volumeHList[i][type] = parseInt(event.target.value);
  }

  deleteMatiereAdd(i) {
    this.volumeHList.splice(i, 1)
  }


  constructor(private formateurService: FormateurService, private formBuilder: UntypedFormBuilder, private messageService: MessageService, private router: Router,
    private ServService: ServService, private diplomeService: DiplomeService, private MatiereService: MatiereService, private SeanceService: SeanceService,
    private CampusService: CampusService, private entrepriseService: EntrepriseService) { }

  ngOnInit(): void {
    this.diplomeService.getAll().subscribe(data => {
      this.diplomesListe = data
      data.forEach(formation => {
        this.diplomesListe[formation._id] = formation;
      })
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

    this.entrepriseService.getAll().subscribe(entData => {
      entData.forEach(ent => {
        this.prestataireList.push({ value: ent._id, label: ent.r_sociale })
      })
    })

  }


  //Methode d'initialisation du formulaire d'ajout de nouveau formateur
  onInitFormAddFormateur() {
    this.formAddFormateur = this.formBuilder.group({
      civilite: [this.civiliteList[0], Validators.required,],
      firstname: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      lastname: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      indicatif: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern("^[0-9+]+$")]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+((@estya+\.com)|(@estyagroup+\.com)|(@eduhorizons+\.com)|(@adgeducation+\.com)|(@intedgroup+\.com))$")]],
      email_perso: ['', Validators.email],
      pays_adresse: ['', [Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      ville_adresse: ['', [Validators.pattern('[^0-9]+')]],
      rue_adresse: [''],
      numero_adresse: [''],
      postal_adresse: [''],
      type_contrat: [this.typeContratList[0], Validators.required],
      taux_h: [''],
      taux_j: [''],
      prestataire_id: [this.prestataireList[0]],
      remarque: [''],
      campus: [null],
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
      IsJury: [""]
    });
  }


  //pour la partie de traitement des erreurs sur le formulaire
  get civilite() { return this.formAddFormateur.get('civilite'); };
  get firstname() { return this.formAddFormateur.get('firstname'); };
  get lastname() { return this.formAddFormateur.get('lastname'); };
  get indicatif() { return this.formAddFormateur.get('indicatif'); };
  get phone() { return this.formAddFormateur.get('phone'); };
  get email() { return this.formAddFormateur.get('email'); };
  get email_perso() { return this.formAddFormateur.get('email_perso'); };
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
    let email_perso = this.formAddFormateur.get('email_perso')?.value;
    let pays_adresse = this.formAddFormateur.get('pays_adresse')?.value;
    let ville_adresse = this.formAddFormateur.get('ville_adresse')?.value;
    let rue_adresse = this.formAddFormateur.get('rue_adresse')?.value;
    let numero_adresse = this.formAddFormateur.get('numero_adresse')?.value;
    let postal_adresse = this.formAddFormateur.get('postal_adresse')?.value;

    let type_contrat = this.formAddFormateur.get('type_contrat')?.value.value;
    let taux_h = this.formAddFormateur.get('taux_h')?.value;
    let taux_j = this.formAddFormateur.get('taux_j')?.value;
    //let prestataire_id = this.formAddFormateur.get('prestataire_id')?.value.value;
    let volumeH_i = {};
    let volumeH_consomme = {};
    let cout_h = {}
    let campus = this.formAddFormateur.get('campus')?.value;
    let nda = this.formAddFormateur.get('nda')?.value;
    this.volumeHList.forEach((VH, index) => {
      volumeH_i[VH["matiere_id"]] = VH["volume_init"]
      volumeH_consomme[VH["matiere_id"]] = 0
      cout_h[VH["matiere_id"]] = VH["cout_h"]
    });
    let jury = {}
    this.jury_diplomesList.forEach((VH, index) => {
      jury[VH["titre"]] = VH["cout_h"]
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
    let newUser = new User(null, firstname, lastname, indicatif, phone, email, email_perso, null, 'user', null, null, civilite, null, null, 'Formateur', null, pays_adresse, ville_adresse, rue_adresse, numero_adresse, postal_adresse);
    //création et envoie du nouvelle objet formateur
    let newFormateur = new Formateur(null, '', type_contrat, taux_h, taux_j, null, volumeH_i, volumeH_consomme, monday_available, tuesday_available, wednesday_available, thursday_available, friday_available, remarque, campus, nda,
      jury, absences,cout_h);

    this.formateurService.create({ 'newUser': newUser, 'newFormateur': newFormateur }).subscribe(
      ((response) => {
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: 'Ajout de formateur', detail: response.success });
          response.data.user_id = response.dataUser
          this.onInitFormAddFormateur();
          this.showUploadFile = response.data
        } else {
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'ajout du formateur', detail: response.error });
        }
      }),
      ((error) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'ajout du formateur', detail: error });
        console.error(error);
      })
    );

  }


  FileUpload(event) {
    if (event.files != null) {
      this.messageService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();
      formData.append('id', this.showUploadFile._id)
      formData.append('file', event.files[0])
      this.formateurService.uploadFile(formData, this.showUploadFile._id).subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
        event.target = null;
        this.showUploadFile = null;
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }
  }



  onGetStatut() {
    //recupère le statut et l'affecte à la variable affichePrestataire pour determiné s'il faut ou non afficher le champs prestataire
    return this.formAddFormateur.get('type_contrat').value.value;
  }




  getUserList() {
    this.formateurService.getAllUser().subscribe((data) => {
      this.userList = data;
    }, error => {
      console.error(error)
    })
  }
  resetAddFormateur() {
    this.formAddFormateur.reset()
    this.formAddFormateur.patchValue({
      civilite: this.civiliteList[0], type_contrat: this.typeContratList[0],
      prestataire_id: this.prestataireList[0],
      remarque: ""
    })
  }

}
