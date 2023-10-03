import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-read-more',
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.scss']
})
export class ReadMoreComponent implements OnInit {
  @Input() string?: String;
  seeAllString = false
  constructor() { }
  onClick() {
    this.seeAllString = !this.seeAllString
  }

  ngOnInit(): void {
  }

}
