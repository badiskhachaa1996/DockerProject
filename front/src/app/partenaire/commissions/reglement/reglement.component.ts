import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { saveAs } from "file-saver";
import { FactureCommission } from 'src/app/models/FactureCommission';
import { FactureCommissionService } from 'src/app/services/facture-commission.service';
import { VenteService } from 'src/app/services/vente.service';
import { Vente } from 'src/app/models/Vente';
import { PartenaireService } from 'src/app/services/partenaire.service';
import { Partenaire } from 'src/app/models/Partenaire';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reglement',
  templateUrl: './reglement.component.html',
  styleUrls: ['./reglement.component.scss']
})
export class ReglementComponent implements OnInit {

  constructor(private FCService: FactureCommissionService, private route: ActivatedRoute,
    private MessageService: MessageService, private VenteService: VenteService,
    private PartenaireService: PartenaireService) { }

  showFormAddFacture = false

  statutFacture = [
    { label: "Payé", value: "Payé" },
    { label: "En Attente", value: "En Attente" },
  ]

  filterStatutFacture = [
    { label: "Tous les statuts de facture", value: null },
    { label: "Payé", value: "Payé" },
    { label: "En Attente", value: "En Attente" },
  ]

  natureList = [
    { label: "Espèce", value: "Espèce" },
    { label: "A la source", value: "A la source" },
    { label: "Compensation", value: "Compensation" },
    { label: "Virement", value: "Virement" },
  ]

  filterNaturePaiement = [
    { label: "Tous les natures de paiement", value: null },
    { label: "Espèce", value: "Espèce" },
    { label: "A la source", value: "A la source" },
    { label: "Compensation", value: "Compensation" },
    { label: "Virement", value: "Virement" },
  ]

  factures = []

  stats = {
    tt_vente: 0,
    tt_commission: 0,
    tt_paye: 0,
    reste_paye: 0
  }

  PartenaireList = []
  PartenaireSelected: string = null

  isPovPartenaire = false

  formAddFacture: FormGroup = new FormGroup({
    numero: new FormControl(this.factures.length, Validators.required),
    montant: new FormControl('', Validators.required),
    tva: new FormControl('', Validators.required),
    statut: new FormControl('', Validators.required),
    nature: new FormControl('', Validators.required),
    date_paiement: new FormControl('', Validators.required),
    partenaire_id: new FormControl('')
  })

  onAddFacture() {
    if (this.PartenaireSelected)
      this.formAddFacture.patchValue({ partenaire_id: this.PartenaireSelected })
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
    if (this.route.snapshot.paramMap.get('partenaire_id')) {
      this.PartenaireSelected = this.route.snapshot.paramMap.get('partenaire_id')
      this.isPovPartenaire = true
      this.FCService.getAllByPartenaireID(this.PartenaireSelected).subscribe(data => {
        this.factures = data
      })
      this.VenteService.getAllByPartenaireID(this.PartenaireSelected).subscribe(data => {
        this.updateStats(data)
      })
    } else {
      this.FCService.getAll().subscribe(data => {
        this.factures = data
      })
      this.VenteService.getAll().subscribe(data => {
        this.updateStats(data)
      })
      this.PartenaireService.getAll().subscribe(data => {
        this.PartenaireList = [{ label: "Tous les Partenaires", value: null }]
        data.forEach(p => {
          this.PartenaireList.push({ label: p.nom, value: p._id })
        })
      })
    }
  }
  updateStats(data: Vente[]) {
    this.stats = {
      tt_vente: Math.trunc(data.reduce((total, next) => total + next?.prospect_id?.montant_paye, 0)),
      tt_commission: Math.trunc(data.reduce((total, next) => total + next?.montant, 0)),
      tt_paye: Math.trunc(data.reduce((total, next) => total + (next?.statutCommission == 'Facture payé' || next?.statutCommission == 'A la source' || next?.statutCommission == 'Compensation' ? next?.montant : 0), 0)), // Somme ((Statut de commission équal à Facturé payé ou A la source ou Compensation) *Montant de la commission)  

      reste_paye: 0
    }
    if (Number.isNaN(this.stats.tt_vente))
      this.stats.tt_vente = 0
    if (Number.isNaN(this.stats.tt_paye))
      this.stats.tt_paye = 0
    this.stats.reste_paye = this.stats.tt_commission - this.stats.tt_paye

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

  selectPartenaire() {
    if (this.PartenaireSelected) {
      this.FCService.getAllByPartenaireID(this.PartenaireSelected).subscribe(data => {
        this.factures = data
      })
      this.VenteService.getAllByPartenaireID(this.PartenaireSelected).subscribe(data => {
        this.updateStats(data)
      })
    } else {
      this.FCService.getAll().subscribe(data => {
        this.factures = data
      })
      this.VenteService.getAll().subscribe(data => {
        this.updateStats(data)
      })
    }

  }

}
