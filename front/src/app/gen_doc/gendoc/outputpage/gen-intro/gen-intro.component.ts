import { Component, Input, OnInit } from '@angular/core';
import { GenDoc } from 'src/app/models/gen_doc/GenDoc';

@Component({
  selector: 'app-gen-intro',
  templateUrl: './gen-intro.component.html',
  styleUrls: ['./gen-intro.component.scss']
})
export class GenIntroComponent implements OnInit {


  @Input() type_certif;
  @Input() formContent;
  @Input() school;
  
  constructor() { }

  ngOnInit(): void {
  }

}
