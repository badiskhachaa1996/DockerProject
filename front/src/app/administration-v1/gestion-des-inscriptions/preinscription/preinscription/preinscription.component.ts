import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MailType } from 'src/app/models/MailType';
import { HistoriqueEmail } from 'src/app/models/HistoriqueEmail';
import { EmailTypeService } from 'src/app/services/email-type.service';
import { FileUpload } from 'primeng/fileupload';
import { TeamsIntService } from 'src/app/services/teams-int.service';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-preinscription',
  templateUrl: './preinscription.component.html',
  styleUrls: ['./preinscription.component.scss']
})
export class PreinscriptionComponent implements OnInit {
  @ViewChild('dt1') dt1: Table | undefined;
  prospects: Prospect[] = [];
  prospectI: Prospect[] = [];
  PROSPECT: Prospect;
  proscteList: Prospect[] = [];
  prospect_acctuelle: Prospect;
  displayFilter:boolean = false;
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
  showDocumentB: boolean = false;
  service_id: any;
  sujet_id: any;
  visible: boolean = false;
  visible_evaluation: boolean = false;
  showDocuments: boolean = false;
  showDossier: boolean = false;
  showDoccuments: boolean = false;
  visibleC:boolean = false;
  nationList = environment.nationalites;
  paysList = environment.pays;
  TicketnewPro: Ticket;
  civiliteList = environment.civilite;
  formationsFitre=[
    {label:"Toutes les Formations ",value:null }
  ];
  tabStates: { [tabId: string]: boolean } = {};
  programeFrDropdown = [

  ]

