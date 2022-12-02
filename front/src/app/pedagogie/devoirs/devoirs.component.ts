import { Component, OnInit } from '@angular/core';
import { Devoir } from 'src/app/models/devoir';

@Component({
  selector: 'app-devoirs',
  templateUrl: './devoirs.component.html',
  styleUrls: ['./devoirs.component.scss']
})
export class DevoirsComponent implements OnInit {

  devoirs: Devoir[] = []
  showDevoir=false

  constructor() { }

  ngOnInit(): void {
  }

}
