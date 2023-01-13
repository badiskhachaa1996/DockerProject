import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Classe } from 'src/app/models/Classe';
import { ClasseService } from 'src/app/services/classe.service';
import { NoteService } from 'src/app/services/note.service';
import * as html2pdf from 'html2pdf.js';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-pv-annuel',
  templateUrl: './pv-annuel.component.html',
  styleUrls: ['./pv-annuel.component.scss']
})
export class PvAnnuelComponent implements OnInit {

  dataPV = []//{ prenom: "Morgan", nom: "HUE", date_naissance: "21/12/2000", email: "m.hue@estya.com", notes: { "NomModule": 0, "Python": 20 }, moyenne: "15" }
  cols = []//{ module: "NomModule", formateur: "NomFormateur", coeff: 1 }, { module: "Python", formateur: "Anis", coeff: 2 }
  ID = this.route.snapshot.paramMap.get('classe_id');
  SEMESTRE = this.route.snapshot.paramMap.get('semestre');
  classe: Classe;
  hideForPDF = false;
  loaded = false;
  constructor(private NoteService: NoteService, private route: ActivatedRoute, private GroupeService: ClasseService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.GroupeService.getPopulate(this.ID).subscribe(c => {
      this.classe = c
    })
    this.NoteService.loadPV(this.SEMESTRE, this.ID).subscribe(data => {
      if (data && confirm('Un PV a été sauvegardé, Voulez-vous le chargez ?')) {
        this.cols = data.pv_annuel_cols
        this.dataPV = data.pv_annuel_data
        this.loaded = true
      } else {
        this.NoteService.getPVAnnuel(this.SEMESTRE, this.ID).subscribe(data => {
          this.cols = data.cols
          this.dataPV = data.data
        })
      }
    })
  }

  savePv() {
    if (!this.loaded || (this.loaded && confirm("Un PV est déjà enregisté, Voulez-vous écraser l'ancien par celui-ci ?")))
      this.NoteService.savePV(this.SEMESTRE, this.ID, { cols: this.cols, data: this.dataPV }).subscribe(data => {
        if (data)
          this.messageService.add({ severity: 'success', summary: "Sauvegarde du PV avec succès" })
      })
  }

  exportPDF() {
    var element = document.getElementById('dt1');
    var opt = {
      margin: 0,
      filename: 'PV_' + this.SEMESTRE + '_' + this.classe.abbrv + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'cm', format: 'a3', orientation: 'l' }
    };
    this.hideForPDF = true
    html2pdf().set(opt).from(element).save().then(() => {
      this.hideForPDF = false
    });
  }

  calculMoyenne(notes, index) {
    let dicModuleCoeff = {}
    this.cols.forEach(col => {
      dicModuleCoeff[col.module] = col.coeff
    })
    var i = 0, summ = 0, ArrayDic = Object.keys(notes), ArrayLen = ArrayDic.length, coeffTotal = 0;
    while (i < ArrayLen) {
      if (!Number.isNaN(notes[ArrayDic[i]])) {
        summ = summ + (notes[ArrayDic[i]]) * dicModuleCoeff[ArrayDic[i]];
        coeffTotal += dicModuleCoeff[ArrayDic[i]]
      }
      i++;
    }
    return summ / coeffTotal;
  }
}
