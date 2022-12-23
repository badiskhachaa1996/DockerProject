import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FactureFormateur } from 'src/app/models/FactureFormateur';
import { FormateurFactureService } from 'src/app/services/finance/formateur-facture.service';
import { FormateurService } from 'src/app/services/formateur.service';
import { SeanceService } from 'src/app/services/seance.service';
import { saveAs as importedSaveAs } from "file-saver";
import { FactureFormateurMensuel } from 'src/app/models/FactureFormateurMensuel';
import { MessageService } from 'primeng/api';
import { Seance } from 'src/app/models/Seance';
import { PresenceService } from 'src/app/services/presence.service';
import * as html2pdf from 'html2pdf.js';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { User } from 'src/app/models/User';
@Component({
  selector: 'app-facture-formateur',
  templateUrl: './facture-formateur.component.html',
  styleUrls: ['./facture-formateur.component.scss']
})
export class FactureFormateurComponent implements OnInit {
  showAddFactureMensuel = false
  today: Date = new Date()
  formateurList = []
  seanceList = []
  formateurDic = {}
  seanceDic = {}
  facturesMensuel = []
  seances: Seance[] = []

  infosFormateur: [{ formateur_id: User, mois: Number, nombre_heure: Number, rapport: [{ seance: Seance, rapport: any }] }];
  clonedTables;

  formAddFactureMensuel: FormGroup = this.formBuilder.group({
    formateur_id: ['', Validators.required],
    mois: ['', Validators.required],
    file: [''],
    year: [new Date().getFullYear(), Validators.required],
    remarque: ['']
  });

  filterFormateur = [{ value: null, label: "Tous les formateurs" }]
  entrepriseList = []

  dropdownMonth = [
    { label: "Janvier", value: 1 },
    { label: "Fevrier", value: 2 },
    { label: "Mars", value: 3 },
    { label: "Avril", value: 4 },
    { label: "Mai", value: 5 },
    { label: "Juin", value: 6 },
    { label: "Juillet", value: 7 },
    { label: "Aout", value: 8 },
    { label: "Septembre", value: 9 },
    { label: "Octobre", value: 10 },
    { label: "Novembre", value: 11 },
    { label: "Decembre", value: 12 },
  ]

  convert = [null, 'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre']

  constructor(private formBuilder: FormBuilder, private FormateurService: FormateurService, private EntrepriseService: EntrepriseService,
    private FactureFormateurService: FormateurFactureService, private MessageService: MessageService, private PresenceService: PresenceService,
    private SeanceService:SeanceService) { }

  ngOnInit(): void {
    this.FormateurService.getAllPopulate().subscribe(r => {
      r.forEach(formateur => {
        let bypass: any = formateur.user_id
        if (bypass) {
          this.formateurList.push({ value: bypass._id, label: bypass.lastname + " " + bypass.firstname })
          this.filterFormateur.push({ value: bypass._id, label: bypass.lastname + " " + bypass.firstname })
          this.formateurDic[bypass._id] = formateur
        }
      })
    })
    this.FactureFormateurService.getAllMensuel().subscribe(data => {
      this.facturesMensuel = data
    })
    let d = new Date()
    this.FormateurService.getAllInfos(d.getMonth() , d.getFullYear()).subscribe(data => {
      this.infosFormateur = data
      this.clonedTables = data
    })
    this.EntrepriseService.getAll().subscribe(data => {
      this.entrepriseList = data
      this.formFactureType1.patchValue({ entreprise: data[0] })
    })
  }

