import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Diplome } from 'src/app/models/Diplome';
import { AnneeScolaireService } from 'src/app/services/annee-scolaire.service';
import { CampusService } from 'src/app/services/campus.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { EcoleService } from 'src/app/services/ecole.service';
import { FormateurService } from 'src/app/services/formateur.service';
import { MatiereService } from 'src/app/services/matiere.service';
import { AuthService } from 'src/app/services/auth.service';
import { AnneeScolaire } from 'src/app/models/AnneeScolaire';
import { Ecole } from 'src/app/models/Ecole';
import { Campus } from 'src/app/models/Campus';
import { saveAs as importedSaveAs } from "file-saver";
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';


@Component({
  selector: 'app-list-diplome',
  templateUrl: './list-diplome.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./list-diplome.component.scss']
})
export class ListDiplomeComponent implements OnInit {

  isExpanded: boolean = false;
  expandedRows = {};


  rythmeList = [
    { value: "Tous les jours" },
    { value: "2 jours par semaine" },
    { value: "1 semaine sur 3" },
    { value: "1 jour par semaine" }
  ]

  domaineEtude = [
    { value: "Informatique" },
    { value: "Commerce" },
    { value: "Construction" },
    { value: "Tertiaire" },
  ]

  typeDiplome = [
    { value: "BTS" },
    { value: "RNCP" },
    { value: "CAP" },
  ]

  typeEtude = [
    { value: "Initial" },
    { value: "Apprentissage" },
    { value: "Continu" }
  ]

  niveauEtude = [
    { value: "Niveau 3" },
    { value: "Niveau 4" },
    { value: "Niveau 5" },
    { value: "Niveau 6" },
    { value: "Niveau 7" }
  ]

  choiceList = [
    { label: 'Oui', value: true },
    { label: 'Non', value: false },
  ]




  diplomes: Diplome[] = [];

  showFormAddDiplome: boolean = false;

  formUpdateDiplome: FormGroup;
  showFormUpdateDiplome: boolean = false;
  diplomeToUpdate: Diplome = new Diplome();
  idDiplomeToUpdate: string;
  campusId: string;
  AnneeSelected: AnneeScolaire;
  EcoleSelected: Ecole;
  CampusSelected: Campus;
  ID = this.route.snapshot.paramMap.get('id');
  matiereVolume: any = {};

  dicMatiere: any
  campusList = [];
  campusListToUpdate = [];

  dicCampus = {};
  dicFormateur = {};
  dropdownFormateur = [{ "value": null, "label": "Choisissez un Formateur référent" }];
  token;
  uploadDiplome: Diplome = null

  isCommercial: boolean = false;

  constructor(private route: ActivatedRoute, private campusService: CampusService, private diplomeService: DiplomeService, private router: Router, private formBuilder: FormBuilder,
    private messageService: MessageService, private matiereService: MatiereService, private ecoleService: EcoleService, private anneeScolaireService: AnneeScolaireService,
    private formateurService: FormateurService, private AuthService: AuthService, private CommercialService: CommercialPartenaireService) { }

  ngOnInit(): void {

    this.campusId = this.route.snapshot.paramMap.get('id');
    //Recuperation de la liste des diplômes
    if (this.campusId) {
      this.diplomeService.getAllByCampus(this.campusId).subscribe(
        (data) => { this.diplomes = data; },
        (error) => { console.error(error) }
      );
    } else
      this.diplomeService.getAll().subscribe(
        (data) => { this.diplomes = data; },
        (error) => { console.error(error) }
      );
    this.campusList = []
    this.campusService.getAll().subscribe(
      (data) => {
        data.forEach(d => {
          this.dicCampus[d._id] = d
          this.campusList.push({ value: d._id, label: d.libelle })
        });
      }
    )
    this.matiereService.getVolume().subscribe(data => {
      this.matiereVolume = data
    })
    this.formateurService.getAll().subscribe(data => {
      data.forEach(d => {
        this.dicFormateur[d._id] = d
      })
      this.AuthService.getAll().subscribe(dataU => {
        let dicUser = []
        data.forEach(d => {
          dicUser.push(d.user_id)
        })
        dataU.forEach(u => {
          if (dicUser.includes(u._id)) {
            this.dropdownFormateur.push({ "label": u.lastname + " " + u.firstname, "value": u._id })
          }

        })
      })
    })

    this.matiereService.getDicMatiere().subscribe(data => {
      this.dicMatiere = data
    })


    //Initialisation du formulaire de modification de diplome
    this.onInitFormUpdateDiplome();
    if (this.ID) {
      this.campusService.getByID(this.ID).subscribe(data0 => {
        this.CampusSelected = data0[0]
        this.ecoleService.getByID(this.CampusSelected.ecole_id).subscribe((data) => {
          let idanneeselected = data.dataEcole.annee_id;
          this.EcoleSelected = data.dataEcole;
          this.anneeScolaireService.getByID(idanneeselected).subscribe((data2) => {
            this.AnneeSelected = data2.dataAnneeScolaire;
          })
        })
      })
    }

  }


