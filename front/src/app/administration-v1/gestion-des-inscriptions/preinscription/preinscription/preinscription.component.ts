import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdmissionService } from 'src/app/services/admission.service';
import { User } from 'src/app/models/User';
import { MessageService } from 'primeng/api';
import { saveAs as importedSaveAs } from "file-saver";
import { SocketService } from 'src/app/services/socket.service';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/services/notification.service';
import { Prospect } from 'src/app/models/Prospect';
import jwt_decode from "jwt-decode";
import { AuthService } from 'src/app/services/auth.service';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PartenaireService } from 'src/app/services/partenaire.service';
import { Collaborateur } from 'src/app/models/Collaborateur';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { RhService } from 'src/app/services/rh.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import mongoose from 'mongoose';
import { Notification } from 'src/app/models/notification';
import { Ticket } from 'src/app/models/Ticket';
import { TicketService } from 'src/app/services/ticket.service';
import { SujetService } from 'src/app/services/sujet.service';
import { ServService } from 'src/app/services/service.service';
import { CandidatureLeadService } from 'src/app/services/candidature-lead.service';
import { VenteService } from 'src/app/services/vente.service';
@Component({
  selector: 'app-preinscription',
  templateUrl: './preinscription.component.html',
  styleUrls: ['./preinscription.component.scss']
})
export class PreinscriptionComponent implements OnInit {
  prospects: Prospect[] = [];
  prospectI: Prospect[] = [];
  PROSPECT: Prospect;
  proscteList: Prospect[] = [];
  prospect_acctuelle: Prospect;
  userConnected: User;
  ticket: any[] = [];
  tickets: Ticket[] = [];
  selectedTabIndex: number = 0;
  selectedTabIndex1: number = 0;
  shownewLeadForm: boolean = false;
  showupdateLeadForm: boolean = false;
  shownewLeadFormI: boolean = false;
  shownewRIForm: boolean = false;
  itslead: boolean = false;
  service_id: any;
  sujet_id: any;
  visible: boolean = false;
  visible_evaluation: boolean = false;
  showDocuments: boolean = false;
  showDossier: boolean = false;
  showDoccuments: boolean = false;
  nationList = environment.nationalites;
  paysList = environment.pays;
  TicketnewPro: Ticket;
  civiliteList = environment.civilite;
  tabStates: { [tabId: string]: boolean } = {};
  programeFrDropdown = [

  ]

  programEnDropdown = [

  ]
  rentreeList = [

  ]

  etat_dossierDropdown = [
    { value: "En attente", label: "En attente" },
    { value: "Manquant", label: "Manquant" },
    { value: "Complet", label: "Complet" }
  ];
  decision_dropdown = [
    { value: "Admis", label: "Admis" },
    { value: "Admis sous réserve", label: "Admis sous réserve" },
    { value: "Réorientation", label: "Réorientation" },
    { value: "Refusé", label: "Refusé" },
  ];
  niveux_dropdown = [
    { value: "Bac", label: "Bac" },
    { value: "Bac+1", label: "Bac+1" },
    { value: "Bac+2", label: "Bac+2" },
    { value: "Bac+3", label: "Bac+3" },
    { value: "Bac+4", label: "Bac+4" },
    { value: "Bac+5", label: "Bac+5" },
  ]
  defaultEtatDossier: string = "En attente";
  campusDropdown =
    [
      { value: "Paris - France", label: "Paris - France" },
      { value: "Montpellier - France", label: "Montpellier - France" },
      { value: "Brazzaville - Congo", label: "Brazzaville - Congo" },
      { value: "Rabat - Maroc", label: "Rabat - Maroc" },
      { value: "La Valette - Malte", label: "La Valette - Malte" },
      { value: "UAE - Dubai", label: "UAE - Dubai" },
      { value: "En ligne", label: "En ligne" },
    ];
  typeFormationDropdown = [
    { value: "Initiale" },
    { value: "Alternance" }
  ];
  programList =
    [
      { value: "Programme Français" },
      { value: "Programme Anglais" },
    ];
  isPartenaireExterne = false

  typeList = [
    { label: "Local", value: "Local" },
    { label: "International", value: "International" }
  ]
  ecoleList = [
    { label: "Estya", value: "estya" },
    { label: "ESPIC", value: "espic" },
    { label: "Académie des gouvernantes", value: "adg" },
    { label: "Estya Dubai", value: "estya-dubai" },
    { label: "Studinfo", value: "studinfo" },
    { label: "INTUNS", value: "intuns" },
    { label: "Intunivesity", value: "intunivesity" },
    { label: "ICBS Malte", value: "icbsmalta" },
    { label: "INT Education", value: "inteducation" }
  ]

  sourceList = [
    { label: "Partenaire", value: "Partenaire" },
    { label: "Equipe commerciale", value: "Equipe commerciale" },
    { label: "Etudiant interne", value: "Etudiant interne" },// Par défaut si Etudiant ou Alternant
    { label: "Lead", value: "Lead" },
    { label: "Spontané", value: "Spontané" } //Par défaut si Lead
  ]

