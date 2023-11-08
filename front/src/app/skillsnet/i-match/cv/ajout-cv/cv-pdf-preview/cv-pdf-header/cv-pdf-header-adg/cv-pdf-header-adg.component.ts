import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cv-pdf-header-adg',
  templateUrl: './cv-pdf-header-adg.component.html',
  styleUrls: ['./cv-pdf-header-adg.component.scss']
})
export class CvPdfHeaderAdgComponent implements OnInit {

  @Input() student

  constructor() { }

  ngOnInit(): void {
  }

}
