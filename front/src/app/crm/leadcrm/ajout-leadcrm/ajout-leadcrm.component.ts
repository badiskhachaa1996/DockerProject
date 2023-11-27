import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LeadcrmService } from 'src/app/services/crm/leadcrm.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from "@angular/router";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { LeadCRM } from 'src/app/models/LeadCRM';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-ajout-leadcrm',
  templateUrl: './ajout-leadcrm.component.html',
  styleUrls: ['./ajout-leadcrm.component.scss']
})
export class AjoutLeadcrmComponent implements OnInit {
  @Output() newLead = new EventEmitter<LeadCRM>();
  sourceDropdown = [
    { value: 'Facebook' },
    { value: 'WhatsApp' },
    { value: 'Appel Telephonique' },
    { value: 'Mail' },
    { value: 'Visite au site' },
    { value: 'Online Meeting' },
    { value: 'Marketing' },
    { value: 'Recyclage' },
    { value: 'LinkdIn' },
  ]
  operationDropdown = [
    { value: 'Prospection FRP' },
    { value: 'Prospection ENP' },
    { value: 'Prospection ICBS Malte' },
    { value: 'Prospection ICBS Dubai' },
    { value: 'Prospection Alternant' },
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
  addForm: FormGroup = new FormGroup({
    _id: new FormControl(''),
    source: new FormControl(''),
    civilite: new FormControl(''),
    nom: new FormControl('', Validators.required),
    prenom: new FormControl('', Validators.required),
    pays_residence: new FormControl(''),
    email: new FormControl(''),
    indicatif_phone: new FormControl(''),
    numero_phone: new FormControl(''),
    nationalite: new FormControl('', Validators.required),
    indicatif_whatsapp: new FormControl(''),
    numero_whatsapp: new FormControl(''),
    dernier_niveau_academique: new FormControl(''),
  })

  prospects = []

  onAdd() {
    let user = null
    try {
      user = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      user = null
    }
    this.LCS.create({ ...this.addForm.value, date_creation: new Date(), custom_id: this.generateID(), statut_dossier: "Non contacté", decision_qualification: "En attente", created_by: user?.id }).subscribe(data => {
      this.addForm.reset()
      this.newLead.emit(data)
      this.ToastService.add({ severity: "success", summary: "Ajout d'un nouveau lead" })
    })
    this.LCS.getAll().subscribe(data => {
      this.prospects = data
    })
  }

  generateID() {
    let prenom = this.addForm.value.prenom.substring(0, 1)
    let nom = this.addForm.value.nom.substring(0, 1)
    let code_pays = this.addForm.value.nationalite.substring(0, 3)
    environment.dicNationaliteCode.forEach(code => {
      if (code[this.addForm.value.nationalite] && code[this.addForm.value.nationalite] != undefined) {
        code_pays = code[this.addForm.value.nationalite]
      }
    })
    let dn = new Date(this.addForm.value.date_naissance)
    let jour = dn.getDate()
    let mois = dn.getMonth() + 1
    let year = dn.getFullYear().toString().substring(2)
    let nb = (this.prospects.length + 1).toString()
    nb = nb.substring(nb.length - 3)
    return (code_pays + prenom + nom + jour + mois + year + nb).toUpperCase()
  }


  constructor(private LCS: LeadcrmService, private ToastService: MessageService, private route: ActivatedRoute, private router: Router) { }

  isUpdate = false
  paramID = ""
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id']; // Récupérez l'ID à partir de l'URL
      this.paramID = id
      if (id) {
        // Si un ID est fourni, chargez les données du lead pour la mise à jour
        this.loadLeadData(id);
        this.isUpdate = true
      }
    });

  }



  private loadLeadData(id: string) {
    this.LCS.getOneByID(id).subscribe(data => {
      this.addForm.patchValue({ ...data })
    })
  }


  onUpdate() {
    this.LCS.update({ ...this.addForm.value }).subscribe(data => {
      this.ToastService.add({ severity: "success", summary: "Mise à jour du lead" })
    })
    this.router.navigate(['/crm/leads/liste']);
  }
  downloadTemplate() {
    let dataExcel = [];
    dataExcel.push({
      'Source': ' ',
      'Operation': ' ',
      'Civilité': ' ',
      'Nom': ' ',
      'Prénom': ' ',
      'Pays de résidence': ' ',
      'Email': ' ',
      'Indicatif': ' ',
      'Téléphone': ' ',
      'Date de naissance': ' ',
      'Nationalité': ' ',
      'Indicatif WA': ' ',
      'WhatsApp': ' ',
      'Indicatif T': ' ',
      'Telegram': ' ',
      'Dernier niveau académique': ' ',
      'Statut': ' ',
      'Niveau Français': ' ',
      'Niveau Anglais': ' ',
      //send_mail: ' ',
      //Qualification
      'Decision Qualification': ' ',
      'Note Qualification': ' ',

      //Affectation
      'Date Affectation': ' ',

      //Choix Prospects
      'Rythme': ' ',
      'Ecole': ' ',
      'Formation': ' ',
      'Campus': ' ',
      'Note Choix': ' ',
    })
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExcel);
    //const worksheet2: XLSX.WorkSheet = XLSX.utils.json_to_sheet();
    const workbook: XLSX.WorkBook = { Sheets: { 'notes': worksheet }, SheetNames: ['notes'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, "leadcrm_template_" + new Date().toLocaleDateString("fr-FR") + ".xlsx");
  }
  onImportExcel() {
    document.getElementById('selectedFile').click();
  }
  importExcel(event) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      let arrayBuffer: any = fileReader.result;
      var data = new Uint8Array(arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var temp_list: any = XLSX.utils.sheet_to_json(worksheet, { raw: true })
      temp_list.forEach(val => {
        Object.keys(val).forEach(k => {
          if (val[k] == ' ')
            val[k] = null
          if (k == 'Date de naissance' || k == 'date_naissance') {
            let d: Date = new Date(val[k])
            d.setDate(d.getDate() + 1)
            val[k] = d
          }

        })
        let Lead: LeadCRM = {
          source: val['Source'],
          operation: val['Operation'],
          civilite: val['Civilité'],
          nom: val['Nom'],
          prenom: val['Prénom'],
          pays_residence: val['Pays de résidence'],
          email: val['Email'],
          indicatif_phone: val['Indicatif'],
          numero_phone: val['Téléphone'],
          date_naissance: val['Date de naissance'],
          nationalite: val['Nationalité'],
          indicatif_whatsapp: val['Indicatif WA'],
          numero_whatsapp: val['WhatsApp'],
          indicatif_telegram: val['Indicatif T'],
          numero_telegram: val['Telegram'],
          dernier_niveau_academique: val['Dernier niveau académique'],
          statut: val['Statut'],
          niveau_fr: val['Niveau Français'],
          niveau_en: val['Niveau Anglais'],
          //send_mail],
          //Qualification
          decision_qualification: val['Decision Qualification'],
          note_qualification: val['Note Qualification'],

          //Affectation
          affected_date: val['Date Affectation'],

          //Choix Prospects
          rythme: val['Rythme'],
          ecole: val['Ecole'],
          formation: val['Formation'],
          campus: val['Campus'],
          note_choix: val['Note Choix'],
        }
        this.LCS.create({
          ...Lead,
          custom_id: this.generateIDLead(Lead),
          date_creation: new Date()
        }).subscribe(r => {

        }, error => {
          console.error()
        })
      })
      this.ToastService.add({ severity: "success", summary: "Importation avec succès" })

    }
    fileReader.readAsArrayBuffer(event[0]);
  }

  generateIDLead(lead: LeadCRM) {
    let prenom = lead?.prenom.substring(0, 1)
    let nom = lead?.nom.substring(0, 1)
    let code_pays = lead?.nationalite.substring(0, 3)
    if (lead?.nationalite)
      environment.dicNationaliteCode.forEach(code => {
        if (code[lead?.nationalite] && code[lead?.nationalite] != undefined) {
          code_pays = code[lead?.nationalite]
        }
      })
    let dn = new Date()
    if (lead.date_naissance)
      dn = new Date(lead.date_naissance)
    let jour = dn.getDate()
    let mois = dn.getMonth() + 1
    let year = dn.getFullYear().toString().substring(2)
    let nb = (this.prospects.length + 1).toString()
    nb = nb.substring(nb.length - 3)
    return (code_pays + prenom + nom + jour + mois + year + nb).toUpperCase()
  }
}
