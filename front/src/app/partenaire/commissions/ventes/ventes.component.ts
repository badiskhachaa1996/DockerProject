import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { VenteService } from 'src/app/services/vente.service';
import { Vente } from 'src/app/models/Vente';
import { Prospect } from 'src/app/models/Prospect';
import { AdmissionService } from 'src/app/services/admission.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import { Partenaire } from 'src/app/models/Partenaire';
import { ActivatedRoute } from '@angular/router';
import { FactureCommission } from 'src/app/models/FactureCommission';
import { FactureCommissionService } from 'src/app/services/facture-commission.service';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
@Component({
  selector: 'app-ventes',
  templateUrl: './ventes.component.html',
  styleUrls: ['./ventes.component.scss']
})
export class VentesComponent implements OnInit {

  statutCommission = [
    { label: "Non payé", value: "Non payé" },
    { label: "Facturé payé", value: "Facturé payé" },
    { label: "A la source", value: "A la source" },
    { label: "Compensation", value: "Compensation" },
    { label: "Facturé non payé", value: "Facturé non payé" }
  ]
  filterStatutCommission = [
    { label: "Tous les statuts de commission", value: null },
    { label: "Non payé", value: "Non payé" },
    { label: "Facturé payé", value: "Facturé payé" },
    { label: "A la source", value: "A la source" },
    { label: "Compensation", value: "Compensation" },
    { label: "Facturé non payé", value: "Facturé non payé" }
  ]
  produitList = [
    { label: "Liste déroulante avec la description de commission", value: "Liste déroulante avec la description de commission" }
  ]
  produitListUpdate = [

  ]

  filterProduit = [
    { label: "Tous les produits", value: null },
    { label: "Liste déroulante avec la description de commission", value: "Liste déroulante avec la description de commission" }
  ]

  listProspect = []

  isPovPartenaire = false
  factures = 0

