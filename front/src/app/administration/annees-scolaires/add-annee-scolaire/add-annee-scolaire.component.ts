import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AnneeScolaireService } from 'src/app/services/annee-scolaire.service';
import { AnneeScolaire } from 'src/app/models/AnneeScolaire'

@Component({
  selector: 'app-add-annee-scolaire',
  templateUrl: './add-annee-scolaire.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./add-annee-scolaire.component.scss']
})
export class AddAnneeScolaireComponent implements OnInit {

  etat_annee: any[] = environment.etat_annee
  showFormAddAnneeScolaire = false;
  showFormUpdateAnneeScolaire: AnneeScolaire = null;
  rangedate: any;
  rangedateS: string = "";
  anneeScolaires: AnneeScolaire[] = [];
  display: boolean;

  anneeScolaireForm: FormGroup = new FormGroup({
    libelle: new FormControl('', Validators.required),
    etat: new FormControl(this.etat_annee[0], Validators.required),
  })

  anneeScolaireFormUpdate: FormGroup = new FormGroup({
    etat: new FormControl('Archivée', Validators.required),
  })

  columns = []
  token;

  constructor(private ASService: AnneeScolaireService, private messageService: MessageService, private router: Router) { }

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
    this.updateList()
  }

  updateList() {
    this.ASService.getAll().subscribe((data) => {
      this.anneeScolaires = data;
    })
  }

  saveAnneeScolaire() {
    let anneeScolaire = new AnneeScolaire(null, String(this.anneeScolaireForm.value.libelle), String(this.anneeScolaireForm.value.etat.value))

    this.ASService.create(anneeScolaire).subscribe((data) => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Gestion des années scolaires', detail: 'Votre année scolaire a bien été ajouté' });
      
      this.anneeScolaires.push(data)
      this.showFormAddAnneeScolaire = false;
      this.anneeScolaireForm.reset();
    }, (error) => {
      console.error(error)
    });
  }
  navigatetoEcole(rowData: AnneeScolaire) {
    this.router.navigateByUrl('/ecoles/' + rowData._id);
  }

  archiverAnneeScolaire(rowData: AnneeScolaire) {
    this.showFormUpdateAnneeScolaire = rowData;
    this.showFormAddAnneeScolaire = false
    let anneeScolaire = this.showFormUpdateAnneeScolaire
    anneeScolaire._id = this.showFormUpdateAnneeScolaire._id
    this.ASService.archivee(anneeScolaire._id).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des anneeScolaires', detail: 'année scolaire a bien été archivé' });
      this.updateList()
      this.showFormUpdateAnneeScolaire = null;
      this.anneeScolaireFormUpdate.reset();
    }, (error) => {
      console.error(error)
    });

  }

  activerAnneeScolaire(rowData: AnneeScolaire) {
    this.showFormUpdateAnneeScolaire = rowData;
    this.showFormAddAnneeScolaire = false
    let anneeScolaire = this.showFormUpdateAnneeScolaire
    anneeScolaire._id = this.showFormUpdateAnneeScolaire._id
    this.ASService.activer(anneeScolaire._id).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des anneeScolaires', detail: "l'année scolaire a bien été Activé" });
      this.updateList()
      this.showFormUpdateAnneeScolaire = null;
      this.anneeScolaireFormUpdate.reset();
    }, (error) => {
      console.error(error)
    });

  }

}
