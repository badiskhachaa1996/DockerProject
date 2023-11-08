import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cv-pdf-header-btech',
  templateUrl: './cv-pdf-header-btech.component.html',
  styleUrls: ['./cv-pdf-header-btech.component.scss']
})
export class CvPdfHeaderBtechComponent implements OnInit {

  @Input() student

  constructor() { }

  ngOnInit(): void {
  }

}
