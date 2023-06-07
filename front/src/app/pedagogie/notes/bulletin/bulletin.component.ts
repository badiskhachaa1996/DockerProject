import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Classe } from 'src/app/models/Classe';
import { ClasseService } from 'src/app/services/classe.service';
import { EcoleService } from 'src/app/services/ecole.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { NoteService } from 'src/app/services/note.service';
import * as html2pdf from 'html2pdf.js';
import { MessageService } from 'primeng/api';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-bulletin',
  templateUrl: './bulletin.component.html',
  styleUrls: ['./bulletin.component.scss']
})
export class BulletinComponent implements OnInit {
  constructor(private GroupeService: ClasseService, private NoteS: NoteService, private EtuService: EtudiantService,
    private CFAService: EcoleService, private messageService: MessageService, private sanitizer: DomSanitizer, private route: ActivatedRoute) { }
  //:semestre/:classe_id/:etudiant_id/:pv_id
  ngOnInit(): void {
    this.GroupeService.getAll().subscribe(classes => {
      classes.forEach(c => {
        this.dropdownClasse.push({ label: c.abbrv, value: c._id })
      })
    })
    if (this.route.snapshot.paramMap.get('semestre') && this.route.snapshot.paramMap.get('semestre') == "Annuel")
      this.NoteS.getAllByClasse(this.route.snapshot.paramMap.get('classe_id')).subscribe(data => {
        data.forEach(c => {
          if (!this.SemestreList.includes(c.semestre))
            this.SemestreList.push(c.semestre)
        })
        this.SemestreList = this.SemestreList.sort()
        this.SEMESTRE = this.SemestreList[this.SemestreList.length - 1]
        this.semestreLoader()
      })
    else if (this.route.snapshot.paramMap.get('semestre')) {
      this.SEMESTRE = this.route.snapshot.paramMap.get('semestre')
      this.semestreLoader()
    }

  }

  semestreLoader() {
    this.askGroupeSemestrePV = false
    this.GroupeService.getPopulate(this.route.snapshot.paramMap.get('classe_id')).subscribe(classe => {
      this.GROUPE = classe
      //getAllByClasseID serait mieux
      this.EtuService.getAll().subscribe(etudiants => {
        this.etudiantFromClasse = etudiants
        this.etudiantFromClasse.forEach(etudiant => {
          if (etudiant.custom_id == this.route.snapshot.paramMap.get('etudiant_id')) {
            console.log(etudiant)
            if (this.route.snapshot.paramMap.get('pv_id') != "Nouveau") {
              if (this.route.snapshot.paramMap.get('classe_id') && this.SEMESTRE) {
                this.NoteS.loadPV(this.SEMESTRE, this.route.snapshot.paramMap.get('classe_id')).subscribe(pv => {
                  pv.forEach(pvD => {
                    if (pvD._id == this.route.snapshot.paramMap.get('pv_id')) {
                      this.PV = pvD
                      this.configureBulletin(etudiant)
                    }
                  })
                })
              }
            } else {
              this.formAGSPV.patchValue({ pv: "Aucun/Nouveau PV" })
              this.configureBulletin(etudiant)
            }
          }
        })
      })
      if (classe.abbrv.includes('1'))
        this.exInfoDiplome = "1er année 2022-2023"
      else if (classe.abbrv.includes('2'))
        this.exInfoDiplome = "2ème année 2022-2023"
      else
        this.exInfoDiplome = "2022-2023"
    })
  }

  //Formulaire: Générer un bulletin de note
  askGroupeSemestrePV = true
  dropdownClasse = []
  dropdownSemestre = [{ label: "Annuel", value: "Annuel" }, { label: "Semestre 1", value: "Semestre 1" }, { label: "Semestre 2", value: "Semestre 2" }]
  dropdownPV: any = [{ value: "Aucun/Nouveau PV", label: "Aucun/Nouveau PV" }]
  formAGSPV: FormGroup = new FormGroup({
    classe: new FormControl('', Validators.required),
    semestre: new FormControl('', Validators.required),
    pv: new FormControl('', Validators.required),
  })
  exInfoDiplome = "2022-2023"// 1er année 2022-2023

