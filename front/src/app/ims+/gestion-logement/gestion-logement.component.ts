import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Reservation } from 'src/app/models/Reservation';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { LogementService } from 'src/app/services/logement.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-gestion-logement',
  templateUrl: './gestion-logement.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./gestion-logement.component.scss']
})
export class GestionLogementComponent implements OnInit {

  reservations: Reservation[] = [];
  users: User[] = [];

  reservationsValidated: Reservation[] = [];

  constructor(private messageService: MessageService, private userService: AuthService, private logementService: LogementService) { }

  ngOnInit(): void {

    //Recuperation de la liste des Utilisateurs
    this.userService.getAll().subscribe(
      ((response) => {
        response.forEach((user: User) => {
          this.users[user._id] = user;
        });
      }),
      ((error) => { console.log(error) })
    );

    //Recuperation de la liste des réservation
    this.logementService.getAllReservation().subscribe(
      ((response) => {
        this.reservations = response;
      }),
      ((error) => { console.log(error) })
    );

    //Recuperation de la liste des réservation validée
    this.logementService.getAllReservationsValidated().subscribe(
      ((response) => {
        this.reservationsValidated = response;
      }),
      ((error) => { console.log(error) })
    );

  }


  //Methode de validation d'une demande de reservation
  onValidate(reservation: Reservation)
  {
    reservation.isValidate = true;
    this.logementService.validateReservation(reservation).subscribe(
      ((response) => {
        if (response.success)
        {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Nouvelle réservation', detail: response.success });
        }

        //Recuperation de la liste des réservation
        this.logementService.getAllReservation().subscribe(
          ((response) => {
            this.reservations = response;
          }),
          ((error) => { console.log(error) })
        );

        //Recuperation de la liste des réservation validée
        this.logementService.getAllReservationsValidated().subscribe(
          ((response) => {
            this.reservationsValidated = response;
          }),
          ((error) => { console.log(error) })
        );

      }),
      ((error) => { console.log(error)})
    );
  }

  //Methode de refus d'une demande de reservation
  onDelete(id: string)
  {
    this.logementService.deleteReservation(id).subscribe(
      ((response) => {
        if (response.success)
        {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Nouvelle réservation', detail: response.success });
        }

        //Recuperation de la liste des réservation
        this.logementService.getAllReservation().subscribe(
          ((response) => {
            this.reservations = response;
          }),
          ((error) => { console.log(error) })
        );

        //Recuperation de la liste des réservation validée
        this.logementService.getAllReservationsValidated().subscribe(
          ((response) => {
            this.reservationsValidated = response;
          }),
          ((error) => { console.log(error) })
        );

      }),
      ((error) => { console.log(error)})
    );
  }

}
