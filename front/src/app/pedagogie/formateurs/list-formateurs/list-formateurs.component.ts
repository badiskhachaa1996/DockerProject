import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Formateur } from 'src/app/models/Formateur';
import { User } from 'src/app/models/User';
import { FormateurService } from 'src/app/services/formateur.service';
import { ServService } from 'src/app/services/service.service';
import { MatiereService } from 'src/app/services/matiere.service';
import { SeanceService } from 'src/app/services/seance.service';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";
import { saveAs as importedSaveAs } from "file-saver";
import { CampusService } from 'src/app/services/campus.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-list-formateurs',
  templateUrl: './list-formateurs.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./list-formateurs.component.scss']
})
export class ListFormateursComponent implements OnInit {
  expandedRows = {};

  typeFormateur = [
    { label: 'Interne', value: true },
    { label: 'Externe', value: false },
  ];

  fr = environment.fr;
  formateurs: Formateur[] = [];
  dropdownCampus = [];
  diplomesListe = [];
  jury_diplomesList = []
  formUpdateFormateur: FormGroup;
  showFormUpdateFormateur: boolean = false;
  formateurToUpdate: Formateur;

  users: User[] = [];
  civiliteList = environment.civilite;

  typeContratList = [
    { label: 'CDI', value: 'CDI' },
    { label: 'CDD', value: 'CDD' },
    { label: 'Prestation et Vacation', value: 'Prestation et Vacation' },
    //{ label: 'Vacation', value: 'Vacation' },
    { label: 'Sous-traitance', value: 'Sous-traitance' },
    /*{ label: "Contrat d'apprentissage", value: "Contrat d'apprentissage" },
    { label: "Contrat de professionalisation", value: "Contrat de professionalisation" },*/
  ];
  prestataireList = [
    { label: 'EliteLabs', value: 'EliteLabs' },
    { label: 'Autre', value: 'Autre' }
  ];
  matiereList = [];
  campusList = [];
  matiereDic = {};
  entrepriseDic = {}
  volumeHList = [];
  affichePrestataire: string;
  tempVolumeCons = null;
  serviceDic = []
  seanceNB = {};

  ListDocuments = []
  showUploadFile: Formateur;

  genderMap: any = { 'Monsieur': 'Mr.', 'Madame': 'Mme.', undefined: '', 'other': 'Mel.' };
  token;

  onAddJ_diplome() {
    this.jury_diplomesList.push({ diplome_id: "", cout_h: 0, isNew: true })
  }

  changeCout(i, event, type) {
    if (type == "cout_h") {
      this.jury_diplomesList[i][type] = parseInt(event.target.value);
    } else {
      this.jury_diplomesList[i][type] = event.value._id;
    }
  }
  deleteJ_diplome(i) {
    this.jury_diplomesList.splice(i, 1)
  }

  onAddMatiere() {
    this.volumeHList.push({ volume_init: 0, matiere_id: this.matiereList[0].items[0].value, isNew: true })
  }

  changeVolumeH(i, event, type) {
    if (type == "volume_init")
      this.volumeHList[i][type] = parseInt(event.target.value);
    else if (type == "matiere_id") {
      this.volumeHList[i][type] = event.value;
      this.volumeHList[i]["volume_init"] = parseInt(this.matiereDic[event.value].volume_init)
    }

  }

  deleteMatiereAdd(i) {
    this.volumeHList.splice(i, 1)
  }

  constructor(private formateurService: FormateurService, private formBuilder: FormBuilder, private messageService: MessageService, private router: Router, private diplomeService: DiplomeService,
    private ServService: ServService, private MatiereService: MatiereService, private SeanceService: SeanceService, private CampusService: CampusService, private EntrepriseService: EntrepriseService) { }

  ngOnInit(): void {
    //Recuperation de la liste des formateurs
    this.token = jwt_decode(localStorage.getItem('token'))
    this.formateurService.getAllPopulate().subscribe(
      (data) => {
        this.formateurs = [];
        data.forEach(f => {
          let abscList = []
          f.absences.forEach(a => {
            if (a != null) {
              abscList.push(new Date(a))
            }
          })
          f.absences = abscList
          if (f.user_id)
            this.formateurs.push(f)
        })
      },
      (error) => { console.error(error) }
    );


    //Initialisation du formulaire de modification de formateur
    this.onInitFormUpdateFormateur();
    this.MatiereService.getMatiereList().subscribe((data) => {
      this.matiereList = data
    })
    this.MatiereService.getAll().subscribe(data => {
      data.forEach(m => {
        this.matiereDic[m._id] = m
      });
    })

    this.diplomeService.getAll().subscribe(data => {
      this.diplomesListe = data
      data.forEach(formation => {

        this.diplomesListe[formation._id] = formation;
      })

    })

    this.ServService.getAll().subscribe((services) => {
      services.forEach(serv => {
        this.serviceDic[serv._id] = serv;
      });
    })

    this.SeanceService.getAll().subscribe(data => {
      data.forEach(seance => {
        if (this.seanceNB[seance.formateur_id] != null) {
          this.seanceNB[seance.formateur_id] += 1
        }
        else {
          this.seanceNB[seance.formateur_id] = 0
        }
      })
    })

    this.CampusService.getAll().subscribe((cData) => {
      cData.forEach(c => {
        this.campusList[c._id] = c;
        this.dropdownCampus.push({ label: c.libelle, value: c._id })
      });
    })

    this.EntrepriseService.getAll().subscribe(datEnt => {
      datEnt.forEach(ent => {
        this.entrepriseDic[ent._id] = ent;
      })
    })

  }

