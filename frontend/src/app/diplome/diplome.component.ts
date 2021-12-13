import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Campus } from '../models/Campus';
import { Diplome } from '../models/Diplome';
import { User } from '../models/User';
import { CampusService } from '../services/campus.service';
import { DiplomeService } from '../services/diplome.service';


@Component({
  selector: 'app-diplome',
  templateUrl: './diplome.component.html',
  styleUrls: ['./diplome.component.css']
})
export class DiplomeComponent implements OnInit {


  diplomes: Diplome[] = [];

  formAddDiplome: FormGroup;
  showFormAddDiplome: boolean = false;

  formUpdateDiplome: FormGroup;
  showFormUpdateDiplome: boolean = false;
  diplomeToUpdate: Diplome = new Diplome();
  idDiplomeToUpdate: string;

  campusList = [];
  campusListToUpdate = [];

  dicCampus = {};

  constructor(private diplomeService: DiplomeService, private router: Router, private campusService: CampusService, private formBuilder: FormBuilder, private messageService: MessageService) { }

  ngOnInit(): void {
    //Recuperation de la liste des diplômes
    this.diplomeService.getAll().subscribe(
      (data) => { this.diplomes = data; },
      (error) => { console.log(error) }
    );

    //Initialisation du formulaire d'ajout de diplome
    this.onInitFormAddDiplome();

    //Initialisation du formulaire de modification de diplome
    this.onInitFormUpdateDiplome();

    //Recuperation de la liste des campus
    this.campusService.getAll().subscribe(
      ((response) => 
      {
        this.campusListToUpdate = response;
        response.forEach(campus => {
          this.campusList.push({label: campus.libelle, value: campus._id, id: campus._id});
          
          this.dicCampus[campus._id] = campus;
        });
      }),
      ((error) => { console.log(error) })
    );

  }