  //Methode de recuperation du diplome à mettre à jour
  onGetbyId(diplome) {
    //Recuperation du diplome à modifier
    this.diplomeToUpdate = diplome;
    this.formUpdateDiplome.patchValue({ campus_id: diplome.campus_id })
    if (diplome.formateur_id && diplome.formateur_id != null) {
      this.dropdownFormateur.forEach(f => {
        if (f.value == diplome.formateur_id) {
          this.formUpdateDiplome.patchValue({ formateur_id: f })
        }
      })
    } else {
      this.formUpdateDiplome.patchValue({ formateur_id: null })
    }
    console.log(this.diplomeToUpdate)
    this.formUpdateDiplome.patchValue({
      titre: this.diplomeToUpdate.titre, titre_long: this.diplomeToUpdate.titre_long,
      type_diplome: { value: this.diplomeToUpdate.type_diplome }, domaine: { value: this.diplomeToUpdate.domaine },
      niveau: { value: this.diplomeToUpdate.niveau }, certificateur: this.diplomeToUpdate.certificateur, code_RNCP: this.diplomeToUpdate.code_RNCP,
      nb_heure: this.diplomeToUpdate.nb_heure, date_debut: this.diplomeToUpdate.date_debut, date_fin: this.diplomeToUpdate.date_fin,
      rythme: { value: this.diplomeToUpdate.rythme }, frais: this.diplomeToUpdate.frais,
      frais_en_ligne: this.diplomeToUpdate.frais_en_ligne,
      isCertified: this.diplomeToUpdate.isCertified,
      date_debut_examen: this.diplomeToUpdate.date_debut_examen,
      date_fin_examen: this.diplomeToUpdate.date_fin_examen,
      date_debut_stage: this.diplomeToUpdate.date_debut_stage,
      date_fin_stage: this.diplomeToUpdate.date_fin_stage,
      date_debut_semestre_1: this.convertTime(this.diplomeToUpdate.date_debut_semestre_1),
      date_fin_semestre_1: this.convertTime(this.diplomeToUpdate.date_fin_semestre_1),
      date_debut_semestre_2: this.convertTime(this.diplomeToUpdate.date_debut_semestre_2),
      date_fin_semestre_2: this.convertTime(this.diplomeToUpdate.date_fin_semestre_2),
      code_diplome: this.diplomeToUpdate.code_diplome,
      date_debut_semestre_3: this.convertTime(this.diplomeToUpdate.date_debut_semestre_3),
      date_fin_semestre_3: this.convertTime(this.diplomeToUpdate.date_fin_semestre_3),
      date_debut_semestre_4: this.convertTime(this.diplomeToUpdate.date_debut_semestre_4),
      date_fin_semestre_4: this.convertTime(this.diplomeToUpdate.date_fin_semestre_4),
      cb_an: this.diplomeToUpdate.cb_an,
    });

  }
  get cb_an() { return this.formUpdateDiplome.get('cb_an'); }

