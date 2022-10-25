import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import jwt_decode from "jwt-decode";
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-gestion-equipe',
  templateUrl: './gestion-equipe.component.html',
  styleUrls: ['./gestion-equipe.component.scss']
})
export class GestionEquipeComponent implements OnInit {

  commercials: User[] = [];
  commercialAvailable: User[] = [];
  responsable: User[] = [];
  showFormAddEquipe: Boolean = false
  showFormModifEquipe: Boolean = false
  token: any;
  formAddEquipe: FormGroup = this.formBuilder.group({
    owner_id: ['', [Validators.required]],
    team_id: ['', [Validators.required]]
  })

  constructor(private formBuilder: FormBuilder, private UserService: AuthService) { }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    /*this.team.getAllCommercialFromTeam(this.token.id).subscribe(d => {
      this.commercials = d
    })*/
    this.UserService.getAllCommercialV2().subscribe(u => {
      u.forEach(user => {
        if (user.role == "Responsable")
          this.responsable.push(user)
        else if (user.role == "Agent")
          this.commercialAvailable.push(user)
      })
    })
  }

  seeConseilled(rowData: User) {
    console.log("WIP 1")
  }

  deleteFromTeam(rowData: User) {
    console.log("WIP 2")
  }

}
