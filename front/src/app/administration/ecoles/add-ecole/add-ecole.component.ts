import { Component, OnInit } from '@angular/core';
import jwt_decode from "jwt-decode";
import { AnneeScolaire } from 'src/app/models/AnneeScolaire';
import { DropdownModule } from 'primeng/dropdown';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EcoleService } from 'src/app/services/ecole.service';
import { AnneeScolaireService } from 'src/app/services/annee-scolaire.service';
import { Ecole } from 'src/app/models/Ecole'
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-add-ecole',
  templateUrl: './add-ecole.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./add-ecole.component.scss']
})
export class AddEcoleComponent implements OnInit {

  annees: AnneeScolaire[] = []
  dropdownAnnee: any[] = [{ libelle: "Toutes les années", value: null }];
  ecoles: Ecole[] = [];
  AnneeSelected : AnneeScolaire;
  display: boolean;

  addecoleForm: FormGroup = new FormGroup({
    libelle: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
    email: new FormControl('', Validators.required),
    site: new FormControl('', Validators.required),
    annee_id: new FormControl('', Validators.required),
    telephone: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+'), Validators.maxLength(14)]),
    adresse: new FormControl('', Validators.required),
    ville: new FormControl('', [Validators.required,Validators.pattern('[^0-9]+')]),
    pays: new FormControl('', [Validators.required,Validators.pattern('[^0-9]+')]),
  });

  columns = []
  token;
  logo;

  constructor(private EcoleService: EcoleService, private messageService: MessageService, private anneeScolaireService: AnneeScolaireService, private route: ActivatedRoute, private router: Router) { }

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
    const id = this.route.snapshot.paramMap.get('id');

    this.anneeScolaireService.getAll().subscribe((data) => {
      data.forEach(anne => {
        this.dropdownAnnee.push({ libelle: anne.libelle, value: anne._id })
        this.annees[anne._id] = anne;

      }, (error) => {
        console.error(error)
      });
    })
    this.anneeScolaireService.getByID(id).subscribe((data) => {
      this.AnneeSelected = data.dataAnneeScolaire
    })


  }

  saveEcole() {
    let ecole = new Ecole(null, this.addecoleForm.value.libelle, this.addecoleForm.value.annee_id.value, this.addecoleForm.value.ville, this.addecoleForm.value.pays, this.addecoleForm.value.adresse, this.addecoleForm.value.email, this.addecoleForm.value.site, this.addecoleForm.value.telephone)
    this.EcoleService.create(ecole).subscribe((data) => {

      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Gestion des écoles', detail: 'Votre ecole a bien été ajouté' });
      this.ecoles.push(data);
      this.addecoleForm.reset(); 
    }, (error) => {
      console.error(error)
    });
  }

}
