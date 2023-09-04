import { Component, OnInit } from '@angular/core';
import { PointageData } from 'src/app/models/PointageData';
import { PointageService } from 'src/app/services/pointage.service';
import { PointeuseService } from 'src/app/services/pointeuse.service';
import { RhService } from 'src/app/services/rh.service';

@Component({
  selector: 'app-archivage-pointage',
  templateUrl: './archivage-pointage.component.html',
  styleUrls: ['./archivage-pointage.component.scss']
})
export class ArchivagePointageComponent implements OnInit {

  constructor(private PoiService: PointeuseService, private PointageService: PointageService, private rhService: RhService) { }
  machineList = []
  pointages: PointageData[] = []
  collaborateurDic = {}
  machineDic = {}
  uidDic = {}
  dateAjr = new Date()
  date_dernier_maj = new Date()

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
      this.pointages = ps
    })
    this.rhService.getCollaborateurs()
      .then((response) => {

        response.forEach(c => {
          if (c.user_id)
            this.collaborateurDic[c.user_id._id] = `${c.user_id.lastname} ${c.user_id.firstname}`
        })
      })
  }

}
