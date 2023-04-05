import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { saveAs } from "file-saver";
import { FactureCommission } from 'src/app/models/FactureCommission';
import { FactureCommissionService } from 'src/app/services/facture-commission.service';

@Component({
  selector: 'app-reglement',
  templateUrl: './reglement.component.html',
  styleUrls: ['./reglement.component.scss']
})
export class ReglementComponent implements OnInit {

  constructor(private FCService: FactureCommissionService, private MessageService: MessageService) { }

  showFormAddFacture = false

  statutFacture = [
    { label: "Payé", value: "Payé" },
    { label: "En Attente", value: "En Attente" },
  ]

  natureList = [
    { label: "Espèce", value: "Espèce" },
    { label: "A la source", value: "A la source" },
    { label: "Compensation", value: "Compensation" },
    { label: "Virement", value: "Virement" },
  ]

  factures = []

  formAddFacture: FormGroup = new FormGroup({
    numero: new FormControl(this.factures.length, Validators.required),
    montant: new FormControl('', Validators.required),
    tva: new FormControl('', Validators.required),
    statut: new FormControl('', Validators.required),
    nature: new FormControl('', Validators.required),
    date_paiement: new FormControl('', Validators.required),
  })

  onAddFacture() {
    this.FCService.create({ ...this.formAddFacture.value }).subscribe(data => {
      this.factures.push(data)
      this.showFormAddFacture = false
      this.formAddFacture.reset()
      this.MessageService.add({ severity: 'success', summary: "Création de facture avec succès" })
    })
  }

  initEditForm(facture) {
    this.factureSelected = facture
    this.formEditFacture.patchValue({
      ...facture
    })
    this.formEditFacture.patchValue({
      date_paiement: facture.date_paiement
    })
    this.showFormEditFacture = true
  }

  ngOnInit(): void {
    this.FCService.getAll().subscribe(data => {
      this.factures = data
    })
  }

  download(facture: FactureCommission) {
    this.FCService.downloadFile(facture._id).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      saveAs(new Blob([byteArray], { type: data.documentType }), data.fileName)
    }, (error) => {
      console.error(error)
      this.MessageService.add({ severity: 'error', summary: 'Téléchargement du Fichier', detail: 'Une erreur est survenu' });
    })
  }

  factureSelected: FactureCommission = null

  clickFile() {
    document.getElementById('selectedFile').click();
  }

  FileUpload(event) {
    if (event && event.length > 0 && this.factureSelected != null) {
      const formData = new FormData();

      formData.append('_id', this.factureSelected._id)
      formData.append('file', event[0])
      this.FCService.uploadFile(formData, this.factureSelected._id).subscribe(() => {
        this.MessageService.add({ severity: 'success', summary: 'Facture uploadé', detail: 'Mise à jour du fichier de la facture avec succès' });
        this.factures[this.factures.indexOf(this.factureSelected)].factureUploaded = true
      }, (error) => {
        console.error(error)
      })
    }
  }

  uploadFile(facture: FactureCommission) {
    this.factureSelected = facture
    this.clickFile()
  }

  showFormEditFacture = false

  formEditFacture: FormGroup = new FormGroup({
    numero: new FormControl(this.factures.length, Validators.required),
    montant: new FormControl('', Validators.required),
    tva: new FormControl('', Validators.required),
    statut: new FormControl('', Validators.required),
    nature: new FormControl('', Validators.required),
    date_paiement: new FormControl('', Validators.required),
  })

  onUpdateFacture() {
    this.FCService.update({ ...this.formEditFacture.value, _id: this.factureSelected._id }).subscribe(data => {
      this.factures[this.factures.indexOf(this.factureSelected)] = data
      this.showFormEditFacture = false
      this.formEditFacture.reset()
      this.MessageService.add({ severity: 'success', summary: "Mise à jour de la facture avec succès" })
    })
  }

  convertTime(v) {
    let date = new Date(v)
    let day = date.getUTCDate() + 1
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    if (year != 1970)
      return `${day}-${month}-${year}`
    else
      return ""
  }

}
