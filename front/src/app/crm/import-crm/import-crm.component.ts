import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LeadCRM } from 'src/app/models/LeadCRM';
import { LeadcrmService } from 'src/app/services/crm/leadcrm.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-import-crm',
  templateUrl: './import-crm.component.html',
  styleUrls: ['./import-crm.component.scss']
})
export class ImportCrmComponent implements OnInit {

  sourceDropdown = [
    { value: 'Facebook' },
    { value: 'WhatsApp' },
    { value: 'Appel Telephonique' },
    { value: 'Mail' },
    { value: 'Visite au site' },
    { value: 'Online Meeting' },
    { value: 'Marketing' },
    { value: 'Recyclage' },
  ]
  operationDropdown = [
    { value: 'Prospection FRP' },
    { value: 'Prospection ENP' },
    { value: 'Prospection ICBS Malte' },
    { value: 'Prospection ICBS Dubai' },
  ]
  civiliteDropdown = [
    { value: 'Monsieur' },
    { value: 'Madame' },
    { value: 'Autre' },
  ]
  nationaliteDropdown = environment.nationalites
  paysDropdown = environment.pays
  nivDropdown = [
    { label: 'Pré-bac', value: 'Pré-bac' },
    { label: 'Bac +1', value: 'Bac +1' },
    { label: 'Bac +2', value: 'Bac +2' },
    { label: 'Bac +3', value: 'Bac +3' },
    { label: 'Bac +4', value: 'Bac +4' },
    { label: 'Bac +5', value: 'Bac +5' },
  ];
  statutList =
    [
      { label: 'Etudiant', value: 'Etudiant' },
      { label: 'Salarié', value: 'Salarié' },
      { label: 'Au chômage', value: 'Au chômage' },
      { label: 'Autre', value: 'Autre' },
    ];
  niveauFR =
    [
      { label: "Langue maternelle", value: "Langue maternelle" },
      { label: "J’ai une attestation de niveau (TCF DALF DELF..)", value: "J’ai une attestation de niveau (TCF DALF DELF..)" },
      { label: "Aucun de ces choix", value: "Aucun de ces choix" },
    ]
  niveauEN =
    [
      { label: "Langue maternelle", value: "Langue maternelle" },
      { label: "Avancé", value: "Avancé" },
      { label: "Intermédiaire", value: "Intermédiaire" },
      { label: "Basique", value: "Basique" },
      { label: "Je ne parle pas l’anglais", value: "Je ne parle pas l’anglais" },
    ]

  constructor(private ToastService: MessageService, private LCRMS: LeadcrmService) { }

  ngOnInit(): void {
    this.LCRMS.getAll().subscribe(data => {
      data.forEach(l => {
        this.dicLeads[l.email] = l
      })
      console.log(this.dicLeads)
    })

  }

  upload = false
  leadsDefault: LeadCRM[] = []
  leadsToCreate: LeadCRM[] = []
  errorToCreate: {
    source: { error: string, warning: string }, operation: { error: string, warning: string }, civilite: { error: string, warning: string }, nom: { error: string, warning: string }, prenom: { error: string, warning: string }, pays_residence: { error: string, warning: string }, email: { error: string, warning: string }, nationalite: { error: string, warning: string }, date_naissance: { error: string, warning: string }, indicatif_whatsapp: { error: string, warning: string },
    numero_whatsapp: { error: string, warning: string }, indicatif_telegram: { error: string, warning: string }, numero_telegram: { error: string, warning: string }, dernier_niveau_academique: { error: string, warning: string }, statut: { error: string, warning: string }, niveau_fr: { error: string, warning: string }, niveau_en: { error: string, warning: string }
  }[] = []
  leadsToUpdate: LeadCRM[] = []
  errorToUpdate: {
    source: { error: string, warning: string }, operation: { error: string, warning: string }, civilite: { error: string, warning: string }, nom: { error: string, warning: string }, prenom: { error: string, warning: string }, pays_residence: { error: string, warning: string }, email: { error: string, warning: string }, nationalite: { error: string, warning: string }, date_naissance: { error: string, warning: string }, indicatif_whatsapp: { error: string, warning: string },
    numero_whatsapp: { error: string, warning: string }, indicatif_telegram: { error: string, warning: string }, numero_telegram: { error: string, warning: string }, dernier_niveau_academique: { error: string, warning: string }, statut: { error: string, warning: string }, niveau_fr: { error: string, warning: string }, niveau_en: { error: string, warning: string }
  }[] = []
  dicLeads = {}

