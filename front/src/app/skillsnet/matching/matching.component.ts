import { Component, OnInit } from '@angular/core';
import jwt_decode from "jwt-decode";

import { MessageService } from 'primeng/api';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { Entreprise } from 'src/app/models/Entreprise';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TuteurService } from 'src/app/services/tuteur.service';
import { Tuteur } from 'src/app/models/Tuteur';

@Component({
  selector: 'app-matching',
  templateUrl: './matching.component.html',
  styleUrls: ['./matching.component.scss']
})
export class MatchingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
}
