import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LeadCRM } from 'src/app/models/LeadCRM';
import { LeadcrmService } from 'src/app/services/crm/leadcrm.service';
import * as XLSX from 'xlsx';
let parseString = require('xml2js').parseString;
@Component({
  selector: 'app-import-crm',
  templateUrl: './import-crm.component.html',
  styleUrls: ['./import-crm.component.scss']
})
export class ImportCrmComponent implements OnInit {

  constructor(private ToastService: MessageService, private LCRMS: LeadcrmService) { }

  ngOnInit(): void {
  }

  upload = false
  leadsToCreate: LeadCRM[] = []
  leadsToUpdate: LeadCRM[] = []

  fileUploadXLS(event: { files: File[] }) {
    console.log(event)
    this.upload = true
    this.ToastService.add({ severity: 'info', summary: 'Envoi de Fichier', detail: 'Envoi en cours, veuillez patienter ...' });
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = event.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      this.ToastService.add({ severity: 'info', summary: 'Convertion du fichier', detail: "Convertion du fichier sous JSON avec succès" })
    }
    reader.readAsBinaryString(file);
  }

  fileUploadXML(event: { files: File[] }) {
    console.log(event)
    parseString(event.files[0].text, function (err, result) {
      console.dir(result);
    });
  }

}
