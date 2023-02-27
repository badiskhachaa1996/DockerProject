import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from "jwt-decode";
import { saveAs as importedSaveAs } from "file-saver";
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CV } from 'src/app/models/CV';
import { User } from 'src/app/models/User';
import { CvService } from 'src/app/services/skillsnet/cv.service';
import { Table } from 'primeng/table';
import { SkillsService } from 'src/app/services/skillsnet/skills.service';
import { Competence } from 'src/app/models/Competence';
import { from } from 'rxjs';

@Component({
  selector: 'app-cvtheque',
  templateUrl: './cvtheque.component.html',
  styleUrls: ['./cvtheque.component.scss']
})
export class CvthequeComponent implements OnInit {

  // partie dedié aux CV
  cvLists: CV[] = [];
  showFormAddCV: boolean = false;
  formAddCV: FormGroup;

  showFormUpdateCV: boolean = false;

  languesList: any[] = [
    { label: 'Français' },
    { label: 'Anglais' },
    { label: 'Espagnol' },
    { label: 'Allemand' },
    { label: 'Arabe' },
    { label: 'Italien' },
  ]

  competencesList: any[] = [];

  outilsList: any[] = [
    { label: 'Visual studio Code' },
    { label: 'Android studio' },
    { label: 'Wamp Server' },
    { label: 'Xamp Server' },
    { label: 'Mamp Server' },
    { label: "MySQl Workbench" },
    { label: "JMerise" },
    { label: "DIA" },
    { label: "StarUML" },
    { label: "mongoDb Compas" },
    { label: 'Eclipse' },
    { label: 'Git' },
    { label: 'Mercurial' },
    { label: 'IDL' },
    { label: 'Matlab' },
    { label: 'Netcdf' },
    { label: 'IDFS' },
    { label: 'Teamviewer' },
    { label: 'Ocean' },
    { label: 'Jira' },
    { label: 'Trello' },
  ];

  typeList: any = [
    { label: 'Tous les types', value: null },
    { label: 'Etudiant', value: 'Etudiant' },
    { label: 'Initial', value: 'Initial' },
    { label: 'Alternant', value: 'Alternant' },
    { label: 'Formateur', value: 'Formateur' },
  ];

  selectedMultiCpt: string[] = [];
  selectedMultiOutils: string[] = [];
  selectedMultilang: string[] = [];
  loading: boolean = true;

  users: User[] = [];
  dropdownUser: any[] = [
    { label: 'Choisir un utilisateur', value: null }
  ];

  uploadedFiles: any;

  token: any;

  @ViewChild('filter') filter: ElementRef;


  constructor(private skillsService: SkillsService, private formBuilder: FormBuilder, private messageService: MessageService, private cvService: CvService, private userService: AuthService, private router: Router,) { }

  ngOnInit(): void {
    // decodage du token
    this.token = jwt_decode(localStorage.getItem("token"));

    // initialisation de la methode de recuperation des données
    this.onGetAllClasses();

    //Initialisation du formulaire d'ajout de CV
    this.formAddCV = this.formBuilder.group({
      user_id: ['', Validators.required],
      experiences_pro: this.formBuilder.array([]),
      experiences_sco: this.formBuilder.array([]),
      competences: [],
      outils: ['', Validators.required],
      langues: [],
      video_lien: [],
    });

  }


  // methode de recuperation des données utile
  onGetAllClasses(): void {
    // recuperation des CVs
    this.cvService.getCvs()
      .then((response: CV[]) => {
        this.cvLists = response;
        this.loading = false;
      })
      .catch((error) => { console.error(error); })


    // recuperation de la liste des users et remplissage de la dropdown
    this.userService.getAllForCV()
      .then((response: User[]) => {
        this.users = response;

        // remplissage de la dropdown des users pour ajouter le CV
        response.forEach((user: User) => {
          if(user.firstname && user.lastname && user.type){
            let username = `${user.firstname} ${user.lastname} | ${user.type}`;
            this.dropdownUser.push({ label: username, value: user._id });
          }
        })
      })
      .catch(error => console.log(error));

    // recuperation de la liste des compétences
    this.skillsService.getCompetences()
      .then((response: Competence[]) => {
        response.forEach((competence: Competence) => {
          this.competencesList.push({ label: competence.libelle, value: competence._id });
        })
      })
      .catch((error) => { console.log(error); })

  }


  //Traitement des formArray
  /* Xp pro */
  getXpPros() {
    return this.formAddCV.get('experiences_pro') as FormArray;
  }

  onAddXpPro() {
    const newXpProControl = this.formBuilder.control('', Validators.required);
    this.getXpPros().push(newXpProControl);
  }

  onRemoveXpPro(i: number) {
    this.getXpPros().removeAt(i);
  }
  /* end Xp pro */

  /* Xp sco */
  getXpScos() {
    return this.formAddCV.get('experiences_sco') as FormArray;
  }

  onAddXpSco() {
    const newXpScoControl = this.formBuilder.control('', Validators.required);
    this.getXpScos().push(newXpScoControl);
  }

  onRemoveXpSco(i: number) {
    this.getXpScos().removeAt(i);
  }
  /* end xp sco */

  // upload du cv brute
  onUpload(event: any) {
    if (event.target.files.length > 0) {
      this.uploadedFiles = event.target.files[0];
    }
  }

