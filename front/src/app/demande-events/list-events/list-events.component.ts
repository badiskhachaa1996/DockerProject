import { Component, OnInit } from '@angular/core';
import { Demande_events } from '../../models/Demande_events';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DemandeEventsService } from '../../services/demande-events.service';
import { sourceForm } from 'src/app/models/sourceForm';

@Component({
  selector: 'app-list-events',
  templateUrl: './list-events.component.html',
  styleUrls: ['./list-events.component.scss']
})
export class ListEventsComponent implements OnInit {

  events : sourceForm[] = [];

  constructor(private formBuilder: FormBuilder, private dEventService:DemandeEventsService,
    private messageService:MessageService) { }

  ngOnInit(): void {
    this.dEventService.getAll().subscribe(
      (response) => {
        this.events = response;
      }
    )
  }

}
