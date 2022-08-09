import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { map } from 'rxjs';
import { ContratAlternance } from 'src/app/models/ContratAlternance';
import { Entreprise } from 'src/app/models/Entreprise';
import { Prospect } from 'src/app/models/Prospect';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { ServService } from 'src/app/services/service.service';
import { Notification } from 'src/app/models/notification';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-inscription-entreprise',
  templateUrl: './inscription-entreprise.component.html',
  styleUrls: ['./inscription-entreprise.component.scss']
})
export class InscriptionEntrepriseComponent implements OnInit {

  Tok_code_commercial: string = this.route.snapshot.paramMap.get('code');

  formSteps: any[] = [
    "Entreprise",
    "Representant",
    "Tuteurs",
    "Alternant",
    "Fin",
  ];

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
  listAlternantDD = []
  formationList = []
  constructor(private servService: ServService, private NotifService: NotificationService, private formationService: DiplomeService, private route: ActivatedRoute, private formBuilder: FormBuilder, private messageService: MessageService,
    private entrepriseService: EntrepriseService, private AuthService: AuthService, private EtudiantService: EtudiantService) { }

  get raison_sociale() { return this.RegisterForm.get('raison_sociale').value; }
  get activite() { return this.RegisterForm.get('activite').value; }
  get adresse_ss() { return this.RegisterForm.get('adresse_ss').value; }
  get postal_ss() { return this.RegisterForm.get('postal_ss').value; }
  get ville_ss() { return this.RegisterForm.get('ville_ss').value; }

  get adresse_ec() { return this.RegisterForm.get('adresse_ec').value; }

  get postal_ec() { return this.RegisterForm.get('postal_ec').value; }

  get ville_ec() { return this.RegisterForm.get('ville_ec').value; }
  get crc() { return this.RegisterForm.get('crc').value; }
  get convention() { return this.RegisterForm.get('convention').value; }
  get idcc() { return this.RegisterForm.get('idcc').value; }

  get civilite() { return this.RegisterForm.get('civilite').value; }
  get lastname() { return this.RegisterForm.get('lastname').value; }
  get firstname() { return this.RegisterForm.get('firstname').value; }
  get email() { return this.RegisterForm.get('email').value; }
  get phone() { return this.RegisterForm.get('phone').value; }
  get indicatif() { return this.RegisterForm.get('indicatif').value; }
  get numero_whatsapp() { return this.RegisterForm.get('numero_whatsapp').value; }
  get indicatif_whatsapp() { return this.RegisterForm.get('indicatif_whatsapp').value; }
  get siret() { return this.RegisterForm.get('siret').value; }
  get nb_salarie() { return this.RegisterForm.get('nb_salarie').value; }
  get phone_ent() { return this.RegisterForm.get('phone_ent').value; }
  get indicatif_ent() { return this.RegisterForm.get('indicatif_ent').value; }
  get ape_naf() { return this.RegisterForm.get('ape_naf').value; }
  get telecopie() { return this.RegisterForm.get('telecopie').value; }
  get OPCO() { return this.RegisterForm.get('OPCO').value; }
  get organisme_prevoyance() { return this.RegisterForm.get('organisme_prevoyance').value; }

