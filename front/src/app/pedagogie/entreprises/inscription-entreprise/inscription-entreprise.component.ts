import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { map } from 'rxjs';
import { Entreprise } from 'src/app/models/Entreprise';
import { Prospect } from 'src/app/models/Prospect';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { environment } from 'src/environments/environment';


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
  ActiveIndex = 2;
  RegisterForm: FormGroup;

  paysList = environment.pays;
  civiliteList = environment.civilite;
  nationList = environment.nationalites;

  emailExist: boolean;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private messageService: MessageService,
    private entrepriseService: EntrepriseService, private AuthService: AuthService, private EtudiantService: EtudiantService) { }

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

  get civilite() { return this.RegisterForm.get('civilite'); }
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

  get civilite_t1() { return this.RegisterForm.get('civilite_t1'); }
  get lastname_t1() { return this.RegisterForm.get('lastname_t1'); }
  get firstname_t1() { return this.RegisterForm.get('firstname_t1'); }
  get email_t1() { return this.RegisterForm.get('email_t1'); }
  get phone_t1() { return this.RegisterForm.get('phone_t1'); }
  get indicatif_t1() { return this.RegisterForm.get('indicatif_t1'); }
  get date_naissance_t1() { return this.RegisterForm.get('date_naissance_t1'); }
  get fonction_t1() { return this.RegisterForm.get('fonction_t1'); }
  get temps_fonction_t1() { return this.RegisterForm.get('temps_fonction_t1'); }
  get niv_formation_t1() { return this.RegisterForm.get('niv_formation_t1'); }
  get debut_contrat() { return this.RegisterForm.get('debut_contrat'); }
  get fin_contrat() { return this.RegisterForm.get('fin_contrat'); }
  get horaire() { return this.RegisterForm.get('horaire'); }
  get alternant() { return this.RegisterForm.get('alternant'); }
  get intitule() { return this.RegisterForm.get('intitule'); }
  get classification() { return this.RegisterForm.get('classification'); }
  get niv() { return this.RegisterForm.get('niv'); }
  get coeff_hier() { return this.RegisterForm.get('coeff_hier'); }
  get code_commercial() { return this.RegisterForm.get('code_commercial'); }
  get form() { return this.RegisterForm.get('form'); }
  get donneePerso() { return this.RegisterForm.get('donneePerso'); }
  ngOnInit(): void {

    this.onInitRegisterForm();
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

    let entreprise: Entreprise = null

    //Création du nouvel user
    let CEO = new User(null,
      this.RegisterForm.get('firstname').value,
      this.RegisterForm.get('lastname').value,
      this.RegisterForm.get('indicatif').value,
      this.RegisterForm.get('phone').value,
      this.RegisterForm.get('email').value,
      this.RegisterForm.get('email').value,
      this.generatePassword(),
      'user', true, null,
      this.RegisterForm.get('civilite').value,
      null,
      null,
      'Entreprise',
      'entreprise._id',
      this.RegisterForm.get('adresse_ss').value,
      this.RegisterForm.get('ville_ss').value,
      this.RegisterForm.get('adresse_ss').value,
      '',
      this.RegisterForm.get('postal_ss').value,
      "",
      true,
      null,

    );

    let t1 = new User(
      null,
      this.RegisterForm.get('firstname_t1').value,
      this.RegisterForm.get('lastname_t1').value,
      this.RegisterForm.get('indicatif_t1').value,
      this.RegisterForm.get('phone_t1').value,
      this.RegisterForm.get('email_t1').value,
      this.RegisterForm.get('email_t1').value,
      this.generatePassword(),
      'user', true, null,
      this.RegisterForm.get("civilite_t1").value, null, null,
      'Tuteur', 'entreprise._id', this.RegisterForm.get('adresse_ss').value,
      "",
      "",
      '',
      "",
      "",
      true,
      null,

    );

    //Creation du nouveau prospect

    this.entrepriseService.inscription(entreprise).subscribe(
      ((response) => {
        if (response) {
          /*this.NotifService.create(new Notification(null, null, null, "nouvelle demande admission", null, null, "62555405607a7a55050430bc")).pipe(map(notif => {
            console.log(notif)
            this.NotifService.newNotif(notif)
          }, (error) => {
            console.error(error)
          }));*/

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
