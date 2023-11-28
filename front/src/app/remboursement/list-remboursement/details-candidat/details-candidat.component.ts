import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-details-candidat',
  templateUrl: './details-candidat.component.html',
  styleUrls: ['./details-candidat.component.scss']
})
export class DetailsCandidatComponent implements OnInit {
  @Input() demande
  @Input() annesSchols;
  students = [
    {
      civility:'civilité',
      date_naissance:'date_naissance',
      pays_residence:'pays_residence',
      nationality:'nationality',
      scholar_year:'scholar_year',
      formation:'formation',
    }
  ]
  constructor() { }

  ngOnInit(): void {
    
    if(this.demande && this.demande.student && this.demande.training){
    this.students[0].civility = this.demande?.student?.civility
    this.students[0].date_naissance = this.demande?.student?.date_naissance
    this.students[0].pays_residence = this.demande?.student?.country_residence
    this.students[0].nationality = this.demande?.student?.nationality
    this.students[0].scholar_year= this.demande?.training?.scholar_year
    this.students[0].formation = this.demande?.training?.name
  }
  

}

}
