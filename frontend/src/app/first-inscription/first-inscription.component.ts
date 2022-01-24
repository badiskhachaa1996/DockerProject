import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Diplome } from '../models/Diplome';
import { Inscription } from '../models/Inscription';
import { User } from '../models/User';
import { DiplomeService } from '../services/diplome.service';
import { FirstInscriptionService } from '../services/first-inscription.service';
import { AuthService } from '../services/auth.service';
import  jwt_decode from 'jwt-decode';
import {DialogModule} from 'primeng/dialog';
import {FileUpload, FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';


@Component({
  selector: 'app-first-inscription',
  templateUrl: './first-inscription.component.html',
  styleUrls: ['./first-inscription.component.css']
})
export class FirstInscriptionComponent implements OnInit {

  display: boolean = false;

 
  @ViewChild('fileInput') fileInput: FileUpload;
  inscriptions: Inscription[] = [];
  diplomes: Diplome[] = [];
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
  Selectedinscription: Inscription;
  userSelected: User;
  userDic:any= {};
  diplomeDic:any={};
  uploadedFile: File=null;
  reader: any;

  constructor(private diplomeService: DiplomeService, private fInscriptionService: FirstInscriptionService, private formBuilder: FormBuilder, private messageService: MessageService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {

    this.fInscriptionService.getAll().subscribe(
      (data) => {
        this.inscriptions = data;
        console.log(this.inscriptions)

      },
      (error) => { console.log(error) }
    );
    this.authService.getAll().subscribe((data) => {

      if (!data.message) {

        data.forEach(user => {

          this.userDic[user._id] = user;
        });
      }
    })
    this.diplomeService.getAll().subscribe(
      (diplomeData) => {
        this.diplomes = diplomeData
        console.log(this.diplomes)
        diplomeData.forEach(diplome =>{
          this.diplomeDic[diplome._id] = diplome;
        })
      },
      (error) => { console.log(error) }
    );

  }
  toggleFormfInscriptionAdd() {

    this.showFormAddnewInscription = !this.showFormAddnewInscription;
  }

  createfInscription() {
    console.log(this.formAddNewInscription.value.diplomeID._id)
    let fInscription = new Inscription(null, null, this.formAddNewInscription.value.diplomeID._id, "préinscription")
    let newUser = new User(null, this.formAddNewInscription.value.firstname, this.formAddNewInscription.value.lastname, null, null, this.formAddNewInscription.value.emailperso, "user", null, null, null, null, null, null, null, null, null, null, null, null)
  
    this.fInscriptionService.create({ 'newUser': newUser, 'fInscription': fInscription }).subscribe((data) => {
      
 
      this.inscriptions.push(data)
      this.messageService.add({ severity: 'success', summary: 'Gestion des Inscriptions', detail: 'Une nouvelle inscription a été ajouté avec Un nouvel utilisateur' });
      this.showFormAddnewInscription = false;
      this.formAddNewInscription.reset();
    }, (error) => {
      console.error(error)
    });

  }

  onRowSelect() {
  
    console.log(this.Selectedinscription.user_id)
this.authService.getById(this.Selectedinscription.user_id).subscribe(
  (userdata) => {

    
    this.userSelected = jwt_decode(userdata.userToken)["userFromDb"];
    console.log(this.userSelected)
    
  }, (error) => { console.log(error) }
  );
    
  }
 showDialog(user) {
      this.authService.getById(user.user_id).subscribe(
        (userdata) => {
          this.userSelected = jwt_decode(userdata.userToken)["userFromDb"];
          console.log(this.userSelected)
          
        }, (error) => { console.log(error) }
        );
        this.display = true;
  }


  FileUpload(event){
 console.log(event.files)
 const formData = new FormData();

   formData.append('file', event.files[0])
   formData.append('id', this.Selectedinscription._id)
    console.log(formData)

  this.fInscriptionService.uploadFile(formData).subscribe(res =>{
      console.log(res)
      this.messageService.add({ severity: 'success', summary: 'Fichier upload', detail: ' avec succès' });
   });
  event.target=null;
  }



}