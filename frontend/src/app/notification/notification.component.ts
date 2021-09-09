import { Component, OnInit } from '@angular/core';
import {  NotificationService} from 'src/app/services/notification.service';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
 

  notifications: any = [];
  constructor(private NotificationService:NotificationService) { }
  // "Nouveau Ticket Affecté" "Modification d'un ticket" "Nouveau Message" "Traitement de votre ticket" "Revert d'un ticket"

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

}
