import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Agent } from 'http';
import { environment } from 'src/environments/environment';
import { Etudiant } from '../../models/Etudiant';
import { Formateur } from '../../models/Formateur';
import { Service } from '../../models/Service';
import { User } from '../../models/User';
import { AuthService } from '../../services/auth.service';
import { CommercialPartenaireService } from '../../services/commercial-partenaire.service';
import { EtudiantService } from '../../services/etudiant.service';
import { FormateurService } from '../../services/formateur.service';
import { ServService } from '../../services/service.service';
import { MessageService } from 'primeng/api';
import { CampusService } from 'src/app/services/campus.service';
import { RhService } from 'src/app/services/rh.service';

@Component({
  selector: 'app-users-settings',
  templateUrl: './users-settings.component.html',
  styleUrls: ['./users-settings.component.scss']
})
export class UsersSettingsComponent implements OnInit {

  users: User[] = [];
  userToUpdate: any;
  formUpdate: FormGroup;
  showFormUpdate: boolean = false;
  showUsersList: boolean = true;
  //Photo de profil
  profilPicture: any = "assets/images/avatar.PNG";

  typeList: any = [
    { label: 'Tous les types', value: null },
    { label: 'Salarié', value: 'Salarié' },
    { label: 'CEO Entreprise', value: 'CEO Entreprise' },
    { label: 'Tuteur', value: 'Tuteur' },
    { label: 'Initial', value: 'Initial' },
    { label: 'Alternant', value: 'Alternant' },
    { label: 'Formateur', value: 'Formateur' },
    { label: 'Commercial', value: 'Commercial' },
    { label: 'Visitor', value: 'Visitor' },
    { label: 'Prospect', value: 'Prospect' },
    //ACCES V3
    { label: 'Collaborateur', value: 'Collaborateur' },
    { label: 'Responsable', value: 'Responsable' },
    { label: 'Externe-InProgress', value: 'Externe-InProgress' },
    { label: 'Initial', value: 'Initial' },
    { label: 'Alternant', value: 'Alternant' },
  ];

  roleList: any = [
    { label: 'Tous les rôles', value: null },
    { label: 'Admin', value: 'Admin' },
    { label: 'User', value: 'user' },
    { label: 'Agent', value: 'Agent' },
    { label: 'Responsable', value: 'Responsable' },
    { label: 'Watcher', value: 'Watcher' },
    //ACCES V3
    { label: 'Etudiant', value: 'Etudiant' },
  ];

  civiliteList: any = [
    { label: 'Monsieur' },
    { label: 'Madame' },
    { label: 'Autre' },
  ];

  mentionList: any = [
    { label: 'IGM - Inted Group Marketing', value: 'IGM - Inted Group Marketing' },
    { label: 'IGN - Inted Group Partenaires', value: 'IGN - Inted Group Partenaires' },
    { label: 'IGW - Inted Group Commercial', value: 'IGW - Inted Group Commercial' },
    { label: 'IGE - Inted Group Admission', value: 'IGE - Inted Group Admission' },
    { label: 'IGI - Inted Group Administration', value: 'IGI - Inted Group Administration' },
    { label: 'IGP - Inted Group Pédagogie', value: 'IGP - Inted Group Pédagogie' },
    { label: 'IGA - Inted Group Facturation', value: 'IGA - Inted Group Facturation' },
    { label: 'IGL - Inted Group Juridique', value: 'IGL - Inted Group Juridique' },
    { label: 'IGQ - Inted Group Qualité', value: 'IGQ - Inted Group Qualité' },
    { label: 'IGA - Inted Group Comptabilité', value: 'IGA - Inted Group Comptabilité' },
    { label: 'IGS - Inted Group Support', value: 'IGS - Inted Group Support' },
    { label: 'IGH - Inted Group RH', value: 'IGH - Inted Group RH' },
    { label: 'IGD - Inted Group Direction', value: 'IGD - Inted Group Direction' },
    { label: 'ETUDIANT', value: 'ETUDIANT' },
    { label: 'FORMATEUR', value: 'FORMATEUR' },
  ];

  campusList = [

  ]
  paysList = environment.pays;
  nbEstya = 0
  etudiants: Etudiant[] = [];
  //formateurs: Formateur[] = [];
  agents: User[] = [];
  services: Service[] = [];
  dropDownService: any = [{ label: 'Tous les services', value: null }];

