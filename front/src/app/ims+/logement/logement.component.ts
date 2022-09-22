import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { ConfirmationService, MessageService } from 'primeng/api';

import jwt_decode from "jwt-decode";
import { FormBuilder, FormGroup } from '@angular/forms';
import { Reservation } from 'src/app/models/Reservation';
import { LogementService } from 'src/app/services/logement.service';

@Component({
  selector: 'app-logement',
  templateUrl: './logement.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./logement.component.scss']
})
export class LogementComponent implements OnInit {

  showFormReservation1: boolean = false;
  formReservation1: FormGroup;
  showFormReservation2: boolean = false;
  formReservation2: FormGroup;

  dropdownEtudiant = [{ name: '', _id: null }];

  token: any;

  constructor(private messageService: MessageService, private logementService: LogementService, private router: Router, private etudiantService: EtudiantService, private userService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    //decodage du token
    this.token = jwt_decode(localStorage.getItem("token"));
    console.log(this.token);

    //Récupération de la liste des étudiants
    this.userService.getAll().subscribe(
      ((response) => {
        
        this.etudiantService.getAll().subscribe(
          ((response2) => {
            response.forEach(u => {
              response2.forEach(e => {
                if(e.user_id == u._id) 
                {
                  this.dropdownEtudiant.push({ name: `${u.firstname} ${u.lastname}`, _id: u._id })
                }
              });
            });
          }),
          ((error) => { console.error(error); })
        );

      }),
      ((error) => { console.error(error); })
    );

    //Initialisation des formulaires
    this.onInitFormReservation1();
    this.onInitFormReservation2();

  }


  //Methode d'initialisation des formulaires
  onInitFormReservation1()
  {
    this.formReservation1 = this.formBuilder.group({
      choice: [''],
    });
  }

  onInitFormReservation2()
  {
    this.formReservation2 = this.formBuilder.group({
      choice: [''],
    });
  }


  onReserve1()
  {
    //Récuperation des données du formulaire
    const formValue = this.formReservation1.value;
    //Création d'une nouvelle réservation
    const reservation = new Reservation(
      null,
      this.token.id,
      formValue['choice'],
      false,
    );

    this.logementService.createReservation(reservation).subscribe(
      ((response) => {
        if(response.success)
        {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Nouvelle réservation', detail: response.success });
        }
        else 
        {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Nouvelle réservation', detail: response.error });
        }
      }),
      ((error) => { console.log(error) })
    );
  }

  onReserve2()
  {
    //Récuperation des données du formulaire
    const formValue = this.formReservation2.value;
    //Création d'une nouvelle réservation
    const reservation = new Reservation(
      null,
      this.token.id,
      formValue['choice'],
      false,
    );

    this.logementService.createReservation(reservation).subscribe(
      ((response) => {
        if(response.success)
        {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Nouvelle réservation', detail: response.success });
        }
        else 
        {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Nouvelle réservation', detail: response.error });
        }      }),
      ((error) => { console.log(error) })
    );
  }

}
