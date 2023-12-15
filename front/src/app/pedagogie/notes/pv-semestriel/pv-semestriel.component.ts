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
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-pv-semestriel',
  templateUrl: './pv-semestriel.component.html',
  styleUrls: ['./pv-semestriel.component.scss']
})
export class PvSemestrielComponent implements OnInit, ComponentCanDeactivate {

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
    this.NoteService.loadPV(this.SEMESTRE, this.ID).subscribe(data => {
      this.pvAnnuel = data
      if (data && data[data.length - 1]) {
        this.loadPV(data[data.length - 1])
      } else
        this.NoteService.getPVAnnuel(this.SEMESTRE, this.ID).subscribe(dataNew => {
          this.cols = dataNew.cols
          this.dataPV = dataNew.data
          this.dataPV.forEach((data, index) => {
            if ((!data.appreciation || data.appreciation == "" || data.appreciation == "Doit faire ses preuves" || data.appreciation == "Passable" || data.appreciation == "Assez Bien" || data.appreciation == "Bien" || data.appreciation == "Très Bien" || data.appreciation == "Excellent")) {
              let note = this.calculMoyenne(data.notes)
              if (note < 10)
                data.appreciation = "Doit faire ses preuves"
              else if ((note > 10 && note < 12) || note == 10)
                data.appreciation = "Passable"
              else if ((note > 12 && note < 14) || note == 12)
                data.appreciation = "Assez Bien"
              else if ((note > 14 && note < 16) || note == 14)
                data.appreciation = "Bien"
              else if ((note > 16 && note < 18) || note == 16)
                data.appreciation = "Très Bien"
              else if (note > 18 || note == 18)
                data.appreciation = "Excellent"
              else
                data.appreciation = ""
              this.dataPV[index] = data
            }
          })
          this.messageService.add({ severity: 'success', summary: "Création d'un nouveau PV" })
        })
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
          this.messageService.add({ severity: 'success', summary: "Suppression du PV avec succès" })
          this.pvAnnuel.splice(this.pvAnnuel.indexOf(pv, 0))
        }
      })
  }

  loadPV(pv) {
    if (!this.modified || (this.modified && confirm("Des modifications ne sont pas enregistrés, Voulez-vous quand même charger ce PV ?"))) {
      this.cols = pv.pv_annuel_cols
      this.dataPV = pv.pv_annuel_data
      this.PVID = pv._id
      this.dataPV.forEach((data, index) => {
        if ((!data.appreciation || data.appreciation == "" || data.appreciation == "Doit faire ses preuves" || data.appreciation == "Passable" || data.appreciation == "Assez Bien" || data.appreciation == "Bien" || data.appreciation == "Très Bien" || data.appreciation == "Excellent")) {
          let note = this.calculMoyenne(data.notes)
          if (note < 10)
            data.appreciation = "Doit faire ses preuves"
          else if ((note > 10 && note < 12) || note == 10)
            data.appreciation = "Passable"
          else if ((note > 12 && note < 14) || note == 12)
            data.appreciation = "Assez Bien"
          else if ((note > 14 && note < 16) || note == 14)
            data.appreciation = "Bien"
          else if ((note > 16 && note < 18) || note == 16)
            data.appreciation = "Très Bien"
          else if (note > 18 || note == 18)
            data.appreciation = "Excellent"
          else
            data.appreciation = ""
          this.dataPV[index] = data
        }
      })
      this.messageService.add({ severity: 'success', summary: "Chargement du PV avec succès" })
    }
  }

  regeneratePV() {
    this.NoteService.getPVAnnuel(this.SEMESTRE, this.ID).subscribe(dataNew => {
      this.cols = dataNew.cols
      this.dataPV = dataNew.data
      this.dataPV.forEach((data, index) => {
        if ((!data.appreciation || data.appreciation == "" || data.appreciation == "Doit faire ses preuves" || data.appreciation == "Passable" || data.appreciation == "Assez Bien" || data.appreciation == "Bien" || data.appreciation == "Très Bien" || data.appreciation == "Excellent")) {
          let note = this.calculMoyenne(data.notes)
          if (note < 10)
            data.appreciation = "Doit faire ses preuves"
          else if ((note > 10 && note < 12) || note == 10)
            data.appreciation = "Passable"
          else if ((note > 12 && note < 14) || note == 12)
            data.appreciation = "Assez Bien"
          else if ((note > 14 && note < 16) || note == 14)
            data.appreciation = "Bien"
          else if ((note > 16 && note < 18) || note == 16)
            data.appreciation = "Très Bien"
          else if (note > 18 || note == 18)
            data.appreciation = "Excellent"
          else
            data.appreciation = ""
          this.dataPV[index] = data
        }
      })
      this.messageService.add({ severity: 'success', summary: "Création d'un nouveau PV" })
    })
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

  totalCoeff() {
    let r = 0
    this.cols.forEach(col => {
      r += col.coeff
    })
    return r
  }

  exportExcel() {
    let dataExcel = []
    this.dataPV.forEach(data => {
      let t = {}
      t['ID Etudiant'] = data.custom_id
      t['NOM'] = data.nom
      t['Prenom'] = data.nom
      t['Date de Naissance'] = data.date_naissance
      t['Date Inscrit'] = data.date_inscrit
      t['Email'] = data.email
      this.cols.forEach(col => {
        t[col.module] = data.notes[col.module]
      })
      t['Moyenne'] = this.calculMoyenne(data.notes)
      t['Appréciations'] = data.appreciation
      dataExcel.push(t)
    })
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, `pv_${this.SEMESTRE}_${this.classe.abbrv}_export_${new Date().toLocaleDateString("fr-FR")}.xlsx`);

  }

  showRenamePV = null

  initRenamePV(pv) {
    this.showRenamePV = pv
  }
  onRenamePV() {
    this.NoteService.replacePV(this.showRenamePV._id, { nom: this.showRenamePV.nom }).subscribe(data => {
      this.showRenamePV = null
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
