import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CvService } from 'src/app/services/skillsnet/cv.service';
import { ExterneSNService } from 'src/app/services/skillsnet/externe-sn.service';

@Component({
  selector: 'app-imatch-entreprise',
  templateUrl: './imatch-entreprise.component.html',
  styleUrls: ['./imatch-entreprise.component.scss', '../../../../assets/css/bootstrap.min.css']
})
export class ImatchEntrepriseComponent implements OnInit {

  portail = "etudiant";

  constructor(private ExterneService: ExterneSNService, private cvService: CvService, private ToastService: MessageService, private router: Router) { }

  ngOnInit(): void {
  }
  HowItsWorking() {
    console.log("???")
  }
  showPostuler = false
  form = new FormGroup({
    civilite: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    email_perso: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    consent: new FormControl('', Validators.required),
  })
  DepositCV() {
    this.showPostuler = true
  }
  civiliteList: any = [
    { label: 'Monsieur' },
    { label: 'Madame' },
    { label: 'Autre' },
  ];
  uploadedFiles: any;

  onSubmit() {
    this.ExterneService.create({ ...this.form.value }, null).subscribe(externe => {
      if (this.uploadedFiles?.length != 0) {
        console.log(this.uploadedFiles)
        let formData = new FormData();

        formData.append('id', externe.user_id._id);
        formData.append('file', this.uploadedFiles);
        this.cvService.postCVBrute(formData)
          .then(() => {

          })
          .catch((error) => {
            console.error(error)
          });
      }

      let bufferExt: any = externe.user_id
      this.cvService.postCv({ user_id: externe.user_id._id, date_creation: new Date(), createur_id: bufferExt._id }).then(newCv => {
        this.ToastService.add({ severity: 'success', summary: "Compte crée", detail: 'Un compte a été crée, vos identifiants ont été envoyés sur votre adresse email' })
        this.form.reset();
        this.showPostuler = false;
        this.router.navigate(['/login'])
      })

    })

  }
}
