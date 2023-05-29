import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { LeadCRM } from 'src/app/models/LeadCRM';
import { LeadcrmService } from 'src/app/services/crm/leadcrm.service';

@Component({
  selector: 'app-list-leadcrm',
  templateUrl: './list-leadcrm.component.html',
  styleUrls: ['./list-leadcrm.component.scss']
})
export class ListLeadcrmComponent implements OnInit {

  constructor(private LCS: LeadcrmService, private ToastService: MessageService) { }
  cols = [
    'table'
  ]
  leads: LeadCRM[] = []
  ngOnInit(): void {
    this.LCS.getAll().subscribe(data => {
      this.leads = data
      if (data[0])
        this.cols = Object.keys(data[0])
    })
  }

}
