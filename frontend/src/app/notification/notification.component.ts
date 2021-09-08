import { Component, OnInit } from '@angular/core';
import {  NotificationService} from 'src/app/services/notification.service';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
 

  notifications: any = [];
  constructor(private NotificationService:NotificationService) { }

  ngOnInit(): void {
  }

  Notification() {
    this.NotificationService.getAll()
      .subscribe(
        data => {
          this.notifications = data;
        },
        error => {
          console.log(error);
        });
  }

}
