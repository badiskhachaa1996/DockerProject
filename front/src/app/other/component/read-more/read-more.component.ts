import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-read-more',
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.scss']
})
export class ReadMoreComponent implements OnInit {
  @Input() string?: any;
  seeAllString = false
  @Input() size_max?: number = 20
  constructor() { }
  onClick() {
    this.seeAllString = !this.seeAllString
  }

  ngOnInit(): void {
    console.log(this.string)
    if (this.string)
      this.string = this.string.toString()
  }

}