  constructor(private userService: AuthService, private etudiantService: EtudiantService,
    private formateurService: FormateurService, private commercialService: CommercialPartenaireService,
    private serviceService: ServService, private formBuilder: FormBuilder, private CollabService: RhService,
    private messageService: MessageService, private CampusService: CampusService) { }

  ngOnInit(): void {
    //Recuperation de toute les data
    this.onGetAllDatas();
    this.CampusService.getAll().subscribe(data => {
      data.forEach(c => {
        this.campusList.push({ label: c.libelle, value: c._id })
      })
    })

    //Initialisation du formulaire de mise à jour des infos
    this.formUpdate = this.formBuilder.group({
      civilite: [this.civiliteList[0], Validators.required],
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      indicatif: [''],
      phone: [''],
      email: [''],
      email_perso: [''],
      service: [''],
      mention: [''],
      type: [''],
      role: [''],
      pays_adresse: [''],
      numero_adresse: [''],
      postal_adresse: [''],
      rue_adresse: [''],
      ville_adresse: [''],
      date_creation: [''],
      campus: [''],
      type_supp: [[]],
      SITE: [[]]
    });
  }


  //Methode de recuperation de la liste des datas
  onGetAllDatas() {
    //Recuperation de la liste des users
    this.userService.getAllPopulate()
      .then((response: User[]) => {
        this.messageService.add({ severity: 'info', summary: 'Gestion des utilisateurs', detail: `Chargement de la liste des users` });
        this.users = response;
        response.forEach(u => {
          if (u.email && u.email.includes('@estya.com'))
            this.nbEstya += 1
        })
      })
      .catch((error) => { console.error(error) });

    //Recuperation de la liste des étudiants
    this.etudiantService.getAll().subscribe(
      ((response) => { this.etudiants = response }),
      ((error) => { console.error(error) })
    );

    //Recuperation de la liste des formateurs
    /*this.formateurService.getAll().subscribe(
      ((response) => { this.formateurs = response }),
      ((error) => { console.error(error) })
    );*/

    //Recuperation de la liste des agents
    this.userService.getAllAgent().subscribe(
      ((response) => { this.agents = response }),
      ((error) => { console.error(error) })
    );

    //Recuperation de la liste des services
    this.serviceService.getAll().subscribe(
      ((response) => {
        this.dropDownService = []
        response.forEach((service) => {
          this.services[service._id] = response;
          this.dropDownService.push({ label: service.label, value: service._id });
        });
      }),
      ((error) => { console.error(error) })
    );
  }

  //Methode de recuperation de la photo de profil d'un utilisateur
  onLoadProfilePicture(id: string) {
    this.userService.getLoadProfilePicture(id)
      .then((response: any) => {
        if (response.image) {
          const imageDecoded = new Uint8Array(atob(response.image).split('').map(char => char.charCodeAt(0)));
          let blob: Blob = new Blob([imageDecoded], { type: `image/${response.imgExtension}` })
          let reader: FileReader = new FileReader();
          reader.addEventListener("load", () => {
            this.profilPicture = reader.result;
          }, false);

          if (blob) {
            reader.readAsDataURL(blob);
          }

        }
        else {
          this.profilPicture = 'assets/images/avatar.PNG'
        }
      })
      .catch((error) => { console.error(error); });
  }

