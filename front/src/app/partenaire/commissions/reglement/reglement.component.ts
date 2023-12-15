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
import { NotificationService } from 'src/app/services/notification.service';
import { SocketService } from 'src/app/services/socket.service';
import { EmailTypeService } from 'src/app/services/email-type.service';
import { Notification } from 'src/app/models/notification';

@Component({
  selector: 'app-reglement',
  templateUrl: './reglement.component.html',
  styleUrls: ['./reglement.component.scss']
})
export class ReglementComponent implements OnInit {

  constructor(private FCService: FactureCommissionService, private route: ActivatedRoute,
    private MessageService: MessageService, private VenteService: VenteService,
    private PartenaireService: PartenaireService, private NotifService: NotificationService, private Socket: SocketService, private EmailService: EmailTypeService) { }

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
  PartenaireSelected: [string] = null

  isPovPartenaire = false

  formAddFacture: FormGroup = new FormGroup({
    numero: new FormControl(this.factures.length + 1, Validators.required),
    montant: new FormControl('', Validators.required),
    tva: new FormControl('', Validators.required),
    statut: new FormControl('', Validators.required),
    nature: new FormControl('', Validators.required),
    date_paiement: new FormControl('', Validators.required),
    partenaire_id: new FormControl('')
  })

  onAddFacture() {
    this.FCService.create({ ...this.formAddFacture.value }).subscribe(data => {
      if (data.nature == "A la source" || data.nature == "Compensation")
        this.factures.push(data)
      if (this.formAddFacture.value.partenaire_id && this.partenaireDic[this.formAddFacture.value.partenaire_id]?.email_perso) {
        let partenaire_user_id = this.partenaireDic[this.formAddFacture.value.partenaire_id]
        this.Socket.NewNotifV2(partenaire_user_id._id, `Une nouvelle facture est disponible dans votre espace `)

        this.NotifService.create(new Notification(null, null, false,
          `Une nouvelle facture est disponible dans votre espace `,
          new Date(), partenaire_user_id._id, null)).subscribe(test => { })

        this.EmailService.defaultEmail({
          email: partenaire_user_id.email,
          objet: '[IMS] - Nouvelle Facture',
          mail: `

          Cher partenaire,

          Nous sommes ravis de vous informer qu'une nouvelle facture est désormais disponible dans votre espace. Vous pouvez y accéder en vous connectant à votre compte sur notre plateforme en ligne.
          
          Si vous avez des questions ou des préoccupations concernant cette facture, n'hésitez pas à nous contacter. Notre équipe est là pour vous aider et répondre à vos demandes.
          
          Nous vous remercions de votre confiance continue et de votre partenariat précieux. Nous apprécions votre promptitude dans le règlement de nos factures et nous sommes impatients de poursuivre notre collaboration fructueuse.
          
          Cordialement,
        `
        }).subscribe(() => { })
      }
      this.showFormAddFacture = false
      this.formAddFacture.patchValue({ numero: this.generateIDFacture() })
      this.formAddFacture.reset()
      this.MessageService.add({ severity: 'success', summary: "Création de facture avec succès" })
    })
  }
  generateIDFacture() {
    let date = new Date()
    return (this.factures.length + 1).toString() + date.getDate().toString() + date.getMonth().toString() + date.getFullYear().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString()

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
  partenaireDic = {}
  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('partenaire_id')) {
      this.PartenaireSelected = [this.route.snapshot.paramMap.get('partenaire_id')]
      this.isPovPartenaire = true
      this.FCService.getAllByPartenaireID(this.PartenaireSelected[0]).subscribe(dataF => {
        this.factures = dataF
        this.VenteService.getAllByPartenaireID(this.PartenaireSelected[0]).subscribe(data => {
          this.updateStats(data, dataF)
        })
      })

    } else {
      this.FCService.getAll().subscribe(dataFacture => {
        this.factures = dataFacture
        this.VenteService.getAll().subscribe(dataVente => {
          this.updateStats(dataVente, dataFacture)
        })
      })

      this.PartenaireService.getAll().subscribe(data => {
        this.PartenaireList = [{ label: "Tous les Partenaires", value: null }]
        data.forEach(p => {
          this.PartenaireList.push({ label: p.nom, value: p._id })
          this.partenaireDic[p._id] = p.user_id
        })
      })
    }
  }
  updateStats(data: Vente[], dataFacture: FactureCommission[]) {
    console.log(data)
    this.stats = {
      tt_vente: Math.trunc(data.reduce((total, next) => total + next?.montant, 0)),
      tt_commission: Math.trunc(data.reduce((total, next) => total + this.getMontant(next?.produit), 0)),
      tt_paye: Math.trunc(dataFacture.reduce((total, next) => total + (next?.statut == 'Payé' ? next?.montant : 0), 0)), // Somme ((Statut de commission équal à Facturé payé ou A la source ou Compensation) *Montant de la commission)  
      //next?.statut == 'Facture payé' || next?.statut == 'A la source' || next?.statut == 'Compensation'
      reste_paye: 0
    }
    if (Number.isNaN(this.stats.tt_vente))
      this.stats.tt_vente = 0
    if (Number.isNaN(this.stats.tt_commission))
      this.stats.tt_commission = 0
    if (Number.isNaN(this.stats.tt_paye))
      this.stats.tt_paye = 0
    this.stats.reste_paye = this.stats.tt_commission - this.stats.tt_paye

  }

  getMontant(str: string) {
    if (str)
      if (str.includes("\n")) {
        let val = parseInt(str.substring(str.lastIndexOf('Montant:') + 'Montant:'.length, str.lastIndexOf('€')))
        console.log(val)
        if (Number.isNaN(val))
          return 0
        else
          return val
      }
      else {
        let val = parseInt(str.substring(str.lastIndexOf(' ') + 1, str.lastIndexOf('€')))
        console.log(val)
        if (Number.isNaN(val))
          return 0
        else
          return val
      }
    else return 0
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
    numero: new FormControl(this.factures.length + 1, Validators.required),
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
    if (this.PartenaireSelected && this.PartenaireSelected[0]) {
      this.FCService.getAllByPartenaireIDs(this.PartenaireSelected).subscribe(dataF => {
        this.factures = dataF
        this.VenteService.getAllByPartenaireIDs(this.PartenaireSelected).subscribe(data => {
          this.updateStats(data, dataF)
        })
      })

    } else {

      this.VenteService.getAll().subscribe(data => {
        this.FCService.getAll().subscribe(dataF => {
          this.factures = dataF
          this.updateStats(data, dataF)
        })

      })
    }

  }
  delete(facture: FactureCommission) {
    if (confirm(`Etes-vous sûr de vouloir supprimer cette vente ?`))
      this.FCService.delete(facture._id).subscribe(data => {
        this.factures.splice(this.factures.indexOf(facture), 1)
        this.MessageService.add({ severity: 'success', summary: 'Suppression de la vente avec succès' })
      })
  }
}
