import { Component, Input, OnInit } from '@angular/core';
import { GenDoc } from 'src/app/models/gen_doc/GenDoc';

@Component({
  selector: 'app-gen-outro',
  templateUrl: './gen-outro.component.html',
  styleUrls: ['./gen-outro.component.scss']
})
export class GenOutroComponent implements OnInit {

  @Input() isWoman: Boolean;
  @Input() type_certif;
  @Input() school;
  @Input() campus;
  @Input() formation;
  @Input() rentre;
  @Input() paiement_method;
  @Input() formContent;
  
  constructor() { }

  ngOnInit(): void {

  }

}
