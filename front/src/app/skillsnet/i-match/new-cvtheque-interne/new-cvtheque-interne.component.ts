import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-new-cvtheque-interne',
  templateUrl: './new-cvtheque-interne.component.html',
  styleUrls: ['./new-cvtheque-interne.component.scss']
})
export class NewCvthequeInterneComponent implements OnInit {
  users: any[] = [{ lastname: 'qsdqsdqd',firstname:'qsdqsdqsdq' }]
  constructor() { }

  ngOnInit(): void {
  }

}