  downloadFactureMensuel(facture: FactureFormateurMensuel) {
    this.FactureFormateurService.downloadMensuel(facture.formateur_id._id, facture.mois.toString() + "-" + facture.year.toString()).subscribe(data => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.documentType }), data.fileName)
    }, err => {
      console.error(err)
    })
  }

  onAddFactureMensuel() {
    this.FactureFormateurService.createMensuel(new FactureFormateurMensuel(null,
      this.formAddFactureMensuel.value.formateur_id,
      this.formAddFactureMensuel.value.mois,
      new Date(), this.formAddFactureMensuel.value.year, this.formAddFactureMensuel.value.remarque, this.data.totalHeure)).subscribe(data => {
        this.MessageService.add({ severity: "success", summary: "Création de la facture avec succès" })
        if (this.formAddFactureMensuel.value.file) {
          const formData = new FormData();
          formData.append('_id', data._id)
          formData.append('formateur_id', data.formateur_id)
          formData.append('mois', data.mois.toString() + "-" + data.year.toString())
          formData.append('file', this.formAddFactureMensuel.value.file)
          this.FactureFormateurService.upload(formData).subscribe(fD => {
            this.showAddFactureMensuel = false
            this.formAddFactureMensuel.reset()
            //WIP Faire un getBYID populate puis le push dans la liste
            this.FactureFormateurService.getAllMensuel().subscribe(data => {
              this.facturesMensuel = data
            })
          }, err => {
            this.MessageService.add({ severity: "error", summary: "Erreur lors de la création de la facture", detail: err.error })
            console.error(err)
          })
        }
      })
  }

  FileUploadMensuel(event, fileupload) {
    if (event && event.length > 0) { this.formAddFactureMensuel.patchValue({ file: event[0] }); fileupload.clear() }
  }

  formFactureType1: FormGroup = this.formBuilder.group({
    entreprise: ['', Validators.required],
    tva: [true, Validators.required]
  });

  data = {
    totalHeure: 0,
    taux_h: 0,
    ht: 0,
    tva: 0,
    total: 0
  }

  calculMensuel(value) {
    let date = new Date(value)
    this.formAddFactureMensuel.patchValue({ mois: date.getMonth() + 1, year: date.getFullYear() })
    let c_h = this.formateurDic[this.formAddFactureMensuel.value.formateur_id]?.taux_h
    if (!c_h || c_h == "" || c_h == " " || c_h == "0") {
      this.MessageService.add({ severity: 'error', summary: "Le formateur n'a pas de taux horaire", detail: "Le cout ne pourra pas être calculé car le taux horaire du formateur n'a pas été renseigné" })
    }
    this.PresenceService.getAllByUserIDMois(this.formAddFactureMensuel.value.formateur_id, this.formAddFactureMensuel.value.mois, this.formAddFactureMensuel.value.year).subscribe(r => {
      this.seances = r
      let ht = 0
      this.data.taux_h = this.formateurDic[this.formAddFactureMensuel.value.formateur_id]?.taux_h
      r.forEach(element => {
        if (element.calcul && element.presence != 'Absent' && element.libelle != 'TOTAL Présent') {
          this.data.totalHeure += element.calcul
          if (element.taux_h != 0)
            ht += element.calcul * element.taux_h
          else
            ht += element.calcul * this.data.taux_h
        }
      })
      this.data.ht = ht
      this.data.tva = this.data.ht * 0.2
      this.data.total = this.data.ht + this.data.tva
    })
  }

  affichageMois = `${new Date().getMonth() + 1}/${new Date().getFullYear()}`

  filterMonth(tableau, value, tab = 'dt2') {
    let date = new Date(value)
    if (tab == "dt1") {
      this.FormateurService.getAllInfos(date.getMonth(), date.getFullYear()).subscribe(data => {
        this.infosFormateur = data
        this.clonedTables = data
        console.log(this.infosFormateur)
        this.affichageMois = `${date.getMonth() + 1}/${date.getFullYear()}`
      })
    } else {
      tableau.filter(date.getMonth() + 1, 'mois', 'equals')
      tableau.filter(date.getFullYear(), 'year', 'equals')
    }
  }

  onGenerateFacture(id = 'facture1') {
    var element = document.getElementById(id);
    var opt = {
      margin: 0,
      filename: id + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  }


  onRowEditInit(product) {
    this.clonedTables[product.formateur_id._id] = { ...product };
  }

  onRowEditSave(product) {
    delete this.clonedTables[product.formateur_id._id];
    //TODO Send
    console.log(product)
  }

  onRowEditCancel(product, index: number) {
    this.infosFormateur[index] = this.clonedTables[product.formateur_id._id];
    delete this.clonedTables[product.formateur_id._id];
  }

  downloadFileCours(rapport,id){
    this.SeanceService.downloadFileCours(rapport.name, id).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.fileType }), rapport.name)
    }, (error) => {
      this.MessageService.add({ severity: 'error', summary: 'Contacté un Admin', detail: error })
      console.error(error)
    })
  }

}
