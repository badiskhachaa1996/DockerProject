import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-logement',
  templateUrl: './detail-logement.component.html',
  styleUrls: ['./detail-logement.component.scss']
})
export class DetailLogementComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
