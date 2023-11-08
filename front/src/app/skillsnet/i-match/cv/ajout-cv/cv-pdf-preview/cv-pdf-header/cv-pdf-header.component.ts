import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cv-pdf-header',
  templateUrl: './cv-pdf-header.component.html',
  styleUrls: ['./cv-pdf-header.component.scss']
})
export class CvPdfHeaderComponent implements OnInit {

  @Input() student

  @Input() school

  constructor() { }

  ngOnInit(): void {
  }

}
