import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cv-pdf-header-espic',
  templateUrl: './cv-pdf-header-espic.component.html',
  styleUrls: ['./cv-pdf-header-espic.component.scss']
})
export class CvPdfHeaderEspicComponent implements OnInit {


  @Input() student

  constructor() { }

  ngOnInit(): void {
  }

}
