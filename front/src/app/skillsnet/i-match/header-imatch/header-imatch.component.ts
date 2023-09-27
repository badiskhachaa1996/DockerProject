import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-imatch',
  templateUrl: './header-imatch.component.html',
  styleUrls: ['./header-imatch.component.scss']
})
export class HeaderImatchComponent implements OnInit {


  @Input() portail;

  constructor() { }

  ngOnInit(): void {
  }

}
