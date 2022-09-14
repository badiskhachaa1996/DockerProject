import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, PrimeIcons } from 'primeng/api';
import { map } from 'rxjs';
import { ContratAlternance } from 'src/app/models/ContratAlternance';
import { Entreprise } from 'src/app/models/Entreprise';

import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { ServService } from 'src/app/services/service.service';
import { Notification } from 'src/app/models/notification';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/services/notification.service';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { Tuteur } from 'src/app/models/Tuteur';

@Component({
  selector: 'app-inscription-entreprise',
  templateUrl: './inscription-entreprise.component.html',
  styleUrls: ['./inscription-entreprise.component.scss']
})
export class InscriptionEntrepriseComponent implements OnInit {

  Tok_code_commercial: string = this.route.snapshot.paramMap.get('code');

  formSteps: any[] = [
    { label: "Entreprise", icon: "pi pi-sitemap", i: 0 },
    { label: "Representant", icon: "pi pi-user", i: 1 },
    { label: "Tuteurs", icon: "pi pi-id-card", i: 2 },
    { label: "Alternant", icon: "pi pi-user", i: 3 },
    { label: "Fin", icon: "pi pi-flag", i: 4 },
  ];

  MessageFormSubmit: boolean;
  Professionnalisation: boolean;
  listAlternant = []
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
  ActiveIndex = 0;
  RegisterForm: FormGroup;
  paysList = environment.pays;
  civiliteList = environment.civilite;
  nationList = environment.nationalites;
  emailExist: boolean;
  listAlternantDD: any = []
  formationList = []

  


  constructor(private servService: ServService, private NotifService: NotificationService, private formationService: DiplomeService, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private messageService: MessageService,
    private entrepriseService: EntrepriseService, private AuthService: AuthService, private etudiantService: EtudiantService) { }




  get raison_sociale() { return this.RegisterForm.get('raison_sociale'); }
  get activite() { return this.RegisterForm.get('activite'); }
  get adresse_ss() { return this.RegisterForm.get('adresse_ss'); }
  get postal_ss() { return this.RegisterForm.get('postal_ss'); }
  get ville_ss() { return this.RegisterForm.get('ville_ss'); }

  get adresse_ec() { return this.RegisterForm.get('adresse_ec'); }

  get postal_ec() { return this.RegisterForm.get('postal_ec'); }

  get ville_ec() { return this.RegisterForm.get('ville_ec'); }
  get crc() { return this.RegisterForm.get('crc'); }
  get convention() { return this.RegisterForm.get('convention'); }
  get idcc() { return this.RegisterForm.get('idcc'); }

  get civilite() { return this.RegisterForm.get('civilite').value; }
  get lastname() { return this.RegisterForm.get('lastname'); }
  get firstname() { return this.RegisterForm.get('firstname'); }
  get email() { return this.RegisterForm.get('email'); }
  get phone() { return this.RegisterForm.get('phone'); }
  get indicatif() { return this.RegisterForm.get('indicatif'); }
  get numero_whatsapp() { return this.RegisterForm.get('numero_whatsapp'); }
  get indicatif_whatsapp() { return this.RegisterForm.get('indicatif_whatsapp'); }
  get siret() { return this.RegisterForm.get('siret'); }
  get nb_salarie() { return this.RegisterForm.get('nb_salarie'); }
  get phone_ent() { return this.RegisterForm.get('phone_ent'); }
  get indicatif_ent() { return this.RegisterForm.get('indicatif_ent'); }
  get ape_naf() { return this.RegisterForm.get('ape_naf'); }
  get telecopie() { return this.RegisterForm.get('telecopie'); }
  get OPCO() { return this.RegisterForm.get('OPCO'); }
  get organisme_prevoyance() { return this.RegisterForm.get('organisme_prevoyance'); }

  get civilite_t1() { return this.RegisterForm.get('civilite_t1').value; }
  get lastname_t1() { return this.RegisterForm.get('lastname_t1'); }
  get firstname_t1() { return this.RegisterForm.get('firstname_t1'); }
  get email_t1() { return this.RegisterForm.get('email_t1'); }
  get phone_t1() { return this.RegisterForm.get('phone_t1'); }
  get indicatif_t1() { return this.RegisterForm.get('indicatif_t1'); }
  get date_naissance_t1() { return this.RegisterForm.get('date_naissance_t1').value; }
  get fonction_t1() { return this.RegisterForm.get('fonction_t1'); }
  get temps_fonction_t1() { return this.RegisterForm.get('temps_fonction_t1'); }
  get niv_formation_t1() { return this.RegisterForm.get('niv_formation_t1'); }
  get debut_contrat() { return this.RegisterForm.get('debut_contrat').value; }
  get fin_contrat() { return this.RegisterForm.get('fin_contrat').value; }
  get horaire() { return this.RegisterForm.get('horaire'); }
  get alternant() { return this.RegisterForm.get('alternant').value; }

