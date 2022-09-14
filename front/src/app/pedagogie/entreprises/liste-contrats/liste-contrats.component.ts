import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import jwt_decode from "jwt-decode";
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { AuthService } from 'src/app/services/auth.service';
import { Etudiant } from 'src/app/models/Etudiant';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { ContratAlternance } from 'src/app/models/ContratAlternance';
import { TuteurService } from 'src/app/services/tuteur.service';
import { Tuteur } from 'src/app/models/Tuteur';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DiplomeService } from 'src/app/services/diplome.service';


@Component({
  selector: 'app-liste-contrats',
  templateUrl: './liste-contrats.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./liste-contrats.component.scss']
})
export class ListeContratsComponent implements OnInit {

  token;
  Professionnalisation: boolean;
  ListeContrats: ContratAlternance[] = []
  tuteurInfoPerso: any;
  EntreprisesName: any[] = [];
  maxYear = new Date().getFullYear() - 16
  minYear = new Date().getFullYear() - 60
  rangeYear = this.minYear + ":" + this.maxYear
  minDateCalendar = new Date("01/01/" + this.minYear)
  maxDateCalendar = new Date("01/01/" + this.maxYear)
  maxYearC = new Date().getFullYear() + 4
  minYearC = new Date().getFullYear() - 1
  rangeYearC = this.minYear + ":" + this.maxYearC
  minDateCalendarC = new Date("01/01/" + this.minYearC)
  maxDateCalendarC = new Date("01/01/" + this.maxYearC)
  listAlternantDD: any = []
  formationList = []
  RegisterNewCA: FormGroup;
  idTuteur = this.route.snapshot.paramMap.get('idTuteur');
  ParmTuteur = this.route.snapshot.paramMap.get('idTuteur');
  formAddNewCA: boolean = false;
  ConnectedEntreprise: any;
  EntrepriseList = [];
  TuteursList = [];
  dropdownTuteurList = []
  ListCommercial = [];
  dropDownCommecialList = [];


  constructor(private entrepriseService: EntrepriseService, private route: ActivatedRoute,
    private messageService: MessageService, private router: Router, private etudiantService: EtudiantService,
    private authService: AuthService, private tuteurService: TuteurService, private formationService: DiplomeService, private formBuilder: FormBuilder,) { }

  get entreprise_id() {
    console.log("1");
    return this.RegisterNewCA.get('entreprise_id');
  }
  get tuteur_id() { console.log("2"); return this.RegisterNewCA.get('tuteur_id').value; }
  get debut_contrat() { console.log("3"); return this.RegisterNewCA.get('debut_contrat'); }
  get fin_contrat() { console.log("4"); return this.RegisterNewCA.get('fin_contrat'); }
  get horaire() { console.log("5"); return this.RegisterNewCA.get('horaire').value; }
  get alternant() { console.log("6"); return this.RegisterNewCA.get('alternant').value; }

