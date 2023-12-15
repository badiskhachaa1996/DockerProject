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
  selector: 'app-pv-appreciation',
  templateUrl: './pv-appreciation.component.html',
  styleUrls: ['./pv-appreciation.component.scss']
})
export class PvAppreciationComponent implements OnInit {
  dataPV = []//{ prenom: "Morgan", nom: "HUE", date_naissance: "21/12/2000", email: "m.hue@estya.com", notes: { "NomModule": 0, "Python": 20 }, moyenne: "15", appreciation_module:{} }
  cols = []//{ module: "NomModule", formateur: "NomFormateur", coeff: 1 }, { module: "Python", formateur: "Anis", coeff: 2 }
  ID = this.route.snapshot.paramMap.get('classe_id');
  SEMESTRE = this.route.snapshot.paramMap.get('semestre');
  PVID = "Nouveau"
  classe: Classe;
  hideForPDF = false;
  loaded = false;
  modified = false
  pvAnnuel = []
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
        this.NoteService.getPVAnnuel(this.SEMESTRE, this.ID).subscribe(data => {
          this.cols = data.cols
          this.dataPV = data.data
          this.messageService.add({ severity: 'success', summary: "Création d'un nouveau PV avec succès" })
          this.dataPV.forEach((d, index) => {
            if (!d.appreciation_module) {
              d.appreciation_module = {}
            }
            this.cols.forEach(col => {
              //console.log((!d.appreciation_module[col.module] || d.appreciation_module[col.module] == ""),(d.notes[col.module] ||d.notes[col.module]==0),col.module)
              if ((!d.appreciation_module[col.module] || d.appreciation_module[col.module] == "" || d.appreciation_module[col.module] == "Doit faire ses preuves" || d.appreciation_module[col.module] == "Passable" || d.appreciation_module[col.module] == "Assez Bien" || d.appreciation_module[col.module] == "Bien" || d.appreciation_module[col.module] == "Très Bien" || d.appreciation_module[col.module] == "Excellent") && (d.notes[col.module] || d.notes[col.module] == 0)) {
                let note = parseInt(d.notes[col.module])
                //console.log(note)
                if (note < 10)
                  d.appreciation_module[col.module] = "Doit faire ses preuves"
                else if (note > 10 && note < 12 || note == 10)
                  d.appreciation_module[col.module] = "Passable"
                else if (note > 12 && note < 14 || note == 12)
                  d.appreciation_module[col.module] = "Assez Bien"
                else if (note > 14 && note < 16 || note == 14)
                  d.appreciation_module[col.module] = "Bien"
                else if (note > 16 && note < 18 || note == 16)
                  d.appreciation_module[col.module] = "Très Bien"
                else if (note > 18 || note == 18)
                  d.appreciation_module[col.module] = "Excellent"
                else
                  d.appreciation_module[col.module] = ""
              }

            })
            this.dataPV[index] = d
          })
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
      pv.pv_annuel_data.forEach((d, index) => {
        if (!d.appreciation_module) {
          d.appreciation_module = {}
        }
        pv.pv_annuel_cols.forEach(col => {
          if ((!d.appreciation_module[col.module] || d.appreciation_module[col.module] == "" || d.appreciation_module[col.module] == "Doit faire ses preuves" || d.appreciation_module[col.module] == "Passable" || d.appreciation_module[col.module] == "Assez Bien" || d.appreciation_module[col.module] == "Bien" || d.appreciation_module[col.module] == "Très Bien" || d.appreciation_module[col.module] == "Excellent") && (d.notes[col.module] || d.notes[col.module] == 0)) {
            let note = parseInt(d.notes[col.module])
            if (note < 10)
              d.appreciation_module[col.module] = "Doit faire ses preuves"
            else if ((note > 10 && note < 12) || note == 10)
              d.appreciation_module[col.module] = "Passable"
            else if ((note > 12 && note < 14) || note == 12)
              d.appreciation_module[col.module] = "Assez Bien"
            else if ((note > 14 && note < 16) || note == 14)
              d.appreciation_module[col.module] = "Bien"
            else if ((note > 16 && note < 18) || note == 16)
              d.appreciation_module[col.module] = "Très Bien"
            else if (note > 18 || note == 18)
              d.appreciation_module[col.module] = "Excellent"
            else
              d.appreciation_module[col.module] = ""
          }
        })
        pv.pv_annuel_data[index] = d
      })

      this.PVID = pv._id
      this.cols = pv.pv_annuel_cols
      this.dataPV = pv.pv_annuel_data
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


  regeneratePV() {
    this.NoteService.getPVAnnuel(this.SEMESTRE, this.ID).subscribe(data => {
      this.cols = data.cols
      this.dataPV = data.data
      this.messageService.add({ severity: 'success', summary: "Création d'un nouveau PV avec succès" })
      this.dataPV.forEach((d, index) => {
        if (!d.appreciation_module) {
          d.appreciation_module = {}
        }
        this.cols.forEach(col => {
          //console.log((!d.appreciation_module[col.module] || d.appreciation_module[col.module] == ""),(d.notes[col.module] ||d.notes[col.module]==0),col.module)
          if ((!d.appreciation_module[col.module] || d.appreciation_module[col.module] == "" || d.appreciation_module[col.module] == "Doit faire ses preuves" || d.appreciation_module[col.module] == "Passable" || d.appreciation_module[col.module] == "Assez Bien" || d.appreciation_module[col.module] == "Bien" || d.appreciation_module[col.module] == "Très Bien" || d.appreciation_module[col.module] == "Excellent") && (d.notes[col.module] || d.notes[col.module] == 0)) {
            let note = parseInt(d.notes[col.module])
            //console.log(note)
            if (note < 10)
              d.appreciation_module[col.module] = "Doit faire ses preuves"
            else if (note > 10 && note < 12 || note == 10)
              d.appreciation_module[col.module] = "Passable"
            else if (note > 12 && note < 14 || note == 12)
              d.appreciation_module[col.module] = "Assez Bien"
            else if (note > 14 && note < 16 || note == 14)
              d.appreciation_module[col.module] = "Bien"
            else if (note > 16 && note < 18 || note == 16)
              d.appreciation_module[col.module] = "Très Bien"
            else if (note > 18 || note == 18)
              d.appreciation_module[col.module] = "Excellent"
            else
              d.appreciation_module[col.module] = ""
          }

        })
        this.dataPV[index] = d
      })
    })
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
