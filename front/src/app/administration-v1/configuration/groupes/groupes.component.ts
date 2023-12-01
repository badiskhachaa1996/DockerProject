import { Component, OnInit } from '@angular/core';
import { Groupe } from 'src/app/models/Groupe';
import { GroupeService } from 'src/app/services/groupe.service';

@Component({
  selector: 'app-groupes',
  templateUrl: './groupes.component.html',
  styleUrls: ['./groupes.component.scss']
})
export class GroupesComponent implements OnInit {

  constructor(private GroupeService: GroupeService) { }
  groupes: Groupe[] = []
  ngOnInit(): void {
    this.GroupeService.getAll().subscribe(groupes => {
      this.groupes = groupes
    })
  }
  groupeUpdated: Groupe
  onUpdateGroupe(groupe: Groupe) {
    console.log(groupe)
    this.groupes.splice(this.groupes.indexOf(this.groupeUpdated), 1, groupe)
    this.groupeUpdated = null
  }

  InitUpdateGroupe(groupe: Groupe) {
    this.groupeUpdated = groupe
  }

  onAddGroupe(groupe: Groupe) {
    this.groupes.push(groupe)
  }

}
