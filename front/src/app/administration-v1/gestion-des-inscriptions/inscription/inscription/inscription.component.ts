import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Prospect } from 'src/app/models/Prospect';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { AdmissionService } from 'src/app/services/admission.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit {
  @ViewChild('dt1') dt1: Table | undefined;
  prospects: Prospect[] = [];
  prospectI: Prospect[] = [];
  prospect_acctuelle: Prospect;
  visible: boolean = false;
  showupdateLeadForm: boolean = false;
  displayFilter: boolean = false;
  civiliteList = environment.civilite;
  paysList = environment.pays;
  nationList = environment.nationalites;
  Frythme: String; Fcampus: String; Frentree: String; Fecoles: String;
  Fformation: String; Fetape: String; Fsource: String; FYpareo: boolean; FTeams: boolean; Fgroupe: Boolean;
  EcoleListRework = [];
  campusDropdown = [];
  programeFrDropdown = [];
  programEnDropdown = [];
  rentreeList = [];
  groupe_dropdown = [
    { value: "BIG DATA 1", label: "BIG DATA 1" },
    { value: "BIG DATA 2", label: "BIG DATA 2" },
    { value: "BIG DATA 3", label: "BIG DATA 3" },
    { value: "BIG DATA 4", label: "BIG DATA 4" },
  ];
  programList =
    [
      { value: "Programme Français" },
      { value: "Programme Anglais" },
    ];
  rythme_filtre = [
    { label: "Tous les rythmes", value: null },
    { label: "Initiale", value: 'Initiale' },
    { label: "Alternance", value: 'Alternance' }
  ];
  typeFormationDropdown = [
    { value: "Initiale" },
    { value: "Alternance" }
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
    { label: "Site Web", value: "Site Web" },
    { label: "Spontané", value: "Spontané" } //Par défaut si Lead
  ];
  sourceList = [
    { label: "Partenaire", value: "Partenaire" },
    { label: "Equipe commerciale", value: "Equipe commerciale" },
    { label: "Etudiant interne", value: "Etudiant interne" },// Par défaut si Etudiant ou Alternant
    { label: "Lead", value: "Lead" },
    { label: "Site Web", value: "Site Web" },
    { label: "Spontané", value: "Spontané" } //Par défaut si Lead
  ]
  etapeFiltre = [
    { label: "all", value: null },
    { label: "", value: "Partenaire" },
    { label: "Equipe commerciale", value: "Equipe commerciale" },
    { label: "Etudiant interne", value: "Etudiant interne" },// Par défaut si Etudiant ou Alternant
    { label: "Lead", value: "Lead" },
    { label: "Spontané", value: "Spontané" } //Par défaut si Lead
  ];
  EcoleFiltre = [{
    label: "Toutes les écoles", value: null
  }]
  formationsFitre = [
    { label: "Toutes les Formations ", value: null }
  ];
  rentreeFiltere = [{ label: "Toutes les rentrées ", value: null, _id: null }];
  EtapeFiltere = [
    { label: "Toutes les étapes", value: null },
    { label: "Etape 1", value: "Etape 1" },
    { label: "Etape 2", value: "Etape 2" },
    { label: "Etape 3", value: "Etape 3" },
    { label: "Etape 4", value: "Etape 4" },

  ];
  filterValue: string | null = null;
  updateLeadForm: UntypedFormGroup = new UntypedFormGroup({
    civilite: new UntypedFormControl(environment.civilite[0], Validators.required),
    lastname: new UntypedFormControl('',),
    firstname: new UntypedFormControl('',),
    date_naissance: new UntypedFormControl('',),
    pays: new UntypedFormControl(this.paysList[76], Validators.required),
    nationalite: new UntypedFormControl('',),
    indicatif: new UntypedFormControl('',),
    phone: new UntypedFormControl('',),
    email_perso: new UntypedFormControl('',),
    rue: new UntypedFormControl('',),
    ville: new UntypedFormControl('',),
    codep: new UntypedFormControl('',),
    ecole: new UntypedFormControl('',),
    campus: new UntypedFormControl('',),
    rentree_scolaire: new UntypedFormControl('',),
    programme: new UntypedFormControl('',),
    formation: new UntypedFormControl('',),
    rythme_formation: new UntypedFormControl('',),
    source: new UntypedFormControl('',),
    commercial: new UntypedFormControl('',),
    nomlead: new UntypedFormControl('',),
  })
  compteForm: UntypedFormGroup = new UntypedFormGroup({
    teams: new UntypedFormControl('',),
    Ypareo: new UntypedFormControl('',),
    groupe: new UntypedFormControl('',),
  })

  constructor(private FAService: FormulaireAdmissionService, private admissionService: AdmissionService, private messageService: MessageService,) { }

  ngOnInit(): void {
    //RECUPERATION PROSPECT
    this.admissionService.getAll().subscribe((results => {
      results.forEach((result) => {
        if (result.traited_by == "Local") {
          this.prospects.push(result);
        } else { this.prospectI.push(result); }
        console.log(this.prospects);

      })
    }))
    //RECUPERATION ECOLES
    this.FAService.EAgetAll().subscribe(data => {
      data.forEach(e => {
        this.EcoleFiltre.push({ label: e.titre, value: e.url_form })
        this.FAService.RAgetByEcoleID(e._id).subscribe(dataEcoles => {
          dataEcoles.forEach(rentre => {
            this.rentreeFiltere.push({ label: rentre.nom, value: rentre.nom, _id: rentre._id })
          })
        })
      })
    });
    //RECUPERATION DES FORMATIONS
    this.FAService.FAgetAll().subscribe(form => {
      form.forEach(f => {
        this.formationsFitre.push({ label: f.nom, value: f.nom })
      })
    })

    console.log(this.EcoleListRework);
  }
  //AFFICHER LES COMPTES
  onShowCompte(prospect: Prospect) {
    this.visible = true;
    this.prospect_acctuelle = prospect;
    if (this.prospect_acctuelle?.teams != "NON") {
      this.compteForm.patchValue({
        teams: this.prospect_acctuelle?.teams
      })
    } else {
      this.compteForm.patchValue({
        teams: ''
      })
    }
    if (this.prospect_acctuelle?.Ypareo != "NON") {
      this.compteForm.patchValue({

        Ypareo: this.prospect_acctuelle?.Ypareo,
      })
    } else {
      this.compteForm.patchValue({
        Ypareo: ''
      })
    };
    if (this.prospect_acctuelle?.groupe != "NON") {
      this.compteForm.patchValue({
        groupe: this.prospect_acctuelle?.groupe,
      })
    } else {
      this.compteForm.patchValue({
        groupe: ''
      })
    }
  };
  //AJOUTER UN COMPTE TEAMS
  onAddTeams() {
    this.prospect_acctuelle.teams = this.compteForm.value.teams
    this.admissionService.updateV2(this.prospect_acctuelle).subscribe(resultat => {
      console.log(resultat);
      this.messageService.add({ severity: "success", summary: "Modification du compte teams avec succès" })
    });
  }
  //AJOUTER UN COMPTE YPAREO
  onAddYpareo() {
    this.prospect_acctuelle.Ypareo = this.compteForm.value.Ypareo
    this.admissionService.updateV2(this.prospect_acctuelle).subscribe(resu => {
      console.log(resu);
      this.messageService.add({ severity: "success", summary: "Modification du compte Ypareo avec succès" })
    });
  }
  //AFFECTER UN GROUP
  onAddGroup(event: any) {
    this.prospect_acctuelle.groupe = event.value;
    this.admissionService.updateV2(this.prospect_acctuelle).subscribe(res => {
      console.log(res);
      this.messageService.add({ severity: "success", summary: "Modification du groupe avec succès" })
    });
  }
  //SUPRIMER UN COMPTE TEAMS
  onDeleteTeams() {
    this.prospect_acctuelle.teams = "NON"
    this.admissionService.updateV2(this.prospect_acctuelle).subscribe(resultat => {
      console.log(resultat);
      this.messageService.add({ severity: "success", summary: "Suppresion du compte Teams avec succès" })
    });
  }
  //SUPRIMER UN COMPTE YPARIO
  onDeleteYpareo() {
    this.prospect_acctuelle.Ypareo = "NON"
    this.admissionService.updateV2(this.prospect_acctuelle).subscribe(resu => {
      console.log(resu);
      this.messageService.add({ severity: "success", summary: "Suppresion du compte Ypareo avec succès" })
    });
  }
  //SUPRIMER UN PROSPECT
  deletePro(prospect: Prospect) {
    console.log("hello")
    this.admissionService.delete(prospect._id, prospect.user_id._id).subscribe(res => { console.log(res) });
  }
  //INTIALISATION DE LA MODIFICATION D'UN ETUDIANT 
  initupdateLeadForm(prospect: Prospect) {
    this.prospect_acctuelle = prospect;
    console.log(prospect.user_id.civilite);
    this.updateLeadForm.patchValue({
      civilite: prospect.user_id.civilite,
      lastname: prospect.user_id.lastname,
      firstname: prospect.user_id.firstname,
      date_naissance: this.conersiondate(prospect.date_naissance),
      pays: prospect.user_id.pays_adresse,
      nationalite: prospect.user_id.nationnalite,
      indicatif: prospect.user_id.indicatif,
      phone: prospect.user_id.phone,
      email_perso: prospect.user_id.email_perso,
      rue: prospect.user_id.rue_adresse,
      ville: prospect.user_id.ville_adresse,
      codep: prospect.user_id.postal_adresse,
      //ecole
      campus: prospect.campus_choix_1,
      rentree_scolaire: prospect.rentree_scolaire,
      programme: prospect.programme,
      formation: prospect.formation,
      rythme_formation: prospect.rythme_formation,
      source: prospect.source,
      //commercial
      //nomlead
    })
    this.showupdateLeadForm = true
  };
  //MODIFICATION
  UpadateProspect() {
    this.prospect_acctuelle.user_id.civilite = this.updateLeadForm.value.civilite;
    this.prospect_acctuelle.user_id.lastname = this.updateLeadForm.value.lastname;
    this.prospect_acctuelle.user_id.firstname = this.updateLeadForm.value.firstname;
    this.prospect_acctuelle.date_naissance = this.updateLeadForm.value.date_naissanc;
    this.prospect_acctuelle.user_id.pays = this.updateLeadForm.value.pays;
    this.prospect_acctuelle.user_id.nationalite = this.updateLeadForm.value.nationalite;
    this.prospect_acctuelle.user_id.indicatif = this.updateLeadForm.value.indicatif;
    this.prospect_acctuelle.user_id.phone = this.updateLeadForm.value.phone;
    this.prospect_acctuelle.user_id.email_perso = this.updateLeadForm.value.email_perso;
    this.prospect_acctuelle.user_id.rue = this.updateLeadForm.value.rue;
    this.prospect_acctuelle.user_id.ville = this.updateLeadForm.value.ville;
    this.prospect_acctuelle.user_id.postal_adresse = this.updateLeadForm.value.postal_adresse;
    this.prospect_acctuelle.campus_choix_1 = this.updateLeadForm.value.campus_choix_1;
    this.prospect_acctuelle.rentree_scolaire = this.updateLeadForm.value.rentree_scolaire;
    this.prospect_acctuelle.programme = this.updateLeadForm.value.programme;
    this.prospect_acctuelle.formation = this.updateLeadForm.value.formation;
    this.prospect_acctuelle.rythme_formation = this.updateLeadForm.value.rythme_formation;
    this.prospect_acctuelle.source = this.updateLeadForm.value.source;

    const user = this.prospect_acctuelle.user_id
    const prospect = this.prospect_acctuelle
    this.admissionService.update({ prospect, user }).subscribe(data => { console.log(data) });
  }
  //A LA SELECTION D4UNE ECOLE 
  onSelectEcole() {
    this.FAService.EAgetByParams(this.updateLeadForm.value.ecole).subscribe(data => {
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
  conersiondate(a) {
    const dl = a // Supposons que project.debut soit une date valide
    const dateObjectl = new Date(dl); // Conversion en objet Date
    const year = dateObjectl.getFullYear();
    const month = String(dateObjectl.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
    const day = String(dateObjectl.getDate()).padStart(2, '0');
    const new_date = `${year}-${month}-${day}`;
    return new_date
  }
  clearFilter() {
    this.Frythme = null; this.Fcampus = null; this.Frentree = null; this.Fecoles = null; this.Fformation = null; this.Fetape = null; this.Fsource = null;

  }
  onTeamsCheckboxChange(event: any) {
    console.log('Checkbox changed', event);
    if (event.checked) {
      console.log(event.checked)
      // Checkbox est coché, appliquer le filtre
      this.dt1?.filter('NON', 'teams', 'equals');
      this.FTeams = true;
    }
    if (event.checked.length < 1) {
      console.log("notchecked")
      // Checkbox est décoché, réinitialiser le filtre
      this.dt1?.filter('', 'teams', 'equals');
      this.FTeams = false;

    }
  }
  onYpareoCheckboxChange(event: any) {
    console.log('Checkbox changed', event);
    if (event.checked) {
      console.log(event.checked)
      // Checkbox est coché, appliquer le filtre
      this.dt1?.filter('NON', 'Ypareo', 'equals');
      this.FYpareo = true;
    }
    if (event.checked.length < 1) {
      console.log("notchecked")
      // Checkbox est décoché, réinitialiser le filtre
      this.dt1?.filter('', 'Ypareo', 'equals');
      this.FYpareo = false;
    }
  }
  onGroupeCheckboxChange(event: any) {
    console.log('Checkbox changed', event);
    if (event.checked) {
      console.log(event.checked)
      // Checkbox est coché, appliquer le filtre
      this.dt1?.filter('NON', 'groupe', 'equals');
      this.Fgroupe = true;

    }
    if (event.checked.length < 1) {
      console.log("notchecked")
      // Checkbox est décoché, réinitialiser le filtre
      this.dt1?.filter('', 'groupe', 'equals');
      this.Fgroupe = false;
    }
  }

}
