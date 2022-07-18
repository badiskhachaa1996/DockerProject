import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Etudiant } from 'src/app/models/Etudiant';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import jwt_decode from "jwt-decode";
import { PresenceService } from 'src/app/services/presence.service';
import { SeanceService } from 'src/app/services/seance.service';
import { UIChart } from 'primeng/chart';
import { MatiereService } from 'src/app/services/matiere.service';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { pipe } from 'rxjs';

@Component({
  selector: 'app-details-etudiant',
  templateUrl: './details-etudiant.component.html',
  styleUrls: ['./details-etudiant.component.scss']
})
export class DetailsEtudiantComponent implements OnInit {
  @ViewChild('chart') chart: UIChart;
  @ViewChild('chart2') chart2: UIChart;
  idEtudiant = this.activeRoute.snapshot.paramMap.get('id');
  EtudiantDetail: Etudiant
  Etudiant_userdata: User;

  AssiduiteListe: any[];
  ListeSeanceDIC: any[] = [];
  matiereDic: any[] = [];
  ListeSeance: any[];
  barDataAJ: any;
  barDataHorAJ: any;
  nb_absences = 0;
  nb_absencesNJ = 0;
  nb_presences = 0;
  barDataHor: any = {

    labels: ['Assiduite'],
    datasets: [
      {
        label: 'Absences',
        backgroundColor: 'red',
        data: []
      },
      {
        label: 'Présences',
        backgroundColor: '#22C20E',
        data: []
      },
      {
        label: 'Absences non justifiées',
        backgroundColor: '#730e0e',
        data: []
      }
    ]

  };

  barData: any = {
    labels: ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'],
    datasets: [
      {
        label: 'Abscence',
        backgroundColor: 'red',
        hoverBackgroundColor: [
          "#FF6384"

        ],
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      {
        label: 'Présence',
        backgroundColor: '#22C20E',
        hoverBackgroundColor: [
          "#22C55E",


        ],
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      {
        label: 'Absence non justifié',
        backgroundColor: '#730e0e',
        hoverBackgroundColor: [
          "#781d1d",
        ],
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    ]
  };
  horizontalOptions: any;
  barOptions: any;

  VoirJustificatif(rowData) {
    this.PresenceService.getJustificatif(rowData).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.fileType });
      var blobURL = URL.createObjectURL(blob);
      window.open(blobURL);
    }, (error) => {
      this.messageService.add({ severity: 'error', summary: 'Contacté un administrateur', detail: rowData._id })
      console.error(error)
    })
  }
  constructor(private messageService: MessageService, private PresenceService: PresenceService, private matiereService: MatiereService, private seanceService: SeanceService, private presenceService: PresenceService, private etudiantService: EtudiantService, private activeRoute: ActivatedRoute, private userService: AuthService) { }

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
        this.seanceService.getAllByClasseId(this.EtudiantDetail.classe_id).subscribe((seanceData) => {
          this.ListeSeance = seanceData

          this.ListeSeance.forEach(seance => {


            this.ListeSeanceDIC[seance._id] = seance;

          });

          this.matiereService.getAll().subscribe(data => {
            data.forEach(m => {
              this.matiereDic[m._id] = m
            });
          })



          // boucle liste des presences totales de l'étudiants.
          this.AssiduiteListe.forEach(item => {
          
            if (item.isPresent != true) {
              // abscense ++1
              let month: string = this.ListeSeanceDIC[item.seance_id]?.date_debut.slice(5, 7)
              console.log(month)
              this.  nb_absences++
              this.barData.datasets[0].data[Number(month) - 1]++
             
              if (item.justificatif != true) {
                // abscense non justifié ++1
                let month: string = this.ListeSeanceDIC[item.seance_id]?.date_debut.slice(5, 7)
                console.log(month)
                this.nb_absencesNJ++
                this.barData.datasets[2].data[Number(month) - 1]++

               
              }
            }
            else {
              //presence ++1
              let month: string = this.ListeSeanceDIC[item.seance_id]?.date_debut.slice(5, 7)
              console.log(month)
             this. nb_presences++;
              this.barData.datasets[1].data[Number(month) - 1]++
              

            }
          });
          this.barDataHor.datasets[1].data.push(this.nb_presences)
          this.barDataHor.datasets[2].data.push(this.nb_absencesNJ)
          this.barDataHor.datasets[0].data.push(this.nb_absences)
        })



      }),
        ((error) => { console.error(error); })


    }),
      ((error) => { console.error(error); })

    this.barOptions = {
      plugins: {
        animation: false,
        legend: {
          display: true,
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
    this.horizontalOptions = {
      indexAxis: 'y',

      plugins: {
        legend: {
          labels: {
            color: '#red'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }

    };

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.chart2.data = this.barDataHor
      this.chart.data = this.barData
      this.barDataHorAJ = this.barDataHor
    }, 2000);
  }
}
