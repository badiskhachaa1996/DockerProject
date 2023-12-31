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
import { Ecole } from 'src/app/models/Ecole';
import { EcoleService } from 'src/app/services/ecole.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DiplomeService } from 'src/app/services/diplome.service';
import { ClasseService } from 'src/app/services/classe.service';
import * as html2pdf from 'html2pdf.js';
import { DatePipe } from '@angular/common';
import { Presence } from 'src/app/models/Presence';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
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
  date_aj = new Date()
  Etudiant_userdata: User;
  AssiduiteListe: any[];
  ListeSeanceDIC: any[] = [];
  matiereDic: any[] = [];
  ListeSeance: any[];
  barDataAJ: any;
  barDataHorAJ: any;
  annee_scolaire = "2022-2023"
  nb_absences = 0;
  nb_absencesNJ = 0;
  nb_presences = 0;
  showPDF = false
  isNotEtudiant = false
  colorBande = "#ffffff"
  filterModule = [{ label: "Tous les modules", value: null }]
  dropdownTimes = [
    { label: "Passé", value: "Passé" },
    { label: "Présent", value: "Présent" }
  ]
  PHRASE = this.dropdownTimes[0].value
  barDataHor: any = {
    labels: ['Présences', 'Absences justifiées', 'Absences non justifiées'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [
          '#22C20E',
          "#f9ac09",
          "red",


        ],
        hoverBackgroundColor: [
          "#22C55E",
          "#f9ac09",
          "#FF6384"

        ]
      }
    ]
  };

  barData: any = {
    labels: ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre'],
    datasets: [
      {
        label: 'Absences Justifiés ',
        backgroundColor: '#f9ac09',
        hoverBackgroundColor: [
          "#f9ac19"

        ],
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      {
        label: 'Présences',
        backgroundColor: '#22C20E',
        hoverBackgroundColor: [
          "#22C55E",


        ],
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      {
        label: 'Absences non justifiées',
        backgroundColor: 'red',
        hoverBackgroundColor: [
          "red",
        ],
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    ]
  };
  horizontalOptions: any;
  barOptions: any;
  pourcentageAssiduite: number;
  isNotEntreprise = true

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
  dropdownEcoles = []
  constructor(private CFAService: EcoleService, private sanitizer: DomSanitizer, private messageService: MessageService,
    private PresenceService: PresenceService, private matiereService: MatiereService, private seanceService: SeanceService,
    private presenceService: PresenceService, private etudiantService: EtudiantService, private activeRoute: ActivatedRoute,
    private userService: AuthService, private DiplomeService: DiplomeService, private GroupeService: ClasseService, public datepipe: DatePipe) { }

  ngOnInit(): void {
    let token = null
    try {
      token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      token = null
      console.error(e)
    }
    //Recuperation de l'etudiant à modifier
    this.etudiantService.getById(this.idEtudiant).subscribe((response) => {
      this.EtudiantDetail = response;
      let user: any = response.user_id
      if (response.date_inscription)
        this.dateValue[0] = new Date(response.date_inscription)
      else if (user && user.date_creation)
        this.dateValue[0] = new Date(user.date_creation)
      if (response.ecole_id)
        this.CFAService.getByID(response.ecole_id).subscribe(ecole => {
          this.ECOLE = ecole.dataEcole
        })
      this.CFAService.getAll().subscribe(ecoles => {
        ecoles.forEach(ecol => {
          if (ecol == response.ecole_id)
            this.ECOLE = ecol
          this.dropdownEcoles.push({ value: ecol, label: ecol.libelle })
        })
        if (!this.ECOLE) {
          this.ECOLE = this.dropdownEcoles[0].value
        }

      })


      this.userService.getById(this.EtudiantDetail.user_id).subscribe((userdata) => {
        this.Etudiant_userdata = jwt_decode(userdata.userToken)['userFromDb']
      }),
        ((error) => { console.error(error); })
      this.userService.getPopulate(token.id).subscribe(userConnected => {
        this.seanceService.getAllFinishedByClasseId(this.EtudiantDetail.classe_id, this.EtudiantDetail.user_id).subscribe((seanceData) => {
          this.ListeSeance = seanceData
          this.isNotEtudiant = (userConnected.role == "Agent" || userConnected.role == "Admin" || userConnected.role == "Responsable" || userConnected.type == 'Collaborateur' || userConnected.type_supp.includes('Collaborateur'))
          this.isNotEntreprise = userConnected.type != 'CEO Entreprise'
          let type = "Agent"
          if ((userConnected.type == 'Initial' || userConnected.type == 'Alternant' || userConnected.type == 'CEO Entreprise') && userConnected.role != "Agent" && userConnected.role != "Admin" && userConnected.role != "Responsable")
            type = "EtudiantOuEntreprise"
          this.presenceService.getAllByUser(this.EtudiantDetail.user_id, type).subscribe((presenceData) => {
            this.AssiduiteListe = presenceData

            this.ListeSeance.forEach(seance => {
              this.ListeSeanceDIC[seance._id] = seance;
            });

            this.matiereService.getAll().subscribe(data => {
              data.forEach(m => {
                this.matiereDic[m._id] = m
                this.filterModule.push({ value: m._id, label: `${m.abbrv} - ${m.nom}` })
              });
            })
            this.PresenceService.updateAbsences(this.EtudiantDetail.user_id).subscribe(seances => {
              this.nb_absencesNJ += seances.length
            })

            // boucle liste des presences totales de l'étudiants.
            this.AssiduiteListe.forEach(item => {
              if (item.isPresent != true) {
                // absence ++1
                let month: string = item.seance_id?.date_debut.slice(5, 7)

                if (item.justificatif != true) {
                  // absence non justifié ++1
                  let month: string = item.seance_id?.date_debut.slice(5, 7)
                  this.nb_absencesNJ++
                  this.barData.datasets[2].data[Number(month) - 1]++
                }
                else {
                  this.nb_absences++
                  this.barData.datasets[0].data[Number(month) - 1]++
                }
              }
              else {
                //presence ++1
                let month: string = item.seance_id?.date_debut.slice(5, 7)

                this.nb_presences++;
                this.barData.datasets[1].data[Number(month) - 1]++
              }
            });
            this.barDataHor.datasets[0].data.push(this.nb_presences)

            this.barDataHor.datasets[0].data.push(this.nb_absences)

            this.barDataHor.datasets[0].data.push(this.nb_absencesNJ)

            this.pourcentageAssiduite = Math.round(100 - (this.nb_absencesNJ * 100 / this.AssiduiteListe.length));
            this.chart2.data = this.barDataHor
            this.chart.data = this.barData
            this.barDataHorAJ = this.barDataHor
          })



        }),
          ((error) => { console.error(error); })
      })



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
      plugins: {
        legend: {
          labels: {
            color: 'black',

          },
          legendCallback: { text: 'this is legend' }
        }
      }
    }

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.chart.refresh();
      this.chart2.refresh();
    }, 200);
  }
  invalidDates = []
  dateValue: Date[] = [null, new Date()]
  PICTURE;
  ECOLE: Ecole;
  diplome_libelle: string = ""
  initGenerer() {
    console.log(this.ECOLE)
    this.loadEcoleImage()
    this.showPDF = true
    if (this.EtudiantDetail.filiere)
      this.DiplomeService.getById(this.EtudiantDetail.filiere).subscribe(data => {
        this.diplome_libelle = data.titre_long
      })
    else
      this.GroupeService.getPopulate(this.EtudiantDetail.classe_id).subscribe(data => {
        let buffer: any = data.diplome_id
        this.diplome_libelle = buffer.titre_long
      })
  }
  loadEcoleImage() {
    console.log(this.ECOLE)
    this.colorBande = this.ECOLE.color
    this.PICTURE = { cachet: 'assets/images/service-administratif.png', logo: "assets/images/logo-estya-flag.png", pied_de_page: "assets/images/footer-bulletinv2.png" }
    this.CFAService.downloadCachet(this.ECOLE._id).subscribe(blob => {
      let objectURL = URL.createObjectURL(blob);
      this.PICTURE.cachet = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    })
    this.CFAService.downloadLogo(this.ECOLE._id).subscribe(blob => {
      let objectURL = URL.createObjectURL(blob);
      this.PICTURE.logo = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    })
    this.CFAService.downloadPied(this.ECOLE._id).subscribe(blob => {
      let objectURL = URL.createObjectURL(blob);
      this.PICTURE.pied_de_page = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    })
  }
  exportToPDF(id = "rendu") {
    var element = document.getElementById(id);
    var opt = {
      margin: 0,
      filename: 'ATTESTATION_' + this.Etudiant_userdata.lastname + '_' + this.Etudiant_userdata.firstname + "_" + this.datepipe.transform(this.date_aj, 'd-MM-y') + '.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'px', format: 'a4', orientation: 'p', hotfixes: ['px_scaling'] } //[element.offsetWidth, element.offsetHeight]
    };
    html2pdf().set(opt).from(element).save();
  }

  saveColor() {
    this.CFAService.saveColor(this.ECOLE._id, this.colorBande).subscribe(newEcole => {
      this.ECOLE = newEcole
      this.messageService.add({ severity: 'success', summary: "Changement de couleur sauvegardé" })
      this.loadEcoleImage()
    }, err => {
      console.error(err)
      this.messageService.add({ severity: 'error', summary: "Erreur lors du changement de couleur", detail: err.error })
    })
  }

  AbsenceApproved(p: Presence, bool: boolean) {
    p.approved_by_pedagogie = bool
    this.PresenceService.updatePresence(p).subscribe(r => {
      if (bool)
        this.messageService.add({ severity: 'success', summary: "L'absence sera visible sur l'espace assiduité de l'étudiant" })
      else
        this.messageService.add({ severity: 'success', summary: "L'absence sera caché sur l'espace assiduité de l'étudiant" })
    })
  }

  saveGraph() {
    var a = document.createElement('a');
    a.href = this.chart.getBase64Image();
    a.download = "bar_chart_assiduite_" + this.Etudiant_userdata.lastname + "_" + this.Etudiant_userdata.firstname + '_export_' + new Date().toLocaleDateString("fr-FR") + '.png';

    // Trigger the download
    a.click();

    var a2 = document.createElement('a');
    a2.href = this.chart2.getBase64Image();
    a2.download = "pie_chart_assiduite_" + this.Etudiant_userdata.lastname + "_" + this.Etudiant_userdata.firstname + '_export_' + new Date().toLocaleDateString("fr-FR") + '.png';

    // Trigger the download
    a2.click();
  }



  initExportExcel() {
    let dataExcel = []
    let mois = ['Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre']
    //Clean the data
    this.AssiduiteListe.sort((a, b) => {
      if (new Date(a.seance_id.date_debut) > new Date(b.seance_id.date_debut))
        return +1
      else
        return -1
    })
    this.AssiduiteListe.forEach(Assiduit => {
      let t = {}
      t['Module'] = this.matiereDic[Assiduit.seance_id.matiere_id]?.nom
      t['Mois'] = mois[new Date(Assiduit.seance_id.date_debut).getMonth()]
      t['Date de la seance'] = new Date(Assiduit.seance_id.date_debut).toLocaleString()
      t['Seance'] = Assiduit.seance_id.libelle.replace(' - ESTYA', '').replace('Paris', '').replace(' - Marne', '').replace(' - ESTYA', '').replace('Paris', '').replace(' - Marne', '').replace(' - ESTYA', '').replace('Paris', '').replace(' - Marne', '').replace(' - ESTYA', '').replace('Paris', '').replace(' - Marne', '').replace(' - ESTYA', '').replace('Paris', '').replace(' - Marne', '').replace(' - ESTYA', '').replace('Paris', '').replace(' - Marne', '')
      t['Présence'] = Assiduit.isPresent ? 'Présent' : Assiduit.justificatif ? 'Absence Justifié' : 'Absent'
      if (Assiduit.date_signature)
        t['Date Signature'] = new Date(Assiduit.date_signature).toLocaleString()
      dataExcel.push(t)
    })
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, "assiduite_" + this.Etudiant_userdata.lastname + "_" + this.Etudiant_userdata.firstname + '_export_' + new Date().toLocaleDateString("fr-FR") + ".xlsx");
  }
  tauxAssiduite = false
  selectAssidu = [
    { label: 'Oui', value: true },
    { label: 'Non', value: false }
  ]
  newPhrase = "A suivi avec assiduité la formation intitulée:"
  updatePhrase() {
    if (!this.tauxAssiduite) {
      if (this.PHRASE == 'Passé')
        this.newPhrase = "A suivi avec assiduité la formation intitulée:"
      else
        this.newPhrase = "Suit avec assiduité la formation intitulée:"
    } else
      if (this.PHRASE == 'Passé')
        this.newPhrase = `A suivi avec un taux d'assiduité de <strong>${this.pourcentageAssiduite}%</strong> la formation intitulée:`
      else
        this.newPhrase = `Suit avec un taux d'assiduité de <strong>${this.pourcentageAssiduite}%</strong> la formation intitulée:`
  }
}