  //Methode pour pre-remplir le formulaire de mise à jour
  onPatchData() {
    this.formUpdate.patchValue({
      civilite: { label: this.userToUpdate.civilite },
      lastname: this.userToUpdate.lastname,
      firstname: this.userToUpdate.firstname,
      indicatif: this.userToUpdate.indicatif,
      phone: this.userToUpdate.phone,
      email: this.userToUpdate.email,
      email_perso: this.userToUpdate.email_perso,
      mention: this.userToUpdate.mention,
      service: this.userToUpdate?.service_id?._id,
      type: this.userToUpdate.type,
      role: this.userToUpdate.role,
      pays_adresse: { value: this.userToUpdate.pays_adresse, label: this.userToUpdate.pays_adresse, actif: false },
      postal_adresse: this.userToUpdate.postal_adresse,
      rue_adresse: this.userToUpdate.rue_adresse,
      ville_adresse: this.userToUpdate.ville_adresse,
      date_creation: this.formatDate(this.userToUpdate.date_creation),
      campus: this.userToUpdate.campus,
      type_supp: this.userToUpdate.type_supp
    });
    this.CollabService.getCollaborateurByUserId(this.userToUpdate._id).then(val => {
      if (val && !this.userToUpdate.haveNewAccess && this.userToUpdate.type != 'Formateur')
        this.formUpdate.patchValue({ type: 'Collaborateur' })
      if (val)
        this.formUpdate.patchValue({ SITE: val.localisation })
    })
  }
  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  //Methode de modification des infos
  onUpdateUser() {
    const user = new User();
    if (this.formUpdate.value.type == 'Collaborateur' || this.formUpdate.value.type_supp.includes('Collaborateur') || this.formUpdate.value.type == 'Formateur')
      this.CollabService.getCollaborateurByUserId(this.userToUpdate._id).then(c => {
        if (!c)
          this.CollabService.postCollaborateur({ user_id: this.userToUpdate, localisation: this.formUpdate.value.SITE }).then(c => { })
        else
          this.CollabService.patchCollaborateurData({ _id: c._id, user_id: this.userToUpdate, localisation: this.formUpdate.value.SITE }).then(c => {

          })
      })
    user._id = this.userToUpdate._id;
    user.civilite = this.formUpdate.get('civilite')?.value.label;
    user.lastname = this.formUpdate.get('lastname')?.value;
    user.firstname = this.formUpdate.get('firstname')?.value;
    user.indicatif = this.formUpdate.get('indicatif')?.value;
    user.phone = this.formUpdate.get('phone')?.value;
    user.email = this.formUpdate.get('email')?.value;
    user.email_perso = this.formUpdate.get('email_perso')?.value;
    user.service_id = this.formUpdate.get('service')?.value;
    user.mention = this.formUpdate.get('mention')?.value;
    user.type = this.formUpdate.get('type')?.value;
    user.role = this.formUpdate.get('role')?.value;
    user.pays_adresse = this.formUpdate.get('pays_adresse')?.value.value;
    user.postal_adresse = this.formUpdate.get('postal_adresse')?.value;
    user.numero_adresse = this.formUpdate.get('numero_adresse')?.value;
    user.rue_adresse = this.formUpdate.get('rue_adresse')?.value;
    user.ville_adresse = this.formUpdate.get('ville_adresse')?.value;
    user.date_creation = new Date(this.formUpdate.get('date_creation')?.value)
    user.campus = this.formUpdate.value.campus
    user.type_supp = this.formUpdate.value.type_supp
    user.haveNewAccess = true


    this.userService.patchById(user)
      .then((response) => {
        this.messageService.add({ severity: 'success', summary: 'Gestion des utilisateurs', detail: `Utilisateur modifié` });
        this.onGetAllDatas();
        this.showFormUpdate = false;
        this.formUpdate.reset();
      })
      .catch((error) => { console.log(error.msg); });

  }

  deletePerso(user) {
    if (confirm('Etes-vous sur de vouloir supprimer ' + user.lastname + ' ' + user.firstname + " ?"))
      this.userService.delete(user._id).subscribe(r => {
        this.messageService.add({ severity: 'success', summary: 'Gestion des utilisateurs', detail: `Utilisateur supprimé` });
        this.users.splice(this.customIndexOf(this.users, user._id), 1);
        this.onGetAllDatas();
      }, err => {
        console.log(err)
        this.messageService.add({ severity: 'error', summary: 'L\'utilisateur n\'a pas été supprimé' });

      })
  }

  customIndexOf(list: User[], id: string) {
    let r = -1
    list.forEach((u, index) => {
      if (u._id == id)
        r = index
    })
    console.log(r)
    return r
  }

  localisationList: any[] = [
    { label: 'Paris – Champs sur Marne', value: 'Paris – Champs sur Marne' },
    { label: 'Paris - Louvre', value: 'Paris - Louvre' },
    { label: 'Montpellier', value: 'Montpellier' },
    { label: 'Dubaï', value: 'Dubaï' },
    { label: 'Congo', value: 'Congo' },
    { label: 'Maroc', value: 'Maroc' },
    { label: 'Tunis M1', value: 'Tunis M1' },
    { label: 'Tunis M4', value: 'Tunis M4' },
    { label: 'Autre', value: 'Autre' },
  ];

}
