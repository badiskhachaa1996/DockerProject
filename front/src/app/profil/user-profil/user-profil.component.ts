import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import { Partenaire } from 'src/app/models/Partenaire';
import { CommercialPartenaire } from 'src/app/models/CommercialPartenaire';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { User } from 'src/app/models/User';
import { Etudiant } from 'src/app/models/Etudiant';
import { MessageService } from 'primeng/api';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { CampusService } from 'src/app/services/campus.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { ClasseService } from 'src/app/services/classe.service';
import { AuthService } from 'src/app/services/auth.service';
import { AdmissionService } from 'src/app/services/admission.service';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';


@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.scss']
})
export class UserProfilComponent implements OnInit {

  Roles = environment.role;
  showFormModifInfo: boolean = true;
  showFormModifMdp: boolean = true;
  passwordForm: FormGroup;

  civiliteList = environment.civilite;
  statutList = environment.typeUser
  nationList = environment.nationalites;
  formationDic = []
  campusDic = []
  entrepriseDic = []
  diplomeDic = []
  entreprisesList = environment.entreprisesList

  maxYear = new Date().getFullYear() - 16
  minYear = new Date().getFullYear() - 60
  rangeYear = this.minYear + ":" + this.maxYear
  minDateCalendar = new Date("01/01/" + this.minYear)
  maxDateCalendar = new Date("01/01/" + this.maxYear)
  fr = environment.fr
  typeProfil: string;
  decodeToken: any = jwt_decode(localStorage.getItem("token"))
  token = null;

  reader: FileReader = new FileReader();

  retour: boolean = false;
  toggleUpdate: boolean = false
  toggleUpdatepwd: boolean = false
  userupdate: any = this.decodeToken;
  InfoUser: any;
  userco: any = this.userupdate;
  imageToShow: any = "../assets/images/avatar.PNG";

  infoPartenaire: Partenaire;
  infoCommercial: CommercialPartenaire;

  pwdmsgerr: string = "";
  PreinscriptionData: any;


  changeStatut(event) {
    if (event.value.value == "Salarié" || event.value.value == "Alternant/Stagiaire") {
      if (this.InfoUser.entreprise != null) {
        this.RegisterForm.patchValue({ entreprise: this.entrepriseDic[this.InfoUser.entreprise] })
      }
    }
    if (event.value.value == "Initial" || event.value.value == "Alternant/Stagiaire") {
      if (this.InfoUser.formation != null) {
        this.RegisterForm.patchValue({ formations: this.formationDic[this.InfoUser.formation] })
      }
      if (this.InfoUser.campus != null) {
        this.RegisterForm.patchValue({ campus: this.campusDic[this.InfoUser.campus] })
      }
    }
  }

  public ToggleUpdate() {
    this.toggleUpdate = !this.toggleUpdate
    this.toggleUpdatepwd = false
    window.scrollTo(1000, 0)
    this.civiliteList.forEach((civ) => {
      if (civ.value == this.userco.civilite) {
        let date = new Date(this.InfoUser.date_naissance)
        this.RegisterForm.setValue({
          lastname: this.userco.lastname,
          firstname: this.userco.firstname,
          indicatif: this.userco?.indicatif,
          phone: this.userco?.phone,
          civilite: civ,
          pays_adresse: this.userco.pays_adresse,
          ville_adresse: this.userco.ville_adresse,
          rue_adresse: this.userco.rue_adresse,
          numero_adresse: this.userco.numero_adresse,
          postal_adresse: this.userco.postal_adresse,
          nationalite: { value: this.InfoUser.nationalite, viewValue: this.InfoUser.nationalite },
          date_naissance: date
        })
      }
    })

    return this.toggleUpdate
  }
  public ToggleUpdatepwd() {
    this.toggleUpdatepwd = !this.toggleUpdatepwd
    this.toggleUpdate = false

    return this.toggleUpdatepwd

  }

  RegisterForm: FormGroup = new FormGroup({
    civilite: new FormControl(environment.civilite[0], [Validators.required]),
    lastname: new FormControl(this.userco.lastname, [Validators.required, Validators.pattern('[^0-9]+')]),//Lettre et espace
    firstname: new FormControl(this.userco.firstname, [Validators.required, Validators.pattern('[^0-9]+')]),
    indicatif: new FormControl(this.userco.indicatif, [Validators.required]),//Si il finit par .png ou .jpg
    phone: new FormControl(this.userco.phone, [Validators.required, Validators.pattern('[- +()0-9]+'), Validators.maxLength(14), Validators.minLength(9)]),
    pays_adresse: new FormControl(this.userco.pays_adresse, [Validators.required, Validators.pattern('[^0-9]+')]),
    ville_adresse: new FormControl(this.userco.ville_adresse, [Validators.required, Validators.pattern('[^0-9]+')]),
    rue_adresse: new FormControl(this.userco.rue_adresse, [Validators.required, Validators.pattern('[^0-9]+')]),
    numero_adresse: new FormControl(this.userco.numero_adresse, [Validators.required, Validators.pattern('[0-9]+')]),
    postal_adresse: new FormControl(this.userco.postal_adresse, [Validators.required, Validators.pattern('[0-9]+')]),
    nationalite: new FormControl(null),
    date_naissance: new FormControl("21/12/2000"),
  })

