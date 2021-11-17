import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Seance } from '../models/Seance';
import { SeanceService } from '../services/seance.service';

@Component({
  selector: 'app-seance',
  templateUrl: './seance.component.html',
  styleUrls: ['./seance.component.css']
})
export class SeanceComponent implements OnInit {

  showFormAddSeance: Boolean = false;
  showFormUpdateSeance: Seance = null;

  seances: Seance[] = [];

  seanceForm: FormGroup = new FormGroup({
    classe: new FormControl('', Validators.required),
    debut: new FormControl('', Validators.required),
    fin: new FormControl('', Validators.required),
    formateur: new FormControl('', Validators.required),
  });

  seanceFormUpdate: FormGroup = new FormGroup({
    classe: new FormControl('', Validators.required),
    debut: new FormControl('', Validators.required),
    fin: new FormControl('', Validators.required),
    formateur: new FormControl('', Validators.required),
  });

  columns = [

  ]

  constructor(private seanceService: SeanceService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.updateList()
  }

  updateList() {
    this.seanceService.getAll().subscribe((data) => {
      this.seances = data;
      console.log(data);
    });
  }

  saveSeance() {
    let seance = new Seance(null, this.seanceForm.value.classe, this.seanceForm.value.debut, this.seanceForm.value.fin, this.seanceForm.value.formateur);
    console.log(seance);
    this.seanceService.create(seance).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des séances', detail: 'La séance a bien été ajouté!' });
      this.seances.push(data)
      this.showFormAddSeance = false;
      this.seanceForm.reset();
    }, (error) => {
      console.error(error)
    });
  }

  showModify(rowData: Seance) {
    this.showFormUpdateSeance = rowData;
    this.showFormAddSeance = false;
    this.seanceFormUpdate.setValue({ classe: rowData.classe_id, debut: rowData.date_debut, fin: rowData.date_fin, formateur: rowData.formateur_id });
  }

  modifySeance() {
    let seance = new Seance(this.showFormUpdateSeance._id, this.seanceFormUpdate.value.classe, this.seanceFormUpdate.value.debut, this.seanceFormUpdate.value.fin, this.seanceFormUpdate.value.formateur );

    this.seanceService.update(seance).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Gestion des séances', detail: 'Votre séance a bien été modifié!' });
      this.updateList()
      this.showFormUpdateSeance = null;
      this.seanceFormUpdate.reset();
    }, (error) => {
      console.error(error)
    });
  }
}

