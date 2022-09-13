import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-liste-comptes',
  templateUrl: './liste-comptes.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./liste-comptes.component.scss']
})
export class ListeComptesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