  commercialList = []

  EcoleListRework = []
  newLeadForm: FormGroup = new FormGroup({
    type: new FormControl('', Validators.required),
    ecole: new FormControl('', [Validators.required]),
    commercial: new FormControl('',),
    source: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    civilite: new FormControl(environment.civilite[0], Validators.required),
    date_naissance: new FormControl('', Validators.required),
    nationalite: new FormControl(this.nationList[0], Validators.required),
    pays: new FormControl(this.paysList[76], Validators.required),
    email_perso: new FormControl('', Validators.required),
    indicatif: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    campus: new FormControl(this.campusDropdown[0]),
    rentree_scolaire: new FormControl(''),
    programme: new FormControl(this.programList[0], Validators.required),
    formation: new FormControl('', Validators.required),
    rythme_formation: new FormControl('', Validators.required),
    nomlead: new FormControl(''),
    rue: new FormControl(''),
    ville: new FormControl(''),
    codep: new FormControl(''),
  });
  updateLeadForm: FormGroup = new FormGroup({
    type: new FormControl('', Validators.required),
    ecole: new FormControl('', [Validators.required]),
    commercial: new FormControl('',),
    source: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    civilite: new FormControl(environment.civilite[0], Validators.required),
    date_naissance: new FormControl('', Validators.required),
    nationalite: new FormControl(this.nationList[0], Validators.required),
    pays: new FormControl(this.paysList[76], Validators.required),
    email_perso: new FormControl('', Validators.required),
    indicatif: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    campus: new FormControl(this.campusDropdown[0]),
    rentree_scolaire: new FormControl(''),
    programme: new FormControl(this.programList[0], Validators.required),
    formation: new FormControl('', Validators.required),
    rythme_formation: new FormControl('', Validators.required),
    nomlead: new FormControl(''),
    rue: new FormControl(''),
    ville: new FormControl(''),
    codep: new FormControl(''),
  })
  formAffectation = new FormGroup({
    _id: new FormControl('', Validators.required),
    agent_id: new FormControl('', Validators.required),
    date_limite: new FormControl(''),
    note_assignation: new FormControl(''),
  })
  RIForm: FormGroup = new FormGroup({
    etudiant: new FormControl('', Validators.required),
    ecole: new FormControl('', [Validators.required]),
    commercial: new FormControl('',),
    source: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    firstname: new FormControl('', Validators.required),
    civilite: new FormControl(environment.civilite[0], Validators.required),
    date_naissance: new FormControl('', Validators.required),
    nationalite: new FormControl(this.nationList[0], Validators.required),
    pays: new FormControl(this.paysList[76], Validators.required),
    email_perso: new FormControl('', Validators.required),
    indicatif: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    campus: new FormControl(this.campusDropdown[0]),
    rentree_scolaire: new FormControl(''),
    programme: new FormControl(this.programList[0], Validators.required),
    formation: new FormControl('', Validators.required),
    rythme_formation: new FormControl('', Validators.required),
    nomlead: new FormControl(''),
    rue: new FormControl(''),
    ville: new FormControl(''),
    codep: new FormControl(''),
  })

