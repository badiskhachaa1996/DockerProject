import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cv-pdf-header-studinfo',
  templateUrl: './cv-pdf-header-studinfo.component.html',
  styleUrls: ['./cv-pdf-header-studinfo.component.scss']
})
export class CvPdfHeaderStudinfoComponent implements OnInit {

  @Input() student

  constructor() { }

  ngOnInit(): void {
  }

}
