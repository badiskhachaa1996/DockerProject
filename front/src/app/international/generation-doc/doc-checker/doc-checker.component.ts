import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DocumentInternational } from 'src/app/models/DocumentInternational';
import { Prospect } from 'src/app/models/Prospect';
import { User } from 'src/app/models/User';
import { saveAs } from "file-saver";
import { AdmissionService } from 'src/app/services/admission.service';
import { GenDocIntService } from 'src/app/services/gen-doc-int.service';
import { AuthService } from 'src/app/services/auth.service';
import { EcoleAdmission } from 'src/app/models/EcoleAdmission';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';

@Component({
  selector: 'app-doc-checker',
  templateUrl: './doc-checker.component.html',
  styleUrls: ['./doc-checker.component.scss']
})
export class DocCheckerComponent implements OnInit {
  reader: FileReader = new FileReader();
  documentForm = new FormGroup({
    input: new FormControl('', Validators.required)
  })
  documents: any[]
  USER: User
  PROSPECT: Prospect
  imageToShow: any = "../assets/images/avatar.PNG";
  checkID() {
    //Vérifier si c'est un email d'un lead
    this.LeadService.docChecker(this.documentForm.value.input).subscribe(data => {
      if (data && data.type == "Prospect") {
        console.log("Document trouvé")
        this.ToastService.add({ severity: 'success', summary: "Document trouvé" })
        console.log(data)
        data.data.documents_administrative.forEach(d => {
          if (d.custom_id == this.documentForm.value.input)
            this.documents = [d]
        })

        this.LeadService.getPopulate(data.data._id).subscribe(prospect => {
          this.USER = prospect.user_id
          this.PROSPECT = data.data
          this.AuthService.getProfilePicture(this.USER._id).subscribe((img) => {
            if (img.error) {
              this.imageToShow = "../assets/images/avatar.PNG"
            } else {
              const byteArray = new Uint8Array(atob(img.file).split('').map(char => char.charCodeAt(0)));
              let blob: Blob = new Blob([byteArray], { type: img.documentType })
              if (blob) {
                this.imageToShow = "../assets/images/avatar.PNG"
                this.reader.readAsDataURL(blob);
              }
            }
          })
        })

      } else if (data && data.type == "User") {
        console.log('Prospect trouvé')
        this.LeadService.getByUserId(data.data._id).subscribe(prospect => {
          this.ToastService.add({ severity: 'success', summary: "Prospect trouvé" })
          this.USER = data.data
          console.log(this.USER)
          this.PROSPECT = prospect
          this.documents= this.PROSPECT.documents_administrative
          this.AuthService.getProfilePicture(this.USER._id).subscribe((img) => {
            console.log(img)
            if (img.error) {
              this.imageToShow = "../assets/images/avatar.PNG"
            } else {
              const byteArray = new Uint8Array(atob(img.file).split('').map(char => char.charCodeAt(0)));
              let blob: Blob = new Blob([byteArray], { type: img.documentType })
              if (blob) {
                this.imageToShow = "../assets/images/avatar.PNG"
                this.reader.readAsDataURL(blob);
              }
            }
          })
        })

      } else {
        this.ToastService.add({ severity: 'success', summary: "Email ou ID Incorrect", detail: "Aucun document a été délivré, veuillez vérifier l'ID ou l'adresse email de l'étudiant" })
      }
    })

  }

  constructor(private LeadService: AdmissionService, private GenDocService: GenDocIntService, private ToastService: MessageService, private AuthService: AuthService, private FAS: FormulaireAdmissionService) { }

  ngOnInit(): void {
    this.reader.addEventListener("load", () => {
      this.imageToShow = this.reader.result;
    }, false);
  }


  downloadAdminFile(path) {
    this.LeadService.downloadFileAdmin(this.PROSPECT._id, path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });

      saveAs(blob, path)
    }, (error) => {
      console.error(error)
    })

  }

}
