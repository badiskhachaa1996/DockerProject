import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LeadCRM } from 'src/app/models/LeadCRM';
import jwt_decode from "jwt-decode";
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-crm-list',
  templateUrl: './crm-list.component.html',
  styleUrls: ['./crm-list.component.scss']
})
export class CrmListComponent implements OnInit {
  leadList: LeadCRM[] = []
  base_idx = -3
  selectedTabIndex = 1
  eventsSubject: Subject<LeadCRM> = new Subject<LeadCRM>();
  eventsLead: Subject<LeadCRM> = new Subject<LeadCRM>();
  constructor(private UserService: AuthService) { }
  suivreLead(event: LeadCRM) {
    let ids = []
    this.leadList.forEach(l => {
      ids.push(l._id)
    })
    if (!ids.includes(event._id)) {
      this.leadList.push(event)
      setTimeout(() => {
        this.selectedTabIndex = -1 + (this.base_idx * -1) + this.leadList.length
      }, 5)
      this.UserService.update({ savedLeadCRM: this.leadList, _id: this.token.id }).subscribe((u: User) => {

      })
    }
  }
  newLead(event: LeadCRM) {
    this.eventsSubject.next(event);
  }
  token;
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.UserService.getPopulate(this.token.id).subscribe((u: User) => {
      this.leadList = u.savedLeadCRM
    })
  }

  onTabClose(event) {
    if (event.index > 2) {
      this.leadList.splice(this.base_idx + event.index, 1)
      this.UserService.update({ savedLeadCRM: this.leadList, _id: this.token.id }).subscribe((u: User) => {
      })
    }

  }
  autoLead(value:LeadCRM){
    this.eventsLead.next(value)

  }

}
