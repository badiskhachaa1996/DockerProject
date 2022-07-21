import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AnneeScolaireService } from 'src/app/services/annee-scolaire.service';
import { CampusService } from 'src/app/services/campus.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { EcoleService } from 'src/app/services/ecole.service';
import { FormateurService } from 'src/app/services/formateur.service';
import { MatiereService } from 'src/app/services/matiere.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Diplome } from 'src/app/models/Diplome';
import jwt_decode from "jwt-decode";
import { Campus } from 'src/app/models/Campus';
import { saveAs as importedSaveAs } from "file-saver";
import { Formateur } from 'src/app/models/Formateur';
import { AnneeScolaire } from 'src/app/models/AnneeScolaire';
import { Ecole } from 'src/app/models/Ecole';

@Component({
  selector: 'app-add-diplome',
  templateUrl: './add-diplome.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./add-diplome.component.scss']
})
export class AddDiplomeComponent implements OnInit {

  rythmeList = [
    { value: "Choissisez le rythme de la formmation", actif: true },
    { value: "2 jours par semaine", actif: false },
    { value: "1 semaine sur 3", actif: false },
    { value: "1 jour par semaine", actif: false }
  ]

  domaineEtude = [
    { value: "Choissisez le type du diplôme", actif: true },
    { value: "Commerce", actif: false },
    { value: "RH", actif: false },
    { value: "Informatique", actif: false },
    { value: "Gestion", actif: false },
    { value: "Construction", actif: false },
    { value: "Santé, Sanitaire et Social", actif: false }
  ]

  typeDiplome = [
    { value: "Choissisez le type du diplôme", actif: true },
    { value: "BTS", actif: false },
    { value: "RNCP", actif: false }
  ]

  typeEtude = [
    { value: "Choissisez le type d'étude", actif: true },
    { value: "Initial", actif: false },
    { value: "Apprentissage", actif: false },
    { value: "Continu", actif: false }
  ]

  niveauEtude = [
    { value: "Choissisez le type d'étude", actif: true },
    { value: "Niveau 5", actif: false },
    { value: "Niveau 6", actif: false },
    { value: "Niveau 7", actif: false }
  ]

  choiceList = [
    { label: 'Oui', value: true },
    { label: 'Non', value: false },
  ]

  diplomes: Diplome[] = [];

  formAddDiplome: FormGroup;

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
  display: boolean;

  dicMatiere: any
  constructor(private route: ActivatedRoute, private campusService: CampusService, private diplomeService: DiplomeService, private router: Router, private formBuilder: FormBuilder,
    private messageService: MessageService, private matiereService: MatiereService, private ecoleService: EcoleService, private anneeScolaireService: AnneeScolaireService,
    private formateurService: FormateurService, private AuthService: AuthService) { }

  campusList = [];
  campusListToUpdate = [];

  dicCampus = {};
  dicFormateur = {};
  dropdownFormateur = [];
  token;
  uploadDiplome: Diplome = null