  fileUploadXLS(event: { files: File[] }) {
    //console.log(event)
    this.ToastService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
    let workBook = null;
    let jsonData: JSON = null;
    const reader = new FileReader();
    const file = event.files[0];
    reader.onload = (event) => {
      const dataR = reader.result;
      workBook = XLSX.read(dataR, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      this.ToastService.add({ severity: 'info', summary: 'Convertion du fichier', detail: "Convertion du fichier sous JSON avec succès" })
      let JsonKeys = Object.keys(jsonData)
      JsonKeys.forEach(k => {
        if (jsonData[k][0]['Email du Lead']) {
          if (jsonData[k][0]['Prénom du Lead *'] && jsonData[k][0]['Nom du Lead *']) {
            this.ToastService.add({ severity: 'success', summary: "Colonne requise présente", detail: "Début du traitement du fichier..." })
            jsonData[k].forEach((data, idx) => {
              //console.log(data['Email du Lead'], this.dicLeads[data['Email du Lead']])
              if (this.dicLeads[data['Email du Lead']]) {
                //A Modifier
                let leadDefault: LeadCRM = this.dicLeads[data['Email du Lead']]

                let r = {
                  ...leadDefault
                }
                if (data['Source Lead']) r.source = data['Source Lead'];
                if (data['Operation']) r.operation = data['Operation'];
                if (data['Civilité']) r.civilite = data['Civilité'];
                if (data['Nom du Lead *']) r.nom = data['Nom du Lead *'];
                if (data['Prénom du Lead *']) r.prenom = data['Prénom du Lead *'];
                if (data['Pays de Résidence']) r.pays_residence = data['Pays de Résidence'];
                if (data['Email du Lead']) r.email = data['Email du Lead'];
                if (data['Nationalité ']) r.nationalite = data['Nationalité '];
                if (data['Date de naissance']) r.date_naissance = new Date(data['Date de naissance']);
                if (data['Indicatif']) r.indicatif_whatsapp = data['Indicatif'];
                if (data['Numéro WhatsApp']) r.numero_whatsapp = data['Numéro WhatsApp'];
                if (data['Indicatif2']) r.indicatif_telegram = data['Indicatif2'];
                if (data['Numéro Telegram']) r.numero_telegram = data['Numéro Telegram'];
                if (data['Dernier niveau académique']) r.dernier_niveau_academique = data['Dernier niveau académique'];
                if (data['Statut Actuel']) r.statut = data['Statut Actuel'];
                if (data['Niveau en Français']) r.niveau_fr = data['Niveau en Français'];
                if (data['Niveau en Anglais']) r.niveau_en = data['Niveau en Anglais'];
                this.leadsToUpdate.push(r)
                Object.keys(r).forEach(key => {
                  this.errorToUpdate.push({
                    source: { error: null, warning: null }, operation: { error: null, warning: null }, civilite: { error: null, warning: null }, nom: { error: null, warning: null }, prenom: { error: null, warning: null }, pays_residence: { error: null, warning: null }, email: { error: null, warning: null }, nationalite: { error: null, warning: null }, date_naissance: { error: null, warning: null }, indicatif_whatsapp: { error: null, warning: null },
                    numero_whatsapp: { error: null, warning: null }, indicatif_telegram: { error: null, warning: null }, numero_telegram: { error: null, warning: null }, dernier_niveau_academique: { error: null, warning: null }, statut: { error: null, warning: null }, niveau_fr: { error: null, warning: null }, niveau_en: { error: null, warning: null }
                  })
                  this.onChangeUpdate(this.leadsToUpdate.length - 1, key, r[key])
                })
              } else {
                let r = {
                  source: null, operation: null, civilite: null, nom: null, prenom: null, pays_residence: null, email: null, nationalite: null, date_naissance: null, indicatif_whatsapp: null,
                  numero_whatsapp: null, indicatif_telegram: null, numero_telegram: null, dernier_niveau_academique: null, statut: null, niveau_fr: null, niveau_en: null
                }
                if (data['Source Lead']) r.source = data['Source Lead'];
                if (data['Operation']) r.operation = data['Operation'];
                if (data['Civilité']) r.civilite = data['Civilité'];
                if (data['Nom du Lead *']) r.nom = data['Nom du Lead *'];
                if (data['Prénom du Lead *']) r.prenom = data['Prénom du Lead *'];
                if (data['Pays de Résidence']) r.pays_residence = data['Pays de Résidence'];
                if (data['Nationalité ']) r.nationalite = data['Nationalité '];
                if (data['Email du Lead']) r.email = data['Email du Lead'];
                if (data['Date de naissance']) r.date_naissance = new Date(data['Date de naissance']);
                if (data['Indicatif']) r.indicatif_whatsapp = data['Indicatif'];
                if (data['Numéro WhatsApp']) r.numero_whatsapp = data['Numéro WhatsApp'];
                if (data['Indicatif2']) r.indicatif_telegram = data['Indicatif2'];
                if (data['Numéro Telegram']) r.numero_telegram = data['Numéro Telegram'];
                if (data['Dernier niveau académique']) r.dernier_niveau_academique = data['Dernier niveau académique'];
                if (data['Statut Actuel']) r.statut = data['Statut Actuel'];
                if (data['Niveau en Français']) r.niveau_fr = data['Niveau en Français'];
                if (data['Niveau en Anglais']) r.niveau_en = data['Niveau en Anglais'];
                this.leadsToCreate.push(r)
                Object.keys(r).forEach(key => {
                  this.errorToCreate.push({
                    source: { error: null, warning: null }, operation: { error: null, warning: null }, civilite: { error: null, warning: null }, nom: { error: null, warning: null }, prenom: { error: null, warning: null }, pays_residence: { error: null, warning: null }, email: { error: null, warning: null }, nationalite: { error: null, warning: null }, date_naissance: { error: null, warning: null }, indicatif_whatsapp: { error: null, warning: null },
                    numero_whatsapp: { error: null, warning: null }, indicatif_telegram: { error: null, warning: null }, numero_telegram: { error: null, warning: null }, dernier_niveau_academique: { error: null, warning: null }, statut: { error: null, warning: null }, niveau_fr: { error: null, warning: null }, niveau_en: { error: null, warning: null }
                  })
                  this.onChangeCreate(this.leadsToCreate.length - 1, key, r[key])
                })
              }
            })
            this.upload = true
            this.ToastService.add({ severity: 'success', summary: "Traitement Fini" })
          } else {
            this.ToastService.add({ severity: "error", summary: 'Colonne requise manquante', detail: "La colonne 'Prénom du Lead *' ou 'Nom du Lead *' est manquante dans la feuille '" + k + "'" })
          }
        } else {
          this.ToastService.add({ severity: "error", summary: 'Colonne requise manquante', detail: "La colonne 'Email du Lead' est manquante dans la feuille '" + k + "'\nCette feuille sera ignorée" })
        }
      });
    }
    reader.readAsBinaryString(file);
  }

  /*fileUploadXML(event: { files: File[] }) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = reader.result;
      console.log(data)
      parseString(data, function (err, result) {
        console.dir(result);
      });
    }
    reader.readAsText(event.files[0]);

  }*/

  addLead() {
    this.leadsToCreate.push(
      {
        source: null, operation: null, civilite: null, nom: null, prenom: null, pays_residence: null, email: null, nationalite: null, date_naissance: null, indicatif_whatsapp: null,
        numero_whatsapp: null, indicatif_telegram: null, numero_telegram: null, dernier_niveau_academique: null, statut: null, niveau_fr: null, niveau_en: null, date_creation: new Date()
      }
    )
  }
  deleteAdded(index) {
    this.leadsToCreate.splice(index, 1)
    this.errorToCreate.splice(index, 1)
  }
  deleteUpdated(index) {
    this.leadsToUpdate.splice(index, 1)
    this.leadsToUpdate.splice(index, 1)
  }

  saveLeads() {
    let toInsert = []
    this.leadsToCreate.forEach(val => {
      val.date_creation = new Date()
      val.custom_id = this.generateID(val)
      toInsert.push(val)
    })
    this.LCRMS.insertDB({ toInsert, toUpdate: this.leadsToUpdate }).subscribe(data => {
      this.ToastService.add({ severity: 'success', summary: "Insertion dans la DB", detail: "Insertion Réussie" })
    })
  }

  generateID(val: LeadCRM) {
    let prenom = val.prenom.substring(0, 1)
    let nom = val.nom.substring(0, 1)
    let code_pays = val.nationalite.substring(0, 3)
    environment.dicNationaliteCode.forEach(code => {
      if (code[val.nationalite] && code[val.nationalite] != undefined) {
        code_pays = code[val.nationalite]
      }
    })
    let dn = new Date(val.date_naissance)
    let jour = dn.getDate()
    let mois = dn.getMonth() + 1
    let year = dn.getFullYear().toString().substring(2)
    let nb = (Object.keys(this.dicLeads).length + 1).toString()
    nb = nb.substring(nb.length - 3)
    return (code_pays + prenom + nom + jour + mois + year + nb).toUpperCase()
  }

  onChangeCreate(index, attribute, value) {
    if (attribute == 'date_naissance') {
      if (new FormControl(value, Validators.required).valid) {
        if (!this.isValid(value))
          this.errorToCreate[index][attribute] = { error: 'La date n\'est pas correct', warning: null }
        else
          this.errorToCreate[index][attribute] = { error: null, warning: null }
      } else {
        this.errorToCreate[index][attribute] = { error: 'Le champ est requis pour pouvoir générer l\'ID', warning: null }
      }
    } else if (attribute == "email") {
      if (new FormControl(value, [Validators.email, Validators.required]).invalid)
        this.errorToCreate[index][attribute] = { error: 'Email non conforme', warning: null }
      else
        this.errorToCreate[index][attribute] = { error: null, warning: null }

    } else if (attribute == "source") {
      let list = []
      this.sourceDropdown.forEach(val => { list.push(val.value) })
      if (list.includes(value))
        this.errorToCreate[index][attribute] = { error: null, warning: null }
      else
        this.errorToCreate[index][attribute] = { error: null, warning: 'Le texte ne correponds pas à un élément de la liste déroulante' }
    } else if (attribute == "operation") {
      let list = []
      this.operationDropdown.forEach(val => { list.push(val.value) })
      if (list.includes(value))
        this.errorToCreate[index][attribute] = { error: null, warning: null }
      else
        this.errorToCreate[index][attribute] = { error: null, warning: 'Le texte ne correponds pas à un élément de la liste déroulante' }
    } else if (attribute == "pays_residence") {
      let list = []
      this.paysDropdown.forEach(val => { list.push(val.value) })
      if (list.includes(value))
        this.errorToCreate[index][attribute] = { error: null, warning: null }
      else
        this.errorToCreate[index][attribute] = { error: null, warning: 'Le texte ne correponds pas à un élément de la liste déroulante' }
    } else if (attribute == "dernier_niveau_academique") {
      let list = []
      this.nivDropdown.forEach(val => { list.push(val.value) })
      if (list.includes(value))
        this.errorToCreate[index][attribute] = { error: null, warning: null }
      else
        this.errorToCreate[index][attribute] = { error: null, warning: 'Le texte ne correponds pas à un élément de la liste déroulante' }
    } else if (attribute == "statut") {
      let list = []
      this.statutList.forEach(val => { list.push(val.value) })
      if (list.includes(value))
        this.errorToCreate[index][attribute] = { error: null, warning: null }
      else
        this.errorToCreate[index][attribute] = { error: null, warning: 'Le texte ne correponds pas à un élément de la liste déroulante' }
    } else if (attribute == "niveau_fr") {
      let list = []
      this.niveauFR.forEach(val => { list.push(val.value) })
      if (list.includes(value))
        this.errorToCreate[index][attribute] = { error: null, warning: null }
      else
        this.errorToCreate[index][attribute] = { error: null, warning: 'Le texte ne correponds pas à un élément de la liste déroulante' }
    } else if (attribute == "niveau_en") {
      let list = []
      this.niveauEN.forEach(val => { list.push(val.value) })
      if (list.includes(value))
        this.errorToCreate[index][attribute] = { error: null, warning: null }
      else
        this.errorToCreate[index][attribute] = { error: null, warning: 'Le texte ne correponds pas à un élément de la liste déroulante' }
    } else if (attribute == "nationalite" || attribute == "prenom" || attribute == "nom") {
      if (new FormControl(value, Validators.required).valid)
        this.errorToCreate[index][attribute] = { error: null, warning: null }
      else
        this.errorToCreate[index][attribute] = { error: 'Le champ est requis pour pouvoir générer l\'ID', warning: null }
    }
  }

  onChangeUpdate(index, attribute, value) {
    if (attribute == 'date_naissance') {
      if (new FormControl(value, Validators.required).valid) {
        if (!this.isValid(value))
          this.errorToUpdate[index][attribute] = { error: 'La date n\'est pas correct', warning: null }
        else
          this.errorToUpdate[index][attribute] = { error: null, warning: null }
      } else {
        this.errorToUpdate[index][attribute] = { error: 'Le champ est requis pour pouvoir générer l\'ID', warning: null }
      }
    } else if (attribute == "email") {
      if (new FormControl(value, [Validators.email, Validators.required]).valid)
        this.errorToUpdate[index][attribute] = { error: null, warning: null }
      else
        this.errorToUpdate[index][attribute] = { error: 'Email non conforme', warning: null }

    } else if (attribute == "source") {
      let list = []
      this.sourceDropdown.forEach(val => { list.push(val.value) })
      if (list.includes(value))
        this.errorToUpdate[index][attribute] = { error: null, warning: null }
      else
        this.errorToUpdate[index][attribute] = { error: null, warning: 'Le texte ne correponds pas à un élément de la liste déroulante' }
    } else if (attribute == "operation") {
      let list = []
      this.operationDropdown.forEach(val => { list.push(val.value) })
      if (list.includes(value))
        this.errorToUpdate[index][attribute] = { error: null, warning: null }
      else
        this.errorToUpdate[index][attribute] = { error: null, warning: 'Le texte ne correponds pas à un élément de la liste déroulante' }
    } else if (attribute == "pays_residence") {
      let list = []
      this.paysDropdown.forEach(val => { list.push(val.value) })
      if (list.includes(value))
        this.errorToUpdate[index][attribute] = { error: null, warning: null }
      else
        this.errorToUpdate[index][attribute] = { error: null, warning: 'Le texte ne correponds pas à un élément de la liste déroulante' }
    } else if (attribute == "dernier_niveau_academique") {
      let list = []
      this.nivDropdown.forEach(val => { list.push(val.value) })
      if (list.includes(value))
        this.errorToUpdate[index][attribute] = { error: null, warning: null }
      else
        this.errorToUpdate[index][attribute] = { error: null, warning: 'Le texte ne correponds pas à un élément de la liste déroulante' }
    } else if (attribute == "statut") {
      let list = []
      this.statutList.forEach(val => { list.push(val.value) })
      if (list.includes(value))
        this.errorToUpdate[index][attribute] = { error: null, warning: null }
      else
        this.errorToUpdate[index][attribute] = { error: null, warning: 'Le texte ne correponds pas à un élément de la liste déroulante' }
    } else if (attribute == "niveau_fr") {
      let list = []
      this.niveauFR.forEach(val => { list.push(val.value) })
      if (list.includes(value))
        this.errorToUpdate[index][attribute] = { error: null, warning: null }
      else
        this.errorToUpdate[index][attribute] = { error: null, warning: 'Le texte ne correponds pas à un élément de la liste déroulante' }
    } else if (attribute == "niveau_en") {
      let list = []
      this.niveauEN.forEach(val => { list.push(val.value) })
      if (list.includes(value))
        this.errorToUpdate[index][attribute] = { error: null, warning: null }
      else
        this.errorToUpdate[index][attribute] = { error: null, warning: 'Le texte ne correponds pas à un élément de la liste déroulante' }
    } else if (attribute == "nationalite" || attribute == "prenom" || attribute == "nom") {
      if (new FormControl(value, Validators.required).valid)
        this.errorToUpdate[index][attribute] = { error: null, warning: null }
      else
        this.errorToUpdate[index][attribute] = { error: 'Le champ est requisF', warning: null }
    }
  }

  canValidate() {
    let nberror = 0
    let nbwarning = 0
    this.errorToCreate.forEach(val => {
      let temp = Object.keys(val)
      temp.forEach(k => {
        if (val[k].error != null) {
          nberror += 1
        }
        if (val[k].warning != null) {
          nbwarning += 1
        }
      })
    })
    this.errorToUpdate.forEach(val => {
      let temp = Object.keys(val)
      temp.forEach(k => {
        if (val[k].error != null) {
          nberror += 1
        }
        if (val[k].warning != null) {
          nbwarning += 1
        }
      })
    })
    return { nberror, nbwarning }
  }

  isValid(d) {
    return new Date(d).getTime() === new Date(d).getTime()
  }
  downloadFile(file) {
    let link = document.createElement("a");
    link.download = file;
    link.href = "assets/document/" + file;
    link.click();
  }
}