  updateDropdownPV() {
    this.dropdownPV = [{ value: "Aucun/Nouveau PV", label: "Aucun/Nouveau PV" }]
    if (this.formAGSPV.value.classe && this.formAGSPV.value.semestre) {
      this.NoteS.loadPV(this.formAGSPV.value.semestre, this.formAGSPV.value.classe).subscribe(pv => {
        pv.forEach(pvD => {
          this.dropdownPV.push({ value: pvD, label: "PV du " + new Date(pvD.date_creation).toLocaleString('fr-FR').toString() })
        })
      })
    }
  }

  onGenerateClasse() {
    //Afficher la liste des étudiants
    this.askGroupeSemestrePV = false
    this.showGroupe = true
    this.SEMESTRE = this.formAGSPV.value.semestre
    this.GroupeService.getPopulate(this.formAGSPV.value.classe).subscribe(classe => { this.GROUPE = classe })
    this.EtuService.getAllByClasseId(this.formAGSPV.value.classe).subscribe(etudiants => { this.etudiantFromClasse = etudiants })
    if (this.formAGSPV.value.pv != "Aucun/Nouveau PV") { this.PV = this.formAGSPV.value.pv }
  }

  //Tableau: Bulletin de
  showGroupe = false
  GROUPE: Classe = null
  SEMESTRE = ""
  etudiantFromClasse = []

  loadEcoleImage() {
    this.PICTURE = { cachet: 'assets/images/service-administratif.png', logo: "assets/images/logo-estya-flag.png", pied_de_page: "assets/images/footer-bulletinv2.png" }
    this.CFAService.downloadCachet(this.ECOLE._id).subscribe(blob => {
      let objectURL = URL.createObjectURL(blob);
      this.PICTURE.cachet = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    })
    this.CFAService.downloadLogo(this.ECOLE._id).subscribe(blob => {
      let objectURL = URL.createObjectURL(blob);
      this.PICTURE.logo = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    })
    this.CFAService.downloadPied(this.ECOLE._id).subscribe(blob => {
      let objectURL = URL.createObjectURL(blob);
      this.PICTURE.pied_de_page = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    })
  }

  SemestreList = []
  dicSemestreMoy = {}

  configureBulletin(etu) {
    this.dropdownEcoles = []
    this.ETUDIANT = etu
    this.CFAService.getAll().subscribe(ecoles => {
      ecoles.forEach(ecol => {
        if (ecol == etu.ecole_id)
          this.ECOLE = ecol
        this.dropdownEcoles.push({ value: ecol, label: ecol.libelle })
      })
      if (!this.ECOLE) { this.ECOLE = this.dropdownEcoles[0].value }
      this.loadEcoleImage()
    })

    if (this.formAGSPV.value.pv == "Aucun/Nouveau PV") {
      this.NoteS.getPVAnnuel(this.SEMESTRE, this.GROUPE._id, "Bulletin").subscribe(pv => {
        this.PV = { date_creation: new Date(), semestre: this.SEMESTRE, classe_id: this.GROUPE._id, pv_annuel_data: pv.data, pv_annuel_cols: pv.cols }
        this.generateBulletin()
      })
    } else {
      this.generateBulletin()
    }
    if (this.route.snapshot.paramMap.get('semestre') == "Annuel")
      this.SemestreList.forEach((semestre, index) => {
        this.NoteS.getPVAnnuel(semestre, this.GROUPE._id).subscribe(data => {
          //this.cols[semestre] = data.cols
          data.data.forEach(d => {
            if (d.custom_id == this.ETUDIANT.custom_id) {

              let dicModuleCoeff = {}
              data.cols.forEach(col => {
                dicModuleCoeff[col.module] = col.coeff
              })

              var i = 0, summ = 0, ArrayDic = Object.keys(d.notes), ArrayLen = ArrayDic.length, coeffTotal = 0;
              while (i < ArrayLen) {
                if (!Number.isNaN(d.notes[ArrayDic[i]])) {
                  summ = summ + (d.notes[ArrayDic[i]]) * dicModuleCoeff[ArrayDic[i]];
                  coeffTotal += dicModuleCoeff[ArrayDic[i]]
                }
                i++;
              }
              this.dicSemestreMoy[semestre] = summ / coeffTotal
              let moy = 0
              this.SemestreList.forEach(v => {
                console.log(this.dicSemestreMoy[v])
                moy += this.dicSemestreMoy[v]
              })
              this.dicSemestreMoy['Annuel'] = moy / this.SemestreList.length

            }
          })
          this.showAnnuel = true
        })
      })
  }

