import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Classe } from 'src/app/models/Classe';
import { ClasseService } from 'src/app/services/classe.service';
import { NoteService } from 'src/app/services/note.service';
import * as html2pdf from 'html2pdf.js';
import { MessageService } from 'primeng/api';
import { ComponentCanDeactivate } from 'src/app/dev-components/guards/pending-changes.guard';
import { Observable, timeout } from 'rxjs';
import { HostListener } from '@angular/core';
import { Table } from 'primeng/table';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-pv-annuel',
  templateUrl: './pv-annuel.component.html',
  styleUrls: ['./pv-annuel.component.scss']
})
export class PvAnnuelComponent implements OnInit, ComponentCanDeactivate {
  dataPVAnnuel = []
  StpFonctionne = {}
  dataPV = {}//semestre:{ prenom: "Morgan", nom: "HUE", date_naissance: "21/12/2000", email: "m.hue@estya.com", notes: { "NomModule": 0, "Python": 20 }, moyenne: "15" }
  cols = {}//semestre:{ module: "NomModule", formateur: "NomFormateur", coeff: 1 }, { module: "Python", formateur: "Anis", coeff: 2 }
  colsAnnuel = []
  dataAnnuel = {}
  ID = this.route.snapshot.paramMap.get('classe_id');
  SEMESTRE = "Annuel";
  SemestreList = []
  classe: Classe;
  hideForPDF = false;
  loaded = false;
  modified = false
  pvAnnuel = {}
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
    this.NoteService.getAllByClasse(this.ID).subscribe(data => {
      data.forEach(c => {
        if (!this.SemestreList.includes(c.semestre))
          this.SemestreList.push(c.semestre)
      })
      this.SemestreList.forEach((semestre, index) => {
        this.NoteService.loadPV(semestre, this.ID).subscribe(data => {
          this.pvAnnuel[semestre] = data
          if (data && data[data.length - 1])
            this.loadPV(data[data.length - 1], semestre)
          else
            this.NoteService.getPVAnnuel(semestre, this.ID).subscribe(data => {
              this.cols[semestre] = data.cols
              this.dataPV[semestre] = data.data
              this.messageService.add({ severity: 'success', summary: `Création du PV de ${semestre} avec succès` })
              data.data.forEach(d => {
                if (!this.StpFonctionne[d.email])
                  this.StpFonctionne[d.email] = {}
                if (!this.StpFonctionne[d.email][semestre])
                  this.StpFonctionne[d.email][semestre] = {}
                if (!this.dataAnnuel[d.email]) {
                  this.dataAnnuel[d.email] = {}
                }
                this.StpFonctionne[d.email][semestre] = d.notes
                if (this.dataInPV(d.email) == -1)
                  this.dataPVAnnuel.push(d)
              })
              setTimeout(() => {
                this.repairBtn()
              }, 2000)
            })
        })

      })
    })
  }

  repairBtn() {
    this.SemestreList.forEach((semestrev2) => {
      this.dataPVAnnuel.forEach((val) => {
        this.cols[semestrev2].forEach(col => {
          if (!this.StpFonctionne[val.email][semestrev2]) {
            this.StpFonctionne[val.email][semestrev2] = {}
          }
          if (!this.StpFonctionne[val.email][semestrev2][col.module]) {
            this.StpFonctionne[val.email][semestrev2][col.module] = 0
          }
          if (!this.dataAnnuel[val.email]) {
            this.dataAnnuel[val.email] = {}
          }
          if (!this.dataAnnuel[val.email][col.module]) {
            this.dataAnnuel[val.email][col.module] = 0
          }
        })
      })

    })
    this.SemestreList.forEach((semestrev2) => {
      this.cols[semestrev2].forEach(col => {
        if (!this.includesDic(col.module, this.colsAnnuel)) {
          this.colsAnnuel.push(col)
        }
      })
    })
    this.dataPVAnnuel.forEach((val) => {
      this.colsAnnuel.forEach(col => {
        let coeff = 0
        let note = 0
        this.SemestreList.forEach(semestrev2 => {
          if (this.StpFonctionne[val.email][semestrev2][col.module] || this.StpFonctionne[val.email][semestrev2][col.module] == 0) {
            note += this.StpFonctionne[val.email][semestrev2][col.module]
            coeff += 1
          }
        })
        if (note != 0 && coeff != 0)
          this.dataAnnuel[val.email][col.module] = note / coeff
        else
          this.dataAnnuel[val.email][col.module] = note
      })
    })
  }

  includesDic(m_nom, arrayDic) {
    let r = false
    arrayDic.forEach(d => {
      if (d.module == m_nom)
        r = true
    })
    return r
  }

  updateAnnuel(mdl, email) {
    let coeff = 0
    let note = 0
    this.SemestreList.forEach(semestrev2 => {
      if ((this.StpFonctionne[email][semestrev2][mdl] && !isNaN(Number(this.StpFonctionne[email][semestrev2][mdl]))) || this.StpFonctionne[email][semestrev2][mdl] == 0) {
        console.log(this.StpFonctionne[email][semestrev2][mdl])
        note += Number(this.StpFonctionne[email][semestrev2][mdl])
        coeff += 1
      }
    })
    console.log(note, coeff)
    if (note != 0 && coeff != 0)
      this.dataAnnuel[email][mdl] = note / coeff
    else
      this.dataAnnuel[email][mdl] = note
  }

  dataInPV(email) {
    let r = -1
    this.dataPVAnnuel.forEach((d2, id) => {
      if (email == d2.email) {
        r = id
      }
    })
    //console.log(r, this.dataPVAnnuel,email)
    return r
  }

  exportPDF() {
    var element = document.getElementById('pvTable');
    var opt = {
      margin: 0,
      filename: 'PV_Annuel_' + this.classe.abbrv + '.pdf',
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

  calculMoyenne(notes, semestre) {
    if (semestre != "Annuel") {
      let dicModuleCoeff = {}
      this.cols[semestre].forEach(col => {
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
    } else {
      let moy_sem1 = this.calculMoyenne(notes['Semestre 1'], 'Semestre 1')
      let moy_sem2 = this.calculMoyenne(notes['Semestre 2'], 'Semestre 2')
      return (moy_sem1 + moy_sem2)/2
    }

  }

  isOdd(number: number) {
    return number % 2 == 0
  }

  totalCoeff(semestre) {
    if (semestre != "Annuel") {
      let r = 0
      this.cols[semestre].forEach(col => {
        r += col.coeff
      })
      return r
    } else {
      let r = 0
      this.colsAnnuel.forEach(col => {
        r += col.coeff
      })
      return r
    }

  }
  avg(myArray) {
    var i = 0, summ = 0, ArrayLen = myArray.length;
    while (i < ArrayLen) {
      summ = summ + myArray[i++];
    }
    return summ / ArrayLen;
  }

  calculAnnuel(notes) {
    let Moy = []
    this.SemestreList.forEach(semestre => {
      let dicModuleCoeff = {}
      this.cols[semestre].forEach(col => {
        dicModuleCoeff[col.module] = col.coeff
      })

      var i = 0, summ = 0, ArrayDic = Object.keys(notes[semestre]), ArrayLen = ArrayDic.length, coeffTotal = 0;
      while (i < ArrayLen) {
        if (!Number.isNaN(notes[semestre][ArrayDic[i]])) {
          summ = summ + (notes[semestre][ArrayDic[i]]) * dicModuleCoeff[ArrayDic[i]];
          coeffTotal += dicModuleCoeff[ArrayDic[i]]
        }
        i++;
      }
      Moy.push(summ / coeffTotal)
    })
    return this.avg(Moy)
  }

  savePv() {
    //Save le PV de chaque Semestre
    this.SemestreList.forEach(semestre => {
      this.dataPVAnnuel.forEach((val) => {
        this.cols[semestre].forEach(col => {
          this.dataPV[semestre].forEach((d, idx) => {
            this.dataPV[semestre][idx]["notes"][col.module] = this.StpFonctionne[d.email][semestre][col.module]
          })
        })
      })
      this.NoteService.savePV(semestre, this.ID, { cols: this.cols[semestre], data: this.dataPV[semestre] }).subscribe(data => {
        if (data) {
          this.modified = false
          this.messageService.add({ severity: 'success', summary: `Sauvegarde du PV de ${semestre} avec succès` })
          this.pvAnnuel[semestre].push(data)
        }
      })
    })
  }
  loadPV(pv, semestre) {
    if (!this.modified || (this.modified && confirm("Des modifications ne sont pas enregistrés, Voulez-vous quand même charger ce PV ?"))) {
      this.cols[semestre] = pv.pv_annuel_cols
      this.dataPV[semestre] = pv.pv_annuel_data
      pv.pv_annuel_data.forEach(d => {
        if (!this.StpFonctionne[d.email])
          this.StpFonctionne[d.email] = {}
        if (!this.StpFonctionne[d.email][semestre])
          this.StpFonctionne[d.email][semestre] = {}
        if (!this.dataAnnuel[d.email]) {
          this.dataAnnuel[d.email] = {}
        }
        this.StpFonctionne[d.email][semestre] = d.notes
        if (this.dataInPV(d.email) == -1)
          this.dataPVAnnuel.push(d)
      })
      this.PVID = pv._id
      setTimeout(() => {
        this.repairBtn()
      }, 2000)
      this.messageService.add({ severity: 'success', summary: `Chargement du ${semestre} PV avec succès` })
    }
  }

  exportExcel() {
    let dataExcel = []
    this.dataPVAnnuel.forEach(data => {
      let t = {}
      t['ID Etudiant'] = data.custom_id
      t['NOM'] = data.nom
      t['Prenom'] = data.nom
      t['Date de Naissance'] = data.date_naissance
      t['Date Inscrit'] = data.date_inscrit
      t['Email'] = data.email

      dataExcel.push(t)
    })
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, "etudiants" + '_export_' + new Date().toLocaleDateString("fr-FR") + ".xlsx");

  }

}
