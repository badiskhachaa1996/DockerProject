import { Component, Input, OnInit } from '@angular/core';
import { GenDoc } from 'src/app/models/gen_doc/GenDoc';

@Component({
  selector: 'app-outputpage',
  templateUrl: './outputpage.component.html',
  styleUrls: ['./outputpage.component.scss']
})
export class OutputpageComponent implements OnInit {

  base_url =  "https://ims.intedgroup.com/#/document/"

  @Input() isWoman: Boolean;
  @Input() prep: string;
  @Input() type_certif;
  @Input() formContent;
  @Input() school;
  @Input() campus;
  @Input() formation;
  @Input() rentre;
  @Input() paiement_method;
  @Input() student;
  @Input() country;
  @Input() id_doc;

  
  
  constructor() { 

  }

  ngOnInit(): void {
    console.log(this.base_url + this.id_doc)
    console.log(this.school)
  }

}
