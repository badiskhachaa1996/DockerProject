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

  code_commercial: string = this.route.snapshot.paramMap.get('code');

  formSteps: any[] = [
    "Entreprise",
    "Representant",
    "Tuteurs",
    "Alternant",
    "Fin",
  ];

  listAlternant = []

  ActiveIndex = 0;
  RegisterForm: FormGroup;

  paysList = environment.pays;
  civiliteList = environment.civilite;
  nationList = environment.nationalites;

  emailExist: boolean;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private messageService: MessageService,
    private entrepriseService: EntrepriseService, private AuthService: AuthService, private EtudiantService: EtudiantService) { }

  ngOnInit(): void {

    this.onInitRegisterForm();
  }

  onInitRegisterForm() {
    this.RegisterForm = this.formBuilder.group({
      // ****** Informations de l'entreprise ****
      raison_sociale: new FormControl('', Validators.required),
      activite: new FormControl('', Validators.required),

      adresse_ss: new FormControl('', Validators.required),
      postal_ss: new FormControl('', Validators.required),
      ville_ss: new FormControl('', Validators.required),

      adresse_ec: new FormControl('', Validators.required),
      postal_ec: new FormControl('', Validators.required),
      ville_ec: new FormControl('', Validators.required),

      crc: new FormControl('', Validators.required),
      convention : new FormControl('', Validators.required),
      idcc: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]), //1486
      siret: new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]),
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
      code_commercial: new FormControl(this.code_commercial),

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

  generatePassword(){
    return "mot dep asse"
  }

  //Methode d'ajout d'un nouveau prospect
  onAddProspect() {

    let entreprise : Entreprise = null

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
      this.RegisterForm.get('civilite').value, null, null,
      'Entreprise', entreprise._id,
      "",
      null,
      null,
      null,
      null,
      "",
      false,
      new Date()
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
      'Tuteur', entreprise._id,'','','','','','',false,
      new Date()
    )

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