  programEnDropdown = [

  ]
  rentreeList = [];
  rentreeFiltere=[{label:"Toutes les rentrées ",value:null,_id:null}];
  EtapeFiltere = [
    {label:"Toutes les étapes",value:null},
    {label:"Etape 1",value:"Etape 1"},
    {label:"Etape 2",value:"Etape 2"},
    {label:"Etape 3",value:"Etape 3"},
    {label:"Etape 4",value:"Etape 4"},

  ];
  visiblecon:boolean = false;
  etat_dossierDropdown = [
    { value: "En attente", label: "En attente" },
    { value: "Manquant", label: "Manquant" },
    { value: "Complet", label: "Complet" }
  ];
  rythme_filtre=[
    {label:"Tous les rythmes", value:null},
    { label: "Initiale", value: 'Initiale' },
    { label: "Alternance", value:'Alternance' }
  ];
  campusfiltre =
  [
    { value: null, label: "Tous les campus" },
    { value: "Paris", label: "Paris - France" },
    { value: "Montpellier", label: "Montpellier - France" },
    { value: "Brazzaville", label: "Brazzaville - Congo" },
    { value: "Rabat", label: "Rabat - Maroc" },
    { value: "La Valette", label: "La Valette - Malte" },
    { value: "UAE", label: "UAE - Dubai" },
    { value: "En ligne", label: "En ligne" },
  ];
  sourceFiltre = [
    { label: "Toutes sources", value: null },
    { label: "Partenaire", value: "Partenaire" },
    { label: "Equipe commerciale", value: "Equipe commerciale" },
    { label: "Etudiant interne", value: "Etudiant interne" },// Par défaut si Etudiant ou Alternant
    { label: "Lead", value: "Lead" },
    { label: "Spontané", value: "Spontané" } //Par défaut si Lead
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
  EcoleFiltre = [{
    label: "Toutes les écoles", value:null
  }]
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
    private SujetService: SujetService, private ServiceService: ServService, private CandidatureService: CandidatureLeadService,
    private EmailTypeS: EmailTypeService, private TeamsIntService: TeamsIntService) { }

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
        this.TeamsIntService.MIgetAll().subscribe(data => {
          let dic = {}
          let listTeam = []
          data.forEach(element => {
            if (!dic[element.team_id.nom]) {
              dic[element.team_id.nom] = [element]
              listTeam.push(element.team_id.nom)
            }
            else
              dic[element.team_id.nom].push(element)
          })
          listTeam.forEach(team => {
            let items = []
            dic[team].forEach(element => {
              items.push({ label: `${element.user_id.lastname} ${element.user_id.firstname}`, value: element._id })
            })
            this.agentSourcingList.push({
              label: team,
              items
            })
          })
        })
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
      this.UserService.getPopulate(this.token.id).subscribe((user: User) => {
        console.log(user.savedAdministration)
        this.proscteList = user.savedAdministration
      })
    }
    //RECUPERATION ECOLES
    this.FAService.EAgetAll().subscribe(data => {
      data.forEach(e => {
        this.EcoleFiltre.push({ label: e.titre, value: e.url_form })
        this.FAService.RAgetByEcoleID(e._id).subscribe(dataEcoles => {
          dataEcoles.forEach(rentre => {
            this.rentreeFiltere.push({ label: rentre.nom, value: rentre.nom, _id: rentre._id })
          })})})});
    //RECUPERATION DES FORMATIONS
    this.FAService.FAgetAll().subscribe(form=>{
      form.forEach(f=>{
        this.formationsFitre.push({ label:f.nom,value:f.nom})
      })
    })

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
        this.newLeadForm?.value.codep,
        
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
    let ids = []
    this.proscteList.forEach((p, idx) => {
      ids.push(p._id)
      if (p._id == student._id)
        this.selectedTabIndex = 3 + idx;
    })
    if (!ids.includes(student._id))
      this.proscteList.push(student);

    this.UserService.update({ _id: this.token.id, savedAdministration: this.proscteList }).subscribe(r => {

    })
    this.prospect_acctuelle = student;
    this.showDossier = true;

    this.admissionService.getPopulate(student._id).subscribe(data => {
      this.PROSPECT = data

    })
    console.log(student.user_id);
    this.ticketService.getAllMine(student.user_id._id).subscribe(tick => {
      this.ticket.push(tick[0]);
      //console.log(tick[0].agent_id?.firstname)

    })

    setTimeout(() => {
      console.log(2 + this.proscteList.length)
      this.selectedTabIndex = 2 + this.proscteList.length; // Définir l'indice après un délai
    }, 100); // Réglez le délai en millisecondes selon vos besoins
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
  onTabClose(e) {
    this.proscteList.splice(e.index - 3, 1)
    this.selectedTabIndex = 0;
    this.UserService.update({ _id: this.token.id, savedAdministration: this.proscteList }).subscribe(r => {

    })
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
  partenaireOwned: string = null
  initPaiement(prospect: Prospect) {
    this.showPaiement = prospect
    this.payementList = prospect?.payement
    this.payementProgramList = prospect?.payement_programme
    if (!this.payementList) { this.payementList = [] }
    if (!this.payementProgramList) { this.payementProgramList = [] }
    console.log(this.payementProgramList)
    this.payementProgramList.forEach(pay => {
      if (pay && pay.etat == 'Programmé')
        if (new Date().getTime() > new Date(pay.date).getTime())
          pay.etat = "Délai dépassé"
    })
    console.log(this.payementProgramList)
    if (prospect.code_commercial)
      this.commercialService.getByCode(prospect.code_commercial).subscribe(commercial => {
        if (commercial && commercial.partenaire_id)
          this.partenaireOwned = commercial.partenaire_id
      })
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
    console.log(this.payementProgramList)
    this.admissionService.updateV2({ _id: this.showPaiement._id, payement: this.payementList, statut_payement, phase_candidature, payement_programme: this.payementProgramList }, "Modification des paiements Admission").subscribe(data => {
      this.ToastService.add({ severity: "success", summary: "Enregistrement des modifications avec succès" })
      this.showPaiement = data
      //this.prospects[this.showPaiement.type_form].splice(this.prospects[this.showPaiement.type_form].indexOf(this.showPaiement), 1, data)
      this.showPaiement = null
    })
  }
  payementList = []
  payementProgramList = []
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
  generateIDPaiement() {
    let date = new Date()
    return (this.payementList.length + this.payementProgramList.length + 1).toString() + date.getDate().toString() + date.getMonth().toString() + date.getFullYear().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString()
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

  onAddPayementProgram() {
    if (this.payementProgramList == null) {
      this.payementProgramList = []
    }
    this.payementProgramList.push({ type: "", montant: 0, date: "", ID: this.generateIDPaiement(), doc: null, motif: "", etat: "Programmé" })
  }
  changeMontantProgram(i, event, type) {

    if (type == "date") {
      this.payementProgramList[i][type] = event.target.value;
    } else if (type == "montant") {
      this.payementProgramList[i][type] = parseInt(event.target.value);
    } else {
      this.payementProgramList[i][type] = event.value;
    }
  }
  deletePayementProgram(i) {
    //let temp = (this.payementList[i]) ? this.payementList[i] + " " : ""
    if (confirm("Voulez-vous supprimer le paiement programmé ?")) {
      this.payementProgramList.splice(i, 1)
    }
  }
  uploadFilePayementProgram(paiement, idx) {
    document.getElementById('UploadPaiementProgram').click();
    this.selectedPaiment = { paiement, idx }
  }
  FileUploadPaiementProgram(event: File[]) {
    let formData = new FormData()
    formData.append('id', this.showPaiement._id);
    formData.append('file', event[0]);
    this.admissionService.uploadFilePaiement(formData, this.showPaiement._id).subscribe(res => {
      this.ToastService.add({ severity: 'success', summary: 'Fichier upload avec succès', detail: event[0].name + ' a été envoyé' });
      //TODO Update PayementList dans DB

      this.payementProgramList[this.selectedPaiment.idx].doc = event[0].name
      if (this.showPaiement.payement_programme && this.showPaiement.payement_programme[this.selectedPaiment.idx])
        this.showPaiement.payement_programme[this.selectedPaiment.idx].doc = event[0].name
      else
        if (this.showPaiement.payement_programme)
          this.showPaiement.payement_programme[this.selectedPaiment.idx] = this.payementProgramList[this.selectedPaiment.idx]
        else
          this.showPaiement.payement_programme = [this.payementProgramList[this.selectedPaiment.idx]]
    },
      (error) => {
        this.ToastService.add({ severity: 'error', summary: event[0].name, detail: 'Erreur de chargement\n' + 'Réessayez SVP' });
        console.error(error)
      });
  }
  showEmail = false
  prospectSendTo: Prospect = null
  emailTypeSelected: string = null
  mailDropdown = []
  mailTypeDropdown = []
  formEmailPerso = new FormGroup({
    objet: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required),
    cc: new FormControl([]),
    send_from: new FormControl('', Validators.required)
  })
  formEmailType = new FormGroup({
    objet: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required),
    cc: new FormControl([]),
    send_from: new FormControl('', Validators.required)
  })
  onEmailPerso() {
    console.log(this.formEmailPerso.value)
    this.EmailTypeS.sendPerso({ ...this.formEmailPerso.value, send_by: this.token.id, send_to: this.prospectSendTo.user_id.email_perso, send_from: this.formEmailPerso.value.send_from._id, pieces_jointes: this.piece_jointes, mailTypeSelected: this.mailTypeSelected }).subscribe(data => {
      this.ToastService.add({ severity: "success", summary: 'Envoie du mail avec succès' })
      this.EmailTypeS.HEcreate({ ...this.formEmailPerso.value, send_by: this.token.id, send_to: this.prospectSendTo._id, send_from: this.formEmailPerso.value.send_from.email }).subscribe(data2 => {
        this.formEmailPerso.reset()
        this.historiqueEmails.push(data2)
        this.ToastService.add({ severity: "success", summary: 'Enregistrement de l\'envoie du mail avec succès' })
      })
    })

  }
  onEmailType() {
    this.EmailTypeS.sendPerso({ ...this.formEmailType.value, send_by: this.token.id, send_to: this.prospectSendTo.user_id.email_perso, send_from: this.formEmailType.value.send_from._id, pieces_jointes: this.piece_jointes, mailTypeSelected: this.mailTypeSelected }).subscribe(data => {
      this.ToastService.add({ severity: "success", summary: 'Envoie du mail avec succès' })
      this.EmailTypeS.HEcreate({ ...this.formEmailType.value, send_by: this.token.id, send_to: this.prospectSendTo._id, send_from: this.formEmailType.value.send_from.email }).subscribe(data2 => {
        this.formEmailType.reset()
        this.historiqueEmails.push(data2)
        this.ToastService.add({ severity: "success", summary: 'Enregistrement de l\'envoie du mail avec succès' })
      })
    })

  }
  initSendEmail(prospect: Prospect) {
    this.showEmail = true
    this.prospectSendTo = prospect
    this.EmailTypeS.HEgetAllTo(this.prospectSendTo._id).subscribe(data => {
      this.historiqueEmails = data
    })
    this.EmailTypeS.getAll().subscribe(data => {
      data.forEach(val => {
        this.mailDropdown.push({ label: val.email, value: val })
      })
    })
    this.EmailTypeS.MTgetAll().subscribe(data => {
      data.forEach(e => {
        this.mailTypeDropdown.push({ label: e.objet, value: e })
      })
    })
  }

  onMailType(event: MailType) {
    this.formEmailType.patchValue({
      ...event
    })
    this.piece_jointes = event.pieces_jointe
    this.mailTypeSelected = event
  }
  mailTypeSelected: MailType
  historiqueEmails: HistoriqueEmail[] = []
  piece_jointes = []

  //Gestion des PJs
  onDeletePJ(ri) {
    delete this.piece_jointes[ri]
  }

  uploadFilePJ: {
    date: Date,
    nom: string,
    path: string,
    _id: string
  } = null

  onAddPj() {
    this.piece_jointes.push({ date: new Date(), nom: "Téléverser le fichier s'il vous plaît", path: '', _id: new mongoose.Types.ObjectId().toString() })
  }
  downloadPJFile(pj) {
    this.EmailTypeS.downloadPJ(this.mailTypeSelected?._id, pj._id, pj.path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });
      importedSaveAs(blob, pj.path)
    }, (error) => {
      console.error(error)
    })
  }

  onUploadPJ(uploadFilePJ) {
    if (uploadFilePJ?.nom && uploadFilePJ.nom != 'Cliquer pour modifier le nom du document ici') {
      document.getElementById('selectedFilePJ').click();
      this.uploadFilePJ = uploadFilePJ
    } else {
      this.ToastService.add({ severity: 'error', summary: 'Vous devez d\'abord donner un nom au fichier avant de l\'upload' });
    }

  }
  @ViewChild('fileInput') fileInput: FileUpload;
  FileUploadPJ(event: [File]) {
    console.log(event)
    if (event != null) {
      this.ToastService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();
      formData.append('nom', this.uploadFilePJ.nom)
      formData.append('pj_id', this.uploadFilePJ._id)
      formData.append('path', event[0].name)
      formData.append('_id', this.mailTypeSelected?._id)
      formData.append('file', event[0])
      this.EmailTypeS.uploadPJ(formData).subscribe(res => {
        this.ToastService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
        this.piece_jointes[this.piece_jointes.indexOf(this.uploadFilePJ)].path = event[0].name
        this.uploadFilePJ = null;
        this.fileInput.clear()
      }, error => {
        this.ToastService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }
  }

  initDocument(prospect) {
    this.PROSPECT=prospect;
    this.showDocAdmin = prospect
    this.scrollToTop()
  }
  convertTime(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  uploadAdminFileForm: FormGroup = new FormGroup({
    //typeDoc: new FormControl(this.DocTypes[0], Validators.required),
    date: new FormControl(this.convertTime(new Date), Validators.required),
    nom: new FormControl("", Validators.required),
    note: new FormControl(""),
    traited_by: new FormControl("", Validators.required),
    type: new FormControl(""),
  })
  showUploadFile = null
  showDocAdmin: Prospect = null
  agentSourcingList = [{ label: "Aucun", items: [{ label: "Aucun", value: null }] }]
  FileUploadAdmin(event: { files: [File], target: EventTarget }) {

    if (this.uploadAdminFileForm.valid && event.files != null) {
      this.ToastService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
      const formData = new FormData();

      formData.append('id', this.showUploadFile._id)
      formData.append('date', this.uploadAdminFileForm.value.date)
      formData.append('note', this.uploadAdminFileForm.value.note)
      formData.append('nom', this.uploadAdminFileForm.value.nom)
      formData.append('type', this.uploadAdminFileForm.value.type)
      formData.append('custom_id', this.generateCustomID(this.uploadAdminFileForm.value.nom))
      formData.append('traited_by', this.uploadAdminFileForm.value.traited_by)
      formData.append('path', event.files[0].name)
      formData.append('file', event.files[0])
      this.admissionService.uploadAdminFile(formData, this.showUploadFile._id).subscribe(res => {
        this.Socket.NewNotifV2(this.showUploadFile.user_id._id, `Un document est disponibe dans votre espace pour le téléchargement `)

        this.NotifService.create(new Notification(null, null, false,
          `Un document est disponibe dans votre espace pour le téléchargement `,
          new Date(), this.showUploadFile.user_id._id, null)).subscribe(test => { })
        if (this.showUploadFile.code_commercial)
          this.commercialService.getByCode(this.showUploadFile.code_commercial).subscribe(commercial => {
            if (commercial) {
              this.Socket.NewNotifV2(commercial.user_id._id, `Un document est disponible pour l'étudiant ${this.showDocAdmin?.user_id?.firstname} ${this.showDocAdmin?.user_id?.lastname}`)

              this.NotifService.create(new Notification(null, null, false,
                `Un document est disponible pour l'étudiant ${this.showDocAdmin?.user_id?.firstname} ${this.showDocAdmin?.user_id?.lastname}`,
                new Date(), commercial.user_id._id, null)).subscribe(test => { })

              this.EmailTypeS.defaultEmail({
                email: commercial.user_id?.email,
                objet: '[IMS] Admission - Document inscription disponible  d\'un de vos leads ',
                mail: `

                Cher partenaire,

                Nous avons le plaisir de vous informer qu'un document important est désormais disponible pour l'étudiant ${this.showDocAdmin?.user_id?.firstname} ${this.showDocAdmin?.user_id?.lastname}. Ce document est accessible via notre plateforme en ligne ou peut être récupéré auprès de notre équipe administrative. Nous tenons à vous remercier pour votre collaboration continue dans le suivi et le soutien des étudiants. Votre engagement est essentiel pour assurer leur réussite et leur satisfaction.
                
                N'hésitez pas à nous contacter si vous avez des questions supplémentaires ou besoin de plus amples informations.
                
                Cordialement,
              `
              }).subscribe(() => { })
            }
          })
        this.ToastService.add({ severity: 'success', summary: 'Envoi de Fichier', detail: 'Le fichier a bien été envoyé' });
        if (res.documents_administrative)
          this.showDocAdmin.documents_administrative = res.documents_administrative
        event.target = null;
        this.showUploadFile = null;

        this.fileInput.clear()
      }, error => {
        this.ToastService.add({ severity: 'error', summary: 'Envoi de Fichier', detail: 'Une erreur est arrivé' });
      });
    }
  }

  generateCustomID(nom) {
    let reeldate = new Date();

    let date = (reeldate.getDate()).toString() + (reeldate.getMonth() + 1).toString() + (reeldate.getFullYear()).toString();

    let random = Math.random().toString(36).substring(5).toUpperCase();

    nom = nom.substr(0, 2).toUpperCase();

    return 'DOC' + nom + date + random;
  }
  documentDropdown = [
    { label: "Inscription", value: "inscription" },
    { label: "Préinscription", value: "preinscription" },
    { label: "Paiement", value: "paiement" },
    { label: "Paiement préinscription", value: "paiement-preinscription" },
    { label: "Paiement préinscription - acompte", value: "paiement-preinscription-acompte" },
    { label: "Paiement acompte", value: "paiement-acompte" },
    { label: "Dérogation", value: "derogation" },
    { label: "Lettre d'acceptation", value: "lettre-acceptation" },
    { label: "Attestation de scolarité", value: "attestation-scolarite" },
    { label: "Attestation d'assiduité", value: "attestation-assiduite" },
    { label: "Contrat d'engagement", value: "contrat-engagement" },
    { label: "Candidature", value: "candidature" },
  ]
  downloadAdminFile(path) {
    this.admissionService.downloadFileAdmin(this.showDocAdmin._id, path).subscribe((data) => {
      const byteArray = new Uint8Array(atob(data.file).split('').map(char => char.charCodeAt(0)));
      var blob = new Blob([byteArray], { type: data.documentType });

      importedSaveAs(blob, path)
    }, (error) => {
      console.error(error)
    })

  }
  clearFilter(){};
  onTeamsCheckboxChange(event: any) {
    console.log('Checkbox changed', event);
  if (event.checked) {
    console.log(event.checked)
    // Checkbox est coché, appliquer le filtre
    this.dt1?.filter('NON', 'teams', 'equals');
    
  } 
  if(event.checked.length <1) {
    console.log("notchecked")
    // Checkbox est décoché, réinitialiser le filtre
    this.dt1?.filter('', 'teams', 'equals');
  }
}
onYpareoCheckboxChange(event: any) {
  console.log('Checkbox changed', event);
if (event.checked) {
  console.log(event.checked)
  // Checkbox est coché, appliquer le filtre
  this.dt1?.filter('NON', 'Ypareo', 'equals');
  
} 
if(event.checked.length <1) {
  console.log("notchecked")
  // Checkbox est décoché, réinitialiser le filtre
  this.dt1?.filter('', 'Ypareo', 'equals');
}
}
onGroupeCheckboxChange(event: any) {
  console.log('Checkbox changed', event);
if (event.checked) {
  console.log(event.checked)
  // Checkbox est coché, appliquer le filtre
  this.dt1?.filter('NON', 'groupe', 'equals');
  
} 
if(event.checked.length <1) {
  console.log("notchecked")
  // Checkbox est décoché, réinitialiser le filtre
  this.dt1?.filter('', 'groupe', 'equals');
}
}
}
