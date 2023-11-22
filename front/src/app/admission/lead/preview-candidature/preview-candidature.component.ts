import { Component, Input, OnInit } from '@angular/core';
import { CandidatureLead } from 'src/app/models/CandidatureLead';
import { Prospect } from 'src/app/models/Prospect';

@Component({
  selector: 'app-preview-candidature',
  templateUrl: './preview-candidature.component.html',
  styleUrls: ['./preview-candidature.component.scss']
})
export class PreviewCandidatureComponent implements OnInit {
  @Input() CANDIDATURE: CandidatureLead
  @Input() PROSPECT: Prospect
  @Input() pageNumber: Number = 0
  constructor() { }

  ngOnInit(): void {
  }

}
