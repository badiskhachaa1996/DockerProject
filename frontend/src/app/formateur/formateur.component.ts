import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { Formateur } from '../models/Formateur';
import { User } from '../models/User';
import { AuthService } from '../services/auth.service';
import { FormateurService } from '../services/formateur.service';
import { ServService } from '../services/service.service';
import { MatiereService } from '../services/matiere.service';

@Component({
  selector: 'app-formateur',
  templateUrl: './formateur.component.html',
  styleUrls: ['./formateur.component.css']
})
export class FormateurComponent implements OnInit {

  formateurs: Formateur[] = [];

  formAddFormateur: FormGroup;
  showFormAddFormateur: boolean = false;

  formUpdateFormateur: FormGroup;
  showFormUpdateFormateur: boolean = false;
  formateurToUpdate: Formateur = new Formateur();
  idFormateurToUpdate: string;

  users: User[] = [];
  civiliteList = environment.civilite;
  statutList = [
    { label: 'Prestataire', value: 'Prestataire' },
    { label: 'Sous traitant', value: 'Sous traitant' },
    { label: 'Vacataire', value: 'Vacataire' }
  ];
  typeContratList = [
    { label: 'CDI', value: 'CDI' },
    { label: 'CDD', value: 'CDD' },
    { label: 'Prestation', value: 'Prestation' },
    { label: 'Vacation', value: 'Vacation' },
    { label: 'Sous-traitance', value: 'Sous-traitance' }
  ];
  prestataireList = [
    { label: 'EliteLabs', value: 'EliteLabs' },
    { label: 'Autre', value: 'Autre' }
  ];
  matiereList = [];
  volumeHList = [];
  affichePrestataire: string;
  tempVolumeCons = null;
  userList: any = {};
  serviceDic = []

  genderMap: any = { 'Monsieur': 'Mr.', 'Madame': 'Mme.', undefined: '', 'other': 'Mel.' };

  constructor(private formateurService: FormateurService, private formBuilder: FormBuilder, private messageService: MessageService, private router: Router, private ServService: ServService, private MatiereService:MatiereService) { }

  ngOnInit(): void {
    this.getUserList()

    //Recuperation de la liste des formateurs
    this.formateurService.getAll().subscribe(
      (data) => { this.formateurs = data; },
      (error) => { console.log(error) }
    );

    //Initialisation du formulaire d'ajout de formateur
    this.onInitFormAddFormateur();

    //Initialisation du formulaire de modification de formateur
    this.onInitFormUpdateFormateur();
    this.MatiereService.getMatiereList().subscribe((data)=>{
      this.matiereList=data
    })

    this.ServService.getAll().subscribe((services) => {
      services.forEach(serv => {
        this.serviceDic[serv._id] = serv;
      });
    })

  }

  //Methode d'initialisation du formulaire d'ajout de nouveau formateur
  onInitFormAddFormateur() {
    this.formAddFormateur = this.formBuilder.group({
      civilite: [''],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      pays_adresse: ['', Validators.required],
      ville_adresse: ['', Validators.required],
      rue_adresse: ['', Validators.required],
      numero_adresse: ['', Validators.required],
      postal_adresse: ['', Validators.required],
      statut: [this.statutList[0], Validators.required],
      type_contrat: [this.typeContratList[0], Validators.required],
      taux_h: ['', Validators.required],
      taux_j: ['', Validators.required],
      isInterne: [false, Validators.required],
      prestataire_id: [this.prestataireList[0]],
      volume_h: this.formBuilder.array([]),
    });
  }


