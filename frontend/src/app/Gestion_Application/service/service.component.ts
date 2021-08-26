import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Service } from 'src/app/models/Service';
import { ServService} from 'src/app/services/service.service';
import {MessageService} from 'primeng/api';
@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  serviceForm: FormGroup= new FormGroup({
    label:new FormControl('',[Validators.required]),
  });
  
 
  emailExists: boolean;

  saveService(){
    let service = <Service> {
      label:this.serviceForm.value.label
    };
    this.serv.addService(service).subscribe((data)=>{
      this.messageService.add({severity:'success', summary:'Gestion de service/Sujet', detail:'Creation de service réussie'});
      this.router.navigate(['/service'])
    },(error)=>{
      if(error.status==400){
        //Bad Request (service deja existant)
        this.messageService.add({severity:'error', summary:'Message d\'inscription', detail:'Le nom de service est deja existant'});
        this.emailExists=true;
      }
      console.log(error)
    });
    
  }


  constructor(private serv :ServService,private router: Router,private messageService: MessageService) { }

  ngOnInit(): void {
  }

}