  get alternantValidite() { console.log("7"); return this.RegisterNewCA.get('alternant').invalid; }
  get intitule() { console.log("8"); return this.RegisterNewCA.get('intitule').value; }
  get classification() { console.log("9"); return this.RegisterNewCA.get('classification').value; }
  get niv() { console.log("10"); return this.RegisterNewCA.get('niv').value; }
  get coeff_hier() { console.log("11"); return this.RegisterNewCA.get('coeff_hier').value; }
  get code_commercial() { console.log("12"); return this.RegisterNewCA.get('code_commercial').value; }
  get form() { console.log("13"); return this.RegisterNewCA.get('form').value; }
  get professionnalisation() { console.log("14"); return this.RegisterNewCA.get('professionnalisation'); }
  ngOnInit(): void {

    this.token = jwt_decode(localStorage.getItem("token"))
    console.log(this.token)

    this.entrepriseService.getAll().subscribe(listEntre => {
      this.EntrepriseList = listEntre;
      this.etudiantService.getAllAlternants().subscribe(alternantsData => {

        this.listAlternantDD = alternantsData;
        this.listAlternantDD.forEach(altdata => {
          altdata.nomcomplet = altdata.user_id.firstname + ' ' + altdata.user_id.lastname

        })
        this.formationService.getAll().subscribe(data => {

          data.forEach(element => {
            this.formationList.push({ label: element.titre, value: element._id });
          });

        })
      })
      this.authService.getAllCommercial().subscribe(CommercialData => {
        console.log(CommercialData)
        this.ListCommercial = CommercialData
        this.ListCommercial.forEach(comData => {
          comData.nomComplet = comData.firstname + " " + comData.lastname;
          this.dropDownCommecialList.push(comData)
        })
      })

      //LISTE A AFFICHER POUR LADMIN
      if (this.token.role == "Admin") {

        this.entrepriseService.getAllContrats().subscribe(Allcontrats => {
          console.log(Allcontrats)
          this.ListeContrats = Allcontrats;


          Allcontrats.forEach(cont => {
            console.log(cont.tuteur_id.entreprise_id)
            this.entrepriseService.getById(cont.tuteur_id?.entreprise_id).subscribe(entpName => {
              console.log(entpName.r_sociale);
              this.onInitRegisterNewCA();

              this.EntreprisesName[entpName._id] = entpName
            })
          })
        })

      }
      //LISTE A AFFICHER POUR LES CEO ENTREPRISE 
      else if (!this.idTuteur && this.token.type == "CEO Entreprise") {

        this.entrepriseService.getByDirecteurId(this.token.id).subscribe(entrepriseData => {
          console.log(entrepriseData)

          this.ConnectedEntreprise = entrepriseData;

          this.tuteurService.getAllByEntrepriseId(this.ConnectedEntreprise._id).subscribe(listTuteur => {
            console.log("*************")
            console.log(listTuteur)
            console.log("*************")

            this.TuteursList = listTuteur;

            this.TuteursList.forEach(tut => {
              tut.nomCOmplet = tut.user_id.firstname + " " + tut.user_id.lastname

              this.dropdownTuteurList.push(tut)
            })

            this.onInitRegisterNewCA();

          }, (eror) => { console.log(eror) })

          this.entrepriseService.getAllContratsbyEntreprise(entrepriseData._id).subscribe(listeData => {

            this.ListeContrats = listeData;
            console.log(listeData)
          }, (eror) => { console.log(eror) })
        }, (eror) => { console.log(eror) })

      }
      // LISTE A AFFICHER POUR LES TUTEURS
      else if (this.token.type == "Tuteur") {
        this.tuteurService.getByUserId(this.token.id).subscribe(TutData => {
          this.idTuteur = TutData._id


          console.log(this.idTuteur)
          this.entrepriseService.getAllContratsbyTuteur(this.idTuteur).subscribe(listeData => {

            this.ListeContrats = listeData;
            console.log(listeData)
          })
        })
      }
      else {
        this.entrepriseService.getAllContratsbyTuteur(this.idTuteur).subscribe(listeData => {

          this.ListeContrats = listeData;
          console.log(listeData)
          this.tuteurService.getById(this.idTuteur).subscribe(TutData => {
            this.authService.getInfoById(TutData._id).subscribe(TuteurInfoPerso => {
              console.log(TuteurInfoPerso)
              this.tuteurInfoPerso = TuteurInfoPerso
            })


          })
        })
      }

    })
  }
  showPresence(alternant_id) {
    console.log(alternant_id)
    this.router.navigate(["details/" + alternant_id]);
  }
  ShowAddNewCA() {
    this.formAddNewCA = true
  }
  afficherProsChamp() {

    this.Professionnalisation = this.RegisterNewCA.value.professionnalisation
    console.log(this.Professionnalisation)
  }
  onInitRegisterNewCA() {
    console.log(this.ConnectedEntreprise)
    this.RegisterNewCA = this.formBuilder.group({
      entreprise_id: new FormControl(this.ConnectedEntreprise ? this.ConnectedEntreprise : '', Validators.required),
      tuteur_id: new FormControl('', Validators.required),
      debut_contrat: new FormControl('', Validators.required),
      fin_contrat: new FormControl('', Validators.required),
      horaire: new FormControl(''),
      alternant: new FormControl('', Validators.required),
      intitule: new FormControl(''),
      classification: new FormControl(''),
      niv: new FormControl(''),
      coeff_hier: new FormControl(''),
      form: new FormControl('', Validators.required),
      code_commercial: new FormControl('', Validators.required),

      professionnalisation: new FormControl(''),

    })
  }

  loadTuteur() {
    this.dropdownTuteurList = []

    this.tuteurService.getAllByEntrepriseId(this.entreprise_id.value._id).subscribe(listTuteur => {
      console.log("*************")
      console.log(listTuteur)
      console.log("*************")
      this.TuteursList = listTuteur;
      this.TuteursList.forEach(tut => {
        tut.nomCOmplet = tut.user_id.firstname + " " + tut.user_id.lastname
        this.dropdownTuteurList.push(tut)
      })

    }, (eror) => { console.log(eror) })

  }
  createNewCA() {

    let CA_Object = new ContratAlternance(null, this.debut_contrat.value, this.fin_contrat.value, this.horaire, this.alternant._id, this.intitule, this.classification, this.niv, this.coeff_hier, this.form.value, this.tuteur_id._id, this.code_commercial._id, 'créé')
    console.log(this.form)
    this.entrepriseService.createContratAlternance(CA_Object).subscribe(resData => {
      console.log(resData)


      this.messageService.add({ severity: 'success', summary: 'Le contrat alternance', detail: " a été créé avec Succés" });
      this.formAddNewCA = false

    }, (error => { console.log(error) }))
  }
  // showPresence(alternant_id) {
  //   console.log(alternant_id)
  //   this.router.navigate(["details/" + alternant_id]);
  // }


}
