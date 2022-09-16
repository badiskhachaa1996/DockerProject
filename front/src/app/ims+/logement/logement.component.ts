import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logement',
  templateUrl: './logement.component.html',
  styleUrls: ['./logement.component.scss']
})
export class LogementComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onGetDetails(id: string)
  {
    this.router.navigate(['/details-logement', id])
  }

}
