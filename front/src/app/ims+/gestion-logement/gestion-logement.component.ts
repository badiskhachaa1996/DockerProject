import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reservation } from 'src/app/models/Reservation';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { LogementService } from 'src/app/services/logement.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EtudiantService } from 'src/app/services/etudiant.service';

import * as XLSX from 'xlsx'; 
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-gestion-logement',
  templateUrl: './gestion-logement.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./gestion-logement.component.scss']
})
export class GestionLogementComponent implements OnInit {

  reservations: Reservation[] = [];
  reservationWaiting: Reservation[] = [];
  reservationsValidated: Reservation[] = [];

  users: User[] = [];

  dropdownEtudiant = [{ name: '', _id: null }];

  showFormAddReservation: boolean = false;
  formReservation: FormGroup;

  constructor(private etudiantService: EtudiantService, private formBuilder: FormBuilder, private messageService: MessageService, private userService: AuthService, private logementService: LogementService) { }

  ngOnInit(): void {

    //Recuperation de la liste des Utilisateurs
    this.userService.getAll().subscribe(
      ((response) => {
        response.forEach((user: User) => {
          this.users[user._id] = user;
        });
      }),
      ((error) => { console.error(error) })
    );

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

    //Récupération des listes
    this.getReservations();

    this.onInitFormReservation();

  }


  //Recupération de tous les types de réservation
  getReservations(): void
  {
    //Recuperation de la liste des réservations
    this.logementService.getAllReservation().subscribe(
      ((response) => {
        this.reservations = response;
      }),
      ((error) => { console.error(error) })
    );

    //Recuperation de la liste des réservations en attentes
    this.logementService.getAllReservationWaiting().subscribe(
      ((response) => {
        this.reservationWaiting = response;
      }),
      ((error) => { console.error(error) })
    );

    //Recuperation de la liste des réservation validée
    this.logementService.getAllReservationsValidated().subscribe(
      ((response) => {
        this.reservationsValidated = response;
      }),
      ((error) => { console.error(error) })
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
        this.getReservations();

      }),
      ((error) => { console.error(error)})
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
        this.getReservations();

      }),
      ((error) => { console.error(error)})
    );
  }

  //Methode d'initialisation des formulaires
  onInitFormReservation()
  {
    this.formReservation = this.formBuilder.group({
      choice: ['', Validators.required],
      choice2: [''],
    });
  }

  onReserve()
  {
    //Récuperation des données du formulaire
    let choice1 = this.formReservation.get('choice')?.value._id; 
    let choice2 = this.formReservation.get('choice2')?.value._id; 

    console.log(choice1)
    //Création d'une nouvelle réservation
    const reservation = new Reservation(
      null,
      choice1,
      choice2,
      false,
    );

    this.logementService.createReservation(reservation).subscribe(
      ((response) => {
        if(response.success)
        {
          this.messageService.add({ key: 'tst', severity: 'success', summary: 'Nouvelle réservation', detail: response.success });
          
          //Recuperation de la liste des réservation
          this.getReservations();

          this.formReservation.reset();
        }
        else 
        {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Nouvelle réservation', detail: response.error });
        }
      }),
      ((error) => { console.error(error) })
    );
  }


  //Methode d'export en excel
  exportExcel(): void 
    {
      let dataExcel = [];
      
      this.reservationsValidated.forEach((reservation) => {
        let pWR: User = this.users[reservation.pWR];
        let pFFR: User = this.users[reservation.pFFR];

        let t = {}
        t['NOM'] = pWR?.lastname;
        t['Prenom'] = pWR?.firstname;
        t['Email perso'] = pWR?.email_perso;
        t['Email IntedGroup'] = pWR?.email
        t['Téléphone'] = pWR?.phone;

        t['NOM Colocataire'] = pFFR?.lastname;
        t['Prenom Colocataire'] = pFFR?.firstname;
        t['Email perso Colocataire'] = pFFR?.email_perso;
        t['Email IntedGroup Colocataire'] = pFFR?.email
        t['Téléphone Colocataire'] = pFFR?.phone;

        dataExcel.push(t);
      });

      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExcel);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
      const data: Blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      });
      FileSaver.saveAs(data, `reservation_validee_${new Date().toLocaleDateString("fr-FR")}.xlsx`);

			
    }

}