  // methode d'ajout du cv
  onAddCV(): void {
    // recuperation des données du formulaire
    const formValue = this.formAddCV.value;
    //création du cv
    let cv = new CV();

    cv.user_id = formValue.user_id;
    cv.experiences_pro = [];
    formValue.experiences_pro?.forEach(xpPro => {
      cv.experiences_pro.push(xpPro);
    });

    cv.experiences_sco = [];
    formValue.experiences_sco?.forEach(xpSco => {
      cv.experiences_sco.push(xpSco);
    });

    cv.competences = [];
    formValue.competences?.forEach(cpt => {
      cv.competences.push(cpt.value);
    });

    cv.outils = [];
    formValue.outils?.forEach((outil) => {
      cv.outils.push(outil.label);
    });

    cv.langues = [];
    formValue.langues?.forEach(langue => {
      cv.langues.push(langue.label);
    });

    cv.video_lien = formValue.video_lien;

    // si un cv brute à été ajouté
    if (this.uploadedFiles) {
      cv.filename = this.uploadedFiles.name;
      let formData = new FormData();
      formData.append('id', cv.user_id);
      formData.append('file', this.uploadedFiles);

      //ajout du cv
      this.cvService.postCv(cv)
        .then((response: CV) => {
          this.messageService.add({ severity: "success", summary: `Le cv à été ajouté` })

          // envoi du fichier brute
          this.cvService.postCVBrute(formData)
            .then(() => {

            })
            .catch((error) => {
              this.formAddCV.reset();
              this.showFormAddCV = false;
              this.onGetAllClasses();
            });
        })
        .catch((error) => {
          this.messageService.add({ severity: "error", summary: `Ajout impossible, ce utilisateur à peut être un CV existant, si le problème persiste veuillez contacter un administrateur` });
          console.log(error);
        });

    } else {
      //ajout du cv
      this.cvService.postCv(cv)
        .then((response: CV) => {
          this.messageService.add({ severity: "success", summary: `Le cv à été ajouté` })
          this.formAddCV.reset();
          this.showFormAddCV = false;
          this.onGetAllClasses();
        })
        .catch((error) => {
          this.messageService.add({ severity: "error", summary: `Ajout impossible, ce utilisateur à peut être un CV existant, si le problème persiste veuillez contacter un administrateur` });
          console.log(error);
        });
    }
  }



  // methode pour vider les filtres
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  //Partie Mis à jour du CV

  showUpdateCV: CV
  formUpdateCV: FormGroup

  InitUpdateCV(cv) {
    this.formUpdateCV = this.formBuilder.group({
      experiences_pro: this.formBuilder.array([]),
      experiences_sco: this.formBuilder.array([]),
      competences: [],
      outils: ['', Validators.required],
      langues: [],
      video_lien: [],
    });
    this.showUpdateCV = cv
    cv.experiences_pro?.forEach(xpPro => {
      const newXpProControl = this.formBuilder.control(xpPro, Validators.required);
      this.getUpdateXpPros().push(newXpProControl);
    });

    cv.experiences_sco?.forEach(xpSco => {
      const newXpScoControl = this.formBuilder.control(xpSco, Validators.required);
      this.getXpUpdateScos().push(newXpScoControl);
    });

    let cv_competences = [];
    cv.competences?.forEach(cpt => {
      this.competencesList.forEach(c => {
        if (c.value == cpt)
          cv_competences.push(c);
      })
    });

    let cv_outils = [];
    cv.outils?.forEach((outil) => {
      cv_outils.push({ label: outil });
    });

    let cv_langues = [];
    cv.langues?.forEach(langue => {
      cv_langues.push({ label: langue });
    });
    this.selectedMultiOutils = cv_outils
    this.selectedMultilang = cv_langues
    this.selectedMultiCpt = cv_competences
    this.formUpdateCV.patchValue({
      competences: cv_competences,
      outils: cv_outils,
      langues: cv_langues,
      video_lien: cv.video_lien
    })
  }

  onUpdateCV() {
    let cv = this.showUpdateCV
    const formValue = this.formUpdateCV.value;
    cv.experiences_pro = [];
    formValue.experiences_pro?.forEach(xpPro => {
      cv.experiences_pro.push(xpPro);
    });

    cv.experiences_sco = [];
    formValue.experiences_sco?.forEach(xpSco => {
      cv.experiences_sco.push(xpSco);
    });

    cv.competences = [];
    formValue.competences?.forEach(cpt => {
      cv.competences.push(cpt.value);
    });

    cv.outils = [];
    formValue.outils?.forEach((outil) => {
      cv.outils.push(outil.label);
    });

    cv.langues = [];
    formValue.langues?.forEach(langue => {
      cv.langues.push(langue.label);
    });
    cv.video_lien = formValue.video_lien

    this.cvService.putCv(cv).then(data => {
      this.cvLists.splice(this.cvLists.indexOf(this.showUpdateCV), 1, cv)
      this.messageService.add({ severity: 'success', summary: "Mis à jour du CV avec succès" })
      this.formUpdateCV.reset();
      this.showUpdateCV = null;
    })
  }

  /* Xp pro */
  getUpdateXpPros() {
    return this.formUpdateCV.get('experiences_pro') as FormArray;
  }

  onAddUpdateXpPro() {
    const newXpProControl = this.formBuilder.control('', Validators.required);
    this.getUpdateXpPros().push(newXpProControl);
  }

  onRemoveUpdateXpPro(i: number) {
    this.getUpdateXpPros().removeAt(i);
  }
  /* end Xp pro */

  /* Xp sco */
  getXpUpdateScos() {
    return this.formUpdateCV.get('experiences_sco') as FormArray;
  }

  onAddUpdateXpSco() {
    const newXpScoControl = this.formBuilder.control('', Validators.required);
    this.getXpUpdateScos().push(newXpScoControl);
  }

  onRemoveUpdateXpSco(i: number) {
    this.getXpUpdateScos().removeAt(i);
  }

  //Partie Exportation en PDF

  showPDF: CV
  InitExportPDF(cv) {
    this.showPDF = cv
  }
}
