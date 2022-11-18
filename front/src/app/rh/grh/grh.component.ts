import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InTime } from 'src/app/models/InTime';
import { IntimeService } from 'src/app/services/intime.service';

@Component({
  selector: 'app-grh',
  templateUrl: './grh.component.html',
  styleUrls: ['./grh.component.scss']
})
export class GrhComponent implements OnInit {

  showSelectDateForm: boolean = false;
  selectDateForm: FormGroup;

  showPresenceList: boolean = false;
  presences: InTime[] = [];

  constructor(private formBuilder: FormBuilder, private inTimeService: IntimeService,) { }

  ngOnInit(): void {

    
  }

}