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

@Component({
  selector: 'app-list-campus',
  templateUrl: './list-campus.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./list-campus.component.scss']
})
export class ListCampusComponent implements OnInit {

  ecoles: Ecole[] = []
  dropdownEcole: any[] = [{ libelle: "Toutes les Ecoles", value: null }];
  campuss: Campus[] = [];
  campusToUpdate: Campus;
  ecoleid: String;
  AnneeSelected: any;
  EcoleSelected: any;

  showFormUpdateCampus: boolean = false;

  campusFormUpdate: FormGroup = new FormGroup({

    libelle: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ- ]+$')]),
    ecole_id: new FormControl('', Validators.required),
    ville: new FormControl('PARIS', [Validators.required,Validators.pattern('[^0-9]+')]),
    pays: new FormControl('', [Validators.required,Validators.pattern('[^0-9]+')]),
    email: new FormControl('', [Validators.pattern("^[a-z0-9._%+-]+((@estya+\.com)|(@estyagroup+\.com)|(@elitech+\.education)|(@eduhorizons+\.com)|(@academiedesgouvernantes+\.com))$")]),
    adresse: new FormControl('', Validators.required),
    site: new FormControl(''),
  })
  columns = [
  ]
  token;

  constructor(private ecoleService: EcoleService, private messageService: MessageService, private campusService: CampusService, private route: ActivatedRoute, private router: Router, private anneeScolaireService: AnneeScolaireService) { }

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
    this.ecoleid = this.route.snapshot.paramMap.get('id');
    this.updateList()
    this.ecoleService.getAll().subscribe((data) => {
      data.forEach(ecole => {
        this.dropdownEcole.push({ libelle: ecole.libelle, value: ecole._id })
        this.ecoles[ecole._id] = ecole;
      }, (error) => {
        console.error(error)
      });

    })
    this.ecoleService.getByID(this.ecoleid).subscribe((data) => {
      let idanneeselected = data.dataEcole.annee_id;
      this.EcoleSelected = data.dataEcole;
      this.anneeScolaireService.getByID(idanneeselected).subscribe((data2) => {
        this.AnneeSelected = data2.dataAnneeScolaire;
      })
    })
  }

  updateList() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.campusService.getAllByEcole(id).subscribe((data) => {
        this.campuss = data;
      })
    }
    else {
      this.campusService.getAll().subscribe((data) => {
        this.campuss = data;

      })
    }
  }

  editCampus() {
    let campus = new Campus(this.campusToUpdate._id, this.campusFormUpdate.value.libelle, this.campusFormUpdate.value.ecole_id.value, this.campusFormUpdate.value.ville, this.campusFormUpdate.value.pays, this.campusFormUpdate.value.email, this.campusFormUpdate.value.adresse, this.campusFormUpdate.value.site)
    this.campusService.edit(campus).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des campus', detail: 'Votre campus a bien été ajouté' });

      this.showFormUpdateCampus = false;
      this.updateList();
    }, (error) => {
      console.error(error)
    });

  }

  showModify(rowData: Campus) {
    this.campusToUpdate = rowData;
    this.showFormUpdateCampus = true;
    this.campusFormUpdate.setValue({ libelle: rowData.libelle, ecole_id: rowData.ecole_id, email: rowData.email, site: rowData.site, pays: rowData.pays, adresse: rowData.adresse, ville: rowData.ville })
  }

  navigatetoDiplome(rowData: Campus) {
    this.router.navigate(['/diplomes/', rowData._id]);
  }

}
