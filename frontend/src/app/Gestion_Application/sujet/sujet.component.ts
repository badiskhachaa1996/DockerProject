import { Component, OnInit } from '@angular/core';
import { SujetService } from 'src/app/services/sujet.service';

@Component({
  selector: 'app-sujet',
  templateUrl: './sujet.component.html',
  styleUrls: ['./sujet.component.css']
})
export class SujetComponent implements OnInit {
  allSujets = []; 
  constructor(private ts:SujetService) { }

  ngOnInit(): void {
  }

}
