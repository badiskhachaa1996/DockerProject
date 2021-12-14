import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { AuthService } from '../services/auth.service';
import { NotesService } from '../services/notes.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  ID = this.route.snapshot.paramMap.get('id');
  notesList = [];
  userDic: any[] = [];
  examenDic: any[] = [];
  TYPE = this.route.snapshot.paramMap.get('type');
  token;

  constructor(private route: ActivatedRoute, private NotesService: NotesService, private router: Router, private AuthService: AuthService, private ExamenService: AuthService) { }

  ngOnInit(): void {
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    if (this.token == null) {
      this.router.navigate(["/login"])
    } else {
      this.AuthService.getAll().subscribe((data) => {
        if (!data.message) {
          data.forEach(user => {
            this.userDic[user._id] = user;
          });
        }
      })
      this.ExamenService.getAll().subscribe((data) => {
        if (!data.message) {
          data.forEach(exam => {
            this.examenDic[exam._id] = exam;
          });
        }
      })
      if (this.TYPE == "eleve") {
        this.NotesService.getAllByUserId(this.ID).subscribe((data) => {
          this.notesList = data;
        })
      } else if (this.TYPE == "examen") {
        this.NotesService.getAllByExamen(this.ID).subscribe((data) => {
          this.notesList = data;
        })
      } else {
        this.NotesService.getAll().subscribe((data) => {
          this.notesList = data;
        })
      }
    }
  }
}