  //Bulletin PDF
  PV;
  ECOLE;
  dropdownEcoles = []
  ETUDIANT;
  genderMap: any = { 'Monsieur': 'Mr.', 'Madame': 'Mme.', undefined: '', 'other': 'Mel.' };
  NOTES;// {module:"",formateur:"",coeff:0 note_etudiant:"",note_moy_groupe:0,note_min_groupe:0,note_max_groupe:0,ects:0,appreciation_module:""}
  APPRECIATION_GENERALE = ""
  MOYENNE = {} //{ 'module': { moy: 0, min: 0, max: 0 } }
  PICTURE; //= { logo: "assets/images/logo-estya-flag.png", cachet: "assets/images/service-administratif.png", pied_de_page: "assets/images/footer-bulletinv2.png" }

  calculMoyenne() {
    var i = 0, summ = 0, ArrayLen = this.NOTES.length, coeffTotal = 0;
    while (i < ArrayLen) {
      if (!isNaN(Number(this.NOTES[i].note_etudiant))) {
        summ = summ + (this.NOTES[i].note_etudiant) * this.NOTES[i].coeff;
        coeffTotal += this.NOTES[i].coeff
      }
      i++;
    }
    return summ / coeffTotal;
  }

  generateBulletin() {
    let dicFormateur = {}
    let dicCoeff = {}
    let listModule = []
    if (this.PV) {
      this.NOTES = []
      this.PV.pv_annuel_cols.forEach(col => {
        dicFormateur[col.module] = col.formateur
        dicCoeff[col.module] = col.coeff
        listModule.push(col.module)
      })
      this.PV.pv_annuel_data.forEach(pv => {//{ prenom: "Morgan", nom: "HUE", date_naissance: "21/12/2000", email: "m.hue@estya.com", notes: { "NomModule": 0, "Python": 20 }, moyenne: "15", appreciation_module:{}, appreciation:"", appreciation_annuel:"" }
        if (pv.email == this.ETUDIANT.user_id.email) {
          this.APPRECIATION_GENERALE = pv.appreciation
          if (pv.appreciation_annuel && this.route.snapshot.paramMap.get('semestre') == "Annuel")
            this.APPRECIATION_GENERALE = pv.appreciation_annuel
          listModule.forEach(n => {
            let t = { module: n, formateur: dicFormateur[n], coeff: dicCoeff[n], note_etudiant: pv.notes[n], ects: 0, appreciation_module: pv.appreciation_module }

            if (!t.appreciation_module) {
              t.appreciation_module = {}
            }
            if (!t.appreciation_module[n]) {
              if ((!t.appreciation_module[n] || t.appreciation_module[n] == "") && (t.appreciation_module[n] || t.appreciation_module[n] == 0)) {
                let note = parseInt(t.note_etudiant)
                if (note < 10)
                  t.appreciation_module[n] = "Doit faire ses preuves"
                else if ((note > 10 && note < 12) || note == 10)
                  t.appreciation_module[n] = "Passable"
                else if ((note > 12 && note < 14) || note == 12)
                  t.appreciation_module[n] = "Assez Bien"
                else if ((note > 14 && note < 16) || note == 14)
                  t.appreciation_module[n] = "Bien"
                else if ((note > 16 && note < 18) || note == 16)
                  t.appreciation_module[n] = "Très Bien"
                else if (note > 18 || note == 18)
                  t.appreciation_module[n] = "Excellent"
                else
                  t.appreciation_module[n] = ""
              }
            } else {
              t.appreciation_module[n] = pv.appreciation_module[n]
            }
            this.NOTES.push(t)
          })
          if ((!this.APPRECIATION_GENERALE || this.APPRECIATION_GENERALE == "")) {
            let note = this.calculMoyenne()
            if (note < 10)
              this.APPRECIATION_GENERALE = "Doit faire ses preuves"
            else if ((note > 10 && note < 12) || note == 10)
              this.APPRECIATION_GENERALE = "Passable"
            else if ((note > 12 && note < 14) || note == 12)
              this.APPRECIATION_GENERALE = "Assez Bien"
            else if ((note > 14 && note < 16) || note == 14)
              this.APPRECIATION_GENERALE = "Bien"
            else if ((note > 16 && note < 18) || note == 16)
              this.APPRECIATION_GENERALE = "Très Bien"
            else if (note > 18 || note == 18)
              this.APPRECIATION_GENERALE = "Excellent"
            else
              this.APPRECIATION_GENERALE = ""
          }
        }
        this.calculMoy()
      })
    }
  }
  hideForPDF = false
  exportToPDF(id) {
    var element = document.getElementById(id);
    this.EtuService.downloadBulletin(this.ETUDIANT._id).subscribe(doc => {
    }, err => {
      console.error(err)
    })
    var opt = {
      margin: 0,
      filename: 'BULLETIN_' + this.SEMESTRE + '_' + this.ETUDIANT.user_id.lastname + "_" + this.ETUDIANT.user_id.firstname + '.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'px', format: [element.offsetWidth, element.offsetHeight], orientation: 'p', hotfixes: ['px_scaling'] }
    };
    this.hideForPDF = true
    html2pdf().set(opt).from(element).save().then(() => {
      this.hideForPDF = false
      //element.style.transform = '';
    });
  }

