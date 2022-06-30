import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import jwt_decode from "jwt-decode";
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EcoleService } from 'src/app/services/ecole.service';
import { CampusService } from 'src/app/services/campus.service';
import { AnneeScolaireService } from 'src/app/services/annee-scolaire.service';
import { Ecole } from 'src/app/models/Ecole';
import { Campus } from 'src/app/models/Campus';

@Component({
  selector: 'app-add-campus',
  templateUrl: './add-campus.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./add-campus.component.scss']
})
export class AddCampusComponent implements OnInit {

  ecoles: Ecole[] = []
  dropdownEcole: any[] = [{ libelle: "Toutes les Ecoles", value: null }];
  campuss: Campus[] = [];
  ecoleid: String;
  AnneeSelected: any;
  EcoleSelected: any;
  display: boolean;

  addcampusForm: FormGroup = new FormGroup({
    libelle: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
    ecole_id: new FormControl('', Validators.required),
    ville: new FormControl('PARIS', [Validators.required,Validators.pattern('[^0-9]+')]),
    pays: new FormControl('', [Validators.required,Validators.pattern('[^0-9]+')]),
    email: new FormControl('', [Validators.pattern("^[a-z0-9._%+-]+((@estya+\.com)|(@estyagroup+\.com)|(@elitech+\.education)|(@eduhorizons+\.com)|(@academiedesgouvernantes+\.com))$")]),
    adresse: new FormControl('', Validators.required),
    site: new FormControl(''),
  });

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

  saveCampus() {
    let campus = new Campus(null, this.addcampusForm.value.libelle, this.addcampusForm.value.ecole_id.value, this.addcampusForm.value.ville, this.addcampusForm.value.pays, this.addcampusForm.value.email, this.addcampusForm.value.adresse, this.addcampusForm.value.site)
    console.log(campus)
    this.campusService.createCampus(campus).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des campus', detail: 'Votre campus a bien été ajouté' });
      this.campuss.push(data)
      this.addcampusForm.reset();
    }, (error) => {
      console.error(error)
    });
  }

  navigatetoDiplome(rowData: Campus) {
    this.router.navigateByUrl('/diplome/' + rowData._id);
  }

}