  convertTime(v) {
    let date = new Date(v)
    let day = date.getUTCDate() + 1
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    if (year != 1970)
      return `${day}-${month}-${year}`
    else
      return ""
  }
  //Methode d'initialisation du formulaire de modification de diplome
  onInitFormUpdateDiplome() {
    this.formUpdateDiplome = this.formBuilder.group({
      titre: ['', Validators.required],
      titre_long: ['', Validators.required],
      campus_id: ['', Validators.required],
      type_diplome: ['', Validators.required],
      domaine: ['', Validators.required],
      niveau: ['', Validators.required],
      certificateur: ['', Validators.required],
      code_RNCP: ['', Validators.required],
      nb_heure: ['', Validators.required],
      date_debut: [''],
      date_fin: [''],
      rythme: ['', Validators.required],
      frais: [''],
      frais_en_ligne: [''],
      isCertified: ['', Validators.required],
      date_debut_examen: [''],
      date_fin_examen: [''],
      date_debut_stage: [''],
      date_fin_stage: [''],
      date_debut_semestre_1: [''],
      date_fin_semestre_1: [''],
      date_debut_semestre_2: [''],
      date_fin_semestre_2: [''],
      date_debut_semestre_3: [''],
      date_fin_semestre_3: [''],
      date_debut_semestre_4: [''],
      date_fin_semestre_4: [''],
      code_diplome: ['', Validators.required],
      formateur_id: [''],
      cb_an: ['']
    });
  }

  //Methode d'ajout du nouveau diplome dans la base de données
  onUpdateDiplome() {
    //Mis à jour du diplome et envoi dans la base de données
    this.diplomeToUpdate.titre = this.formUpdateDiplome.get('titre')?.value;
    this.diplomeToUpdate.titre_long = this.formUpdateDiplome.get('titre_long')?.value;
    this.diplomeToUpdate.campus_id = this.formUpdateDiplome.get('campus_id')?.value;
    this.diplomeToUpdate.type_diplome = this.formUpdateDiplome.get('type_diplome')?.value.value;
    this.diplomeToUpdate.domaine = this.formUpdateDiplome.get('domaine')?.value.value;
    this.diplomeToUpdate.niveau = this.formUpdateDiplome.get('niveau')?.value.value;
    this.diplomeToUpdate.certificateur = this.formUpdateDiplome.get('certificateur')?.value;
    this.diplomeToUpdate.code_RNCP = this.formUpdateDiplome.get('code_RNCP')?.value;
    this.diplomeToUpdate.nb_heure = this.formUpdateDiplome.get('nb_heure')?.value;
    this.diplomeToUpdate.date_debut = this.formUpdateDiplome.get('date_debut')?.value;
    this.diplomeToUpdate.date_fin = this.formUpdateDiplome.get('date_fin')?.value;
    this.diplomeToUpdate.rythme = this.formUpdateDiplome.get('rythme')?.value.value;
    this.diplomeToUpdate.frais = this.formUpdateDiplome.get('frais')?.value;
    this.diplomeToUpdate.frais_en_ligne = this.formUpdateDiplome.get('frais_en_ligne')?.value;

    this.diplomeToUpdate.isCertified = this.formUpdateDiplome.get('isCertified')?.value;
    this.diplomeToUpdate.date_debut_examen = this.formUpdateDiplome.get('date_debut_examen')?.value;
    this.diplomeToUpdate.date_fin_examen = this.formUpdateDiplome.get('date_fin_examen')?.value;
    this.diplomeToUpdate.date_debut_stage = this.formUpdateDiplome.get('date_debut_stage')?.value;
    this.diplomeToUpdate.date_fin_stage = this.formUpdateDiplome.get('date_fin_stage')?.value;
    this.diplomeToUpdate.date_debut_semestre_1 = new Date(this.formUpdateDiplome.get('date_debut_semestre_1')?.value);
    this.diplomeToUpdate.date_fin_semestre_1 = new Date(this.formUpdateDiplome.get('date_fin_semestre_1')?.value);
    this.diplomeToUpdate.date_debut_semestre_2 = new Date(this.formUpdateDiplome.get('date_debut_semestre_2')?.value);
    this.diplomeToUpdate.date_fin_semestre_2 = new Date(this.formUpdateDiplome.get('date_fin_semestre_2')?.value);
    this.diplomeToUpdate.date_debut_semestre_3 = new Date(this.formUpdateDiplome.get('date_debut_semestre_3')?.value);
    this.diplomeToUpdate.date_fin_semestre_3 = new Date(this.formUpdateDiplome.get('date_fin_semestre_3')?.value);
    this.diplomeToUpdate.date_debut_semestre_4 = new Date(this.formUpdateDiplome.get('date_debut_semestre_4')?.value);
    this.diplomeToUpdate.date_fin_semestre_4 = new Date(this.formUpdateDiplome.get('date_fin_semestre_4')?.value);
    this.diplomeToUpdate.cb_an = this.formUpdateDiplome.get('cb_an')?.value;
    this.diplomeToUpdate.code_diplome = this.formUpdateDiplome.get('code_diplome')?.value;
    if (this.formUpdateDiplome.get('formateur_id')?.value)
      this.diplomeToUpdate.formateur_id = this.formUpdateDiplome.get('formateur_id')?.value.value;
    else
      this.diplomeToUpdate.formateur_id = null

    this.diplomeService.update(this.diplomeToUpdate).subscribe(
      ((response) => {
        this.messageService.add({ severity: 'success', summary: 'Modification de diplôme', detail: 'Cet diplôme a bien été modifié' });
        this.diplomeService.getAll().subscribe(
          (data) => {
            this.diplomes = data;
            this.showFormUpdateDiplome = false;
          },
          (error) => { console.error(error) }
        );
      }), error => {
        console.error(error);
        this.messageService.add({ severity: 'error', summary: 'Modification de diplôme', detail: 'Impossible de modifier cet diplôme, veuillez contacter un administrateur' });
      }
    );

  }

