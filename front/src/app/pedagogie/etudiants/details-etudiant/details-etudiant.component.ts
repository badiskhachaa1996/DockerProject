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

@Component({
  selector: 'app-details-etudiant',
  templateUrl: './details-etudiant.component.html',
  styleUrls: ['./details-etudiant.component.scss']
})
export class DetailsEtudiantComponent implements OnInit {
  @ViewChild('chart') chart: UIChart;

  idEtudiant = this.activeRoute.snapshot.paramMap.get('id');
  EtudiantDetail: Etudiant
  Etudiant_userdata: User;
 
  AssiduiteListe: any[];
  ListeSeanceDIC: any[] = [];
  matiereDic: any[] = [];
  ListeSeance: any[];
  barDataAJ: any;
  barData: any = {
    labels: ['Assiduité au seances de cours'],
    datasets: [
      {
        label: 'abscence',
        backgroundColor: 'red',
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56"
      ],
        data: []
      },
      {
        label: 'Présence',
        backgroundColor: 'blue',
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56"
      ],
        data: []
      }
    ]
  };
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
  constructor(private messageService : MessageService, private PresenceService: PresenceService ,private matiereService: MatiereService, private seanceService: SeanceService, private presenceService: PresenceService, private etudiantService: EtudiantService, private activeRoute: ActivatedRoute, private userService: AuthService) { }

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


            this.ListeSeanceDIC[seance._id] = seance;

          });

          this.matiereService.getAll().subscribe(data => {
            data.forEach(m => {
              this.matiereDic[m._id] = m
            });
          })
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

  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.barDataAJ = { ...this.barData };

    }, 1000);
  }
}
