import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormationAdmission } from 'src/app/models/FormationAdmission';
import { Prospect } from 'src/app/models/Prospect';
import { AdmissionService } from 'src/app/services/admission.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';

@Component({
  selector: 'app-lead-informations-personnel',
  templateUrl: './lead-informations-personnel.component.html',
  styleUrls: ['./lead-informations-personnel.component.scss']
})
export class LeadInformationsPersonnelComponent implements OnInit {
  ID = this.route.snapshot.paramMap.get('id');
  PROSPECT: Prospect;
  constructor(private route: ActivatedRoute, private ProspectService: AdmissionService, private ToastService: MessageService,
    private UserService: AuthService, private FAService: FormulaireAdmissionService) { }
  editInfo = false
  FORMATION: FormationAdmission
  ngOnInit(): void {
    if (this.ID)
      this.ProspectService.getPopulate(this.ID).subscribe((dataP: Prospect) => {
        this.FAService.FAgetAll().subscribe(fas => {
          fas.forEach(val => {
            if (val.nom == dataP.formation)
              this.FORMATION = val
          })
        })
        this.PROSPECT = dataP
        this.UserService.getProfilePicture(dataP.user_id._id).subscribe((data) => {
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
      })
    this.reader.addEventListener("load", () => {
      this.imageToShow = this.reader.result;
    }, false);
  }

  editInfoForm: UntypedFormGroup = new UntypedFormGroup({
    lastname: new UntypedFormControl('', Validators.required),
    firstname: new UntypedFormControl('', Validators.required),
    phone: new UntypedFormControl('', Validators.required),
    date_naissance: new UntypedFormControl('', Validators.required),
    nationnalite: new UntypedFormControl('', Validators.required),
    email_perso: new UntypedFormControl('', Validators.required),
    pays_adresse: new UntypedFormControl('', Validators.required),
    _id: new UntypedFormControl("", Validators.required)
  })
  
  editInfoFormSOS: UntypedFormGroup = new UntypedFormGroup({
    sos_lastname: new UntypedFormControl(''),
    sos_firstname: new UntypedFormControl(''),
    sos_email: new UntypedFormControl(''),
    sos_phone: new UntypedFormControl(''),
    _id: new UntypedFormControl("", Validators.required)
  })
  initEditForm() {
    let bypass: any = this.PROSPECT?.user_id
    this.editInfoForm.patchValue({
      sos_lastname: this.PROSPECT?.sos_lastname,
      sos_firstname: this.PROSPECT?.sos_firstname,
      sos_email: this.PROSPECT?.sos_email,
      sos_phone: this.PROSPECT?.sos_phone,
      lastname: bypass?.lastname,
      firstname: bypass?.firstname,
      phone: bypass?.phone,
      date_naissance: new Date(this.PROSPECT?.date_naissance),
      nationnalite: bypass?.nationnalite,
      email_perso: bypass?.email_perso,
      pays_adresse: bypass?.pays_adresse,
      _id: bypass._id
    })
    this.editInfo = true;
  }
  editInfoSOS = false
  initEditFormSOS() {
    this.editInfoFormSOS.patchValue({
      sos_lastname: this.PROSPECT?.sos_lastname,
      sos_firstname: this.PROSPECT?.sos_firstname,
      sos_email: this.PROSPECT?.sos_email,
      sos_phone: this.PROSPECT?.sos_phone,
      _id: this.PROSPECT._id
    })
    this.editInfoSOS = true;
  }

  saveInfo() {
    this.UserService.patchById({ ...this.editInfoForm.value }).then(users => {
      this.ProspectService.getPopulateByUserid(this.editInfoForm.value._id).subscribe(doc => {
        this.PROSPECT = doc
        this.ToastService.add({ severity: 'success', summary: "Modifications des informations avec succès" })
        this.editInfo = false
      })
    })
  }
  saveInfoSOS() {
    this.ProspectService.updateV2({ ...this.editInfoFormSOS.value },'saveInfoSOS').subscribe(user => {
      this.ProspectService.getPopulateByUserid(this.PROSPECT.user_id._id).subscribe(doc => {
        this.PROSPECT = doc
        this.ToastService.add({ severity: 'success', summary: "Modifications des informations avec succès" })
        this.editInfoSOS = false
      })
    })
  }
  padTo2Digits(num) { return num.toString().padStart(2, '0'); }
  formatDate(date) {

    date = new Date(date)
    if (date != 'Invalid Date' && date.getFullYear() != '1970')
      return [this.padTo2Digits(date.getDate()), this.padTo2Digits(date.getMonth() + 1), date.getFullYear(),].join('/');
    else return ''
  }

  clickFile() {
    document.getElementById('selectedFile').click();
  }
  imageToShow: any = "../assets/images/avatar.PNG";
  reader: FileReader = new FileReader();
  FileUploadPDP(event) {
    if (event && event.length > 0) {
      const formData = new FormData();
      let { _id }: any = this.PROSPECT.user_id
      formData.append('id', _id)
      formData.append('file', event[0])

      this.UserService.uploadimageprofile(formData).subscribe(() => {
        this.ToastService.add({ severity: 'success', summary: 'Photo de profil', detail: 'Mise à jour de votre photo de profil avec succès' });
        this.imageToShow = "../assets/images/avatar.PNG"
        this.reader.readAsDataURL(event[0]);
        let avoidError: any = document.getElementById('selectedFile')
        avoidError.value = ""
        //this.UserService.reloadImage(this.token.id)
      }, (error) => {
        console.error(error)
      })
    }
  }


  showUpdatePassword = false
  passwordForm = new UntypedFormGroup({
    passwordactual: new UntypedFormControl('', Validators.required),
    password: new UntypedFormControl('', Validators.required),
    verifypassword: new UntypedFormControl('', Validators.required),
  });
  onUpdatePassword() {
    let passwordactual = this.passwordForm.get('passwordactual').value;
    let password = this.passwordForm.get('password').value;
    let verifypassword = this.passwordForm.get('verifypassword').value;
    if (password == verifypassword) {
      let bypass: any = this.PROSPECT.user_id
      this.UserService.verifPassword({ 'id': bypass._id, 'password': passwordactual }).subscribe(
        ((responseV) => {
          this.UserService.updatePwd(bypass._id, verifypassword).subscribe((updatedPwd) => {
            this.passwordForm.reset();
            this.showUpdatePassword = false;
            this.ToastService.add({ severity: 'success', summary: 'Mot de passe ', detail: 'Votre mot de passe a été mis à jour avec succès' });
          }), ((error) => { console.error(error) })
        }),
      ), ((error) => {
        console.error(error)
      });
    }
    else {
      this.ToastService.add({ severity: 'error', summary: 'Mot de passe ', detail: 'Les mots de passe ne correspondent pas' });
      this.passwordForm.get('verifypassword').dirty
    }
  }

}
