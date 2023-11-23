import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AnneeScolaireService } from 'src/app/services/annee-scolaire.service';
import { AnneeScolaire } from 'src/app/models/AnneeScolaire'

@Component({
  selector: 'app-list-annee-scolaire',
  templateUrl: './list-annee-scolaire.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./list-annee-scolaire.component.scss']
})
export class ListAnneeScolaireComponent implements OnInit {

  etat_annee: any[] = environment.etat_annee
  showFormAddAnneeScolaire = false;
  showFormUpdateAnneeScolaire: AnneeScolaire = null;
  rangedate: any;
  rangedateS: string = "";
  anneeScolaires: AnneeScolaire[] = [];

  anneeScolaireForm: UntypedFormGroup = new UntypedFormGroup({
    libelle: new UntypedFormControl('', Validators.required),
    etat: new UntypedFormControl('', Validators.required),
  })
  
  anneeScolaireFormUpdate: UntypedFormGroup = new UntypedFormGroup({
    etat: new UntypedFormControl('Archivée', Validators.required),
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
  navigatetoEcole(rowData: AnneeScolaire) {
    this.router.navigate(['/ecole', rowData._id]);
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

  //Methode de redirection vers la page d'ajout d'année scolaire
  onRedirect()
  {
    this.router.navigate(['/ajout-annee-scolaire']);
  }
}