  get civilite_t1() { return this.RegisterForm.get('civilite_t1').value; }
  get lastname_t1() { return this.RegisterForm.get('lastname_t1').value; }
  get firstname_t1() { return this.RegisterForm.get('firstname_t1').value; }
  get email_t1() { return this.RegisterForm.get('email_t1').value; }
  get phone_t1() { return this.RegisterForm.get('phone_t1').value; }
  get indicatif_t1() { return this.RegisterForm.get('indicatif_t1').value; }
  get date_naissance_t1() { return this.RegisterForm.get('date_naissance_t1').value; }
  get fonction_t1() { return this.RegisterForm.get('fonction_t1').value; }
  get temps_fonction_t1() { return this.RegisterForm.get('temps_fonction_t1').value; }
  get niv_formation_t1() { return this.RegisterForm.get('niv_formation_t1').value; }
  get debut_contrat() { return this.RegisterForm.get('debut_contrat').value; }
  get fin_contrat() { return this.RegisterForm.get('fin_contrat').value; }
  get horaire() { return this.RegisterForm.get('horaire').value; }
  get alternant() { return this.RegisterForm.get('alternant'); }
  get intitule() { return this.RegisterForm.get('intitule').value; }
  get classification() { return this.RegisterForm.get('classification').value; }
  get niv() { return this.RegisterForm.get('niv').value; }
  get coeff_hier() { return this.RegisterForm.get('coeff_hier').value; }
  get code_commercial() { return this.RegisterForm.get('code_commercial').value; }
  get form() { return this.RegisterForm.get('form').value; }
  get donneePerso() { return this.RegisterForm.get('donneePerso').value; }
  ngOnInit(): void {

    this.onInitRegisterForm();
    this.EtudiantService.getAllAlternants().subscribe((alternatsdata) => {

      console.log(alternatsdata)
      this.listAlternant = alternatsdata

      this.listAlternant.forEach(alt => {
        console.log(alt)
        alt.nomcomplet = alt.user_id?.firstname + " " + alt.user_id?.lastname
        this.listAlternantDD.push(alt)
      })

    }, (error) => {
      console.log(error)
    })
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
      postal_ss: new FormControl('', Validators.required),//
      ville_ss: new FormControl('', Validators.required),//

      adresse_ec: new FormControl('', Validators.required),//
      postal_ec: new FormControl('', Validators.required), //
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
      email_t1: new FormControl('', [Validators.required, Validators.email]),
      phone_t1: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
      indicatif_t1: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
      date_naissance_t1: new FormControl('', [Validators.required]),
      fonction_t1: new FormControl('', [Validators.required]),
      temps_fonction_t1: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
      niv_formation_t1: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
      // ****** Informations de l'alternant ******
      debut_contrat: new FormControl('', Validators.required),
      fin_contrat: new FormControl('', Validators.required),
      horaire: new FormControl(''),
      alternant: new FormControl(this.listAlternant[0]),
      intitule: new FormControl('', Validators.required),
      classification: new FormControl('', Validators.required),
      niv: new FormControl('', Validators.required),
      coeff_hier: new FormControl('', Validators.required),
      form: new FormControl('', Validators.required),
      code_commercial: new FormControl(this.Tok_code_commercial),


      // ****** Informations Données perso ******
      donneePerso: new FormControl(''),

    });
  };

  nextPage() {
    this.ActiveIndex++
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



  generatePassword() {
    return "mot dep asse"
  }

  //Methode d'ajout d'un nouveau prospect
  onAddProspect() {
    let CEO = new User(null,
      this.firstname,
      this.lastname,
      this.indicatif,
      this.phone,
      this.email,
      this.email,
      this.generatePassword(),
      'user', true, null,
      this.civilite.value,
      null,
      null,
      'CEO Entreprise',
      this.raison_sociale,
      null,
      this.ville_ss,
      this.adresse_ss,
      '',
      this.postal_ss,
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
      this.phone_ent,
      null,
      null,
      null,
      null,
      null,
      CEO,
      this.activite,
      this.adresse_ec,
      this.postal_ec,
      this.ville_ec,
      this.crc,
      this.convention,
      this.telecopie,
      this.nb_salarie,
      this.idcc,
      this.indicatif_ent,
      this.OPCO,
      this.organisme_prevoyance)

    //Création du nouvel user

    let t1 = new User(
      null,
      this.firstname_t1,
      this.lastname_t1,
      this.indicatif_t1,
      this.phone_t1,
      this.email_t1,
      this.email_t1,
      this.generatePassword(),
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

    let contratAlternance = new ContratAlternance(this.debut_contrat, this.fin_contrat, this.horaire, this.alternant.value, this.intitule, this.classification, this.niv, this.coeff_hier, this.form.value, null, this.code_commercial)

    //Creation de lobjet a envoyer dans le back 
    let ObjetToSend = { CEO, entreprise, t1, contratAlternance }
    this.entrepriseService.createNewContrat(ObjetToSend).subscribe(
      ((response) => {
        if (response) {
          this.RegisterForm.reset
          this.ActiveIndex = 0
          this.servService.getAServiceByLabel("Commercial").subscribe(serviceCommercial => {
            this.NotifService.create(new Notification(null, null, null, "nouveau contrat Alternance ajouté", null, null, serviceCommercial?._id)).pipe(map(notif => {
              console.log(notif)
              this.NotifService.newNotif(notif)
            }, (error) => {
              console.error(error)
            }));
          })

          this.messageService.add({ severity: 'success', summary: 'La demande d\'admission a été envoyé', detail: "Vérifiez vos mails pour les informations de connexion" });
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
