import { Component, OnInit } from '@angular/core';
import { PointageService } from 'src/app/services/pointage.service';
import { PointeuseService } from 'src/app/services/pointeuse.service';

@Component({
  selector: 'app-configuration-pointage',
  templateUrl: './configuration-pointage.component.html',
  styleUrls: ['./configuration-pointage.component.scss']
})
export class ConfigurationPointageComponent implements OnInit {

  constructor(private PoiService: PointeuseService, private PointageService: PointageService) { }
  machineList = []
  pointages = {}

  ngOnInit(): void {
    this.PoiService.getAll().subscribe(ps => {
      this.machineList = ps
    })
    this.PointageService.getAll().subscribe(ps => {
      console.log(ps)
      ps.forEach(p => {
        if (this.pointages[p.machine]) {
          this.pointages[p.machine].push(p)
        } else {
          this.pointages[p.machine] = [p]
        }
      })
    })
  }

}
