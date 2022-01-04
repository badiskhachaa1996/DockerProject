import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Diplome } from '../models/Diplome';
import { Inscription } from '../models/Inscription';
import { User } from '../models/User';
import { DiplomeService } from '../services/diplome.service';
import { FirstInscriptionService } from '../services/first-inscription.service';

@Component({
  selector: 'app-first-inscription',
  templateUrl: './first-inscription.component.html',
  styleUrls: ['./first-inscription.component.css']
})
export class FirstInscriptionComponent implements OnInit {

  
  inscriptions: Inscription[] = [];
  diplomes : Diplome[]=[];
  formAddNewInscription: FormGroup = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    emailperso: new FormControl('', [Validators.required]),
    diplomeID: new FormControl(''),
  });
  showAddNewInscription: boolean = true;

  showFormAddnewInscription: boolean = false;

  idInscriptionToUpdate: string;
  users: User[] = [];

  constructor(private diplomeService : DiplomeService,private fInscriptionService: FirstInscriptionService, private formBuilder: FormBuilder, private messageService: MessageService, private router: Router) { }

  ngOnInit(): void {

    this.fInscriptionService.getAll().subscribe(
      (data) => { this.inscriptions = data;
      console.log(this.inscriptions) },
      (error) => { console.log(error) }
    );

    this.diplomeService.getAll().subscribe(
      (diplomeData)=>{this.diplomes=diplomeData
      console.log(this.diplomes)},
      (error) => { console.log(error)}
    );
  
      }
      toggleFormfInscriptionAdd(){

        this.showFormAddnewInscription=!this.showFormAddnewInscription;
      }

      createfInscription(){
        console.log(this.formAddNewInscription.value.diplomeID._id)
        let fInscription= new Inscription(null,null,this.formAddNewInscription.value.diplomeID._id,"statut_test")
        let newUser = new User(null,this.formAddNewInscription.value.firstname,this.formAddNewInscription.value.lastname,null,null,this.formAddNewInscription.value.emailperso,"user",null,null,null,null,null,null,null,null,null,null,null,null)
        console.log(this.formAddNewInscription.value.firstname)
        this.fInscriptionService.create({ 'newUser': newUser, 'fInscription': fInscription }).subscribe((data) => {
          this.messageService.add({ severity: 'success', summary: 'Gestion des Inscriptions', detail: 'Une nouvelle inscription a été ajouté avec Un nouvel utilisateur' });
          this.inscriptions.push(data)
          this.showFormAddnewInscription=false;
          this.formAddNewInscription.reset();
        }, (error) => {
          console.error(error)
        });
      
  
        
      }

}