  //Methode de recuperation du diplome à mettre à jour
  onGetbyId(formateur: Formateur) {
    //Recuperation du formateur à modifier
    this.formateurToUpdate = formateur
    this.formateurService.getById(formateur._id).subscribe(
      ((response) => {
        this.tempVolumeCons = response.volume_h_consomme
        let arr = []
        if (this.formateurToUpdate.absences)
          this.formateurToUpdate.absences.forEach(date => {
            arr.push(new Date(date))
          })
        let c = []
        if (response.campus_id)
          response.campus_id.forEach(cid => {
            c.push(this.campusList[cid]?._id)
          })
        this.formUpdateFormateur.patchValue({
          type_contrat: { label: this.formateurToUpdate.type_contrat, value: this.formateurToUpdate.type_contrat }, taux_h: this.formateurToUpdate.taux_h,
          taux_j: this.formateurToUpdate.taux_j,
          remarque: this.formateurToUpdate.remarque,
          campus: c,
          nda: this.formateurToUpdate?.nda,
          absences: arr
        });
        if (this.formateurToUpdate.monday_available) {
          this.formUpdateFormateur.patchValue({
            monday_available: this.formateurToUpdate.monday_available.state,
            monday_h_debut: this.formateurToUpdate.monday_available.h_debut,
            monday_h_fin: this.formateurToUpdate.monday_available.h_fin,
            monday_remarque: this.formateurToUpdate.monday_available.remarque
          })
        }
        if (this.formateurToUpdate.tuesday_available) {
          this.formUpdateFormateur.patchValue({
            tuesday_available: this.formateurToUpdate.tuesday_available.state,
            tuesday_h_debut: this.formateurToUpdate.tuesday_available.h_debut,
            tuesday_h_fin: this.formateurToUpdate.tuesday_available.h_fin,
            tuesday_remarque: this.formateurToUpdate.tuesday_available.remarque
          })
        }
        if (this.formateurToUpdate.wednesday_available) {
          this.formUpdateFormateur.patchValue({
            wednesday_available: this.formateurToUpdate.wednesday_available.state,
            wednesday_h_debut: this.formateurToUpdate.wednesday_available.h_debut,
            wednesday_h_fin: this.formateurToUpdate.wednesday_available.h_fin,
            wednesday_remarque: this.formateurToUpdate.wednesday_available.remarque
          })
        }
        if (this.formateurToUpdate.thursday_available) {
          this.formUpdateFormateur.patchValue({
            thursday_available: this.formateurToUpdate.thursday_available.state,
            thursday_h_debut: this.formateurToUpdate.thursday_available.h_debut,
            thursday_h_fin: this.formateurToUpdate.thursday_available.h_fin,
            thursday_remarque: this.formateurToUpdate.thursday_available.remarque
          })
        }
        if (this.formateurToUpdate.friday_available) {
          this.formUpdateFormateur.patchValue({
            friday_available: this.formateurToUpdate.friday_available.state,
            friday_h_debut: this.formateurToUpdate.friday_available.h_debut,
            friday_h_fin: this.formateurToUpdate.friday_available.h_fin,
            friday_remarque: this.formateurToUpdate.friday_available.remarque
          })
        }
        let dicF = response.IsJury
        let kF = [];
        this.jury_diplomesList = [];
        if (response.IsJury && response.IsJury.keys().length != 0) {
          kF = Object.keys(dicF)
          kF.forEach(key => {
            this.jury_diplomesList.push({ titre: key, cout_h: parseInt(response.IsJury[key]), isNew: false })
          });
        }

        let dic = response.volume_h
        let k = [];
        this.volumeHList = [];
        if (response.volume_h) {
          k = Object.keys(dic)
          k.forEach(key => {
            this.volumeHList.push({ matiere_id: key, volume_init: parseInt(response.volume_h[key]), isNew: false })
          });
        }
      }),
      ((error) => { console.error(error); })
    );
  }

