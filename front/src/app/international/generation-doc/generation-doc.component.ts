import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentInternational } from 'src/app/models/DocumentInternational';
import { AdmissionService } from 'src/app/services/admission.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { GenDocIntService } from 'src/app/services/gen-doc-int.service';
import { saveAs } from "file-saver";
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-generation-doc',
  templateUrl: './generation-doc.component.html',
  styleUrls: ['./generation-doc.component.scss']
})
export class GenerationDocComponent implements OnInit {

  documentDropdown = [
    { label: "Inscription", value: "inscription" },
    { label: "Préinscription", value: "preinscription" },
    { label: "Paiement", value: "paiement" },
    { label: "Paiement préinscription", value: "paiement-preinscription" },
    { label: "Paiement préinscription - acompte", value: "paiement-preinscription-acompte" },
    { label: "Paiement acompte", value: "paiement-acompte" },
    { label: "Dérogation", value: "derogation" },
    { label: "Lettre d'acceptation", value: "lettre-acceptation" },
  ]

  formationDropdown = []
  ecoleDropdown = []
  prospectDropdown = []
  rentreeDropdown = []
  documents: DocumentInternational[] = []

  constructor(private router: Router, private AService: AdmissionService, private FAService: FormulaireAdmissionService, private GenDocService: GenDocIntService,
    private ToastService: MessageService) { }

  ngOnInit(): void {
    this.FAService.EAgetAll().subscribe(data => {
      data.forEach(ecole => {
        this.ecoleDropdown.push({ label: ecole.titre, value: ecole._id })
      })
    })
    this.FAService.FAgetAll().subscribe(data => {
      data.forEach(f => {
        this.formationDropdown.push({ label: f.nom, value: f._id })
      })
    })
    this.AService.getAll().subscribe(data => {
      this.prospectDropdown = []
      data.forEach(p => {
        let { user_id }: any = p
        if (user_id)
          this.prospectDropdown.push({ label: `${p.customid} - ${user_id.lastname} ${user_id.firstname}`, value: user_id._id })
      })
    })
    this.FAService.RAgetAll().subscribe(data => {
      data.forEach(d => {
        this.rentreeDropdown.push({ label: d.nom, value: d._id })
      })
    })
    this.GenDocService.getAll().subscribe(data => {
      this.documents = data
    })
  }



  documentForm = new UntypedFormGroup({
    ecole: new UntypedFormControl('', Validators.required),
    formation: new UntypedFormControl('', Validators.required),
    prospect_id: new UntypedFormControl('', Validators.required),
    document: new UntypedFormControl('', Validators.required),
    rentree_scolaire: new UntypedFormControl('', Validators.required)
  })

  onSelectEcole() {
    this.FAService.RAgetAllByEcoleID(this.documentForm.value.ecole).subscribe(data => {
      this.rentreeDropdown = []
      console.log(data, this.documentForm.value.ecole)
      data.forEach(d => {
        this.rentreeDropdown.push({ label: d.nom, value: d._id })
      })
    })
  }

  openTemplate() {
    //console.log(['international/generation-documents', this.documentForm.value.document, this.documentForm.value.ecole, this.documentForm.value.prospect_id, this.documentForm.value.formation])
    this.router.navigate(['international/generation-documents', this.documentForm.value.document, this.documentForm.value.ecole, this.documentForm.value.prospect_id, this.documentForm.value.formation, this.documentForm.value.rentree_scolaire])
  }
  downloadFile(filename, id) {
    this.GenDocService.download(id, filename).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      saveAs(new Blob([byteArray], { type: data.documentType }),filename)
    }, (error) => {
      if (error?.status == 404 && error?.error?.message == "File not found")
        this.ToastService.add({ severity: 'error', summary: 'Pas de fichier trouvé' })
      else
        this.ToastService.add({ severity: 'error', summary: 'Contacté un Admin', detail: error })
      console.error(error)
    })
  }
}
