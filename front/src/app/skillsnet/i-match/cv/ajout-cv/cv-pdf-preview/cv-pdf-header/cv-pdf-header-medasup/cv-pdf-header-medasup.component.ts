import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cv-pdf-header-medasup',
  templateUrl: './cv-pdf-header-medasup.component.html',
  styleUrls: ['./cv-pdf-header-medasup.component.scss']
})
export class CvPdfHeaderMedasupComponent implements OnInit {

  @Input() student

  constructor() { }

  ngOnInit(): void {
  }

}