  //Methode d'initialisation du formulaire d'ajout de nouveau diplome
  onInitFormAddDiplome() {
    this.formAddDiplome = this.formBuilder.group({
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
      duree: ['', Validators.required],
      nb_heure: ['', Validators.required],
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required],
      rythme: ['', Validators.required],
      frais: ['', Validators.required],
      frais_en_ligne: ['', Validators.required],
    });
  }


  //Methode d'ajout du nouveau diplome dans la base de données
  onAddDiplome() {
    //recupération des données du formulaire
    let titre = this.formAddDiplome.get('titre')?.value;
    let titre_long = this.formAddDiplome.get('titre_long')?.value;
    let campus_id = this.formAddDiplome.get('campus_id')?.value.id;
    let description = this.formAddDiplome.get('description')?.value;
    let type_diplome = this.formAddDiplome.get('type_diplome')?.value;
    let type_etude = this.formAddDiplome.get('type_etude')?.value;
    let domaine = this.formAddDiplome.get('domaine')?.value;
    let niveau = this.formAddDiplome.get('niveau')?.value;
    let certificateur = this.formAddDiplome.get('certificateur')?.value;
    let code_RNCP = this.formAddDiplome.get('code_RNCP')?.value;
    let duree = this.formAddDiplome.get('duree')?.value;
    let nb_heure = this.formAddDiplome.get('nb_heure')?.value;
    let date_debut = this.formAddDiplome.get('date_debut')?.value;
    let date_fin = this.formAddDiplome.get('date_fin')?.value;
    let rythme = this.formAddDiplome.get('rythme')?.value;
    let frais = this.formAddDiplome.get('frais')?.value;
    let frais_en_ligne = this.formAddDiplome.get('frais_en_ligne')?.value;

    //création et envoie du nouvelle objet diplôme
    let newDiplome = new Diplome(
      null, titre, titre_long, campus_id, description, type_diplome, type_etude, domaine, niveau, certificateur,
      code_RNCP, duree, nb_heure, date_debut, date_fin, rythme, frais, frais_en_ligne
    );

    this.diplomeService.create(newDiplome).subscribe(
      (() => 
      { 
        this.messageService.add({ severity: 'success', summary: 'Ajout de diplôme', detail: 'Cet diplôme a bien été ajouté' });
        this.diplomeService.getAll().subscribe(
          (data) => { this.diplomes = data; },
          (error) => { console.log(error) }
        );
      }),
      ((error) => { console.log("impossible d'ajouter le diplome " + error.message); })
    );

    this.showFormAddDiplome = false;
  }

  //Methode de recuperation du diplome à mettre à jour
  onGetbyId(diplome)
  {
    //Recuperation du diplome à modifier
    this.diplomeToUpdate = diplome; 
    
    this.formUpdateDiplome.patchValue({ campus_id: this.dicCampus[diplome.campus_id], titre: this.diplomeToUpdate.titre, titre_long: this.diplomeToUpdate.titre_long, description: this.diplomeToUpdate.description, type_diplome: this.diplomeToUpdate.type_diplome, type_etude: this.diplomeToUpdate.type_etude, domaine: this.diplomeToUpdate.domaine, niveau: this.diplomeToUpdate.niveau, certificateur: this.diplomeToUpdate.certificateur, code_RNCP: this.diplomeToUpdate.code_RNCP, duree: this.diplomeToUpdate.duree, nb_heure: this.diplomeToUpdate.nb_heure, date_debut: this.diplomeToUpdate.date_debut, date_fin: this.diplomeToUpdate.date_fin, rythme: this.diplomeToUpdate.rythme, frais: this.diplomeToUpdate.frais, frais_en_ligne: this.diplomeToUpdate.frais_en_ligne});
    
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
      duree: ['', Validators.required],
      nb_heure: ['', Validators.required],
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required],
      rythme: ['', Validators.required],
      frais: ['', Validators.required],
      frais_en_ligne: ['', Validators.required],
    });
  }

  //Methode d'ajout du nouveau diplome dans la base de données
  onUpdateDiplome() 
  {

    //Mis à jour du diplome et envoi dans la base de données
    this.diplomeToUpdate.titre = this.formUpdateDiplome.get('titre')?.value;
    this.diplomeToUpdate.titre_long = this.formUpdateDiplome.get('titre_long')?.value;
    this.diplomeToUpdate.campus_id = this.formUpdateDiplome.get('campus_id')?.value.id;
    this.diplomeToUpdate.description = this.formUpdateDiplome.get('description')?.value;
    this.diplomeToUpdate.type_diplome = this.formUpdateDiplome.get('type_diplome')?.value;
    this.diplomeToUpdate.type_etude = this.formUpdateDiplome.get('type_etude')?.value;
    this.diplomeToUpdate.domaine = this.formUpdateDiplome.get('domaine')?.value;
    this.diplomeToUpdate.niveau = this.formUpdateDiplome.get('niveau')?.value;
    this.diplomeToUpdate.certificateur = this.formUpdateDiplome.get('certificateur')?.value;
    this.diplomeToUpdate.code_RNCP = this.formUpdateDiplome.get('code_RNCP')?.value;
    this.diplomeToUpdate.duree = this.formUpdateDiplome.get('duree')?.value;
    this.diplomeToUpdate.nb_heure = this.formUpdateDiplome.get('nb_heure')?.value;
    this.diplomeToUpdate.date_debut = this.formUpdateDiplome.get('date_debut')?.value;
    this.diplomeToUpdate.date_fin = this.formUpdateDiplome.get('date_fin')?.value;
    this.diplomeToUpdate.rythme = this.formUpdateDiplome.get('rythme')?.value;
    this.diplomeToUpdate.frais = this.formUpdateDiplome.get('frais')?.value;
    this.diplomeToUpdate.frais_en_ligne = this.formUpdateDiplome.get('frais_en_ligne')?.value;

    this.diplomeService.update(this.diplomeToUpdate).subscribe(
      ( () => 
      {
        this.messageService.add({ severity: 'success', summary: 'Modification de diplôme', detail: 'Cet diplôme a bien été modifié' });
        this.diplomeService.getAll().subscribe(
          (data) => { this.diplomes = data; },
          (error) => { console.log(error) }
        );
      } ),
      ( (error) => { console.log("Modification du diplome impossible " + error.message); })
    );

    this.showFormUpdateDiplome = false;
  }


}