  RegisterForm2: FormGroup = new FormGroup({
    ecole: new FormControl('', [Validators.required]),
    commercial: new FormControl('',),
    source: new FormControl('', Validators.required)
  })
  DecisionForm: FormGroup = new FormGroup({
    decisoin_admission: new FormControl('', [Validators.required]),
    explication: new FormControl('',),
    date_d: new FormControl('',)
  })
  entretienForm: FormGroup = new FormGroup({
    date_e: new FormControl('',),
    duree_e: new FormControl('', [Validators.required]),
    niveau: new FormControl('',),
    parcour: new FormControl('',),
    choix: new FormControl('',)
  })
  dropdownMember = []
  TicketAffecter = null
  userDic = {}
  token;
  candidatureDic = {}
  constructor(private UserService: AuthService, private commercialService: CommercialPartenaireService, private admissionService: AdmissionService,
    private etudiantService: EtudiantService, private ticketService: TicketService, private Socket: SocketService,
    private router: Router, private FAService: FormulaireAdmissionService, private PService: PartenaireService, private VenteService: VenteService,
    private ToastService: MessageService, private rhService: RhService, private NotifService: NotificationService,
    private SujetService: SujetService, private ServiceService: ServService, private CandidatureService: CandidatureLeadService) { }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.getthecrateur();
    this.UserService.getAllAgent().subscribe(data => {
      data.forEach(u => {
        this.dropdownMember.push({ label: `${u.lastname} ${u.firstname}`, value: u._id })
        this.userDic[u._id] = u
      })
    })
    if (localStorage.getItem("token") != null) {
      let decodeToken: any = jwt_decode(localStorage.getItem("token"))
      this.isPartenaireExterne = decodeToken.role === 'Agent' && decodeToken.type === 'Commercial' && !decodeToken.service_id
      if (this.isPartenaireExterne) {
        this.RegisterForm2.patchValue({ source: 'Partenaire' });
        this.commercialService.getByUserId(decodeToken.id).subscribe(commercial => {
          if (commercial) {
            this.RegisterForm2.patchValue({ commercial: commercial.code_commercial_partenaire })
          }
        })
      } else {
        this.commercialService.getAllPopulate().subscribe(commercials => {
          commercials.forEach(commercial => {
            let { user_id }: any = commercial
            if (user_id && commercial.isAdmin)
              this.commercialList.push({ label: `${user_id.lastname} ${user_id.firstname}`, value: commercial.code_commercial_partenaire })
          })
          this.rhService.getCollaborateurs()
            .then((response) => {
              response.forEach((c: Collaborateur) => {
                this.commercialList.push({ label: `${c.user_id.lastname} ${c.user_id.firstname}`, value: c.matricule })
              })
            })
            .catch((error) => { this.ToastService.add({ severity: 'error', summary: 'Agents', detail: 'Impossible de récupérer la liste des collaborateurs' }); });
          this.PService.getAll().subscribe(commercials => {
            this.commercialList = []
            commercials.forEach(commercial => {
              this.commercialList.push({ label: `${commercial.nom}`, value: commercial.code_partenaire })
            })
          })
        })
      }

      if (!this.isPartenaireExterne && (decodeToken.type == "Initial" || decodeToken.type == "Alternant"))
        this.RegisterForm2.patchValue({ source: 'Etudiant interne' });
      else if (!this.isPartenaireExterne && decodeToken.type == "Prospect")
        this.RegisterForm2.patchValue({ source: 'Lead' });


      this.FAService.EAgetAll().subscribe(data => {
        data.forEach(e => {
          this.EcoleListRework.push({ label: e.titre, value: e.url_form })
          //this.sourceList.push({ label: "Site web " + e.titre, value: "Site web " + e.titre })
        })
        /*this.sourceList.push({ label: "Site Web", value: "Site Web" })
        this.sourceList = this.sourceList.concat([
          { label: "Equipe communication", value: "Equipe communication" },
          { label: "Bureau Congo", value: "Bureau Congo" },
          { label: "Bureau Maroc", value: "Bureau Maroc" },
          { label: "Collaborateur interne", value: "Collaborateur interne" },
          { label: "Report", value: "Report" },
          { label: "Equipe commerciale interne - bureau Tunis", value: "Equipe commerciale interne - bureau Tunis" },
          { label: "Equipe commerciale interne - bureau Paris", value: "Equipe commerciale interne - bureau Paris" },
          { label: "Equipe commerciale interne - bureau Montpellier", value: "Equipe commerciale interne - bureau Montpellier" },
          { label: "Equipe commerciale interne - bureau Congo Brazzaville", value: "Equipe commerciale interne - bureau Congo Brazzaville" },
          { label: "Equipe commerciale interne - bureau Dubaï", value: "Equipe commerciale interne - bureau Dubaï" },
          { label: "Equipe commerciale interne - bureau Maroc", value: "Equipe commerciale interne - bureau Maroc" },

          { label: "Site web", value: "Site web" },
          { label: "Candidature spontanée", value: "Candidature spontanée" },
        ])*/
      })
      //recuperation des prospect 
      this.admissionService.getAll().subscribe((results => {
        results.forEach((result) => {
          if (result.traited_by == "Local") {
            this.prospects.push(result);
          } else { this.prospectI.push(result); }


        })
      }))
      this.CandidatureService.getAll().subscribe(cs => {
        cs.forEach(c => {
          if (c.lead_id)
            this.candidatureDic[c.lead_id._id] = c
        })
      })
      this.ticketService.getAll().subscribe(data => {
        this.tickets = data;
      });

    }

  }
  getthecrateur() {
    this.UserService.getInfoById(this.token.id).subscribe({
      next: (response) => { this.userConnected = response; },
      error: (error) => { console.error(error); },
      complete: () => console.log("information de l'utilisateur connecté récuperé")
    });
  }
  onSelectEcole() {
    this.FAService.EAgetByParams(this.newLeadForm.value.ecole).subscribe(data => {
      this.FAService.RAgetByEcoleID(data._id).subscribe(dataEcoles => {
        let dicFilFr = {}
        let fFrList = []

        let dicFilEn = {}
        let fEnList = []
        data.formations.forEach(f => {
          if (f.langue.includes('Programme Français')) {
            if (dicFilFr[f.filiere]) {
              dicFilFr[f.filiere].push({ label: f.nom, value: f.nom })
            } else {
              dicFilFr[f.filiere] = [{ label: f.nom, value: f.nom }]
              fFrList.push(f.filiere)
            }
          }
          //this.programeFrDropdown.push({ label: f.nom, value: f.nom })
          if (f.langue.includes('Programme Anglais'))
            if (dicFilEn[f.filiere]) {
              dicFilEn[f.filiere].push({ label: f.nom, value: f.nom })
            } else {
              dicFilEn[f.filiere] = [{ label: f.nom, value: f.nom }]
              fEnList.push(f.filiere)
            }
        })
        this.programeFrDropdown = []
        fFrList.forEach(f => {
          let ft = f
          if (f == undefined || f == "undefined")
            f = "Autre"
          this.programeFrDropdown.push(
            { label: f, value: f, items: dicFilFr[ft] }
          )
        })
        this.programEnDropdown = []
        fEnList.forEach(f => {
          let ft = f
          if (f == undefined || f == "undefined")
            f = "Autre"
          this.programEnDropdown.push(
            { label: f, value: f, items: dicFilEn[ft] }
          )
        })
        this.rentreeList = []
        dataEcoles.forEach(rentre => {
          this.rentreeList.push({ label: rentre.nom, value: rentre.nom, _id: rentre._id })
        })

      })
      this.campusDropdown = []
      data.campus.forEach(c => {
        this.campusDropdown.push({ label: c, value: c })
      })
    })

  }
  addNewProspect() {
    let customid = ""
    try {
      customid = this.generateCode(this.newLeadForm.value.nationalite.value, this.newLeadForm.value.firstname, this.newLeadForm.value.lastname, this.newLeadForm.value.date_naissance)
    } catch (error) {
      customid = ""
    }
    this.admissionService.create({
      'newUser': new User(
        null,
        this.newLeadForm.value.firstname,
        this.newLeadForm.value.lastname,
        this.newLeadForm.value.indicatif,
        this.newLeadForm.value.phone,
        null,
        this.newLeadForm.value.email_perso,
        null,
        'user',
        true,
        null,
        this.newLeadForm?.value?.civilite?.value,
        null, null, 'Prospect', null,
        this.newLeadForm?.value?.pays?.value,
        null, null, null, null,
        this.newLeadForm?.value?.nationalite?.value,
        null,
        new Date(),
        null, null,
        this.newLeadForm?.value?.campus?.value

      ), 'newProspect': new Prospect(
        null, null,
        this.newLeadForm?.value?.date_naissance,
        null, null, null, null, null, null,
        this.newLeadForm?.value?.campus?.value,
        null, null,
        this.newLeadForm?.value?.programme?.value,
        this.newLeadForm?.value?.formation,
        this.newLeadForm?.value?.rythme_formation?.value,
        null, null, null, null, true, new Date(),
        this.newLeadForm?.value?.ecole,
        this.newLeadForm?.value?.commercial,
        null, null, null, null, null, null, null, null,
        null,
        customid, this.newLeadForm?.value?.type,
        this.newLeadForm?.value.rue,
        this.newLeadForm?.value.ville,
        this.newLeadForm?.value.codep
      )
    }).subscribe(
      ((responsePRO) => {
        console.log(responsePRO);
        this.newLeadForm.reset()
        this.ServiceService.getAServiceByLabel("Administration").subscribe((response) => {
          console.log(response);
          this.service_id = response.dataService._id;
          console.log(this.service_id);
          this.SujetService.getAllByServiceID(this.service_id).subscribe((response) => {
            console.log(response);
            response.forEach((result) => {

              if (result.label = "Inscription") {
                console.log(result);
                this.sujet_id = result._id;
                this.TicketnewPro = {}
                this.TicketnewPro.createur_id = responsePRO?.dataUser._id;
                this.TicketnewPro.sujet_id = this.sujet_id;
                console.log(this.userConnected);
                console.log(this.service_id);
                console.log(this.sujet_id);
                console.log(this.TicketnewPro);
                this.admissionService.createticket(this.TicketnewPro).subscribe((result) => { console.log(result); });

              }
            })
          })


        })
        this.ToastService.add({ severity: 'success', summary: 'Création du prospect avec succès', detail: "L'inscription a été finalisé" });
      })
    );




  }

  changeSource(source: string) {
    this.commercialList = []
    console.log(source)
    if (source == "Partenaire") {
      this.itslead = false
      this.PService.getAll().subscribe(commercials => {
        this.commercialList = []
        commercials.forEach(commercial => {
          this.commercialList.push({ label: `${commercial.nom}`, value: commercial.code_partenaire })
        })
      })
    } else if (source == "Equipe commerciale") {
      this.itslead = false
      this.commercialService.getAllPopulate().subscribe(commercials => {
        this.commercialList = []
        commercials.forEach(commercial => {
          let { user_id }: any = commercial
          if (user_id && commercial.isAdmin)
            this.commercialList.push({ label: `${user_id.lastname} ${user_id.firstname}`, value: commercial.code_commercial_partenaire })
        })
        this.rhService.getCollaborateurs()
          .then((response) => {
            response.forEach((c: Collaborateur) => {
              this.commercialList.push({ label: `${c.user_id.lastname} ${c.user_id.firstname}`, value: c.matricule })
            })
          })
          .catch((error) => { this.ToastService.add({ severity: 'error', summary: 'Agents', detail: 'Impossible de récupérer la liste des collaborateurs' }); });
        this.PService.getAll().subscribe(commercials => {
          this.commercialList = []
          commercials.forEach(commercial => {
            this.commercialList.push({ label: `${commercial.nom}`, value: commercial.code_partenaire })
          })
        })
      })
    } else if (source == "Etudiant interne") {
      this.etudiantService.getAllEtudiantPopulate().subscribe(etudiants => {
        this.commercialList = [];
        etudiants.forEach(etudiant => {
          this.commercialList.push({ label: `${etudiant?.user_id}`, value: etudiant.user_id })

        })
      })
    } else if (source == "Lead") {
      this.itslead = true
    }
  }

  generateCode(nation, firstname, lastname, date_naissance) {
    let code_pays = nation.substring(0, 3)
    environment.dicNationaliteCode.forEach(code => {
      if (code[nation] && code[nation] != undefined) {
        code_pays = code[nation]
      }
    })
    let prenom = firstname.substring(0, 1)
    let nom = lastname.substring(0, 1)
    let y = 0
    for (let i = 0; i < (nom.match(" ") || []).length; i++) {
      nom = nom + nom.substring(nom.indexOf(" ", y), nom.indexOf(" ", y) + 1)
      y = nom.indexOf(" ", y) + 1
    }
    let dn = new Date(date_naissance)
    let jour = dn.getDate()
    let mois = dn.getMonth() + 1
    let year = dn.getFullYear().toString().substring(2)
    let nb = new Date().getMilliseconds().toString()
    nb = nb.substring(nb.length - 3)
    let r = (code_pays + prenom + nom + jour + mois + year + nb).toUpperCase()
    return r

  }


  onshowDossier(student: Prospect) {
    this.defaultEtatDossier = student.etat_dossier;
    this.tabStates[student._id] = true;
    this.ticket = [];
    this.proscteList.push(student);
    this.prospect_acctuelle = student;
    this.showDossier = true;

    this.admissionService.getPopulate(student._id).subscribe(data => {
      this.PROSPECT = data

    })
    console.log(student.user_id);
    this.ticketService.getAllMine(student.user_id._id).subscribe(tick => {
      console.log(student._id);
      console.log(tick);
      console.log(tick[0]);
      this.ticket.push(tick[0]);
      console.log(tick[0].agent_id?.firstname)

    })

    setTimeout(() => {
      this.selectedTabIndex = 3; // Définir l'indice après un délai
    }, 500); // Réglez le délai en millisecondes selon vos besoins
    console.log(student);

    this.DecisionForm.setValue({
      date_d: this.conersiondate(this.prospect_acctuelle.decision.date_decision),
      decisoin_admission: this.prospect_acctuelle.decision.decision_admission,
      explication: this.prospect_acctuelle.decision.expliquation,
    })
    this.entretienForm.patchValue({
      date_e: this.conersiondate(this.prospect_acctuelle.entretien.date_entretien),
      duree_e: this.prospect_acctuelle.entretien.Duree,
      choix: this.prospect_acctuelle.entretien.choix,
      niveau: this.prospect_acctuelle.entretien.niveau,
      parcour: this.prospect_acctuelle.entretien.parcours
    })
    if (this.prospect_acctuelle.decision.expliquation == "En attente de traitement") {
      if (this.prospect_acctuelle.entretien.niveau == "0") {

      } else {
        this.prospect_acctuelle.etat_traitement == "ETAPE 3"
      }
    } else {
      this.prospect_acctuelle.etat_traitement = "ETAPE 4"
    }
    this.admissionService.updateV2(this.prospect_acctuelle).subscribe(data => console.log(data))
  }
  conersiondate(a) {
    const dl = a // Supposons que project.debut soit une date valide
    const dateObjectl = new Date(dl); // Conversion en objet Date
    const year = dateObjectl.getFullYear();
    const month = String(dateObjectl.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
    const day = String(dateObjectl.getDate()).padStart(2, '0');
    const new_date = `${year}-${month}-${day}`;
    return new_date
  }
  onTabClose() {
    this.selectedTabIndex = 0;
  }
  onshowDocuments() {

    if (this.showDocuments == true) {
      this.showDocuments = false
    } else {
      this.showDocuments = true
    }
  }
  onSelectEtat(event: any, procpect: Prospect) {
    procpect.etat_dossier = event.value
    this.admissionService.updateV2(procpect).subscribe(data => console.log(data))
  }
  deletePro(prospect: Prospect) {
    console.log("hello")
    this.admissionService.delete(prospect._id, prospect.user_id._id).subscribe(res => { console.log(res) });


  }
  adddicision(prospect: Prospect) {
    console.log(prospect);
    console.log(this.DecisionForm.value.date_d);
    console.log(this.prospect_acctuelle);
    this.prospect_acctuelle.decision.date_decision = this.DecisionForm.value.date_d;
    this.prospect_acctuelle.decision.decision_admission = this.DecisionForm.value.decisoin_admission;
    this.prospect_acctuelle.decision.expliquation = this.DecisionForm.value.explication;
    this.admissionService.updateV2(this.prospect_acctuelle).subscribe(res => { console.log(res) });
    console.log(this.prospect_acctuelle)


  }
  addEntretien() {
    this.prospect_acctuelle.entretien.Duree = this.entretienForm.value.duree_e;
    this.prospect_acctuelle.entretien.choix = this.entretienForm.value.choix;
    this.prospect_acctuelle.entretien.date_entretien = this.entretienForm.value.date_e;
    this.prospect_acctuelle.entretien.niveau = this.entretienForm.value.niveau;
    this.prospect_acctuelle.entretien.parcours = this.entretienForm.value.parcour;
    console.log("***************************************************************");
    console.log(this.prospect_acctuelle);
    this.admissionService.updateV2(this.prospect_acctuelle).subscribe(res => { console.log(res) });
  }
  showDialog(ticket: any) {
    this.visible = true;
    this.TicketAffecter = ticket
    this.formAffectation.patchValue({ ...ticket })
    this.UserService.getAllByServiceFromList(ticket.sujet_id.service_id._id).subscribe(data => {
      this.dropdownMember = []
      data.forEach(u => {
        this.dropdownMember.push({ label: `${u.lastname} ${u.firstname}`, value: u._id })
      })
    })
  }

  initupdateLeadForm(prospect) {
    console.log(prospect.user_id.numero_adresse);
    this.updateLeadForm.patchValue({
      type: prospect?.traited_by,
      ecole: prospect?.type_form,
      //commercial:
      //source:
      lastname: prospect.user_id.lastname,
      firstname: prospect.user_id.firstname,
      civilite: prospect.user_id.civilite,
      date_naissance: prospect.date_naissance,
      //nationalite: 
      pays: prospect.user_id.pays_adresse,
      email_perso: prospect.user_id.email_perso,
      indicatif: prospect.user_id.indicatif,
      phone: prospect.user_id.phone,
      //campus:
      rentree_scolaire: prospect?.rentree_scolaire,
      programme: prospect?.programme,
      //formation:
      rythme_formation: prospect.rythme_formation,
      //nomlead:
      rue: prospect.user_id.numero_adresse,
      ville: prospect.user_id.ville_adresse,
      codep: prospect.user_id.postal_adresse

    })
    this.showupdateLeadForm = true
  }
  initEvaluation() {
    this.visible_evaluation = true;
  }
  UpadateProspect() {

  }
  onAffectation() {
    this.ticketService.update({ ...this.formAffectation.value, statut: "En cours de traitement", assigne_by: this.token.id }).subscribe(data => {
      let d = new Date()
      let month = (d.getUTCMonth() + 1).toString()
      if (d.getUTCMonth() + 1 < 10)
        month = "0" + month
      let day = (d.getUTCDate()).toString()
      if (d.getUTCDate() < 10)
        day = "0" + day
      let year = d.getUTCFullYear().toString().slice(-2);
      this.Socket.NewNotifV2(this.formAffectation.value.agent_id, `Un nouveau ticket vous a été assigné pour le service ${this.TicketAffecter.sujet_id.service_id.label}. Le sujet du ticket est ${this.TicketAffecter.sujet_id.label}. Il vous a été assigné le ${day}/${month}/${year}.`)
      this.ticketService.sendMailAff({ sujet: this.TicketAffecter.sujet_id.label, service: this.TicketAffecter.sujet_id.service_id.label, date: `${day}/${month}/${year}`, agent_email: this.userDic[this.formAffectation.value.agent_id]?.email }).subscribe(() => {

      })
      this.NotifService.create(new Notification(null, null, false, `Un nouveau ticket vous a été assigné pour le service ${this.TicketAffecter.sujet_id.service_id.label}. Le sujet du ticket est ${this.TicketAffecter.sujet_id.label}. Il vous a été assigné le ${day}/${month}/${year}.`, new Date(), this.formAffectation.value.agent_id, this.TicketAffecter.sujet_id.service_id._id)).subscribe(() => { console.log('SUCCES') })
      this.tickets.splice(this.tickets.indexOf(this.TicketAffecter), 1)
      //verfier si c'est une tache alors modifier la tache

      this.TicketAffecter = null
      this.ToastService.add({ severity: 'success', summary: "Affectation du ticket avec succès" })
    })




  }
  downloadFile(doc: { date: Date, nom: String, path: String }) {
    this.admissionService.downloadFile(this.PROSPECT._id, `${doc.nom}/${doc.path}`).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });

      importedSaveAs(new Blob([byteArray], { type: data.documentType }), doc.path)
    }, (error) => {
      console.error(error)
    })
  }
  docToUpload: { date: Date, nom: string, path: string, _id: string }
  initUpload(doc: { date: Date, nom: string, path: string, _id: string }, id = "selectedFile") {
    this.docToUpload = doc
    document.getElementById(id).click();
  }

  uploadFile(event: File[]) {
    let formData = new FormData()
    formData.append('id', this.PROSPECT._id);
    formData.append('document', `${this.docToUpload.nom}`);
    formData.append('file', event[0]);
    this.admissionService.uploadFile(formData, this.PROSPECT._id).subscribe(res => {
      this.ToastService.add({ severity: 'success', summary: 'Fichier upload avec succès', detail: this.docToUpload.nom + ' a été envoyé' });
      this.PROSPECT.documents_dossier.splice(this.PROSPECT.documents_dossier.indexOf(this.docToUpload), 1, { date: new Date(), nom: this.docToUpload.nom, path: event[0].name, _id: this.docToUpload._id })
      this.admissionService.updateV2({ documents_dossier: this.PROSPECT.documents_dossier, _id: this.PROSPECT._id }, "Affectation du dossier Lead-Dossier").subscribe(a => {
        console.log(a)
      })
    },
      (error) => {
        this.ToastService.add({ severity: 'error', summary: this.docToUpload.nom, detail: 'Erreur de chargement' + 'Réessayez SVP' });
        console.error(error)
      });
  }

  delete(doc: { date: Date, nom: string, path: string, _id: string }) {
    this.PROSPECT.documents_dossier[this.PROSPECT.documents_dossier.indexOf(doc)].path = null
    this.admissionService.deleteFile(this.PROSPECT._id, `${doc.nom}/${doc.path}`).subscribe(p => {
      this.admissionService.updateV2({ documents_dossier: this.PROSPECT.documents_dossier, _id: this.PROSPECT._id }, "Suppresion d'un document du dossier Lead-Dossier").subscribe(a => {
        console.log(a)
      })
    })

  }

  addDoc() {
    this.PROSPECT.documents_autre.push({ date: new Date(), nom: 'Cliquer pour modifier le nom du document ici', path: '', _id: new mongoose.Types.ObjectId().toString() })
  }

  uploadOtherFile(event: File[]) {
    let formData = new FormData()
    formData.append('id', this.PROSPECT._id);
    formData.append('document', `${this.docToUpload._id}`);
    formData.append('file', event[0]);
    this.admissionService.uploadFile(formData, this.PROSPECT._id).subscribe(res => {
      this.ToastService.add({ severity: 'success', summary: 'Fichier upload avec succès', detail: this.docToUpload.nom + ' a été envoyé' });
      this.PROSPECT.documents_autre.splice(this.PROSPECT.documents_autre.indexOf(this.docToUpload), 1, { date: new Date(), nom: this.docToUpload.nom, path: event[0].name, _id: this.docToUpload._id })

      this.admissionService.updateV2({ documents_autre: this.PROSPECT.documents_autre, _id: this.PROSPECT._id }, "Ajout d'un document du dossier Lead-Dossier").subscribe(a => {
        console.log(a)
      })
    },
      (error) => {
        this.ToastService.add({ severity: 'error', summary: this.docToUpload.nom, detail: 'Erreur de chargement' + 'Réessayez SVP' });
        console.error(error)
      });

  }
  deleteOther(doc: { date: Date, nom: string, path: string, _id: string }) {
    this.PROSPECT.documents_autre.splice(this.PROSPECT.documents_autre.indexOf(doc), 1)
    this.admissionService.updateV2({ documents_autre: this.PROSPECT.documents_autre, _id: this.PROSPECT._id }, "Suppresion d'un document autre Lead-Dossier").subscribe(a => {
      console.log(a)
    })
    this.admissionService.deleteFile(this.PROSPECT._id, `${doc._id}/${doc.path}`).subscribe(p => {
      console.log(p)

    })
  }

  downloadOtherFile(doc: { date: Date, nom: string, path: string, _id: string }) {
    this.admissionService.downloadFile(this.PROSPECT._id, `${doc._id}/${doc.path}`).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });

      importedSaveAs(new Blob([byteArray], { type: data.documentType }), doc.path)
    }, (error) => {
      console.error(error)
    })
  }
  scrollToTop() {
    var scrollDuration = 250;
    var scrollStep = -window.scrollY / (scrollDuration / 15);

    var scrollInterval = setInterval(function () {
      if (window.scrollY > 120) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }
  goToCandidature(id) {
    this.router.navigate(['admission/lead-candidature/', id])
  }
  initalPayement = []
  showPaiement: Prospect = null
  lengthPaiement = 0
  partenaireOwned: string = null
  initPaiement(prospect) {
    this.showPaiement = prospect
    this.payementList = prospect?.payement
    if (!this.payementList) { this.payementList = [] }
    if (prospect.code_commercial)
      this.commercialService.getByCode(prospect.code_commercial).subscribe(commercial => {
        if (commercial && commercial.partenaire_id)
          this.partenaireOwned = commercial.partenaire_id
      })
    this.lengthPaiement = prospect?.payement?.length
    this.initalPayement = prospect?.payement
  }
  savePaiement() {
    let statut_payement = "Oui" //TODO Vérifier length de prospect.payement par rapport à payementList
    let phase_candidature = "En phase d'orientation consulaire"
    if (this.payementList.length == 0) {
      statut_payement = this.showPaiement.statut_payement;
      phase_candidature = this.showPaiement.phase_candidature;
    }
    let listIDS = []
    this.initalPayement.forEach(payement => {
      listIDS.push(payement.ID)
    })
    if (this.initalPayement.toString() != this.payementList.toString()) {
      this.payementList.forEach((val, idx) => {
        if (val.ID && listIDS.includes(val.ID) == false) {
          let data: any = { prospect_id: this.showPaiement._id, montant: val.montant, date_reglement: new Date(val.date), modalite_paiement: val.type, partenaire_id: this.partenaireOwned, paiement_prospect_id: val.ID }
          this.VenteService.create({ ...data }).subscribe(v => {
            this.ToastService.add({ severity: "success", summary: "Une nouvelle vente a été créé avec succès" })
          })
        }

      })
    }

    this.admissionService.updateV2({ _id: this.showPaiement._id, payement: this.payementList, statut_payement, phase_candidature }, "Modification des paiements Admission").subscribe(data => {
      this.ToastService.add({ severity: "success", summary: "Enregistrement des modifications avec succès" })
      //this.prospects[this.showPaiement.type_form].splice(this.prospects[this.showPaiement.type_form].indexOf(this.showPaiement), 1, data)
      this.showPaiement = null
    })
  }
  payementList = []
  typePaiement = [
    { value: null, label: "Aucun Suite a un renouvelement" },
    { value: "Chèque Montpellier", label: "Chèque Montpellier" },
    { value: "Chèque Paris", label: "Chèque Paris" },
    { value: "Chèque Tunis", label: "Chèque Tunis" },
    { value: "Compensation", label: "Compensation" },
    { value: "Espèce chèque Autre", label: "Espèce chèque Autre" },
    { value: "Espèce chèque Montpellier", label: "Espèce chèque Montpellier" },
    { value: "Espèce chèque Paris", label: "Espèce chèque Paris" },
    { value: "Espèce Congo", label: "Espèce Congo" },
    { value: "Espèce Maroc", label: "Espèce Maroc" },
    { value: "Espèce Montpellier", label: "Espèce Montpellier" },
    { value: "Espèce Paris", label: "Espèce Paris" },
    { value: "Espèce Tunis", label: "Espèce Tunis" },
    { value: "Lien de paiement", label: "Lien de paiement" },
    { value: "PayPal", label: "PayPal" },
    { value: "Virement", label: "Virement" },
    { value: "Virement chèque Autre", label: "Virement chèque Autre" },
    { value: "Virement chèque Montpellier", label: "Virement chèque Montpellier" },
    { value: "Virement chèque Paris", label: "Virement chèque Paris" },
  ]
  onAddPayement() {
    if (this.payementList == null) {
      this.payementList = []
    }
    this.payementList.push({ type: "", montant: 0, date: "", ID: this.generateIDPaiement(), doc: null, motif: "", etat: "" })
  }
  changeMontant(i, event, type) {

    if (type == "date") {
      this.payementList[i][type] = event.target.value;
    } else if (type == "montant") {
      this.payementList[i][type] = parseInt(event.target.value);
    } else {
      this.payementList[i][type] = event.value;
    }
  }

  generateIDPaiement() {
    let date = new Date()
    return (this.payementList.length + 1).toString() + date.getDate().toString() + date.getMonth().toString() + date.getFullYear().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString()
  }

  deletePayement(i) {
    //let temp = (this.payementList[i]) ? this.payementList[i] + " " : ""
    if (confirm("Voulez-vous supprimer le paiement ?")) {
      this.payementList.splice(i, 1)
      if (this.payementList[i].ID)
        this.VenteService.deleteByPaymentID(this.payementList[i].ID).subscribe(data => {
          if (data)
            this.ToastService.add({ severity: 'success', summary: 'La vente associé a été supprimé' })
        })
    }
  }
  typeMotif = [
    { label: 'Préinscription', value: 'Préinscription' },
    { label: 'Avance scolarité', value: 'Avance scolarité' },
    { label: 'Scolarité', value: 'Scolarité' },
    { label: 'Autre', value: 'Autre' },
  ]
  typeEtat = [
    { label: 'Programmé', value: 'Programmé' },
    { label: 'Encassé', value: 'Encassé' },
    { label: 'Délai dépassé', value: 'Délai dépassé' },
    { label: 'Impayé', value: 'Impayé' },
  ]

  downloadFilePayment(paiement, idx) {
    this.admissionService.downloadFilePaiement(this.showPaiement._id, paiement.doc).subscribe(data => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });

      importedSaveAs(new Blob([byteArray], { type: data.documentType }), paiement.doc)
    })
  }
  selectedPaiment
  uploadFilePayement(paiement, idx) {
    document.getElementById('UploadPaiement').click();
    this.selectedPaiment = { paiement, idx }
  }

  FileUploadPaiement(event: File[]) {
    let formData = new FormData()
    formData.append('id', this.showPaiement._id);
    formData.append('file', event[0]);
    this.admissionService.uploadFilePaiement(formData, this.showPaiement._id).subscribe(res => {
      this.ToastService.add({ severity: 'success', summary: 'Fichier upload avec succès', detail: event[0].name + ' a été envoyé' });
      //TODO Update PayementList dans DB
      this.showPaiement.payement[this.selectedPaiment.idx].doc = event[0].name
      this.payementList[this.selectedPaiment.idx].doc = event[0].name
    },
      (error) => {
        this.ToastService.add({ severity: 'error', summary: event[0].name, detail: 'Erreur de chargement' + 'Réessayez SVP' });
        console.error(error)
      });
  }
}
