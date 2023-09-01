import { Component, OnInit } from '@angular/core';
import { PointageService } from 'src/app/services/pointage.service';
import { PointeuseService } from 'src/app/services/pointeuse.service';
import { RhService } from 'src/app/services/rh.service';

@Component({
  selector: 'app-configuration-pointage',
  templateUrl: './configuration-pointage.component.html',
  styleUrls: ['./configuration-pointage.component.scss']
})
export class ConfigurationPointageComponent implements OnInit {

  constructor(private PoiService: PointeuseService, private PointageService: PointageService, private rhService: RhService) { }
  machineList = []
  pointages = {}
  collaborateurDic = {}
  uidDic = {}
  dateAjr = new Date()

  ngOnInit(): void {
    this.PoiService.getAll().subscribe(ps => {
      this.machineList = ps
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
    this.PointageService.getAllToday().subscribe(ps => {
      console.log(ps)
      ps.forEach(p => {
        if (this.pointages[p.machine]) {
          this.pointages[p.machine].push(p)
        } else {
          this.pointages[p.machine] = [p]
        }
      })
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
