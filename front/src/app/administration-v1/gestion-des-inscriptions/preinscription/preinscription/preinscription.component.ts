import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdmissionService } from 'src/app/services/admission.service';
import { User } from 'src/app/models/User';
import { MessageService } from 'primeng/api';
import { saveAs as importedSaveAs } from "file-saver";
import { environment } from 'src/environments/environment';
import { Prospect } from 'src/app/models/Prospect';
import jwt_decode from "jwt-decode";
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PartenaireService } from 'src/app/services/partenaire.service';
import { Collaborateur } from 'src/app/models/Collaborateur';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { RhService } from 'src/app/services/rh.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import mongoose from 'mongoose';
import { Ticket } from 'src/app/models/Ticket';
import { TicketService } from 'src/app/services/ticket.service';
@Component({
  selector: 'app-preinscription',
  templateUrl: './preinscription.component.html',
  styleUrls: ['./preinscription.component.scss']
})
export class PreinscriptionComponent implements OnInit {
  prospects:Prospect[]=[];
  prospectI:Prospect[]= [];
  PROSPECT:Prospect;
  ticket:any[]=[];
  tickets:Ticket[] = [];
  selectedTabIndex: number = 0;
  selectedTabIndex1: number = 0;
  shownewLeadForm: boolean = false;
  shownewLeadFormI: boolean = false;
  shownewRIForm:boolean = false;
  itslead: boolean = false;
  visible: boolean = false;
  showDocuments:boolean = false;
  showDossier: boolean = false;
  showDoccuments: boolean = false;
  nationList = environment.nationalites;
  paysList = environment.pays;
  civiliteList = environment.civilite;
  programeFrDropdown = [

  ]

  programEnDropdown = [

  ]
  rentreeList = [

  ]
  etat_dossierDropdown = [
    {value:"En attente",label:"En attente"},
    {value:"Manquant",label:"Manquant"},
    {value:"Complet",label:"Complet"}
  ]
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

  typeList=[
    {label:"Local",value:"Local"},
    {label:"International",value:"International"}
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
    {label:"Spontané",value:"Spontané"} //Par défaut si Lead
  ]

  commercialList = []

  EcoleListRework = []
  newLeadForm: FormGroup = new FormGroup({
    type:new FormControl('',Validators.required),
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
    rue:new FormControl(''),
    ville:new FormControl(''),
    codep:new FormControl(''),
  })
  formAffectation = new FormGroup({
    _id: new FormControl('', Validators.required),
    agent_id: new FormControl('', Validators.required),
    date_limite: new FormControl(''),
    note_assignation: new FormControl(''),
  })
  RIForm: FormGroup = new FormGroup({
    etudiant:new FormControl('',Validators.required),
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
    rue:new FormControl(''),
    ville:new FormControl(''),
    codep:new FormControl(''),
  })

  RegisterForm2: FormGroup = new FormGroup({
    ecole: new FormControl('', [Validators.required]),
    commercial: new FormControl('',),
    source: new FormControl('', Validators.required)
  })
  constructor(private commercialService: CommercialPartenaireService, private admissionService: AdmissionService,private etudiantService: EtudiantService,private ticketService: TicketService,
    private router: Router, private FAService: FormulaireAdmissionService, private PService: PartenaireService, private ToastService: MessageService, private rhService: RhService) { }

  ngOnInit(): void {
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
      this.admissionService.getAll().subscribe((results=>{
        results.forEach((result) => {
          if(result.traited_by=="Local"){
        this.prospects.push(result);}else{this.prospectI.push(result);}
        console.log(this.prospects);

      })}))
      this.ticketService.getAll().subscribe(data => {
        this.tickets=data;
      });
      
    }

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
        this.newLeadForm.value.civilite.value,
        null, null, 'Prospect', null,
        this.newLeadForm.value.pays.value,
        null, null, null, null,
        this.newLeadForm.value.nationalite.value,
        null,
        new Date(),
        null, null,
        this.newLeadForm.value.campus?.value

      ), 'newProspect': new Prospect(
        null, null,
        this.newLeadForm.value.date_naissance,
        null, null, null, null, null, null,
        this.newLeadForm.value.campus?.value,
        null, null,
        this.newLeadForm.value.programme.value,
        this.newLeadForm.value.formation,
        this.newLeadForm.value.rythme_formation.value,
        null, null, null, null, true, new Date(),
        this.newLeadForm.value.ecole,
        this.newLeadForm.value.commercial,
        null, null, null, null, null, null, null, null,
        null,
        customid,this.newLeadForm.value.type,
        this.newLeadForm.value.rue,
        this.newLeadForm.value.ville,
        this.newLeadForm.value.codep
      )
    }).subscribe(
      ((response) => {
        this.newLeadForm.reset()
        this.ToastService.add({ severity: 'success', summary: 'Création du prospect avec succès', detail: "L'inscription a été finalisé" });
      })
    );
    

  }
  
  changeSource(source: string) {
    this.commercialList=[]
    console.log(source)
    if (source == "Partenaire") {
      this.itslead=false
      this.PService.getAll().subscribe(commercials => {
        this.commercialList = []
        commercials.forEach(commercial => {
          this.commercialList.push({ label: `${commercial.nom}`, value: commercial.code_partenaire })
        })
      })
    } else if (source == "Equipe commerciale"){
      this.itslead=false
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
      })}else if(source=="Etudiant interne"){
        this.etudiantService.getAllEtudiantPopulate().subscribe(etudiants=>{
          this.commercialList=[];
          etudiants.forEach(etudiant => {
            this.commercialList.push({label: `${etudiant?.user_id}`,value: etudiant.user_id} )

        })
      })
    }else if(source=="Lead"){
      this.itslead=true
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
  onshowDossier(student:Prospect){
    this.ticket=[];
    this.showDossier=true;
    this.admissionService.getPopulate(student._id).subscribe(data => {
      this.PROSPECT = data
    
  })
  console.log(student.user_id);
    this.ticketService.getByIdEtudiant(student.user_id._id).subscribe(tick=>{
      console.log(student._id);
      console.log(tick);
      this.ticket.push(tick.dataTicket   )   ;
      
    })
}
onshowDocuments(){
  if(this.showDocuments == true){
    this.showDocuments=false
  }else{
    this.showDocuments=true
  }
}
showDialog() {
  this.visible = true;
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

}
