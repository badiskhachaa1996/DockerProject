import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { Etudiant } from 'src/app/models/Etudiant';
import { EtudiantService } from 'src/app/services/etudiant.service';

@Component({
  selector: 'app-gestion-etudiants',
  templateUrl: './gestion-etudiants.component.html',
  styleUrls: ['./gestion-etudiants.component.scss']
})
export class GestionEtudiantsComponent implements OnInit {

  etudiants: Etudiant[] = [];

  /* partie dediée au reporting */
  studentsByCampus: any;
  etudiantConnectedFromLastWeek: Etudiant[] = [];
  studentsOfParisConnectedFromLastWeek: Etudiant[] = [];
  studentsOfParis: Etudiant[] = [];
  studentsOfMontpellierConnectedFromLastWeek: Etudiant[] = [];
  studentsOfMontpellier: Etudiant[] = [];
  /* end */

  constructor(private etudiantService: EtudiantService, private messageService: MessageService) { }

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
  }


  /* Partie reporting */
  onGetNumbersOfStudentsConnectedbyCampus(etudiants: Etudiant[])
  {
    //Date de la semaine dernière
    let lastWeekDate = moment().subtract(7, 'days').format('MM-DD-YYYY');
    
    etudiants.forEach((etudiant) => {
      let byPassCampus: any = etudiant.campus;
      let byPassUser: any = etudiant.user_id;
      
      if(byPassCampus.ville === 'Champs sur Marne')
      {
        this.studentsOfParis.push(etudiant);
      } else if(byPassCampus.ville === 'Montpellier')
      {
        this.studentsOfMontpellier.push(etudiant);
      }

      if(new Date(byPassUser?.last_connection) >= new Date(lastWeekDate))
      {
        this.etudiantConnectedFromLastWeek.push(etudiant);

        if(byPassCampus.ville === 'Champs sur Marne')
        {
          this.studentsOfParisConnectedFromLastWeek.push(etudiant);
        } else if(byPassCampus.ville === 'Montpellier') {
          this.studentsOfMontpellierConnectedFromLastWeek.push(etudiant);
        }
      }
    });

  }
  /* end */

}
