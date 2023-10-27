import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pause-read-more',
  templateUrl: './pause-read-more.component.html',
  styleUrls: ['./pause-read-more.component.scss']
})
export class PauseReadMoreComponent implements OnInit {

  @Input() pauseList?: any[];
  seeAllString = false
  pause_timing = 0
  @Input() pausemin?: number = 0
  constructor() { }
  onClick() {
    this.seeAllString = !this.seeAllString
  }

  ngOnInit(): void {
    if (!this.pausemin)
      this.pausemin = 0
    if (this.pauseList && this.pauseList.length != 0) {
      let t = 0
      this.pauseList.forEach(p => {
        t = t + (new Date(p.out).getTime() - new Date(p.in).getTime())
      })
      this.pause_timing = t / 60000
      if (!this.pausemin || this.pausemin == 0)
        this.pausemin = this.pause_timing
    }
    console.log(this.pauseList, this.pausemin)

  }

}
