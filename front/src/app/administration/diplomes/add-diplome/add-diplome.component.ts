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
    { value: "Choisissez le rythme de la formmation", actif: true },
    { value: "Tous les jours", actif: false },
    { value: "2 jours par semaine", actif: false },
    { value: "1 semaine sur 3", actif: false },
    { value: "1 jour par semaine", actif: false }
  ]

  domaineEtude = [
    { value: "Choisissez le type du diplôme", actif: true },
    { value: "Informatique", actif: false },
    { value: "Commerce", actif: false },
    { value: "Construction", actif: false },
    { value: "Tertiaire", actif: false },
    { value: "Service à la personne", actif: false },
    { value: "Hôtellerie", actif: false },
  ]

  typeDiplome = [
    { value: "Choisissez le type du diplôme", actif: true },
    { value: "BTS", actif: false },
    { value: "RNCP", actif: false },
    { value: "CAP", actif: false },
  ]

  typeEtude = [
    { value: "Choisissez le type d'étude", actif: true },
    { value: "Initial", actif: false },
    { value: "Apprentissage", actif: false },
    { value: "Continu", actif: false }
  ]

  niveauEtude = [
    { value: "Choisissez le type d'étude", actif: true },
    { value: "Niveau 3", actif: false },
    { value: "Niveau 4", actif: false },
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
        data.forEach(d => {
          this.campusList.push({ value: d._id, label: d.libelle })
          this.dicCampus[d._id] = d
        });
        this.onInitFormAddDiplome();

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
      type_diplome: [this.typeDiplome[0], Validators.required],
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
      cb_an: ['2 ans', Validators.required],
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
    });
  }

  get titre() { return this.formAddDiplome.get('titre'); }
  get titre_long() { return this.formAddDiplome.get('titre_long'); }
  get campus_id() { return this.formAddDiplome.get('campus_id'); }
  get description() { return this.formAddDiplome.get('description'); }
  get type_diplome() { return this.formAddDiplome.get('type_diplome'); }
  get type_etude() { return this.formAddDiplome.get('type_etude'); }
  get domaine() { return this.formAddDiplome.get('domaine'); }
  get niveau() { return this.formAddDiplome.get('niveau'); }
  get certificateur() { return this.formAddDiplome.get('certificateur'); }
  get code_RNCP() { return this.formAddDiplome.get('code_RNCP'); }
  get nb_heure() { return this.formAddDiplome.get('nb_heure'); }
  get rythme() { return this.formAddDiplome.get('rythme'); }
  get isCertified() { return this.formAddDiplome.get('isCertified'); }
  get code_diplome() { return this.formAddDiplome.get('code_diplome'); }
  get cb_an() { return this.formAddDiplome.get('cb_an'); }

  resetAddDiplome() {
    this.onInitFormAddDiplome()
  }


  //Methode d'ajout du nouveau diplome dans la base de données
  onAddDiplome() {
    //recupération des données du formulaire
    let titre = this.formAddDiplome.get('titre')?.value;
    let titre_long = this.formAddDiplome.get('titre_long')?.value;
    let campus_id = this.formAddDiplome.get('campus_id')?.value._id;
    let type_diplome = this.formAddDiplome.get('type_diplome')?.value.value;
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
    let date_debut_semestre_1 = new Date(this.formAddDiplome.get('date_debut_semestre_1')?.value);
    let date_fin_semestre_1 = new Date(this.formAddDiplome.get('date_fin_semestre_1')?.value);
    let date_debut_semestre_2 = new Date(this.formAddDiplome.get('date_debut_semestre_2')?.value);
    let date_fin_semestre_2 = new Date(this.formAddDiplome.get('date_fin_semestre_2')?.value);
    let date_debut_semestre_3 = new Date(this.formAddDiplome.get('date_debut_semestre_3')?.value);
    let date_fin_semestre_3 = new Date(this.formAddDiplome.get('date_fin_semestre_3')?.value);
    let date_debut_semestre_4 = new Date(this.formAddDiplome.get('date_debut_semestre_4')?.value);
    let date_fin_semestre_4 = new Date(this.formAddDiplome.get('date_fin_semestre_4')?.value);
    let cb_an = this.formAddDiplome.get('cb_an')?.value;
    let code_diplome = this.formAddDiplome.get('code_diplome')?.value;
    let formateur_id = this.formAddDiplome.get('formateur_id')?.value.value;

    //création et envoie du nouvel objet diplôme
    let newDiplome = new Diplome(
      null, titre, titre_long, campus_id, type_diplome, domaine, niveau, certificateur,
      code_RNCP, nb_heure, date_debut, date_fin, rythme, frais, frais_en_ligne,
      isCertified, date_debut_examen, date_fin_examen, date_debut_stage, date_fin_stage, date_debut_semestre_1, date_fin_semestre_1, date_debut_semestre_2, date_fin_semestre_2, 
      code_diplome, null, null, formateur_id,date_debut_semestre_3,date_fin_semestre_3,date_debut_semestre_4,date_fin_semestre_4,cb_an
    );
    this.diplomeService.create(newDiplome).subscribe(
      (() => {
        this.messageService.add({ key: 'tst', severity: 'success', summary: 'Ajout de diplôme', detail: 'Ce diplôme a bien été ajouté' });
        this.router.navigate(['diplomes']);
      }),
      ((error) => { console.error(error); })
    );
    this.showFormAddDiplome = false;
    this.resetAddDiplome()
  }

}

