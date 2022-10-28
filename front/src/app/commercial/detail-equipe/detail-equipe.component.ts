import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-equipe',
  templateUrl: './detail-equipe.component.html',
  styleUrls: ['./detail-equipe.component.scss']
})
export class DetailEquipeComponent implements OnInit {

  team;
  showFormAddEquipe = false
  showFormUpdate =false

  constructor() { }

  ngOnInit(): void {
  }

}
