import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Classe } from 'src/app/models/Classe';
import { Diplome } from 'src/app/models/Diplome';
import { ClasseService } from 'src/app/services/classe.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-list-groupe',
  templateUrl: './list-groupe.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./list-groupe.component.scss']
})
export class ListGroupeComponent implements OnInit {

  formUpdateClasse: FormGroup;
  showFormUpdateClasse: boolean = false;

  classes: Classe[] = [];
  classeToUpdate: Classe;
  idClasseToUpdate: string;
  numberClasse = {};

  diplomes: Diplome[] = [];
  dropdownDiplome: any[] = [{ libelle: "Touts les diplômes", value: null }];
  diplomeToUpdate: string;
  token;

  constructor(private diplomeService: DiplomeService, private formBuilder: FormBuilder, private classeService: ClasseService, private messageService: MessageService
    , private router: Router, private EtudiantService: EtudiantService) { }

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
    this.diplomes = [];

    this.classeService.getAll().subscribe(
      ((response) => { this.classes = response; }),
      ((error) => { console.log(error); })
    );

    this.EtudiantService.getAll().subscribe(
      ((etudiants) => {
        etudiants.forEach(data => {
          if(this.numberClasse[data.classe_id]){
            this.numberClasse[data.classe_id]+=1
          }else{
            this.numberClasse[data.classe_id]=1
          }
        })
      })
    );

    this.diplomeService.getAll().subscribe(
      ((responseD) => {
        responseD.forEach(diplome => {
          this.dropdownDiplome.push({ libelle: diplome.titre, value: diplome._id });
          this.diplomes[diplome._id] = diplome;
        })
      }),
      ((error) => { console.log(error); })
    );

    this.onInitFormUpdateClasse();

  }

  onInitFormUpdateClasse() {
    this.formUpdateClasse = this.formBuilder.group({
      libelle: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9éèàêô -]+$")]],
      diplome_id: ['', Validators.required],
      abbrv: ['', Validators.required],
    });
  }

  modifyClasse() {
    //Recuperation des données du formulaire
    let libelle = this.formUpdateClasse.get('libelle')?.value;
    let diplome_id = this.formUpdateClasse.get('diplome_id')?.value.value;
    let abbrv = this.formUpdateClasse.get('abbrv')?.value;

    let classe = new Classe(this.idClasseToUpdate, diplome_id, libelle,true,abbrv);

    this.classeService.update(classe).subscribe(
      ((response) => {
        this.messageService.add({ severity: 'success', summary: 'Votre classe a bien été modifié' });

        this.classeService.getAll().subscribe(
          ((responseC) => { this.classes = responseC; }),
          ((error) => { console.log(error); })
        );

        this.showFormUpdateClasse = false;
        this.formUpdateClasse.reset();
      }),
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Modification impossible' });
      });
  }


  onGetById() {
    this.classeService.get(this.idClasseToUpdate).subscribe(
      ((response) => {
        this.classeToUpdate = response;
        this.formUpdateClasse.patchValue({ libelle: this.classeToUpdate.nom, diplome_id: { libelle: this.diplomeToUpdate, value: this.classeToUpdate.diplome_id },abbrv:this.classeToUpdate.abbrv });
      }),
      ((error) => { console.log(error); })
    );
  }

  get libelle_m() { return this.formUpdateClasse.get('libelle'); }
  get abbrv() { return this.formUpdateClasse.get('abbrv'); }


  hide(classe: Classe) {
    this.classeService.hide(classe._id).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des classes', detail: classe.nom + ' ne s\'affichera plus dans la liste' });

      this.classeService.getAll().subscribe(
        ((response) => { this.classes = response; }),
        ((error) => { console.log(error); })
      );

    }, (error) => {
      console.error(error)
    });
  }

  show(classe: Classe) {
    this.classeService.show(classe._id).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des classes', detail: classe.nom + ' s\'affichera de nouveau dans la liste' });

      this.classeService.getAll().subscribe(
        ((response) => { this.classes = response; }),
        ((error) => { console.log(error); })
      );

    }, (error) => {
      console.error(error)
    });
  }

  onGetColor(color: boolean) {
    if (!color) {
      return 'gray';
    }
  }

  showCalendar(rowData){
    this.router.navigate(['/emploi-du-temps/classe/'+rowData._id])
  }

  sendCalendar(rowData){
    this.EtudiantService.sendEDT(rowData._id).subscribe(data=>{
      this.messageService.add({severity: 'success', summary: 'Envoie des emplois du temps', detail: "Les emplois du temps ont bien été envoyé"})
    },error=>{
      console.error(error)
      this.messageService.add({severity: 'error', summary: 'Erreur avec les emplois du temps', detail: "Contacte un Admin"})
    })
  }

  sendNotes(rowData: Classe)
  {
    this.router.navigate(['/pv', rowData._id]);
  }

}