  onInitPasswordForm() {
    this.passwordForm = this.formBuilder.group({
      passwordactual: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      verifypassword: ['', Validators.required],
    });

  }

  get passwordactual() { return this.passwordForm.get('passwordactual'); }
  get password() { return this.passwordForm.get('password'); }
  get verifypassword() { return this.passwordForm.get('verifypassword'); }


  onUpdatePassword() {
    let passwordactual = this.passwordForm.get('passwordactual').value;
    let password = this.passwordForm.get('password').value;
    let verifypassword = this.passwordForm.get('verifypassword').value;
    if (password = verifypassword) {
      this.AuthService.verifPassword({ 'id': this.decodeToken.id, 'password': passwordactual }).subscribe(
        ((responseV) => {
          console.log(responseV);

          this.AuthService.updatePwd(this.decodeToken.id, verifypassword).subscribe((updatedPwd) => {

            this.passwordForm.reset();
            this.toggleUpdatepwd = false;
            this.messageService.add({ severity: 'success', summary: 'Mot de passe ', detail: 'Votre mot de passe a été mis à jour avec succès' });

          }), ((error) => { console.log(error) })


        }),
      ), ((error) => {
        console.log(error)
      });
    }
    else {
      this.passwordForm.get('verifypassword').dirty
    }
  }


  UpdateUser() {
    let user = new User(this.userco._id,
      this.RegisterForm.value.firstname,
      this.RegisterForm.value.lastname,
      this.RegisterForm.value.indicatif,
      this.RegisterForm.value.phone,
      this.userco.email,
      this.userco.email_perso,
      this.userco.password,
      this.userco.role,
      this.userco.etat,
      this.userco.service_id,
      this.RegisterForm.value.civilite.value,
      this.userco.pathImageProfil,
      this.userco.typeImageProfil,
      this.userco.type,
      this.userco.entreprise,
      this.RegisterForm.value.pays_adresse,
      this.RegisterForm.value.ville_adresse,
      this.RegisterForm.value.rue_adresse,
      this.RegisterForm.value.numero_adresse,
      this.RegisterForm.value.postal_adresse,
    )
    this.AuthService.update(user).subscribe((data) => {
      this.userco = data;
      this.ToggleUpdate();
      this.messageService.add({ severity: 'success', summary: 'Message de modification', detail: 'Mon profil a bien été modifié' });
    }, (error) => {
      console.error(error)
    });
    if (this.userco.type == "Etudiant" || this.userco.type == "Initial") {
      let etu: Etudiant = this.InfoUser
      etu.nationalite = this.RegisterForm.value.nationalite.value
      etu.date_naissance = this.RegisterForm.value.date_naissance
      this.EtudiantService.update(etu).subscribe(newEtu => {
        this.InfoUser = newEtu
        this.InfoUser.date_naissance = this.RegisterForm.value.date_naissance
        this.toggleUpdate = false;
      }, err => {
        console.error(err)
      })
    }

    this.showFormModifInfo = false;
    this.showFormModifInfo = false;
  }

  get lastname() { return this.RegisterForm.get('lastname'); }
  get firstname() { return this.RegisterForm.get('firstname'); }
  get indicatif() { return this.RegisterForm.get('indicatif'); }
  get phone() { return this.RegisterForm.get('phone'); }
  get role() { return this.RegisterForm.get('role'); }
  get civilite() { return this.RegisterForm.get('civilite'); }
  get entreprise() { return this.RegisterForm.get('entreprise').value.value; }
  get type() { return this.RegisterForm.get('type').value.value; }

  get pays_adresse() { return this.RegisterForm.get('pays_adresse'); }
  get ville_adresse() { return this.RegisterForm.get('ville_adresse'); }
  get rue_adresse() { return this.RegisterForm.get('rue_adresse'); }
  get numero_adresse() { return this.RegisterForm.get('numero_adresse'); }
  get postal_adresse() { return this.RegisterForm.get('postal_adresse'); }
  get nationalite() { return this.RegisterForm.get('nationalite'); }
  get date_naissance() { return this.RegisterForm.get('date_naissance'); }