  get alternantValidite() { return this.RegisterForm.get('alternant').invalid; }
  get intitule() { return this.RegisterForm.get('intitule'); }
  get classification() { return this.RegisterForm.get('classification'); }
  get niv() { return this.RegisterForm.get('niv'); }
  get coeff_hier() { return this.RegisterForm.get('coeff_hier'); }
  get code_commercial() { return this.RegisterForm.get('code_commercial'); }
  get form() { return this.RegisterForm.get('form').value; }
  get donneePerso() { return this.RegisterForm.get('donneePerso'); }



  showBasicDialogFin() {
    this.MessageFormSubmit = true;
  }
  ngOnInit(): void {

    this.onInitRegisterForm();


    this.etudiantService.getAllAlternants().subscribe(alternatsdata => {

      console.log(alternatsdata)
      this.listAlternant = alternatsdata

      alternatsdata.forEach(alt => {

        alt.nomcomplet = alt.user_id?.firstname + " " + alt.user_id?.lastname
        this.listAlternantDD.push(alt)
      }, (error) => { console.log(error) })

    }, (error) => { console.log(error) });
    this.formationService.getAll().subscribe(data => {

      data.forEach(element => {
        this.formationList.push({ label: element.titre, value: element._id });
      });

    })


  }

  onInitRegisterForm() {
    this.RegisterForm = this.formBuilder.group({
      // ****** Informations de l'entreprise ****
      raison_sociale: new FormControl('', Validators.required),//
      activite: new FormControl('', Validators.required),//
      adresse_ss: new FormControl('', Validators.required),//
      postal_ss: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),//
      ville_ss: new FormControl('', Validators.required),//

      adresse_ec: new FormControl('', Validators.required),//
      postal_ec: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]), //
      ville_ec: new FormControl('', Validators.required), //

