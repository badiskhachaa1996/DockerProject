import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Classe } from 'src/app/models/Classe';
import { ClasseService } from 'src/app/services/classe.service';
import { NoteService } from 'src/app/services/note.service';
import * as html2pdf from 'html2pdf.js';
import { ExamenService } from 'src/app/services/examen.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-appreciation-input',
  templateUrl: './appreciation-input.component.html',
  styleUrls: ['./appreciation-input.component.scss']
})
export class AppreciationInputComponent implements OnInit {
  dataPV = []//{ prenom: "Morgan", nom: "HUE", date_naissance: "21/12/2000", email: "m.hue@estya.com", notes: { "NomModule": 0, "Python": 20 }, moyenne: "15" }
  cols = []//{ module: "NomModule", formateur: "NomFormateur", coeff: 1 }, { module: "Python", formateur: "Anis", coeff: 2 }
  colsExamen;
  dataExamen;
  ID = this.route.snapshot.paramMap.get('classe_id');
  CLASSES_ID = []
  FORMATEUR_ID = this.route.snapshot.paramMap.get('formateur_id');
  SEMESTRE = this.route.snapshot.paramMap.get('semestre');
  classe: Classe;
  hideForPDF = false;
  loaded = false;
  modified = false
  pvAnnuel = []
  PVLOADED: any = "Nouveau"
  @ViewChild('dt1') pTableRef: Table;
  constructor(private NoteService: NoteService, private route: ActivatedRoute, private GroupeService: ClasseService, private messageService: MessageService,
    private ExamenService: ExamenService) { }
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return !this.modified
  }

  ngAfterViewInit() {
    /*
    const table = this.pTableRef.el.nativeElement.querySelector('table');
    table.setAttribute('id', 'pvTable');
    */
  }

  ngOnInit(): void {
    this.ID = this.ID.replace(',', '')
    this.CLASSES_ID = this.ID.split(',')
    this.ID = this.ID.split(',')[0]
    this.GroupeService.getPopulate(this.ID).subscribe(c => {
      this.classe = c
    })
    this.NoteService.getLastPVAnnuel(this.SEMESTRE, this.ID).subscribe(pv => {
      if (pv) {
        pv.pv_annuel_data.forEach((d, index) => {
          if (!d.appreciation_module) {
            d.appreciation_module = {}
          }
          pv.pv_annuel_cols.forEach(col_m => {
            if (!d.appreciation_module[col_m.module])
              d.appreciation_module[col_m.module] = ""
          })
          pv.pv_annuel_data[index] = d
        })
        this.cols = pv.pv_annuel_cols
        this.dataPV = pv.pv_annuel_data
        this.PVLOADED = pv
        this.messageService.add({ severity: 'success', summary: "Chargement du PV avec succès" })
      } else {
        this.NoteService.getPVAnnuel(this.SEMESTRE, this.ID).subscribe(data => {
          this.cols = data.cols
          this.dataPV = data.data
          this.dataPV.forEach((d, index) => {
            if (!d.appreciation_module) {
              d.appreciation_module = {}
            }
            this.cols.forEach(col_m => {
              if (!d.appreciation_module[col_m.module])
                d.appreciation_module[col_m.module] = ""
            })
            this.dataPV[index] = d
          })
        })
      }
    })

    this.NoteService.loadPV(this.SEMESTRE, this.ID).subscribe(data => {
      this.pvAnnuel = data
    })
    this.ExamenService.getAppreciation(this.SEMESTRE, this.ID, this.FORMATEUR_ID).subscribe(data => {
      this.colsExamen = data.cols
      this.dataExamen = data.data
      console.log(data)
    })
  }

  savePv() {
    if (this.PVLOADED == "Nouveau")
      this.NoteService.savePV(this.SEMESTRE, this.ID, { cols: this.cols, data: this.dataPV }).subscribe(data => {
        if (data) {
          this.modified = false
          this.messageService.add({ severity: 'success', summary: "Sauvegarde du PV avec succès" })
          this.pvAnnuel.push(data)
        }
      })
    else {
      this.PVLOADED.pv_annuel_data = this.dataPV
      this.PVLOADED.pv_annuel_cols = this.cols
      this.NoteService.replacePV(this.PVLOADED._id, this.PVLOADED).subscribe(data => {
        this.modified = false
        this.messageService.add({ severity: 'success', summary: "Sauvegarde du PV avec succès" })
      })
    }

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
        this.colsExamen.module.forEach(col_m => {
          if (!d.appreciation_module[col_m])
            d.appreciation_module[col_m] = ""
        })
        pv.pv_annuel_data[index] = d
      })
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

  libelleCleaner(libelle: string) {
    if (libelle.lastIndexOf('|') != -1) {
      return libelle.slice(libelle.lastIndexOf('|') + 2)
    }
    return libelle
  }

  isNaN(note){
    return isNaN(note)
  }

}
