import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cv-pdf-preview',
  templateUrl: './cv-pdf-preview.component.html',
  styleUrls: ['./cv-pdf-preview.component.scss']
})
export class CvPdfPreviewComponent implements OnInit {

  @Input() student
  @Input() sidebar
  @Input() maintContent
  @Input() school

  constructor() { }

  ngOnInit(): void {
  }

}
