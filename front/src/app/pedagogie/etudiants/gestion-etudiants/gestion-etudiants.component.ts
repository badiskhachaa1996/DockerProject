import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Campus } from 'src/app/models/Campus';
import { Etudiant } from 'src/app/models/Etudiant';
import { CampusService } from 'src/app/services/campus.service';
import { EtudiantService } from 'src/app/services/etudiant.service';

@Component({
  selector: 'app-gestion-etudiants',
  templateUrl: './gestion-etudiants.component.html',
  styleUrls: ['./gestion-etudiants.component.scss']
})
export class GestionEtudiantsComponent implements OnInit {

  etudiants: Etudiant[] = [];
  campus: Campus[] = [];

  //Liste des campus pour rassembler les étudiants
  montpellier: Etudiant[] = [];
  champs: Etudiant[] = [];
  dubai: Etudiant[] = [];
  londres: Etudiant[] = [];

  dropdownCampus: any = [
    { label: 'Tous les campus', value: null }
  ];

  /* partie dediée au reporting */
  etudiantConnectedFromLastWeek: Etudiant[] = [];
  /* end */

  constructor(private etudiantService: EtudiantService, private campusService: CampusService, private messageService: MessageService) { }

  ngOnInit(): void {
    //Recuperation de la liste de l'ensemble des étudiants
    this.etudiantService.getAllEtudiantPopulate().subscribe(
      ((response) => { 
        this.etudiants = response; 
        //Pour le reporting
        this.onGetNumbersOfStudentsConnectedbyCampus(this.etudiants);
      }),
      ((error) => { console.log(error); })
    );


    // campus recovery
    this.campusService.getAll().subscribe(
      ((response) => {
        response.forEach((campus) => {
          this.dropdownCampus.push({ label: campus.libelle, value: campus._id });
        });
      }),
      ((error) => { console.log(error); })
    );

  }


  /* Partie reporting */
  onGetNumbersOfStudentsConnectedbyCampus(etudiants: Etudiant[])
  {
    //Date de la semaine dernière
    let lastWeekDate = moment().subtract(7, 'days').format('MM-DD-YYYY');
    
    etudiants.forEach((etudiant) => {
      let byPassCampus: any = etudiant.campus;
      let byPassUser: any = etudiant.user_id;
      
      if(new Date(byPassUser?.last_connection) >= new Date(lastWeekDate))
      {
        this.etudiantConnectedFromLastWeek.push(etudiant);

        //Remplissage des differents tableau de campus
        switch(byPassCampus.ville)
        {
          case('Champs sur Marne'):
            this.champs.push(etudiant);
            break;
          case('Montpellier'):
            this.montpellier.push(etudiant);
            break;
          case('Dubaï'):
            this.dubai.push(etudiant);
            break;
          case('Londres'):
            this.londres.push(etudiant);
            break;
          default:
            break;
        }

      }
    });

  }
  /* end */

}
