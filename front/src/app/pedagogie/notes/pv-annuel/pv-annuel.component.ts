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
  ID = this.route.snapshot.paramMap.get('classe_id');
  SEMESTRE = "Annuel";
  SemestreList = []
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
    this.NoteService.getAllByClasse(this.ID).subscribe(data => {
      data.forEach(c => {
        if (!this.SemestreList.includes(c.semestre))
          this.SemestreList.push(c.semestre)
      })
      this.SemestreList.forEach((semestre, index) => {
        this.NoteService.getPVAnnuel(semestre, this.ID).subscribe(data => {
          this.cols[semestre] = data.cols
          this.dataPV[semestre] = data.data
          data.data.forEach(d => {
            if (!this.StpFonctionne[d.email])
              this.StpFonctionne[d.email] = {}
            if (!this.StpFonctionne[d.email][semestre])
              this.StpFonctionne[d.email][semestre] = {}
            this.StpFonctionne[d.email][semestre] = d.notes
            if (this.dataInPV(d.email) == -1)
              this.dataPVAnnuel.push(d)
          })
        })
      })
      setTimeout(() => {
        this.SemestreList.forEach((semestrev2) => {
          this.dataPVAnnuel.forEach((val) => {
            this.cols[semestrev2].forEach(col => {
              if (!this.StpFonctionne[val.email][semestrev2]) {
                this.StpFonctionne[val.email][semestrev2] = {}
              }
              if (!this.StpFonctionne[val.email][semestrev2][col.module]) {
                this.StpFonctionne[val.email][semestrev2][col.module] = 0
              }
            })

          })
        })
      }, 1000)
    })
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
  }

  isOdd(number: number) {
    return number % 2 == 0
  }

  totalCoeff(semestre) {
    let r = 0
    this.cols[semestre].forEach(col => {
      r += col.coeff
    })
    return r
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

}
