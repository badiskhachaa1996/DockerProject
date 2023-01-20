import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Classe } from 'src/app/models/Classe';
import { ClasseService } from 'src/app/services/classe.service';
import { NoteService } from 'src/app/services/note.service';
import * as html2pdf from 'html2pdf.js';
import { MessageService } from 'primeng/api';
import { ComponentCanDeactivate } from 'src/app/dev-components/guards/pending-changes.guard';
import { Observable } from 'rxjs';
import { HostListener } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-pv-annuel',
  templateUrl: './pv-annuel.component.html',
  styleUrls: ['./pv-annuel.component.scss']
})
export class PvAnnuelComponent implements OnInit, ComponentCanDeactivate {

  dataPV = []//{ prenom: "Morgan", nom: "HUE", date_naissance: "21/12/2000", email: "m.hue@estya.com", notes: { "NomModule": 0, "Python": 20 }, moyenne: "15" }
  cols = []//{ module: "NomModule", formateur: "NomFormateur", coeff: 1 }, { module: "Python", formateur: "Anis", coeff: 2 }
  ID = this.route.snapshot.paramMap.get('classe_id');
  SEMESTRE = this.route.snapshot.paramMap.get('semestre');
  classe: Classe;
  hideForPDF = false;
  loaded = false;
  modified = false
  pvAnnuel = []
  PVID = "Nouveau"
  @ViewChild('dt1') pTableRef: Table;
  constructor(private NoteService: NoteService, private route: ActivatedRoute, private GroupeService: ClasseService, private messageService: MessageService) { }
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.modified
  }

  ngAfterViewInit() {
    const table = this.pTableRef.el.nativeElement.querySelector('table');
    table.setAttribute('id', 'pvTable');
  }

  ngOnInit(): void {
    this.GroupeService.getPopulate(this.ID).subscribe(c => {
      this.classe = c
    })
    this.NoteService.getPVAnnuel(this.SEMESTRE, this.ID).subscribe(data => {
      this.cols = data.cols
      this.dataPV = data.data
    })
    this.NoteService.loadPV(this.SEMESTRE, this.ID).subscribe(data => {
      this.pvAnnuel = data
    })
  }

  savePv() {
    this.NoteService.savePV(this.SEMESTRE, this.ID, { cols: this.cols, data: this.dataPV }).subscribe(data => {
      if (data) {
        this.modified = false
        this.messageService.add({ severity: 'success', summary: "Sauvegarde du PV avec succès" })
        this.pvAnnuel.push(data)
      }
    })
  }

  delete(pv) {
    if (confirm("Etes-vous sûr de vouloir supprimer ce pv ?"))
      this.NoteService.deletePV(pv._id).subscribe(data => {
        if (data) {
          this.messageService.add({ severity: 'success', summary: "Suppresion du PV avec succès" })
          this.pvAnnuel.splice(this.pvAnnuel.indexOf(pv, 0))
        }
      })
  }

  loadPV(pv) {
    if (!this.modified || (this.modified && confirm("Des modifications ne sont pas enregistrés, Voulez-vous quand même charger ce PV ?"))) {
      this.cols = pv.pv_annuel_cols
      this.dataPV = pv.pv_annuel_data
      this.PVID = pv._id
      this.messageService.add({ severity: 'success', summary: "Chargement du PV avec succès" })
    }
  }

  exportPDF() {
    var element = document.getElementById('pvTable');
    let height = 400
    let width = 800
    width += this.cols.length * 100
    var opt = {
      margin: 0,
      filename: 'PV_' + this.SEMESTRE + '_' + this.classe.abbrv + '.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'px', format: [element.offsetWidth, element.offsetHeight], orientation: 'l', hotfixes: ['px_scaling'] }
    };
    this.hideForPDF = true
    html2pdf().set(opt).from(element).save().then(() => {
      this.hideForPDF = false
      //element.style.transform = '';
    });
  }

  calculMoyenne(notes) {
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

  isOdd(number: number) {
    return number % 2 == 0
  }
}
