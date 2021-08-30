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
    label:new FormControl('',[Validators.required])
  });
 
  emailExists: boolean;

services : any;
sujets : any;
currentService = null;
currentIndex = -1;
label = '';
cols: any[];
sujetList=[];
sujetShow=[];

allServices :any ;

  saveService(){   
    let service = <Service> {
      label:this.serviceForm.value.label
    };
 
    this.ServService.addService(service).subscribe((data)=>{
      this.messageService.add({severity:'success', summary:'Gestion de service/Service', detail:'Creation de service réussie'});
      this.services.push(data)
      
   //   console.log(this.allServices);
      this.serviceForm.reset();
    

    },(error)=>{
      if(error.status==400){
        //Bad Request (service deja existant)
        this.messageService.add({severity:'error', summary:'Message d\'inscription', detail:'Le nom de service est deja existant'});
        this.emailExists=true;
      }
      console.log(error)
    });
  }

  saveSujet(){   
    let sujet = <Sujet> {
      label:this.sujetForm.value.label,
      service_id:this.currentService._id
    };
 
    this.SujetService.addSujet(sujet).subscribe((data)=>{
      this.sujetShow.push(data)
      this.sujetList.push(data);
      this.messageService.add({severity:'success', summary:'Gestion de sujet', detail:'Creation de sujet réussie'});  
   //   console.log(this.allServices);
      this.sujetForm.reset();
    

    },(error)=>{
      if(error.status==400){
        //Bad Request (service deja existant)
        this.messageService.add({severity:'error', summary:'Message d\'inscription', detail:'Le nom du service est deja existant'});
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
  Sujets(){
    this.SujetService.getAll()
    .subscribe(
      data => {
        this.sujets = data;
        console.log(data);
      },
      error => {
        console.log(error);
      });
  }




  constructor(private ServService :ServService,
    private router: Router,
    private messageService: MessageService,
    private SujetService:SujetService) { }

  ngOnInit(): void {
    
    this.cols = [
      { field: 'label', header: 'Sujet' },
    
    ];
    this.SujetService.getAll().subscribe((data) => {
      if(!data.message){
        data.forEach(sujet => {
          this.sujetList.push(sujet);
        });
      }
    })
  
  
    this.Services();
  }

  editSujet(data){
    this.router.navigateByUrl("/sujet/edit",{state:data})
  }
  
  edit(data){
    this.router.navigateByUrl("/service/edit",{state:data})
  }
  deleteService(service): void{
    
  
    this.ServService.delete(service._id)
    .subscribe(
      response => {
        this.services.splice(this.services.indexOf(service), 1);
      },
      error => {
        console.log(error);
      });
    }

    
    deleteSujet(rowData): void{
  
      this.SujetService.delete(rowData._id)
      .subscribe(
        response => {
          this.sujetShow.splice(this.sujetShow.indexOf(rowData), 1);
          this.sujetList.splice(this.sujetList.indexOf(rowData), 1);
        },
        error => {
          console.log(error);
        });
      }
    
   
    onRowSelect($event){
      this.sujetShow=[]
      this.sujetList.forEach(sujet => {
        if(sujet.service_id==this.currentService._id){
          this.sujetShow.push(sujet)
        }
      });
    }

    onRowUnselect($event){
      this.currentService=null
    }
 

}
