import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-remboursement',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactRemboursementComponent implements OnInit {
  @Input() demande
  contacts = [
    {
      tel:'telephone',
      email:'@gmail.com'
    }
  ]
  constructor() { }

  ngOnInit(): void {
    if(this.demande && this.demande.student){
    this.contacts[0].tel=  ('+')+ this.demande.student.indicatif_phone +(' ') + this.demande?.student.phone
    this.contacts[0].email=this.demande?.student.email
  }
}

}
