import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
import { CampusRService } from 'src/app/services/administration/campus-r.service';
import { CampusR } from 'src/app/models/CampusRework';

@Component({
  selector: 'app-add-campus',
  templateUrl: './add-campus.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./add-campus.component.scss']
})
export class AddCampusComponent implements OnInit {

  @Output() createCampus = new EventEmitter<CampusR>()
  addcampusForm: FormGroup = new FormGroup({
    libelle: new FormControl('', [Validators.required]),
    adresse: new FormControl('', [Validators.required]),
  });
  token;

  constructor(private ecoleService: EcoleService, private messageService: MessageService, private campusService: CampusRService,
    private route: ActivatedRoute, private router: Router, private anneeScolaireService: AnneeScolaireService) { }

  ngOnInit(): void {
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
  }

  get libelle() { return this.addcampusForm.get('libelle'); }
  get adresse() { return this.addcampusForm.get('adresse'); };

  saveCampus() {
    this.campusService.create({ ...this.addcampusForm.value }).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des campus', detail: 'Votre campus a bien été ajouté' });
      this.addcampusForm.reset();
      this.createCampus.emit(data)
    }, (error) => {
      console.error(error)
    });
  }

}
