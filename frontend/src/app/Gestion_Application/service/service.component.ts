import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Service } from 'src/app/models/Service';
import { ServService} from 'src/app/services/service.service';
import {MessageService} from 'primeng/api';
import { SujetService } from 'src/app/services/sujet.service';
import { Sujet } from 'src/app/models/Sujet';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  serviceForm: FormGroup= new FormGroup({
    label:new FormControl('',[Validators.required]),
  });
  sujetForm: FormGroup= new FormGroup({
    nom:new FormControl('',[Validators.required]),
  });
  
  idserv:string =  "612760a38655f1b1a8ca979a";
 
  emailExists: boolean;

//  tabserv: any[] = [];
//   cols: any[];

//   get label() { return this.serviceForm.get('label'); }
//   get nom() { return this.sujetForm.get('nom'); }
services : any;
currentService = null;
currentIndex = -1;
label = '';

allServices :any[]
  saveService(){   
    let service = <Service> {
      label:this.serviceForm.value.label
    };
 
    this.ServService.addService(service).subscribe((data)=>{
      this.messageService.add({severity:'success', summary:'Gestion de service/Service', detail:'Creation de service réussie'});
     
      console.log(this.allServices);
      this.serviceForm.reset();
      this.router.navigate(['/servicesujet'])

    },(error)=>{
      if(error.status==400){
        //Bad Request (service deja existant)
        this.messageService.add({severity:'error', summary:'Message d\'inscription', detail:'Le nom de service est deja existant'});
        this.emailExists=true;
      }
      console.log(error)
    });
  }

  saveSujet(Service){
    let sujet = <Sujet> {
      label:this.sujetForm.value.label,    
    };
    this.sujet.addSujet(sujet).subscribe((data)=>{
      this.messageService.add({severity:'success', summary:'Gestion de service/Sujet', detail:'Creation de sujet réussie'});
      this.sujetForm.reset();
      this.router.navigate(['/servicesujet'])
    },(error)=>{
      if(error.status==400){
        //Bad Request (service deja existant)
        this.messageService.add({severity:'error', summary:'Message d\'inscription', detail:'Le nom du sujet est deja existant'});
        this.emailExists=true;
      }
      console.log(error)
    });
    
  }
  Services(){
    this.ServService.getAll()
    .subscribe(
      data => {
        this.services = data;
        console.log(data);
      },
      error => {
        console.log(error);
      });
  }
  // refrechList(): void{
  //     this.Services();
  //     this.currentService = null;
  //     this.currentIndex = -8;
  // }
  SetActiveServices(service, index): void{
      this.currentService = service;
      this.currentIndex = index;
  }



  constructor(private ServService :ServService,private sujet: SujetService,private router: Router,private messageService: MessageService,private ts:SujetService) { }

  ngOnInit(): void {
    
  //  this.ServService.getAll().subscribe((data) => {
  //      this.allServices.push(JSON.parse(data));
  //      console.log(this.allServices);
  //    })
  this.Services();
  }
  

   
  
 

}