  //Methode d'initialisation du formulaire de modification de formateur
  onInitFormUpdateFormateur() {
    this.formUpdateFormateur = this.formBuilder.group({
      type_contrat: ['', Validators.required],
      taux_h: [''],
      taux_j: [''],
      prestataire_id: [''],
      volume_h: this.formBuilder.array([]),
      monday_available: [false],
      tuesday_available: [false],
      wednesday_available: [false],
      thursday_available: [false],
      friday_available: [false],
      monday_h_debut: [""],
      tuesday_h_debut: [""],
      wednesday_h_debut: [""],
      thursday_h_debut: [""],
      friday_h_debut: [""],
      monday_h_fin: [""],
      tuesday_h_fin: [""],
      wednesday_h_fin: [""],
      thursday_h_fin: [""],
      friday_h_fin: [""],
      monday_remarque: [""],
      tuesday_remarque: [""],
      wednesday_remarque: [""],
      thursday_remarque: [""],
      friday_remarque: [""],
      remarque: [''],
      campus: [''],
      nda: [""],
      IsJury: [""],
      absences: [""]
    });
  }



  //Methode d'ajout du nouveau formateur dans la base de données
  onUpdateFormateur() {

    //Mis à jour du formateur et envoi dans la base de données
    this.formateurToUpdate.type_contrat = this.formUpdateFormateur.get('type_contrat')?.value.value;
    this.formateurToUpdate.taux_h = this.formUpdateFormateur.get('taux_h')?.value;
    this.formateurToUpdate.taux_j = this.formUpdateFormateur.get('taux_j')?.value;
    this.formateurToUpdate.prestataire_id = this.formUpdateFormateur.get('prestataire_id')?.value.value;
    this.formateurToUpdate.remarque = this.formUpdateFormateur.get('remarque')?.value;
    this.formateurToUpdate.nda = this.formUpdateFormateur.get('nda')?.value;

    this.formateurToUpdate.campus_id = this.formUpdateFormateur.get('campus')?.value

    let volumeH_i = {};

    this.volumeHList.forEach((VH, index) => {
      volumeH_i[VH["matiere_id"]] = VH["volume_init"]
    });

    let jury = {}
    this.jury_diplomesList.forEach((VH, index) => {
      jury[VH["titre"]] = VH["cout_h"]
    });

    this.formateurToUpdate.IsJury = jury
    this.formateurToUpdate.volume_h = volumeH_i;
    this.formateurToUpdate.monday_available = {
      state: this.formUpdateFormateur.get('monday_available').value,
      h_debut: this.formUpdateFormateur.get('monday_h_debut').value,
      h_fin: this.formUpdateFormateur.get('monday_h_fin').value,
      remarque: this.formUpdateFormateur.get('monday_remarque').value,
    }
    this.formateurToUpdate.tuesday_available = {
      state: this.formUpdateFormateur.get('tuesday_available').value,
      h_debut: this.formUpdateFormateur.get('tuesday_h_debut').value,
      h_fin: this.formUpdateFormateur.get('tuesday_h_fin').value,
      remarque: this.formUpdateFormateur.get('tuesday_remarque').value,
    }
    this.formateurToUpdate.wednesday_available = {
      state: this.formUpdateFormateur.get('wednesday_available').value,
      h_debut: this.formUpdateFormateur.get('wednesday_h_debut').value,
      h_fin: this.formUpdateFormateur.get('wednesday_h_fin').value,
      remarque: this.formUpdateFormateur.get('wednesday_remarque').value,
    }
    this.formateurToUpdate.thursday_available = {
      state: this.formUpdateFormateur.get('thursday_available').value,
      h_debut: this.formUpdateFormateur.get('thursday_h_debut').value,
      h_fin: this.formUpdateFormateur.get('thursday_h_fin').value,
      remarque: this.formUpdateFormateur.get('thursday_remarque').value,
    }
    this.formateurToUpdate.friday_available = {
      state: this.formUpdateFormateur.get('friday_available').value,
      h_debut: this.formUpdateFormateur.get('friday_h_debut').value,
      h_fin: this.formUpdateFormateur.get('friday_h_fin').value,
      remarque: this.formUpdateFormateur.get('friday_remarque').value,
    }
    this.formateurToUpdate.absences = this.formUpdateFormateur.get('absences').value
    this.formateurService.updateById(this.formateurToUpdate).subscribe(
      ((data) => {
        if (data.error) {
          this.messageService.add({ severity: 'error', summary: 'Erreur lors de la modification de formateur', detail: 'data.error' });
        } else {
          this.messageService.add({ severity: 'success', summary: 'Modification de formateur', detail: 'Cet formateur a bien été modifié' });
          this.formateurService.getAllPopulate().subscribe(
            (dataF) => {
              this.formateurs = [];
              dataF.forEach(f => {
                let abscList = []
                f.absences.forEach(a => {
                  if (a != null) {
                    abscList.push(new Date(a))
                  }
                })
                f.absences = abscList
                if (f.user_id)
                  this.formateurs.push(f)
              })
            },
            (error) => { console.error(error) }
          );
        }
        this.onInitFormUpdateFormateur()
      }),
      ((error) => { console.error(error); })
    );

    this.showFormUpdateFormateur = false;
    this.jury_diplomesList = []

  }