  ngOnInit(): void {
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    if (this.token == null) {
      this.router.navigate(["/login"])
    } else if (this.token["role"].includes("user")) {
      this.router.navigate(["/ticket/suivi"])
    }
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
    this.campusService.getAll().subscribe(
      (data) => {
        this.campusList = data;
        this.onInitFormAddDiplome();
        data.forEach(d => {
          this.dicCampus[d._id] = d
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
    this.onInitFormAddDiplome();
  }

  //Methode d'initialisation du formulaire d'ajout de nouveau diplome
  onInitFormAddDiplome() {
    this.formAddDiplome = this.formBuilder.group({
      titre: ['', Validators.required],
      titre_long: ['', Validators.required],
      campus_id: ['', Validators.required],
      description: ['', Validators.required],
      type_diplome: [this.typeDiplome[0], Validators.required],
      type_etude: [this.typeEtude[0], Validators.required],
      domaine: [this.domaineEtude[0], Validators.required],
      niveau: [this.niveauEtude[0], Validators.required],
      certificateur: ['', Validators.required],
      code_RNCP: ['', Validators.required],
      nb_heure: ['', Validators.required],
      date_debut: [''],
      date_fin: [''],
      rythme: [this.rythmeList[0], Validators.required],
      frais: [''],
      frais_en_ligne: [''],
      isCertified: [this.choiceList[1], Validators.required],
      date_debut_examen: [''],
      date_fin_examen: [''],
      date_debut_stage: [''],
      date_fin_stage: [''],
      code_diplome: ['', Validators.required],
      formateur_id: [''],
    });
  }

  get titre () { return this.formAddDiplome.get('titre'); }
  get titre_long() { return this.formAddDiplome.get('titre_long'); }
  get campus_id () { return this.formAddDiplome.get('campus_id');}
  get description () { return this.formAddDiplome.get('description');}
  get type_diplome () { return this.formAddDiplome.get('type_diplome'); }
  get type_etude() { return this.formAddDiplome.get('type_etude'); }
  get domaine () { return this.formAddDiplome.get('domaine'); }
  get niveau () { return this.formAddDiplome.get('niveau'); }
  get certificateur () { return this.formAddDiplome.get('certificateur'); }
  get code_RNCP () { return this.formAddDiplome.get('code_RNCP'); }
  get nb_heure () { return this.formAddDiplome.get('nb_heure'); }
  get rythme () { return this.formAddDiplome.get('rythme'); }
  get isCertified () { return this.formAddDiplome.get('isCertified'); }
  get code_diplome () { return this.formAddDiplome.get('code_diplome'); }

  resetAddDiplome() {
    this.formAddDiplome.reset()
    this.formAddDiplome.patchValue({
      campus_id: this.campusList[0], type_diplome: this.typeDiplome[0], type_etude: this.typeEtude[0],
      domaine: this.domaineEtude[0], rythme: this.rythmeList[0], isCertified: false, niveau: this.niveauEtude[0]
    })
  }


  //Methode d'ajout du nouveau diplome dans la base de données
  onAddDiplome() {
    //recupération des données du formulaire
    let titre = this.formAddDiplome.get('titre')?.value;
    let titre_long = this.formAddDiplome.get('titre_long')?.value;
    let campus_id = this.formAddDiplome.get('campus_id')?.value._id;
    let description = this.formAddDiplome.get('description')?.value;
    let type_diplome = this.formAddDiplome.get('type_diplome')?.value.value;
    let type_etude = this.formAddDiplome.get('type_etude')?.value.value;
    let domaine = this.formAddDiplome.get('domaine')?.value.value;
    let niveau = this.formAddDiplome.get('niveau')?.value.value;
    let certificateur = this.formAddDiplome.get('certificateur')?.value;
    let code_RNCP = this.formAddDiplome.get('code_RNCP')?.value;
    let nb_heure = this.formAddDiplome.get('nb_heure')?.value;
    let date_debut = this.formAddDiplome.get('date_debut')?.value;
    let date_fin = this.formAddDiplome.get('date_fin')?.value;
    let rythme = this.formAddDiplome.get('rythme')?.value.value;
    let frais = this.formAddDiplome.get('frais')?.value;
    let frais_en_ligne = this.formAddDiplome.get('frais_en_ligne')?.value;
    let isCertified = this.formAddDiplome.get('isCertified')?.value.value;
    let date_debut_examen = this.formAddDiplome.get('date_debut_examen')?.value;
    let date_fin_examen = this.formAddDiplome.get('date_fin_examen')?.value;
    let date_debut_stage = this.formAddDiplome.get('date_debut_stage')?.value;
    let date_fin_stage = this.formAddDiplome.get('date_fin_stage')?.value;
    let code_diplome = this.formAddDiplome.get('code_diplome')?.value;
    let formateur_id = this.formAddDiplome.get('formateur_id')?.value.value;

    //création et envoie du nouvelle objet diplôme
    let newDiplome = new Diplome(
      null, titre, titre_long, campus_id, description, type_diplome, type_etude, domaine, niveau, certificateur,
      code_RNCP, nb_heure, date_debut, date_fin, rythme, frais, frais_en_ligne,
      isCertified, date_debut_examen, date_fin_examen, date_debut_stage, date_fin_stage, code_diplome, null, null, formateur_id
    );
    this.diplomeService.create(newDiplome).subscribe(
      (() => {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Ajout de diplôme', detail: 'Ce diplôme a bien été ajouté' });
        this.diplomeService.getAll().subscribe(
          (data) => { this.diplomes = data; },
          (error) => { console.error(error) }
        );
      }),
      ((error) => { console.error(error); })
    );
    this.showFormAddDiplome = false;
    this.resetAddDiplome()
  }

  //Méthode de récupération du diplôme à mettre à jout
  onGetbyId(diplome) {
    //Recuperation du diplome à modifier
    this.diplomeToUpdate = diplome;
    this.formUpdateDiplome.patchValue({ campus_id: this.dicCampus[diplome.campus_id] })
    if (diplome.formateur_id && diplome.formateur_id != null) {
      this.dropdownFormateur.forEach(f => {
        if (f.value == diplome.formateur_id) {
          this.formUpdateDiplome.patchValue({ formateur_id: f })
        }
      })
    } else {
      this.formUpdateDiplome.patchValue({ formateur_id: null })
    }

    this.formUpdateDiplome.patchValue({
      titre: this.diplomeToUpdate.titre, titre_long: this.diplomeToUpdate.titre_long, description: this.diplomeToUpdate.description,
      type_diplome: { value: this.diplomeToUpdate.type_diplome }, type_etude: { value: this.diplomeToUpdate.type_etude }, domaine: { value: this.diplomeToUpdate.domaine },
      niveau: { value: this.diplomeToUpdate.niveau }, certificateur: this.diplomeToUpdate.certificateur, code_RNCP: this.diplomeToUpdate.code_RNCP,
      nb_heure: this.diplomeToUpdate.nb_heure, date_debut: this.diplomeToUpdate.date_debut, date_fin: this.diplomeToUpdate.date_fin,
      rythme: { value: this.diplomeToUpdate.rythme }, frais: this.diplomeToUpdate.frais,
      frais_en_ligne: this.diplomeToUpdate.frais_en_ligne,
      isCertified: this.diplomeToUpdate.isCertified,
      date_debut_examen: this.diplomeToUpdate.date_debut_examen,
      date_fin_examen: this.diplomeToUpdate.date_fin_examen,
      date_debut_stage: this.diplomeToUpdate.date_debut_stage,
      date_fin_stage: this.diplomeToUpdate.date_fin_stage,
      code_diplome: this.diplomeToUpdate.code_diplome
    });

  }

  //Methode d'initialisation du formulaire de modification de diplome
  onInitFormUpdateDiplome() {
    this.formUpdateDiplome = this.formBuilder.group({
      titre: ['', Validators.required],
      titre_long: ['', Validators.required],
      campus_id: ['', Validators.required],
      description: ['', Validators.required],
      type_diplome: ['', Validators.required],
      type_etude: ['', Validators.required],
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
      code_diplome: ['', Validators.required],
      formateur_id: ['']
    });
  }

  //Methode d'ajout du nouveau diplome dans la base de données
  onUpdateDiplome() {

    //Mis à jour du diplome et envoi dans la base de données
    this.diplomeToUpdate.titre = this.formUpdateDiplome.get('titre')?.value;
    this.diplomeToUpdate.titre_long = this.formUpdateDiplome.get('titre_long')?.value;
    this.diplomeToUpdate.campus_id = this.formUpdateDiplome.get('campus_id')?.value._id;
    this.diplomeToUpdate.description = this.formUpdateDiplome.get('description')?.value;
    this.diplomeToUpdate.type_diplome = this.formUpdateDiplome.get('type_diplome')?.value.value;
    this.diplomeToUpdate.type_etude = this.formUpdateDiplome.get('type_etude')?.value.value;
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
    this.diplomeToUpdate.code_diplome = this.formUpdateDiplome.get('code_diplome')?.value;
    this.diplomeToUpdate.formateur_id = this.formUpdateDiplome.get('formateur_id')?.value;

    this.diplomeService.update(this.diplomeToUpdate).subscribe(
      (() => {
        this.messageService.add({ severity: 'success', summary: 'Modification de diplôme', detail: 'Cet diplôme a bien été modifié' });
        this.diplomeService.getAll().subscribe(
          (data) => { this.diplomes = data; },
          (error) => { console.error(error) }
        );
      }),
      ((error) => { console.error(error); })
    );

    this.showFormUpdateDiplome = false;
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


}

