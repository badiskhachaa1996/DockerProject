import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cv-pdf-content',
  templateUrl: './cv-pdf-content.component.html',
  styleUrls: ['./cv-pdf-content.component.scss']
})
export class CvPdfContentComponent implements OnInit {

  @Input() maintContent 
  @Input() school
  
  constructor() { }

  ngOnInit(): void {
  }

}
