import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import jwt_decode from "jwt-decode";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EcoleService } from 'src/app/services/ecole.service';
import { CampusService } from 'src/app/services/campus.service';
import { AnneeScolaireService } from 'src/app/services/annee-scolaire.service';
import { Ecole } from 'src/app/models/Ecole'
import { Campus } from 'src/app/models/Campus'
import { CampusRService } from 'src/app/services/administration/campus-r.service';
import { CampusR } from 'src/app/models/CampusRework';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';

@Component({
  selector: 'app-list-campus',
  templateUrl: './list-campus.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./list-campus.component.scss']
})
export class ListCampusComponent implements OnInit {

  ecoles: Ecole[] = []
  dropdownEcole: any[] = [];
  campuss: CampusR[] = [];
  campusToUpdate: CampusR;

  campusFormUpdate: FormGroup = new FormGroup({
    libelle: new FormControl('', [Validators.required]),
    adresse: new FormControl('', Validators.required),
  })
  addEcoleForm: FormGroup = new FormGroup({
    ecole_id: new FormControl('', [Validators.required]),
    email: new FormControl(''),
    _id: new FormControl('', [Validators.required]),
  })
  salles = []

  onAddSalle() {
    this.salles.push("")
  }
  changeValue(i, value) {
    this.salles[i] = value
  }
  token;

  constructor(private FAService: FormulaireAdmissionService, private messageService: MessageService, private campusRService: CampusRService, private route: ActivatedRoute, private router: Router, private anneeScolaireService: AnneeScolaireService) { }

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
    this.FAService.EAgetAll().subscribe((data) => {
      data.forEach(ecole => {
        this.dropdownEcole.push({ label: ecole.titre, value: ecole })
        this.ecoles[ecole._id] = ecole;
      }, (error) => {
        console.error(error)
      });

    })
  }
  ecolesList = []
  dicCampus = {}//campus_id : Ecole[]
  updateList() {
    this.campusRService.getAll().subscribe((data) => {
      this.campuss = data;
      //Regrouper par école
      console.log(data);
    })
  }

  editCampus() {
    this.campusRService.update({ _id: this.campusToUpdate._id, ...this.campusFormUpdate.value, salles: this.salles }).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des campus', detail: 'Votre campus a bien été ajouté' });
      this.campuss.splice(this.campuss.indexOf(this.campusToUpdate), 1, data)
      this.campusToUpdate = null;
    }, (error) => {
      console.error(error)
    });

  }

  showModify(rowData: CampusR) {
    this.campusToUpdate = rowData;
    this.salles = rowData.salles
    this.scrollToTop()
    this.campusFormUpdate.patchValue({ ...rowData })
  }

  scrollToTop() {
    var scrollDuration = 250;
    var scrollStep = -window.scrollY / (scrollDuration / 15);

    var scrollInterval = setInterval(function () {
      if (window.scrollY > 120) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }

  onAddCampus(campus) {
    this.campuss.push(campus)
  }
  delete(campus: CampusR) {
    if (confirm('Êtes-vous sûr de supprimer ce campus ?'))
      this.campusRService.delete(campus._id).subscribe(c => {
        this.campuss.splice(this.campuss.indexOf(campus), 1)
      })
  }
  showEcoles: CampusR
  onAddEcole(campus: CampusR) {
    this.showEcoles = campus
    this.addEcoleForm.patchValue({ _id: campus._id, ecole_id: this.dropdownEcole[0].value })
  }
  addEcole() {
    this.showEcoles.ecoles.push({ ecole_id: this.addEcoleForm.value.ecole_id._id, email: this.addEcoleForm.value.email })
    this.campusRService.update({ _id: this.showEcoles._id, ecoles: this.showEcoles.ecoles }).subscribe(r => {
      this.campuss.splice(this.campuss.indexOf(this.showEcoles), 1, r)
      this.showEcoles = r
    })
  }
  showEcolesStr(campus: CampusR) {
    let r = "Aucune"
    campus.ecoles.forEach(ec => {
      if (ec.ecole_id?.titre) {
        if (r == 'Aucune')
          r = ec.ecole_id.titre
        else
          r = r + ", " + ec.ecole_id.titre
      }
    })
    return r
  }
  selectedCampus: Campus
  afficherSalles = false
}
