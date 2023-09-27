import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-imatch-entreprise',
  templateUrl: './imatch-entreprise.component.html',
  styleUrls: ['./imatch-entreprise.component.scss', '../../../../assets/css/bootstrap.min.css']
})
export class ImatchEntrepriseComponent implements OnInit {

  portail = "etudiant";

  constructor() { }

  ngOnInit(): void {
  }

}
