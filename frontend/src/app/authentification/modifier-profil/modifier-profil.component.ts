import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/models/User';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import { AuthService } from 'src/app/services/auth.service';
import { Service } from 'src/app/models/Service';
import { ClasseService } from 'src/app/services/classe.service';

@Component({
  selector: 'app-modifier-profil',
  templateUrl: './modifier-profil.component.html',
  styleUrls: ['./modifier-profil.component.css']
})
export class ModifierProfilComponent implements OnInit {
  Services: Service[]
  Roles = environment.role;
  showForm: boolean = true;

  civiliteList = environment.civilite;
  statutList = environment.typeUser
  campusList = environment.campus
  formationList = environment.formations
  formationDic = []
  entreprisesList = environment.entreprisesList

  decodeToken: any = jwt_decode(localStorage.getItem("token"))
  token = null;

  reader: FileReader = new FileReader();

  retour: boolean = false;
  toggleUpdate: boolean = false
  toggleUpdatepwd: boolean = false
  userupdate: any = this.decodeToken;
  userco: any = this.userupdate;
  imageToShow: any = "../assets/images/avatar.PNG";

  public ToggleUpdate() {
    this.toggleUpdate = !this.toggleUpdate
    this.toggleUpdatepwd = false

    this.civiliteList.forEach((civ) => {
      if (civ.value == this.userco.civilite) {
        this.RegisterForm.setValue({
          lastname: this.userco.lastname,
          firstname: this.userco.firstname,
          phone: this.userco?.phone,
          adresse: this.userco?.adresse,
          civilite: civ,
          entreprise: { value: this.userco?.entreprise },
          type: { value: this.userco?.type },
          campus: { value: this.userco?.campus },
          formation: this.formationDic[this.userco.formation]
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
    civilite: new FormControl(this.civiliteList[0], [Validators.required]),
    lastname: new FormControl(this.userco.lastname, [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ-]+$')]),//Lettre et espace
    firstname: new FormControl(this.userco.firstname, [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ-]+$')]),//Si il finit par .png ou .jpg
    phone: new FormControl(this.userco.phone, [Validators.required, Validators.pattern('[- +()0-9]+'), Validators.maxLength(14)]),
    adresse: new FormControl(this.userco.adresse, [Validators.required]),
    entreprise: new FormControl({ value: this.userco.entreprise }),
    type: new FormControl({ value: this.userco.type }, [Validators.required]),
    campus: new FormControl({ value: this.userco.campus }),
    formation: new FormControl('')
  })

  UpdateUser() {
    console.log(this.RegisterForm.value.formation)
    let user = new User(this.userco._id, this.RegisterForm.value.firstname, this.RegisterForm.value.lastname, this.RegisterForm.value.phone, this.userupdate.email, this.userupdate.password, this.userupdate.role, this.userupdate.etat, this.RegisterForm.value.adresse, this.userupdate.service_id, this.RegisterForm.value.civilite.value, null, null, this.RegisterForm.value.campus.value, this.RegisterForm.value.type.value, this.RegisterForm.value.formation._id, this.RegisterForm.value.entreprise.value)
    this.AuthService.update(user).subscribe((data) => {
      this.userco = data;
      this.toggleUpdate = false;
      this.messageService.add({ severity: 'success', summary: 'Message de modification', detail: 'Mon profil a bien été modifié' });
      this.RegisterForm.patchValue({ formation: this.formationDic[data.formation] })
    }, (error) => {
      console.log(error)
    });

  }
  get lastname() { return this.RegisterForm.get('lastname'); }
  get firstname() { return this.RegisterForm.get('firstname'); }
  get phone() { return this.RegisterForm.get('phone'); }
  get adresse() { return this.RegisterForm.get('adresse'); }
  get role() { return this.RegisterForm.get('role'); }
  get civilite() { return this.RegisterForm.get('civilite'); }
  get entreprise() { return this.RegisterForm.get('entreprise').value.value; }
  get type() { return this.RegisterForm.get('type').value.value; }
  get campus() { return this.RegisterForm.get('campus').value.value; }
  get formation() { return this.RegisterForm.get('formation').value; }

  constructor(private AuthService: AuthService, private messageService: MessageService, private ClasseService: ClasseService) { }


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

    this.ClasseService.seeAll().subscribe((data) => {
      this.formationList = data;
      this.RegisterForm.patchValue({ formation: this.formationDic[this.userco.formation] })
    })

    this.ClasseService.getAll().subscribe((data)=>{
      data.forEach(element => {
        this.formationDic[element._id]=element
      });
    })

    this.AuthService.getById(this.userupdate.id).subscribe((data) => {

      this.userco = jwt_decode(data['userToken'])['userFromDb']
      this.civiliteList.forEach((civ) => {
        if (civ.value == this.userco.civilite) {
          this.RegisterForm.patchValue({
            lastname: this.userco.lastname,
            firstname: this.userco.firstname,
            phone: this.userco?.phone,
            adresse: this.userco?.adresse,
            civilite: civ,
            entreprise: { value: this.userco?.entreprise },
            type: { value: this.userco?.type },
            campus: { value: this.userco?.campus }
          })
        }
      })

    }, (err) => console.log(err))

  }
  clickFile() {
    document.getElementById('selectedFile').click();
  }

  FileUpload(event) {
    if (event && event.length > 0) {
      const formData = new FormData();
      formData.append('file', event[0])
      formData.append('id', this.token.id)
      this.AuthService.uploadimageprofile(formData).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Photo de profil', detail: 'Mise à jour de votre photo de profil avec succès' });
        this.imageToShow = "../assets/images/avatar.PNG"
        this.reader.readAsDataURL(event[0]);
        let avoidError: any = document.getElementById('selectedFile')
        avoidError.value = ""
        this.AuthService.reloadImage(this.token.id)
      }, (error) => {
        console.log(error)
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

}