  clickFile(rowData) {
    this.uploadDiplome = rowData
    document.getElementById('selectedFile').click();
  }

  FileUploadPC(event) {
    let choice = true
    if (this.uploadDiplome != null && this.uploadDiplome.imgNames.includes(event[0].name)) {
      choice = confirm("Voulez-vous remplacer le fichier " + event[0].name + " par ce fichier ?")
    }
    if (choice && event && event.length > 0 && this.uploadDiplome != null) {
      const formData = new FormData();
      formData.append('id', this.uploadDiplome._id)
      formData.append('file', event[0])
      this.diplomeService.uploadFile(formData).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Photo de profil', detail: 'Mise à jour de la photo de profil avec succès' });
        this.uploadDiplome = null
        if (this.campusId) {
          this.diplomeService.getAllByCampus(this.campusId).subscribe(
            (data) => { this.diplomes = data; },
            (error) => { console.error(error) }
          );
        } else
          this.diplomeService.getAll().subscribe(
            (data) => { this.diplomes = data; },
            (error) => { console.error(error) }
          );
      }, (error) => {
        console.error(error)
      })
    }
  }

  downloadFile(rowData, name) {
    this.diplomeService.getFile(rowData._id, name).subscribe(data => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      importedSaveAs(new Blob([byteArray], { type: data.documentType }), name)
    })
  }

  VisualiserFichier(id, name) {
    this.diplomeService.getFile(id, name).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    }, (error) => {
      console.error(error)
    })

  }

  onGetCommercialePartenaire() {
    this.CommercialService.getByUserId(this.token.id).subscribe(data => {
      this.isCommercial = data != null
    }
    )
  }

  onRedirect() {
    this.router.navigate(['ajout-diplome']);
  }

  get titre() { return this.formUpdateDiplome.get('titre'); }
  get titre_long() { return this.formUpdateDiplome.get('titre_long'); }
  get campus_id() { return this.formUpdateDiplome.get('campus_id'); }
  get description() { return this.formUpdateDiplome.get('description'); }
  get type_diplome() { return this.formUpdateDiplome.get('type_diplome'); }
  get type_etude() { return this.formUpdateDiplome.get('type_etude'); }
  get domaine() { return this.formUpdateDiplome.get('domaine'); }
  get niveau() { return this.formUpdateDiplome.get('niveau'); }
  get certificateur() { return this.formUpdateDiplome.get('certificateur'); }
  get code_RNCP() { return this.formUpdateDiplome.get('code_RNCP'); }
  get nb_heure() { return this.formUpdateDiplome.get('nb_heure'); }
  get rythme() { return this.formUpdateDiplome.get('rythme'); }
  get isCertified() { return this.formUpdateDiplome.get('isCertified'); }
  get code_diplome() { return this.formUpdateDiplome.get('code_diplome'); }

  // expandAll() {
  //   if(!this.isExpanded){
  //     this.diplomes.forEach(diplome => this.expandedRows[diplome._id] = true);

  //   } else {
  //     this.expandedRows={};
  //   }
  //   this.isExpanded = !this.isExpanded;
  // }

}
