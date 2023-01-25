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
    if (this.route.snapshot.paramMap.get('semestre')) {
      this.askGroupeSemestrePV = false
      this.SEMESTRE = this.route.snapshot.paramMap.get('semestre')
      this.GroupeService.getPopulate(this.route.snapshot.paramMap.get('classe_id')).subscribe(classe => {
        this.GROUPE = classe
        this.EtuService.getAllByClasseId(this.route.snapshot.paramMap.get('classe_id')).subscribe(etudiants => {
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
      })
    }
  }

  //Formulaire: Générer un bulletin de note
  askGroupeSemestrePV = true
  dropdownClasse = []
  dropdownSemestre = [{ label: "Annuel", value: "Annuel" }, { label: "Semestre 1", value: "Semestre 1" }, { label: "Semestre 2", value: "Semestre 2" }, { label: "Semestre 3", value: "Semestre 3" }]
  dropdownPV: any = [{ value: "Aucun/Nouveau PV", label: "Aucun/Nouveau PV" }]
  formAGSPV: FormGroup = new FormGroup({
    classe: new FormControl('', Validators.required),
    semestre: new FormControl('', Validators.required),
    pv: new FormControl('', Validators.required),
  })

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
      this.PV.pv_annuel_data.forEach(pv => {//{ prenom: "Morgan", nom: "HUE", date_naissance: "21/12/2000", email: "m.hue@estya.com", notes: { "NomModule": 0, "Python": 20 }, moyenne: "15", appreciation_module:{}, appreciation:"" }
        if (pv.email == this.ETUDIANT.user_id.email) {
          this.APPRECIATION_GENERALE = pv.appreciation
          console.log(listModule)
          listModule.forEach(n => {
            let t = { module: n, formateur: dicFormateur[n], coeff: dicCoeff[n], note_etudiant: pv.notes[n], ects: 0, appreciation_module: pv.appreciation_module }

            if (!t.appreciation_module) {
              t.appreciation_module = {}
            }
            if (!t.appreciation_module[n]) {
              t.appreciation_module[n] = ""
            } else {
              t.appreciation_module[n] = pv.appreciation_module[n]
            }
            this.NOTES.push(t)
          })
        }
        this.calculMoy()
      })
    }
  }
  hideForPDF = false
  exportToPDF(id) {
    var element = document.getElementById(id);
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
            if (calculMoyenne[n]) {
              calculMoyenne[n].total += pv.notes[n]
              calculMoyenne[n].nb += 1
            } else {
              calculMoyenne[n] = { total: pv.notes[n], nb: 1 }
            }
            if (minMoyenne[n]) {
              if (pv.notes[n] < minMoyenne[n])
                minMoyenne[n] = pv.notes[n]
            }
            else
              minMoyenne[n] = pv.notes[n]

            if (maxMoyenne[n]) {
              if (pv.notes[n] > maxMoyenne[n])
                maxMoyenne[n] = pv.notes[n]
            } else
              maxMoyenne[n] = pv.notes[n]
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



}
