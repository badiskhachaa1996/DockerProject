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
    label:new FormControl('',[Validators.required]),
    service_id:new FormControl('',[Validators.required]),
  });
 
  emailExists: boolean;

services : any;
currentService = null;
currentIndex = -1;
label = '';
cols: any[];

allServices :any ;

  saveService(){   
    let service = <Service> {
      label:this.serviceForm.value.label,
      service_id:this.serviceForm.value.service_id
    };
 
    this.ServService.addService(service).subscribe((data)=>{
      this.messageService.add({severity:'success', summary:'Gestion de service/Service', detail:'Creation de service réussie'});  
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
      service_id:this.sujetForm.value.service_id  
    };
    this.sujet.addSujet(sujet).subscribe((data)=>{
      this.messageService.add({severity:'success', summary:'Gestion de service/Sujet', detail:'Creation de sujet réussie'});
      this.sujetForm.reset();
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




  constructor(private ServService :ServService,
    private sujet: SujetService,private router: Router,
    private messageService: MessageService,
    private ts:SujetService) { }

  ngOnInit(): void {
    
    this.cols = [
      { field: 'label', header: 'Service' },
    

    ];
  
    this.Services();
  }
  
  edit(data){
    this.router.navigateByUrl("/service/edit",{state:data})
  }
  deleteService(): void{
  
    this.ServService.delete(this.currentService._id)
    .subscribe(
      response => {
        console.log(response);
        this.router.navigate(['/service']);
      },
      error => {
        console.log(error);
      });
    }
    
   
  
 

}