      crc: new FormControl('', Validators.required),   //
      convention: new FormControl('', Validators.required),//
      idcc: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]), //1486
      siret: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.minLength(15), Validators.pattern('[0-9]+')]),
      nb_salarie: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
      phone_ent: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
      indicatif_ent: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
      ape_naf: new FormControl('', [Validators.required]),
      telecopie: new FormControl(''),
      OPCO: new FormControl('', [Validators.required]),
      organisme_prevoyance: new FormControl(''),
      // ****** Informations du dirigeant *******
      civilite: new FormControl(environment.civilite[0], [Validators.required]),
      lastname: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
      firstname: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
      indicatif: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
      numero_whatsapp: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+'),]),
      indicatif_whatsapp: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
      // ****** Informations du tuteur 1 *******
      civilite_t1: new FormControl(environment.civilite[0], [Validators.required]),
      lastname_t1: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
      firstname_t1: new FormControl('', [Validators.required, Validators.pattern('[^0-9]+')]),
      email_t1: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      phone_t1: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
      indicatif_t1: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
      date_naissance_t1: new FormControl('', [Validators.required]),
      fonction_t1: new FormControl('', [Validators.required]),
      temps_fonction_t1: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
      niv_formation_t1: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+')]),
      // ****** Informations de l'alternant ******
      debut_contrat: new FormControl('', Validators.required),
      fin_contrat: new FormControl('', Validators.required),
      horaire: new FormControl(''),
      alternant: new FormControl('', Validators.required),
      intitule: new FormControl('', Validators.required),
      classification: new FormControl(''),
      niv: new FormControl(''),
      coeff_hier: new FormControl(''),
      form: new FormControl('', Validators.required),
      code_commercial: new FormControl(this.Tok_code_commercial),

      professionnalisation: new FormControl(''),
      // ****** Informations Données perso ******
      donneePerso: new FormControl(''),

    });



  };

  nextPage() {
    this.ActiveIndex++
    console.log(this.alternant);
  }

  previousPage() {
    this.ActiveIndex--
  }

  verifEmailInBD() {
    this.emailExist = false
    this.AuthService.getByEmail(this.RegisterForm.value.email).subscribe((dataMail) => {
      if (dataMail) {
        this.emailExist = true
        this.ActiveIndex--;
        this.messageService.add({ severity: 'error', summary: 'Votre email est déjà utilisé', detail: "L'inscription ne pourra pas être finalisé" });
        return true
      }
    },
      (error) => {
        return false
      })
  }

  verifEmailt1InBD() {
    this.emailExist = false
    this.AuthService.getByEmail(this.RegisterForm.value.email_t1).subscribe((dataMail) => {
      if (dataMail) {
        this.emailExist = true
        this.ActiveIndex--;
        this.messageService.add({ severity: 'error', summary: 'Votre email est déjà utilisé', detail: "L'inscription ne pourra pas être finalisé" });
        return true
      }
    },
      (error) => {
        return false
      })
  }

  afficherProsChamp() {

    this.Professionnalisation = this.RegisterForm.value.professionnalisation
    console.log(this.Professionnalisation)
  }
  generatePassword() {
    return "mot dep asse"
  }

  //Methode d'ajout d'un nouveau prospect
  onAddProspect() {

    let CEO = new User(null,
      this.firstname.value,
      this.lastname.value,
      this.indicatif.value,
      this.phone.value,
      this.email.value,
      this.email.value,
      "password",
      'user', true, null,
      this.civilite.value,
      null,
      null,
      'CEO Entreprise',
      this.raison_sociale.value,
      null,
      this.ville_ss.value,
      this.adresse_ss.value,
      '',
      this.postal_ss.value,
      "",
      false
    );


    let entreprise = new Entreprise(
      null,
      this.RegisterForm.get('raison_sociale').value,
      null,
      null,
      null,
      false,
      this.RegisterForm.get('siret').value,
      this.RegisterForm.get('ape_naf').value,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      'France',
      null,
      null,
      null,
      null,
      this.email.value,
      this.phone_ent.value,
      null,
      null,
      null,
      null,
      null,
      CEO,
      this.activite.value,
      this.adresse_ec.value,
      this.postal_ec.value,
      this.ville_ec.value,
      this.crc.value,
      this.convention.value,
      this.telecopie.value,
      this.nb_salarie.value,
      this.idcc.value,
      this.indicatif_ent.value,
      this.OPCO.value,
      this.organisme_prevoyance.value)

    //Création du nouvel user

    let t1 = new User(
      null,
      this.firstname_t1.value,
      this.lastname_t1.value,
      this.indicatif_t1.value,
      this.phone_t1.value,
      this.email_t1.value,
      this.email_t1.value,
      "password",
      'user', true, null,
      this.civilite_t1.value, null, null,
      'Tuteur',
      entreprise.email,
      null,
      null,
      null,
      null,
      null,
      null,
      false
    );
    let TuteurObject = new Tuteur(null, null, this.fonction_t1.value, this.temps_fonction_t1.value, this.niv_formation_t1.value, this.date_naissance_t1, null)


    let contratAlternance = new ContratAlternance(null, this.debut_contrat, this.fin_contrat, this.horaire.value, this.alternant._id, this.intitule.value, this.classification.value, this.niv.value, this.coeff_hier.value, this.form.value, null, this.code_commercial.value,'créé')
    console.log(contratAlternance)
    //Creation de lobjet a envoyer dans le back 
    let ObjetToSend = { CEO, entreprise, t1, contratAlternance, TuteurObject }
    this.entrepriseService.createNewContrat(ObjetToSend).subscribe(
      ((response) => {
        if (response) {
          this.servService.getAServiceByLabel("Commercial").subscribe(serviceCommercial => {


            let notifToCreate = new Notification(null, null, null, "nouveau contrat Alternance ajouté", null, null, serviceCommercial.dataService?._id)

            this.NotifService.create(notifToCreate).subscribe(notif => {

              this.NotifService.newNotif(notif)

              this.messageService.add({ severity: 'success', summary: 'Le contrat alternance a été créé', detail: "Vérifiez vos mails pour les informations de connexion" });



            });
          }, (error) => {
            console.log(error)
          })


        } else {
          this.messageService.add({ severity: 'error', summary: 'Impossible de finaliser la pré-inscription', detail: "Votre email est peut-être déjà utilisé" });
          console.error(response)
        }

      }),
      ((error) => {
        this.messageService.add({ severity: 'error', summary: 'Impossible de finaliser la pré-inscription veuillez contacter un administrateur', detail: "Votre email est peut-être déjà utilisé" });
        console.error(error);
      })
    );

  }

}
