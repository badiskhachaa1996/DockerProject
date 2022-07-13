import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Etudiant } from 'src/app/models/Etudiant';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import jwt_decode from "jwt-decode";
import { PresenceService } from 'src/app/services/presence.service';
import { SeanceService } from 'src/app/services/seance.service';
@Component({
  selector: 'app-details-etudiant',
  templateUrl: './details-etudiant.component.html',
  styleUrls: ['./details-etudiant.component.scss']
})
export class DetailsEtudiantComponent implements OnInit {
  idEtudiant = this.activeRoute.snapshot.paramMap.get('id');
  EtudiantDetail: Etudiant
  Etudiant_userdata: User;
  AssiduiteListe: any[];
  ListeSeanceDIC :any[] = [];
  ListeSeance: any[];
  barDataAJ: any;
  barData: any = {
    labels: ['Assiduité au seances de cours'],
    datasets: [
      {
        label: 'abscence' ,
        backgroundColor: 'red',
        data: []
      },
      {
        label: 'Présence',
        backgroundColor: 'blue',
        data: []
      }
    ]
  };
  barOptions: any;
  constructor(private seanceService: SeanceService, private presenceService: PresenceService, private etudiantService: EtudiantService, private activeRoute: ActivatedRoute, private userService: AuthService) { }

  ngOnInit(): void {


    //Recuperation de l'etudiant à modifier
    this.etudiantService.getById(this.idEtudiant).subscribe((response) => {
      this.EtudiantDetail = response;
      console.log(this.EtudiantDetail)

      this.userService.getById(this.EtudiantDetail.user_id).subscribe((userdata) => {
        this.Etudiant_userdata = jwt_decode(userdata.userToken)['userFromDb']
        console.log(this.Etudiant_userdata)
      }),
        ((error) => { console.error(error); })

      this.presenceService.getAllByUser(this.EtudiantDetail.user_id).subscribe((presenceData) => {
        this.AssiduiteListe = presenceData
        console.log(this.AssiduiteListe)
        this.AssiduiteListe.forEach(item => {

          if (item.isPresent != true) {
            console.log(" presnet +1")
            this.barData.datasets['0'].data.push(1)
          }
          else {
            console.log(item)
            this.barData.datasets[1].data.push(1)
          }
        });
        this.seanceService.getAllByClasseId(this.EtudiantDetail.classe_id).subscribe((seanceData) => {
          this.ListeSeance = seanceData

          this.ListeSeance.forEach(seance => {
            console.log(seance)
  
            this.ListeSeanceDIC[seance._id]=seance;
            console.log(this.ListeSeanceDIC[seance._id])
          });
        })

      }),
        ((error) => { console.error(error); })


    }),
      ((error) => { console.error(error); })




    this.barDataAJ = this.barData;
    this.barOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef',
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef',
          }
        },
      }
    };


  }
}