  saveToPV() {
    let notes = {}
    let appreciation = {}
    this.NOTES.forEach(note => {
      notes[note.module] = note.note_etudiant
      appreciation[note.module] = note.appreciation_module
    })
    //{ prenom: "Morgan", nom: "HUE", date_naissance: "21/12/2000", email: "m.hue@estya.com", notes: { "NomModule": 0, "Python": 20 }, moyenne: "15", appreciation_module:{}, appreciation:"" }
    this.PV.pv_annuel_data.forEach((pv, index) => {
      if (pv.email == this.ETUDIANT.user_id.email) {
        let data = pv
        data.notes = notes
        data.appreciation_module = appreciation
        data.appreciation = this.APPRECIATION_GENERALE
        this.PV.pv_annuel_data[index] = data
        this.NoteS.savePV(this.SEMESTRE, this.GROUPE._id, { cols: this.PV.pv_annuel_cols, data: this.PV.pv_annuel_data }).subscribe(msg => {
          this.messageService.add({ severity: 'success', summary: "Sauvegarde du PV avec succès" })
        })
      }

    })
  }

  calculMoy() {
    let dicFormateur = {}
    let dicCoeff = {}
    let listModule = []
    let calculMoyenne = {}
    let minMoyenne = {}
    let maxMoyenne = {}
    if (this.PV) {
      this.PV.pv_annuel_cols.forEach(col => {
        dicFormateur[col.module] = col.formateur
        dicCoeff[col.module] = col.coeff
        listModule.push(col.module)
      })
      this.PV.pv_annuel_data.forEach(pv => {
        listModule.forEach(n => {
          if (!isNaN(Number(pv.notes[n]))) {
            let noteToAdd = Number(pv.notes[n])
            if (calculMoyenne[n]) {
              calculMoyenne[n].total += noteToAdd
              calculMoyenne[n].nb += 1
            } else {
              calculMoyenne[n] = { total: noteToAdd, nb: 1 }
            }
            if (minMoyenne[n]) {
              if (noteToAdd < minMoyenne[n])
                minMoyenne[n] = noteToAdd
            }
            else
              minMoyenne[n] = noteToAdd

            if (maxMoyenne[n]) {
              if (noteToAdd > maxMoyenne[n])
                maxMoyenne[n] = noteToAdd
            } else
              maxMoyenne[n] = noteToAdd
          }
        })
        listModule.forEach(n => {
          if (!calculMoyenne[n]) {
            calculMoyenne[n] = { total: 1, nb: 1 }
          }
          this.MOYENNE[n] = { moy: calculMoyenne[n].total / calculMoyenne[n].nb, min: minMoyenne[n], max: maxMoyenne[n] }
        })
      })
    }
  }
  showAnnuel = false
  calculMoyenneAnnuel() {
    return 0
  }


}