  //Methode d'ajout du nouveau formateur dans la base de données
  onAddFormateur() {
    //recupération des données du formulaire
    let civilite = this.formAddFormateur.get('civilite')?.value.value;
    let firstname = this.formAddFormateur.get('firstname')?.value;
    let lastname = this.formAddFormateur.get('lastname')?.value;
    let phone = this.formAddFormateur.get('phone')?.value;
    let email = this.formAddFormateur.get('email')?.value;
    let pays_adresse = this.formAddFormateur.get('pays_adresse')?.value;
    let ville_adresse = this.formAddFormateur.get('ville_adresse')?.value;
    let rue_adresse = this.formAddFormateur.get('rue_adresse')?.value;
    let numero_adresse = this.formAddFormateur.get('numero_adresse')?.value;
    let postal_adresse = this.formAddFormateur.get('postal_adresse')?.value;

    let statut = this.formAddFormateur.get('statut')?.value.value;
    let type_contrat = this.formAddFormateur.get('type_contrat')?.value.value;
    let taux_h = this.formAddFormateur.get('taux_h')?.value;
    let taux_j = this.formAddFormateur.get('taux_j')?.value;
    let isInterne = this.formAddFormateur.get('isInterne')?.value;
    let prestataire_id = this.formAddFormateur.get('prestataire_id')?.value.value;
    let tempVH = this.formAddFormateur.get('volume_h').value ? this.formAddFormateur.get('volume_h').value : [];
    let volumeH = {};
    let volumeH_ini = {};

    this.volumeHList.forEach((VH, index) => {
      volumeH[tempVH[index]] = VH
      volumeH_ini[tempVH[index]] = 0;
    });

    //Pour la creation du nouveau formateur, on crée en même temps un user et un formateur
    let newUser = new User(null, firstname, lastname, phone, email, null, 'user', civilite, null,'formateur', null, pays_adresse, ville_adresse, rue_adresse, numero_adresse, postal_adresse);

    //création et envoie du nouvelle objet diplôme
    let newFormateur = new Formateur(null, '', statut, type_contrat, taux_h, taux_j, isInterne, prestataire_id, volumeH, volumeH_ini);

    this.formateurService.create({ 'newUser': newUser, 'newFormateur': newFormateur }).subscribe(
      ((response) => {
        if (response.success) {
          this.getUserList()

          this.messageService.add({ severity: 'success', summary: 'Ajout de formateur', detail: response.success });
          this.formateurService.getAll().subscribe(
            (data) => {
              this.formateurs = data;
            },
            (error) => { console.log(error) }
          );
        } else {
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'ajout du formateur', detail: response.error });
        }
      }),
      ((error) => {
        this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'ajout du formateur', detail: error });
        console.log(error);
      })
    );

    this.showFormAddFormateur = false;
  }

  //Methode de recuperation du diplome à mettre à jour
  onGetbyId() {
    //Recuperation du formateur à modifier
    this.formateurService.getById(this.idFormateurToUpdate).subscribe(
      ((response) => {
        this.formateurToUpdate = response;
        this.tempVolumeCons = response.volume_h_consomme
        this.formUpdateFormateur.patchValue({ statut: { label: this.formateurToUpdate.statut, value: this.formateurToUpdate.statut }, type_contrat: { label: this.formateurToUpdate.type_contrat, value: this.formateurToUpdate.type_contrat }, isInterne: this.formateurToUpdate.isInterne, taux_h: this.formateurToUpdate.taux_h, taux_j: this.formateurToUpdate.taux_j });
        let dic = response.volume_h // {id:nb}
        let k = [];
        this.volumeHList = [];
        if (response.volume_h) {
          k = Object.keys(dic)
          k.forEach(key => {
            this.volumeHList.push(parseInt(dic[key]))
          });
        }

        this.formUpdateFormateur.setControl('volume_h', this.formBuilder.array(k))
      }),
      ((error) => { console.log(error); })
    );
  }

  //Methode d'initialisation du formulaire de modification de formateur
  onInitFormUpdateFormateur() {
    this.formUpdateFormateur = this.formBuilder.group({
      statut: ['', Validators.required],
      type_contrat: ['', Validators.required],
      taux_h: ['', Validators.required],
      taux_j: ['', Validators.required],
      isInterne: [false, Validators.required],
      prestataire_id: [''],
      volume_h: this.formBuilder.array([])
    });
  }

  //Methode d'ajout du nouveau formateur dans la base de données
  onUpdateFormateur() {

    //Mis à jour du formateur et envoi dans la base de données
    this.formateurToUpdate.statut = this.formUpdateFormateur.get('statut')?.value.value;
    this.formateurToUpdate.type_contrat = this.formUpdateFormateur.get('type_contrat')?.value.value;
    this.formateurToUpdate.taux_h = this.formUpdateFormateur.get('taux_h')?.value;
    this.formateurToUpdate.taux_j = this.formUpdateFormateur.get('taux_j')?.value;
    this.formateurToUpdate.isInterne = this.formUpdateFormateur.get('isInterne')?.value;
    this.formateurToUpdate.prestataire_id = this.formUpdateFormateur.get('prestataire_id')?.value.value;
    let tempVH = this.formUpdateFormateur.get('volume_h').value ? this.formUpdateFormateur.get('volume_h').value : [];

    let volumeH = {};
    let volumeH_ini = {};

    this.volumeHList.forEach((VH, index) => {
      volumeH[tempVH[index]] = VH
      if (this.tempVolumeCons[tempVH[index]]) {
        volumeH_ini[tempVH[index]] = this.tempVolumeCons[tempVH[index]];
      } else {
        volumeH_ini[tempVH[index]] = 0;
      }

    });

    this.formateurToUpdate.volume_h = volumeH;
    this.formateurToUpdate.volume_h_consomme = volumeH_ini;

    this.formateurService.updateById(this.formateurToUpdate).subscribe(
      ((data) => {
        if (data.error) {
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de la modification de formateur', detail: 'data.error' });
        } else {
          this.messageService.add({ severity: 'success', summary: 'Modification de formateur', detail: 'Cet formateur a bien été modifié' });
          this.getUserList()
          this.formateurService.getAll().subscribe(
            (data) => {
              this.formateurs = data;
            },
            (error) => { console.log(error) }
          );
        }
      }),
      ((error) => { console.log(error); })
    );

    this.showFormUpdateFormateur = false;
  }

  resetForm() {
    this.volumeHList = [];
    this.formAddFormateur.reset()
    this.formUpdateFormateur.reset()
    this.onInitFormAddFormateur()
    this.onInitFormUpdateFormateur()
  }


  onGetStatut() {
    //recupère le statut et l'affecte à la variable affichePrestataire pour determiné s'il faut ou non afficher le champs prestataire
    return this.formAddFormateur.get('statut').value.value;
  }

  onGetStatutToUpdate() {
    //recupère le statut et l'affecte à la variable affichePrestataire pour determiné s'il faut ou non afficher le champs prestataire
    return this.formUpdateFormateur.get('statut').value.value;
  }

  getVolumeH() {
    return this.formAddFormateur.get('volume_h') as FormArray;
  }

  getVolumeHUpdate() {
    return this.formUpdateFormateur.get('volume_h') as FormArray;
  }

  onAddMatiere() {
    const tempControl = this.formBuilder.control('', Validators.required);
    this.getVolumeH().push(tempControl);
  }

  onUpdateMatiere() {
    const tempControl = this.formBuilder.control('', Validators.required);
    this.getVolumeHUpdate().push(tempControl);
  }

  changeVolumeH(i, event) {
    this.volumeHList[i] = parseInt(event.target.value);
  }

  deleteMatiereAdd(i) {
    let temp = (this.volumeHList[i]) ? this.volumeHList[i] + " " : ""
    if (confirm("Voulez-vous supprimer la matière " + temp + "avec son volume horaire ET son volume consommé ?")) {
      this.volumeHList.splice(i)

      let FArray: [] = this.formAddFormateur.get('volume_h').value;
      FArray.splice(i)
      this.formAddFormateur.setControl('volume_h', this.formBuilder.array(FArray))
    }
  }


  deleteMatiereUpdate(i) {
    let temp = (this.volumeHList[i]) ? this.volumeHList[i] + " " : ""
    if (confirm("Voulez-vous supprimer la matière " + temp + "avec son volume horaire ET son volume consommé ?")) {
      this.volumeHList.splice(i)

      let FArray: [] = this.formUpdateFormateur.get('volume_h').value;
      FArray.splice(i)
      this.formUpdateFormateur.setControl('volume_h', this.formBuilder.array(FArray))

    }
  }

  getUserList() {
    this.formateurService.getAllUser().subscribe((data) => {
      this.userList = data;
      console.log(data)
    }, error => {
      console.log(error)
    })
  }
}
