import { Component, OnInit } from '@angular/core';
import { EtudiantService } from 'src/app/services/etudiant.service';
import jwt_decode from "jwt-decode";
@Component({
  selector: 'app-pov-formateur',
  templateUrl: './pov-formateur.component.html',
  styleUrls: ['./pov-formateur.component.scss']
})
export class PovFormateurComponent implements OnInit {

  etudiants = []
  token;
  constructor(private EtudiantService: EtudiantService) { }

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    if (this.token)
      this.EtudiantService.getAllByFormateur(this.token.id).subscribe(etudiants => {
        this.etudiants = etudiants
      })
  }

}
