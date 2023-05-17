import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EcoleAdmission } from 'src/app/models/EcoleAdmission';
import { FormationAdmission } from 'src/app/models/FormationAdmission';
import { Prospect } from 'src/app/models/Prospect';
import { RentreeAdmission } from 'src/app/models/RentreeAdmission';
import { User } from 'src/app/models/User';
import * as html2pdf from 'html2pdf.js';
import jwt_decode from "jwt-decode";
import { AdmissionService } from 'src/app/services/admission.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { MessageService } from 'primeng/api';
import { DocumentInternational } from 'src/app/models/DocumentInternational';
import { GenDocIntService } from 'src/app/services/gen-doc-int.service';

@Component({
  selector: 'app-gen-doc-preinscription',
  templateUrl: './gen-doc-preinscription.component.html',
  styleUrls: ['./gen-doc-preinscription.component.scss']
})
export class GenDocPreinscriptionComponent implements OnInit {

  ecole_id: any = this.route.snapshot.paramMap.get('ecole');
  prospect_id: any = this.route.snapshot.paramMap.get('prospect_id');
  formation_id = this.route.snapshot.paramMap.get('formation');
  rentree_id = this.route.snapshot.paramMap.get('rentree');

  frais_preinscription = "550"
  date_limite_arrivee = new Date()
  ville = "Paris"
  
  user: User
  prospect: Prospect
  ecole: EcoleAdmission
  formation: FormationAdmission
  rentree: RentreeAdmission

  token;
  documents: DocumentInternational[]
  constructor(private route: ActivatedRoute, private AdmissionService: AdmissionService, private FAService: FormulaireAdmissionService,
    private GenDocService: GenDocIntService, private ToastService: MessageService) { }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.AdmissionService.getPopulateByUserid(this.prospect_id).subscribe(data => {
      this.user = data.user_id
      this.prospect = data
    })
    this.FAService.EAgetByID(this.ecole_id).subscribe(data => {
      this.ecole = data
      this.user.pays_adresse
    })
    this.FAService.FAgetByID(this.formation_id).subscribe(data => {
      this.formation = data
    })
    this.FAService.RAgetByID(this.rentree_id).subscribe(data => {
      this.rentree = data
      this.updateDateLimite()
    })
    this.GenDocService.getAll().subscribe(data => {
      this.documents = data
    })
  }

  updateDateLimite() {
    this.date_limite_arrivee = new Date(this.rentree.date_commencement)
    this.date_limite_arrivee.setMonth(this.date_limite_arrivee.getMonth() + 1)
  }

  exportPDF() {
    var element = document.getElementById('page-container');
    var opt = {
      margin: 0,
      filename: `PREINSCRIPTION_${this.user.lastname}_${this.user.firstname}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'p', hotfixes: ['px_scaling'] }
    };
    html2pdf().from(element).set(opt).toPdf().save()
  }

  saveDocument() {
    let data: any = this.prospect._id
    this.GenDocService.create(new DocumentInternational(null, this.generateCode(), data, this.ecole_id, "Préinscription", new Date(), this.token.id, `PREINSCRIPTION_${this.user.lastname}_${this.user.firstname}.pdf`)).subscribe(doc => {

      var element = document.getElementById('page-container');
      var opt = {
        margin: 0,
        filename: `PREINSCRIPTION_${this.user.lastname}_${this.user.firstname}.pdf`,
        image: { type: 'jpeg', quality: 0.9 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'p', hotfixes: ['px_scaling'] }
      };
      this.ToastService.add({ severity: 'info', summary: 'Enregistrement du document en cours ...' })
      html2pdf().from(element).set(opt).toPdf()
        .outputPdf('blob')
        .then(pdfBase64 => {

          const file = new File(
            [pdfBase64],
            `PREINSCRIPTION_${this.user.lastname}_${this.user.firstname}.pdf`,
            { type: 'application/pdf' }
          );
          const formData = new FormData();
          formData.append('id', doc._id)
          formData.append('file', file)
          this.GenDocService.upload(formData, doc._id).subscribe(uploadDoc => {
            this.documents.push(uploadDoc)
            this.ToastService.add({ severity: 'success', summary: 'Document enregistré' })
          })
        })

    })
  }

  generateCode() {
    let ecole_part = this.ecole.titre.substring(0, 2).toUpperCase()
    return "INS" + ecole_part + this.prospect.customid + (this.documents.length + 1).toString()
  }

}
