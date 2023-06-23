import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Prospect } from 'src/app/models/Prospect';
import { AdmissionService } from 'src/app/services/admission.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-lead-informations-personnel',
  templateUrl: './lead-informations-personnel.component.html',
  styleUrls: ['./lead-informations-personnel.component.scss']
})
export class LeadInformationsPersonnelComponent implements OnInit {
  ID = this.route.snapshot.paramMap.get('id');
  PROSPECT: Prospect;
  constructor(private route: ActivatedRoute, private ProspectService: AdmissionService, private ToastService: MessageService, private UserService: AuthService) { }
  editInfo = false

  ngOnInit(): void {
    if (this.ID)
      this.ProspectService.getPopulate(this.ID).subscribe(dataP => {
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

  editInfoForm: FormGroup = new FormGroup({
    lastname: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    date_naissance: new FormControl('', Validators.required),
    nationnalite: new FormControl('', Validators.required),
    _id: new FormControl("", Validators.required)
  })
  initEditForm() {
    let bypass: any = this.PROSPECT?.user_id
    this.editInfoForm.setValue({
      lastname: bypass?.lastname,
      firstname: bypass?.firstname,
      phone: bypass?.phone,
      date_naissance: new Date(this.PROSPECT?.date_naissance),
      nationnalite: bypass.nationnalite,
      _id: bypass._id
    })
    console.log(this.editInfoForm.value.date_naissance)
    this.editInfo = true;
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
  passwordForm = new FormGroup({
    passwordactual: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    verifypassword: new FormControl('', Validators.required),
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
          }), ((error) => { console.log(error) })
        }),
      ), ((error) => {
        console.log(error)
      });
    }
    else {
      this.ToastService.add({ severity: 'error', summary: 'Mot de passe ', detail: 'Les mots de passe ne correspondent pas' });
      this.passwordForm.get('verifypassword').dirty
    }
  }

}