  onGetStatutToUpdate() {
    //recupère le statut et l'affecte à la variable affichePrestataire pour determiné s'il faut ou non afficher le champs prestataire
    return this.formUpdateFormateur.get('type_contrat').value.value;
  }

  showCalendar(rowData) {
    this.router.navigate(['/emploi-du-temps/formateur/' + rowData.user_id._id])
  }
  onGetStatut() {
    //recupère le statut et l'affecte à la variable affichePrestataire pour determiné s'il faut ou non afficher le champs prestataire
    return this.formUpdateFormateur.get('type_contrat').value.value;
  }


  sendCalendar(rowData) {
    this.formateurService.sendEDT(rowData._id).subscribe(data => {
      this.messageService.add({ severity: 'success', summary: 'Envoie des emplois du temps', detail: "L'emploi du temps a bien été envoyé" })
    }, error => {
      console.error(error)
      this.messageService.add({ severity: 'error', summary: 'Erreur avec les emplois du temps', detail: "Contacté un Admin" })
    })
  }

  expandFc(rowData: Formateur) {
    this.formateurService.getFiles(rowData?._id).subscribe(
      (data) => {
        this.ListDocuments = data
      },
      (error) => { console.error(error) }
    );
  }

  downloadFile(id, i) {
    this.messageService.add({ severity: 'success', summary: 'Téléchargement du Fichier', detail: 'Le fichier est entrain d\'être téléchargé' });
    this.formateurService.downloadFile(id, this.ListDocuments[i]).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.documentType }), this.ListDocuments[i])
    }, (error) => {
      console.error(error)
      this.messageService.add({ severity: 'error', summary: 'Téléchargement du Fichier', detail: 'Une erreur est survenu' });
    })

  }
  VisualiserFichier(id, i) {
    this.formateurService.downloadFile(id, this.ListDocuments[i]).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    }, (error) => {
      console.error(error)
    })

  }

  deleteFile(id, i) {
    if (confirm("Voulez-vous vraiment supprimer le fichier " + this.ListDocuments[i] + " ?")) {
      this.formateurService.deleteFile(id, this.ListDocuments[i]).subscribe((data) => {
        this.messageService.add({ severity: "success", summary: "Le fichier a bien été supprimé" })
        this.ListDocuments.splice(i, 1)
      }, (error) => {
        this.messageService.add({ severity: "error", summary: "Le fichier n'a pas pu être supprimé", detail: error })
        console.error(error)
      })
    }
  }

  FileUpload(event) {
    if (event.files != null) {
      this.messageService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();
      formData.append('id', this.showUploadFile._id)
      formData.append('file', event.files[0])
      this.formateurService.uploadFile(formData, this.showUploadFile._id).subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
        this.expandFc(this.showUploadFile)
        event.target = null;
        this.showUploadFile = null;
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }
  }

  onRedirect() {
    this.router.navigate(['ajout-formateur']);
  }

  exportExcel() {
    let dataExcel = []
    //Clean the data
    this.formateurs.forEach(formateur => {
      let t = {}
      let bypass: any = formateur.user_id
      let ent: any = formateur.prestataire_id
      t['NOM'] = bypass.lastname
      t['Prenom'] = bypass.firstname
      t['Email Ecole'] = bypass?.email
      t['Email Personnel'] = bypass?.email_perso
      t['Telephone'] = bypass?.indicatif + bypass?.phone
      if (!bypass?.indicatif)
        t['Telephone'] = bypass?.phone
      t['Nom Rue'] = bypass?.rue_adresse
      t['Numéro Rue'] = bypass?.numero_adresse
      t['Code Postal'] = bypass?.postal_adresse
      t['Pays de Résidence'] = bypass?.pays_adresse
      t['Ville'] = bypass?.ville_adresse
      t['Numéro de Déclaration d\'Activité'] = formateur.nda
      t['Type de contrat'] = formateur.type_contrat
      t['Cout horaire'] = formateur.taux_h
      if (formateur?.campus_id)
        formateur?.campus_id.forEach((cid, index) => {
          if (index == 0)
            t['Campus'] = this.campusList[cid]?.libelle
          else
            t['Campus'] = t['Campus'] + "," + this.campusList[cid]?.libelle
        })
      t['Entreprise'] = ent?.r_sociale
      t['Remarque'] = formateur.remarque
      dataExcel.push(t)
    })
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, "formateurs" + '_export_' + new Date().toLocaleDateString("fr-FR") + ".xlsx");
  }
}
