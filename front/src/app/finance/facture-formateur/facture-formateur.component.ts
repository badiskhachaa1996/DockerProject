import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FactureFormateur } from 'src/app/models/FactureFormateur';
import { FormateurFactureService } from 'src/app/services/finance/formateur-facture.service';
import { FormateurService } from 'src/app/services/formateur.service';
import { SeanceService } from 'src/app/services/seance.service';
import { saveAs as importedSaveAs } from "file-saver";
import { FactureFormateurMensuel } from 'src/app/models/FactureFormateurMensuel';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-facture-formateur',
  templateUrl: './facture-formateur.component.html',
  styleUrls: ['./facture-formateur.component.scss']
})
export class FactureFormateurComponent implements OnInit {

  showAddFacture = false
  showAddFactureMensuel = false
  formateurList = []
  seanceList = []
  formateurDic = {}
  seanceDic = {}
  factures = []
  facturesMensuel = []
  affichageMensuel = ""
  formAddFacture: FormGroup = this.formBuilder.group({
    formateur_id: ['', Validators.required],
    seance_id: ['', Validators.required],
    file: ['', Validators.required],
  });

  formAddFactureMensuel: FormGroup = this.formBuilder.group({
    formateur_id: ['', Validators.required],
    mois: ['', Validators.required],
    file: ['', Validators.required],
  });

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
    private FactureFormateurService: FormateurFactureService, private MessageService: MessageService) { }

  ngOnInit(): void {
    this.FormateurService.getAllPopulate().subscribe(r => {
      r.forEach(formateur => {
        let bypass: any = formateur.user_id
        if (bypass) {
          this.formateurList.push({ value: bypass._id, label: bypass.lastname + " " + bypass.firstname })
          this.formateurDic[bypass._id] = formateur
        }
      })
    })
    this.FactureFormateurService.getAll().subscribe(data => {
      this.factures = data
    })
    this.FactureFormateurService.getAllMensuel().subscribe(data => {
      this.facturesMensuel = data
    })
  }

  filterSeanceByFormateur() {
    this.seanceList = []
    this.seanceDic = {}
    this.SeanceService.getAllbyFormateur(this.formAddFacture.value.formateur_id).subscribe(r => {
      r.forEach(seance => {
        let d = new Date(seance.date_debut)
        let hour = d.getHours()
        let minutes = d.getMinutes()
        let jour = d.getDate()
        let mois = d.getMonth() + 1
        let year = d.getFullYear().toString()?.substring(2)
        let date = jour + "/" + mois + "/" + year + " " + hour + "H" + minutes
        this.seanceDic[seance._id] = seance
        this.seanceList.push({ value: seance._id, label: seance.libelle + " " + date })
      })
    })
  }

  downloadFacture(facture: FactureFormateur) {
    this.FactureFormateurService.download(facture.formateur_id._id, facture._id).subscribe(data => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.documentType }), data.fileName)
    })
  }

  downloadFactureMensuel(facture: FactureFormateurMensuel) {
    this.FactureFormateurService.downloadMensuel(facture.formateur_id._id, facture.mois).subscribe(data => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.documentType }), data.fileName)
    })
  }

  onAddFacture() {
    this.FactureFormateurService.create(new FactureFormateur(null,
      this.formAddFacture.value.formateur_id,
      this.formAddFacture.value.seance_id,
      new Date())).subscribe(data => {
        const formData = new FormData();
        formData.append('_id', data._id)
        formData.append('formateur_id', data.formateur_id)
        formData.append('file', this.formAddFacture.value.file)
        this.FactureFormateurService.upload(formData).subscribe(fD => {
          this.MessageService.add({ severity: "success", summary: "Création de la facture avec succès" })
          this.showAddFacture = false
          this.formAddFacture.reset()
          //WIP Faire un getBYID populate puis le push dans la liste
          this.FactureFormateurService.getAll().subscribe(data => {
            this.factures = data
          })
        }, err => {
          this.MessageService.add({ severity: "error", summary: "Erreur lors de la création de la facture", detail: err.error })
          console.error(err)
        })
      })
  }

  onAddFactureMensuel() {
    this.FactureFormateurService.createMensuel(new FactureFormateurMensuel(null,
      this.formAddFactureMensuel.value.formateur_id,
      this.formAddFactureMensuel.value.mois,
      new Date())).subscribe(data => {
        const formData = new FormData();
        formData.append('_id', data._id)
        formData.append('formateur_id', data.formateur_id)
        formData.append('mois', data.mois.toString())
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

  FileUploadAdd(event, fileupload) {
    if (event && event.length > 0) { this.formAddFacture.patchValue({ file: event[0] }); fileupload.clear() }
  }
  FileUploadMensuel(event, fileupload) {
    if (event && event.length > 0) { this.formAddFactureMensuel.patchValue({ file: event[0] }); fileupload.clear() }
  }

  calcul() {
    if (this.formAddFacture.value.seance_id && this.formAddFacture.value.formateur_id) {
      let date_debut = new Date(this.seanceDic[this.formAddFacture.value.seance_id].date_debut)
      let date_fin = new Date(this.seanceDic[this.formAddFacture.value.seance_id].date_fin)
      let cout_horaire = this.formateurDic[this.formAddFacture.value.formateur_id]?.taux_h
      let nbHeures = date_fin.getHours() - date_debut.getHours()
      if ((date_fin.getMinutes() == 30 && date_debut.getMinutes() != 30) || (date_fin.getMinutes() != 30 && date_debut.getMinutes() == 30))
        nbHeures = nbHeures + 0.5
      if (!cout_horaire || cout_horaire == "" || cout_horaire == "0" || cout_horaire == " ")
        return "Le cout horaire de ce formateur n'est pas connu dans IMS"
      else
        return `${cout_horaire} * ${nbHeures} = ${nbHeures * parseInt(cout_horaire)}`
    }
  }

  calculMensuel() {
    if (this.formAddFactureMensuel.value.formateur_id && this.formAddFactureMensuel.value.mois) {
      let cout_horaire = this.formateurDic[this.formAddFactureMensuel.value.formateur_id]?.taux_h
      if (!cout_horaire || cout_horaire == "" || cout_horaire == "0" || cout_horaire == " ")
        this.affichageMensuel = "Le cout horaire de ce formateur n'est pas connu dans IMS"
      else
        this.SeanceService.getAllbyFormateur(this.formAddFactureMensuel.value.formateur_id).subscribe(seances => {
          let totalHeure = 0
          seances.forEach(s => {
            let date_debut = new Date(s.date_debut)
            let date_fin = new Date(s.date_fin)
            if (date_debut.getMonth() + 1 == this.formAddFactureMensuel.value.mois) {
              totalHeure += date_fin.getHours() - date_debut.getHours()
              if ((date_fin.getMinutes() == 30 && date_debut.getMinutes() != 30) || (date_fin.getMinutes() != 30 && date_debut.getMinutes() == 30))
                totalHeure = totalHeure + 0.5
            }
          })
          this.affichageMensuel = `${cout_horaire} * ${totalHeure} = ${totalHeure * parseInt(cout_horaire)}`
        })
    }
  }

}
