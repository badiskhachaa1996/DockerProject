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
@Component({
  selector: 'app-facture-formateur',
  templateUrl: './facture-formateur.component.html',
  styleUrls: ['./facture-formateur.component.scss']
})
export class FactureFormateurComponent implements OnInit {
  showAddFactureMensuel = false
  formateurList = []
  seanceList = []
  formateurDic = {}
  seanceDic = {}
  facturesMensuel = []
  seances: Seance[] = []

  formAddFactureMensuel: FormGroup = this.formBuilder.group({
    formateur_id: ['', Validators.required],
    mois: ['', Validators.required],
    file: ['', Validators.required],
    year: [new Date().getFullYear(), Validators.required]
  });

  filterFormateur = [{ value: null, label: "Tous les formateurs" }]

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

  constructor(private formBuilder: FormBuilder, private FormateurService: FormateurService, private SeanceService: SeanceService,
    private FactureFormateurService: FormateurFactureService, private MessageService: MessageService, private PresenceService: PresenceService) { }

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
  }

  downloadFactureMensuel(facture: FactureFormateurMensuel) {
    this.FactureFormateurService.downloadMensuel(facture.formateur_id._id, facture.mois.toString() + "-" + facture.year.toString()).subscribe(data => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.documentType }), data.fileName)
    })
  }

  onAddFactureMensuel() {
    this.FactureFormateurService.createMensuel(new FactureFormateurMensuel(null,
      this.formAddFactureMensuel.value.formateur_id,
      this.formAddFactureMensuel.value.mois,
      new Date(), this.formAddFactureMensuel.value.year)).subscribe(data => {
        const formData = new FormData();
        formData.append('_id', data._id)
        formData.append('formateur_id', data.formateur_id)
        formData.append('mois', data.mois.toString() + "-" + data.year.toString())
        formData.append('file', this.formAddFactureMensuel.value.file)
        this.FactureFormateurService.upload(formData).subscribe(fD => {
          this.MessageService.add({ severity: "success", summary: "Création de la facture avec succès" })
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
      })
  }

  FileUploadMensuel(event, fileupload) {
    if (event && event.length > 0) { this.formAddFactureMensuel.patchValue({ file: event[0] }); fileupload.clear() }
  }

  calculMensuel() {
    let c_h = this.formateurDic[this.formAddFactureMensuel.value.formateur_id]?.taux_h
    if (!c_h || c_h == "" || c_h == " ") {
      this.MessageService.add({ severity: 'error', summary: "Le formateur n'a pas de taux horaire", detail: "Le cout ne pourra pas être calculé car le taux horaire du formateur n'a pas été renseigné" })
    }
    this.PresenceService.getAllByUserIDMois(this.formAddFactureMensuel.value.formateur_id, this.formAddFactureMensuel.value.mois).subscribe(r => {
      this.seances = r
    })
  }

  filterMonth(tableau, value) {
    let date = new Date(value)
    tableau.filter(date.getMonth() + 1, 'mois', 'equals')
    tableau.filter(date.getFullYear(), 'year', 'equals')
  }

}
