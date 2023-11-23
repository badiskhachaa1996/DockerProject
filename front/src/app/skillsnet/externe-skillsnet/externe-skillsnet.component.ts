import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { ExterneSkillsnet } from 'src/app/models/ExterneSkillsnet';
import jwt_decode from 'jwt-decode';
import { User } from 'src/app/models/User';
import { ExterneSNService } from 'src/app/services/skillsnet/externe-sn.service';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { CvService } from 'src/app/services/skillsnet/cv.service';
import { saveAs as importedSaveAs } from "file-saver";
@Component({
  selector: 'app-externe-skillsnet',
  templateUrl: './externe-skillsnet.component.html',
  styleUrls: ['./externe-skillsnet.component.scss']
})
export class ExterneSkillsnetComponent implements OnInit {

  civiliteList: any = [
    { label: 'Monsieur' },
    { label: 'Madame' },
    { label: 'Autre' },
  ];

  paysList = environment.pays;

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.France, CountryISO.Tunisia];

  formAddExterne: UntypedFormGroup = new UntypedFormGroup({
    lastname: new UntypedFormControl('', [Validators.required]),
    firstname: new UntypedFormControl('', [Validators.required]),
    phone: new UntypedFormControl(undefined),
    email_perso: new UntypedFormControl('', [Validators.required, Validators.email]),
    civilite: new UntypedFormControl('', Validators.required),
    pays_adresse: new UntypedFormControl(),
    ville_adresse: new UntypedFormControl(),
    rue_adresse: new UntypedFormControl(),
    numero_adresse: new UntypedFormControl(),
    postal_adresse: new UntypedFormControl(),
    date_naissance: new UntypedFormControl()

  })

  formUpdateExterne: UntypedFormGroup = new UntypedFormGroup({
    lastname: new UntypedFormControl('', [Validators.required]),
    firstname: new UntypedFormControl('', [Validators.required]),
    phone: new UntypedFormControl(undefined),
    email_perso: new UntypedFormControl('', [Validators.required, Validators.email]),
    civilite: new UntypedFormControl('', Validators.required),
    pays_adresse: new UntypedFormControl(),
    ville_adresse: new UntypedFormControl(),
    rue_adresse: new UntypedFormControl(),
    numero_adresse: new UntypedFormControl(),
    postal_adresse: new UntypedFormControl(),
    type: new UntypedFormControl('', Validators.required),
    _id: new UntypedFormControl('', Validators.required)
  })

  externes: ExterneSkillsnet[] = []

  typeList = [
    { label: "Non complété", value: "Externe-InProgress" },
    { label: "Complété", value: "Externe" },
  ]

  showAdd = false
  showUpdate = false
  token;

  constructor(public ExSnService: ExterneSNService, private router: Router, private messageService: MessageService,
    private AuthService: AuthService, private CvService: CvService) { }

  ngOnInit(): void {
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    this.ExSnService.getAll().subscribe(externes => {
      this.externes = externes
    })
  }

  onAddExterne() {
    let user = {
      ...this.formAddExterne.value
    }
    user.phone = this.formAddExterne.value.phone.internationalNumber
    this.ExSnService.create(user, this.token.id).subscribe(evenement => {
      this.externes.push(evenement)
      this.formAddExterne.reset()
      this.showAdd = false
      this.messageService.add({ summary: 'Ajout de l\'externe avec succès', severity: 'success' })
    })
  }

  includesId(id: string) {
    let r = -1
    this.externes.forEach((val, index) => {
      if (val.user_id._id == id)
        r = index
    })
    return r
  }

  onUpdateExterne() {
    this.AuthService.update({ ...this.formUpdateExterne.value, phone: this.formUpdateExterne.value.phone.internationalNumber }).subscribe(newUser => {
      if (this.includesId(newUser._id) != -1 && this.externes[this.includesId(newUser._id)])
        this.externes[this.includesId(newUser._id)].user_id = newUser
      this.formUpdateExterne.reset()
      this.showUpdate = false
      this.messageService.add({ summary: 'Mis à jour de l\'externe avec succès', severity: 'success' })
    })
  }
  InitUpdateForm(externe: ExterneSkillsnet) {
    this.formUpdateExterne.setValue({
      lastname: externe.user_id.lastname,
      firstname: externe.user_id.firstname,
      phone: externe.user_id.phone,
      email_perso: externe.user_id.email_perso,
      civilite: externe.user_id.civilite,
      pays_adresse: externe.user_id.pays_adresse,
      ville_adresse: externe.user_id.ville_adresse,
      rue_adresse: externe.user_id.rue_adresse,
      numero_adresse: externe.user_id.numero_adresse,
      postal_adresse: externe.user_id.postal_adresse,
      type: externe.user_id.type,
      _id: externe.user_id._id
    })
    this.showUpdate = true
  }

  emailExist = false
  verifEmailInBD() {
    this.emailExist = false
    this.AuthService.getByEmail(this.formAddExterne.value.email_perso).subscribe((dataMail) => {
      if (dataMail) {
        this.emailExist = true
        this.messageService.add({ severity: 'error', summary: 'Cette email est déjà utilisé', detail: "L'inscription ne pourra pas être finalisé" });
        return true
      }
    }, (error) => {
      return false
    })
  }

  seeMatching(id: string) {
    this.router.navigate(['matching-externe', id])
  }

  downloadCV(user_id) {
    this.CvService.downloadCV(user_id).then((data: any) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.documentType }), 'cv.pdf')
    })
  }

}