  constructor(private prospectService: AdmissionService, private AuthService: AuthService, private messageService: MessageService, private formBuilder: FormBuilder,
    private ClasseService: ClasseService, private EntrepriseService: EntrepriseService, private CampusService: CampusService, private DiplomeService: DiplomeService,
    private EtudiantService: EtudiantService, private CommercialService: CommercialPartenaireService) { }

  ngOnInit(): void {

    this.reader.addEventListener("load", () => {
      this.imageToShow = this.reader.result;
    }, false);

    this.token = jwt_decode(localStorage.getItem("token"))
    if (this.token["role"].includes("user")) {
      this.retour = true;
    }

    let decodeToken: any = jwt_decode(localStorage.getItem("token"))
    this.userupdate = decodeToken;
    this.CommercialService.getByUserId(decodeToken.id).subscribe(data => {
      if (data) {
        this.infoCommercial = data
      }

    })
    this.AuthService.getById(this.userupdate.id).subscribe((data) => {

      this.userco = jwt_decode(data['userToken'])['userFromDb']
      //TODO C'est quoi cette merde
      this.AuthService.WhatTheRole(this.userupdate.id).subscribe(data => {
        this.InfoUser = data?.data
        let date = new Date(this.InfoUser?.date_naissance)
        if (this.InfoUser) {
          this.RegisterForm.patchValue({
            nationalite: { value: this.InfoUser.nationalite, viewValue: this.InfoUser.nationalite },
            date_naissance: date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getUTCFullYear()
          })
        }
        this.prospectService.getByUserId(this.userco._id).subscribe(prospectdata => {
          this.PreinscriptionData = prospectdata
        })
      })



      this.civiliteList.forEach((civ) => {
        if (civ.value == this.userco.civilite) {
          this.RegisterForm.patchValue({
            lastname: this.userco.lastname,
            firstname: this.userco.firstname,
            indicatif: this.userco.indicatif,
            phone: this.userco?.phone,
            civilite: civ,
            pays_adresse: this.userco.pays_adresse,
            ville_adresse: this.userco.ville_adresse,
            rue_adresse: this.userco.rue_adresse,
            numero_adresse: this.userco.numero_adresse,
            postal_adresse: this.userco.postal_adresse
          })
        }
      })
      this.CampusService.getAll().subscribe(campuses => {
        campuses.forEach(c => {
          this.campusDic[c._id] = c
        })
      })
      this.ClasseService.getAll().subscribe(classes => {
        classes.forEach(c => {
          this.formationDic[c._id] = c
        })
      })
      this.EntrepriseService.getAll().subscribe(entreprises => {
        entreprises.forEach(e => {
          this.entrepriseDic[e._id] = e
        })
      })
      this.DiplomeService.getAll().subscribe(diplomes => {
        diplomes.forEach(d => {
          this.diplomeDic[d._id] = d
        })
      })

    }, (err) => console.error(err))


    this.AuthService.getProfilePicture(decodeToken.id).subscribe((data) => {
      if (data.error) {
        this.imageToShow = "../assets/images/avatar.PNG"
      } else {
        const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
        let blob: Blob = new Blob([byteArray], { type: data.documentType })
        if (blob) {
          this.imageToShow = "../assets/images/avatar.PNG"
          this.reader.readAsDataURL(blob);
        }
      }
    })

    this.onInitPasswordForm();




  }
  clickFile() {
    document.getElementById('selectedFile').click();
  }

  FileUpload(event) {
    if (event && event.length > 0) {
      const formData = new FormData();
      formData.append('id', this.token.id)
      formData.append('file', event[0])

      this.AuthService.uploadimageprofile(formData).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Photo de profil', detail: 'Mise à jour de votre photo de profil avec succès' });
        this.imageToShow = "../assets/images/avatar.PNG"
        this.reader.readAsDataURL(event[0]);
        let avoidError: any = document.getElementById('selectedFile')
        avoidError.value = ""
        this.AuthService.reloadImage(this.token.id)
      }, (error) => {
        console.error(error)
      })
    }
  }

  getImage() {
    if (this.imageToShow) {
      return this.imageToShow
    } else {
      return "../assets/images/avatar.PNG"
    }
  }

  showTitle() {
    if (this.toggleUpdate) {
      return "Modifier mes informations"
    } else if (this.toggleUpdatepwd) {
      return "Modifier mon mot de passe"
    } else {
      return "Mes informations"
    }
  }

  scrollToBot() {
    var scrollDuration = 250;
    var scrollStep = window.scrollY / (scrollDuration / 15);

    var scrollInterval = setInterval(function () {
      if (window.scrollY < 120) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }

}