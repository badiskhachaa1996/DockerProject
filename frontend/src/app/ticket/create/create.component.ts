import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  emailExists=false;

  TicketForm: FormGroup= new FormGroup({
    description:new FormControl('',Validators.required)
  })

  saveUser(){
    //Enregistrement de l'user
    //environment.listUser.push(JSON.stringify(this.RegisterForm.value))
    let user = <any>{

    }
    this.TicketService.create(user).subscribe((data)=>{
      this.messageService.add({severity:'success', summary:'Message d\'inscription', detail:'Inscription réussie'});
      this.router.navigate(['/login'])
    },(error)=>{
      if(error.status==400){
        //Bad Request (Email déjà utilisé)
        this.messageService.add({severity:'error', summary:'Message d\'inscription', detail:'Email déjà utilisé'});
        this.emailExists=true;
      }
      console.log(error)
    });
    
  }

  get description() { return this.TicketForm.get('description'); }

  constructor(private router: Router,private TicketService:TicketService,private messageService: MessageService) { }

  ngOnInit(): void {
  }

}
