import { Component, OnInit } from '@angular/core';
import { PointageData } from 'src/app/models/PointageData';
import { PointageService } from 'src/app/services/pointage.service';
import { PointeuseService } from 'src/app/services/pointeuse.service';
import { RhService } from 'src/app/services/rh.service';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-archivage-pointage',
  templateUrl: './archivage-pointage.component.html',
  styleUrls: ['./archivage-pointage.component.scss']
})
export class ArchivagePointageComponent implements OnInit {

  constructor(private PoiService: PointeuseService, private PointageService: PointageService, private rhService: RhService) { }
  machineList = []
  pointages: PointageData[] = []
  dicPointages = {}
  collaborateurDic = {}
  machineDic = {}
  uidDic = {}
  dateAjr = new Date()
  date_dernier_maj = new Date()
  datePointageArray = []
  ngOnInit(): void {
    this.PoiService.getAll().subscribe(ps => {
      this.machineList = ps
      ps.forEach(m => {
        this.machineDic[m.serial_number] = m
      })
    })
    this.PoiService.getData().subscribe(pd => {
      pd.forEach(p => {
        p.users.forEach(u => {
          if (u.user_id) {
            if (this.uidDic[p.serial_number]) {
              this.uidDic[p.serial_number][u.UID] = u.user_id
            } else {
              this.uidDic[p.serial_number] = {}
              this.uidDic[p.serial_number][u.UID] = u.user_id
            }

          }
        })
      })
      console.log(this.uidDic)
    })
    this.PointageService.getAll().subscribe(ps => {
      this.pointages = ps.pointages
      this.dicPointages = ps.dicDayPointage
      this.datePointageArray = Object.keys(this.dicPointages)
      console.log(this.datePointageArray)
    })
    this.rhService.getCollaborateurs()
      .then((response) => {

        response.forEach(c => {
          if (c.user_id)
            this.collaborateurDic[c.user_id._id] = `${c.user_id.lastname} ${c.user_id.firstname}`
        })
      })
  }

  dataHisto = {}
  display = false
  seeHisto(pds: PointageData[]) {
    this.dataHisto = pds
    pds.forEach(p => {
      if (this.dataHisto[p.machine]) {
        this.dataHisto[p.machine].push(p)
      } else {
        this.dataHisto[p.machine] = [p]
      }
      this.date_dernier_maj = new Date(p.updateDate)
    })
    this.display = true
  }

  exportToExcel(pds: PointageData[], date) {
    let dataExcel = []
    //Clean the data
    pds.forEach(p => {
      let t = {}
      let c = "Non Affecté"
      if (this.collaborateurDic && this.uidDic && p.machine && this.uidDic[p.machine] && this.uidDic[p.machine][p.uid] && this.collaborateurDic[this.uidDic[p.machine][p.uid]]) {
        c = this.collaborateurDic[this.uidDic[p.machine][p.uid]]
      }
      t['Machine'] = p?.machine
      t['Localisation'] = this.machineDic[p?.machine]?.localisation
      t['Date'] = p?.date
      t['Type'] = p?.type
      t['UID'] = p?.uid
      t['Collaborateur '] = c
      dataExcel.push(t)
    })
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, "pointage_" + date + '_export_' + new Date().toLocaleDateString("fr-FR") + ".xlsx");
  }

}
