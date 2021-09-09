import { Component, OnInit } from '@angular/core';
import {  NotificationService} from 'src/app/services/notification.service';
import { CarserviceService } from '../services/carservice.service';
import { Car } from '../models/car';
import { MenuItem } from 'primeng/api';
import { BreadcrumbService } from '../services/breadcrumb.service';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
 

  notifications: any = [];
  constructor(private NotificationService:NotificationService) { }

  ngOnInit(): void {
    this.NotificationService.getAll()
    .subscribe(
      data => {
        this.notifications = data;
      },
      error => {
        console.log(error);
      });
  }

    //   deleteNotification(notification): void{
    
  
    // this.NotificationService.delete(notification._id)
    // .subscribe(
    //   response => {
    //     this.notifications.splice(this.notifications.indexOf(notification), 1);
    //   },
    //   error => {
    //     console.log(error);
    //   });
    // }
/////////////////////////////////text:::::::::::::::::::::




}
