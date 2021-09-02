import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Service } from 'src/app/models/Service';
import { ServService} from 'src/app/services/service.service';
import {MessageService} from 'primeng/api';
import { SujetService } from 'src/app/services/sujet.service';
import { Sujet } from 'src/app/models/Sujet';

import { Message } from 'src/app/models/Message';
import { User } from 'src/app/models/User';
import { Test } from 'src/app/test';

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
  // test: Test;
  currentService = null;
  message = '';
  label = '';
  Service: Service;
  Sujet: Sujet;
  firstMessage: Message;
emailExists: boolean;
services : any;
sujets : any;
currentIndex = -1;
cols: any[];
sujetList=[];
sujetShow=[];
serviceList=[];
first = 0;
rows = 10;
currentSujet = null;
showForm: string = "Ajouter";
showwForm: string = "Ajouter";

  saveService(){   
    let service = <Service> {
      label:this.serviceForm.value.label
    };
 
    this.ServService.addService(service).subscribe((data)=>{
      this.messageService.add({severity:'success', summary:'Gestion de service/Service', detail:'Creation de service réussie'});
      this.services.push(data)
      this.serviceForm.reset();
    },(error)=>{
      if(error.status==400){
        //Bad Request (service deja existant)
       // this.messageService.add({severity:'error', summary:'Message d\'inscription', detail:'Le nom de service est deja existant'});
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
      //  this.messageService.add({severity:'error', summary:'Message d\'inscription', detail:'Le nom du sujet est deja existant'});
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
  //  this.test = new Test(12,"farah")
    this.Service = <Service>history.state;
    console.log(this.Service)
    // if (!this.Service._id) {
      // this.router.navigate(["/service"])
    // }
    // console.log(this.Service)
    // this.serviceForm.setValue({label:this.Service.label})

      this.Sujet = <Sujet>history.state;
      // if (!this.Sujet._id) {
      //   this.router.navigate(["/service"])
      // }
    
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
    document.getElementById('btnAccept2').style.display = 'none';  
    this.sujetForm.patchValue({label:data.label})
    this.Sujet=data;
   // this.router.navigateByUrl("/sujet",{state:data})
  }
 
  edit(data){
    // document.getElementById('form1').style.display = 'none'; 
    document.getElementById('btnAccept').style.display = 'none'; 
    this.serviceForm.patchValue({label:data.label})
    this.Service=data;
    // this.router.navigateByUrl("/service",{state:data})
  }


 
  // deleteService(service): void{
    
  
  //   this.ServService.delete(service._id)
  //   .subscribe(
  //     response => {
  //       this.services.splice(this.services.indexOf(service), 1);
  //     },
  //     error => {
  //       console.log(error);
  //     });
  //   }

    
    // deleteSujet(rowData): void{
  
    //   this.SujetService.delete(rowData._id)
    //   .subscribe(
    //     response => {
    //       this.sujetShow.splice(this.sujetShow.indexOf(rowData), 1);
    //       this.sujetList.splice(this.sujetList.indexOf(rowData), 1);
    //     },
    //     error => {
    //       console.log(error);
    //     });
    //   }   
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
    masquer_div2(id)
    {
      if (document.getElementById(id).style.display == 'none' )
      {      
           document.getElementById(id).style.display = 'block';
      }
      else 
      {    
     
        this.saveService();
          this.serviceForm.reset();
           document.getElementById(id).style.display = 'none';  
      }
    }

    div3(id)
    {
      if (document.getElementById(id).style.display == 'none' )
      {      

           document.getElementById(id).style.display = 'block';
           
      }
      else 
      {    
        document.getElementById('btnAccept').style.display = 'block'; 
        document.getElementById('btnAccept2').style.display = 'block'; 
            document.getElementById(id).style.display = 'none';  
      }
    }

    toggleForm() {
      if (this.showForm == "Ajouter") {
        this.showForm = "Enregister";
      } else {
        this.showForm= "Ajouter"
      }
  
    } 
    masquer_div(id)
    {
      if (document.getElementById(id).style.display == 'none' )
      {      
           document.getElementById(id).style.display = 'block';
      }
      else 
      {    
            this.saveSujet();
            // this.sujets.push((this.sujetForm.value))
              this.sujetForm.reset();
           document.getElementById(id).style.display = 'none';  
        
      }
    }

    toggleForm2() {
      if (this.showwForm == "Ajouter") {

        this.showwForm = "Enregister";
      } else {
        this.showwForm= "Ajouter"
      }
  
    } 
    modifyService(id) {
      let req = <Service>{
        id: this.Service._id,
        label: this.serviceForm.value.label
      }
      this.ServService.update(req).subscribe((data) => {
        this.services.splice(this.services.indexOf(this.Service),1,data)
        this.serviceForm.reset();
        document.getElementById('btnAccept').style.display = 'block';  
        this.messageService.add({ severity: 'success', summary: 'Modification du Service', detail: 'Modification réussie' });
        // this.router.navigate(['/service'])
      }, (error) => {
        console.log(error)
      });
    }
    modifySujet(){
      let req = <Sujet>{
        id:this.Sujet._id,
        label:this.sujetForm.value.label
      }
     
      this.SujetService.update(req).subscribe((data)=>{
        this.sujetShow.splice(this.sujetShow.indexOf(this.Sujet),1,data)
        this.sujetForm.reset();
        document.getElementById('btnAccept2').style.display = 'block'; 
        // console.log(data)
        // this.router.navigate(['/service'])
      },(error)=>{
        console.log(error)
      }); 
    }

   



}