  constructor(private VenteService: VenteService, private MessageService: MessageService, private ProspectService: AdmissionService, private CService: CommercialPartenaireService,
    private route: ActivatedRoute, private PartenaireService: PartenaireService, private FCService: FactureCommissionService) { }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('partenaire_id')) {
      this.PartenaireSelected = this.route.snapshot.paramMap.get('partenaire_id')
      this.isPovPartenaire = true
      this.VenteService.getAllByPartenaireID(this.PartenaireSelected).subscribe(data => {
        this.ventes = data
      })
      this.PartenaireService.getById(this.PartenaireSelected).subscribe(partenaire => {
        this.ProspectService.getAllCodeCommercial(partenaire.code_partenaire).subscribe(data => {
          data.forEach(d => {
            let bypass: any = d.user_id
            this.listProspect.push({ label: `${bypass?.lastname} ${bypass?.firstname}`, value: d._id, custom_id: d.customid })
          })
        })
        this.produitList = []
        this.produitListUpdate = []
        partenaire.commissions.forEach(c => {
          this.produitList.push({ label: c.description, value: `${c.description} ${c.montant}€` })
          this.produitListUpdate.push({ label: `${c.description} ${c.montant}€`, value: `${c.description} ${c.montant}€` })
        })
      })
      this.CService.getAllPopulateByPartenaireID(this.PartenaireSelected).subscribe(data => {
        data.forEach(d => {
          let { user_id }: any = d
          if (user_id) {
            this.filterCommercial.push({ label: user_id.lastname + " " + user_id.firstname, value: d.code_commercial_partenaire })
            this.dicCommercial[d.code_commercial_partenaire] = user_id.lastname + " " + user_id.firstname
          }

        })
      })
    } else {
      this.CService.getAllPopulate().subscribe(data => {
        data.forEach(d => {
          let { user_id }: any = d
          if (user_id) {
            this.filterCommercial.push({ label: user_id.lastname + " " + user_id.firstname, value: d.code_commercial_partenaire })
            this.dicCommercial[d.code_commercial_partenaire] = user_id.lastname + " " + user_id.firstname
          }
        })
      })
      this.VenteService.getAll().subscribe(data => {
        this.ventes = data
      })
      this.PartenaireService.getAll().subscribe(data => {
        this.produitList = []
        this.produitListUpdate = []
        this.PartenaireList = [{ label: "Tous les Partenaires", value: null, }]
        data.forEach(d => {
          this.PartenaireList.push({ label: d.nom, value: d._id })
        })
      })
      this.ProspectService.getAll().subscribe(data => {
        data.forEach(d => {
          let bypass: any = d.user_id
          this.listProspect.push({ label: `${bypass?.lastname} ${bypass?.firstname}`, value: d._id, custom_id: d.customid })
        })
      })
    }
    this.FCService.getAll().subscribe(data => {
      this.factures = data.length
    })

  }

  showFormAddVente = false
  filterCommercial = [{ label: 'Tous les commerciaux', value: null }]
  dicCommercial = {}
  ventes = []

  modaliteList = [
    { value: "Chèque Montpellier", label: "Chèque Montpellier" },
    { value: "Chèque Paris", label: "Chèque Paris" },
    { value: "Chèque Tunis", label: "Chèque Tunis" },
    { value: "Compensation", label: "Compensation" },
    { value: "Espèce chèque Autre", label: "Espèce chèque Autre" },
    { value: "Espèce chèque Montpellier", label: "Espèce chèque Montpellier" },
    { value: "Espèce chèque Paris", label: "Espèce chèque Paris" },
    { value: "Espèce Congo", label: "Espèce Congo" },
    { value: "Espèce Maroc", label: "Espèce Maroc" },
    { value: "Espèce Montpellier", label: "Espèce Montpellier" },
    { value: "Espèce Paris", label: "Espèce Paris" },
    { value: "Espèce Tunis", label: "Espèce Tunis" },
    { value: "Lien de paiement", label: "Lien de paiement" },
    { value: "PayPal", label: "PayPal" },
    { value: "Virement", label: "Virement" },
    { value: "Virement chèque Autre", label: "Virement chèque Autre" },
    { value: "Virement chèque Montpellier", label: "Virement chèque Montpellier" },
    { value: "Virement chèque Paris", label: "Virement chèque Paris" },
  ]

  formAddVente: FormGroup = new FormGroup({
    produit: new FormControl('', Validators.required),
    montant: new FormControl('', Validators.required),
    statutCommission: new FormControl(''),
    date_reglement: new FormControl('', Validators.required),
    prospect_id: new FormControl('', Validators.required),
    partenaire_id: new FormControl('', Validators.required),
    modalite_paiement: new FormControl('', Validators.required)
  })

  onAddVente() {
    this.VenteService.create({ ...this.formAddVente.value }).subscribe(data => {
      this.selectPartenaire(this.formAddVente.value.partenaire_id)
      this.showFormAddVente = false
      this.formAddVente.reset()
      this.MessageService.add({ severity: 'success', summary: "Création de vente avec succès" })
    })
    if (this.formAddVente.value.statutCommission == "Compensation" || this.formAddVente.value.statutCommission == "A la source") {
      let montant = this.formAddVente.value.montant
      if (this.formAddVente.value.statutCommission == "A la source")
        montant = this.getMontant(this.formAddVente.value.produit)

      let facture = new FactureCommission((this.factures + 1).toString(), montant, 0, "Payé", this.formAddVente.value.statutCommission, this.formAddVente.value.date_reglement, this.formAddVente.value.partenaire_id)
      this.FCService.create(facture).subscribe(data => {
        this.MessageService.add({ severity: 'success', summary: "Création de facture avec succès car le statut est " + this.formAddVente.value.statutCommission })
      })
    }
  }

  initEditForm(vente: Vente) {
    this.venteSelected = vente
    this.formEditVente.patchValue({
      ...vente
    })
    this.formEditVente.patchValue({
      date_reglement: this.convertTime(vente.date_reglement)

    })
    this.showFormEditVente = true
    this.produitListUpdate = []
    this.venteSelected.partenaire_id.commissions.forEach(c => {
      this.produitList.push({ label: c.description, value: `${c.description} ${c.montant}€` })
      this.produitListUpdate.push({ label: `${c.description} ${c.montant}€`, value: `${c.description} ${c.montant}€` })
    })
  }

  venteSelected: Vente = null

  showFormEditVente = false

  formEditVente: FormGroup = new FormGroup({
    _id: new FormControl('', Validators.required),
    produit: new FormControl('', Validators.required),
    montant: new FormControl(''),
    statutCommission: new FormControl(''),
    date_reglement: new FormControl('', Validators.required),
    modalite_paiement: new FormControl('', Validators.required)
  })

  onUpdateVente() {

    console.log(this.formEditVente.value.date_reglement)
    this.formEditVente.patchValue({ date_reglement: new Date(this.formEditVente.value.date_reglement) })
    this.VenteService.update({ ...this.formEditVente.value }).subscribe(data => {
      this.ventes[this.ventes.indexOf(this.venteSelected)] = data
      this.showFormEditVente = false
      this.formEditVente.reset()
      this.MessageService.add({ severity: 'success', summary: "Mise à jour de la facture avec succès" })
    }, error => {
      this.MessageService.add({ severity: 'error', summary: "Une erreur s'est produit contacté un Admin" })
      console.error(error)
    })
  }

  convertTime(v) {
    let date = new Date(v)
    let day = date.getUTCDate() 
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    if (year != 1970)
      return `${year}-${this.pad(month)}-${this.pad(day)}`
    else
      return ""
  }
  pad(number: number) {
    let r = number.toString()
    while (r.length < 2)
      r = "0" + r
    return r
  }

  PartenaireList = []
  PartenaireSelected: string = null

  onPartenaireSelect() {
    this.PartenaireSelected = this.formAddVente.value.partenaire_id
    this.selectPartenaire(this.formAddVente.value.partenaire_id)
    if (this.PartenaireSelected)
      this.PartenaireService.getById(this.PartenaireSelected).subscribe(data => {
        this.produitList = []
        this.produitListUpdate = []
        data.commissions.forEach(c => {
          this.produitList.push({ label: c.description, value: `${c.description} ${c.montant}€` })
          this.produitListUpdate.push({ label: `${c.description} ${c.montant}€`, value: `${c.description} ${c.montant}€` })
        })
      })
  }

  selectPartenaire(partenaire_id) {
    if (!this.formAddVente.value.partenaire_id)
      this.formAddVente.patchValue({ partenaire_id: this.PartenaireSelected })
    if (this.PartenaireSelected) {
      this.VenteService.getAllByPartenaireID(this.PartenaireSelected).subscribe(data => {
        this.ventes = data
      })
      this.ProspectService.getAllByCodeAdmin(this.PartenaireSelected).subscribe(data => {
        this.listProspect = []
        data.forEach(d => {
          let bypass: any = d.user_id
          this.listProspect.push({ label: `${bypass?.lastname} ${bypass?.firstname}`, value: d._id, custom_id: d.customid })
        })
      })
    } else {
      this.VenteService.getAll().subscribe(data => {
        this.ventes = data
      })
      this.ProspectService.getAll().subscribe(data => {
        this.listProspect = []
        data.forEach(d => {
          let bypass: any = d.user_id
          this.listProspect.push({ label: `${bypass?.lastname} ${bypass?.firstname}`, value: d._id, custom_id: d.customid })
        })
      })
    }
    if (partenaire_id) {
      this.filterCommercial = []
      this.dicCommercial = {}
      this.CService.getAllPopulateByPartenaireID(this.PartenaireSelected).subscribe(data => {
        data.forEach(d => {
          let { user_id }: any = d
          if (user_id) {
            this.filterCommercial.push({ label: user_id.lastname + " " + user_id.firstname, value: d.code_commercial_partenaire })
            this.dicCommercial[d.code_commercial_partenaire] = user_id.lastname + " " + user_id.firstname
          }

        })
      })
    }
  }

  getProduit(str: string) {
    if (str.includes("\n"))
      return str.substring(0, str.lastIndexOf('\n'))
    else
      return str.substring(0, str.lastIndexOf(' '))
  }

  getMontant(str: string) {
    if (str.includes("\n"))
      return str.substring(str.lastIndexOf('Montant:') + 'Montant:'.length, str.lastIndexOf('€'))
    else
      return str.substring(str.lastIndexOf(' ') + 1, str.lastIndexOf('€'))
  }

  delete(vente: Vente) {
    if (confirm(`Etes-vous sûr de vouloir supprimer cette vente ?`))
      this.VenteService.delete(vente._id).subscribe(data => {
        this.ventes.splice(this.ventes.indexOf(vente), 1)
        this.MessageService.add({ severity: 'success', summary: 'Suppression de la vente avec succès' })
      })
  }

  showAttribution: Vente = null
  factureList = []
  tempFactureid = null
  initAttributionForm(vente: Vente) {
    this.showAttribution = vente
    this.FCService.getAllByPartenaireID(vente.partenaire_id._id).subscribe(factures => {
      this.factureList = []
      factures.forEach(f => { this.factureList.push({ label: f.numero, value: f._id }) })
    })
    if (this.showAttribution.facture_id)
      this.tempFactureid = this.showAttribution.facture_id._id
  }
  onMatchFacture(facture_id: any) {

    this.VenteService.update({ facture_id, _id: this.showAttribution._id, statut: 'Facturé' }).subscribe(vente => {
      this.ventes.splice(this.ventes.indexOf(this.showAttribution), 1, vente)
      this.showAttribution = null
      this.MessageService.add({ severity: 'success', summary: 'Attribution de la facture avec succès' })
    })
  }
  scrollToTop() {
    var scrollDuration = 250;
    var scrollStep = -window.scrollY / (scrollDuration / 15);

    var scrollInterval = setInterval(function () {
      if (window.scrollY > 120) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }
}
