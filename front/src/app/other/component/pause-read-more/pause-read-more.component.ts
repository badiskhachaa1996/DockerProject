import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pause-read-more',
  templateUrl: './pause-read-more.component.html',
  styleUrls: ['./pause-read-more.component.scss']
})
export class PauseReadMoreComponent implements OnInit {

  @Input() pauseList?: any[];
  seeAllString = false
  @Input() pausemin?: number = 0
  constructor() { }
  onClick() {
    this.seeAllString = !this.seeAllString
  }

  ngOnInit(): void {
  }

}
