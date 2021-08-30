import { Component, OnInit } from '@angular/core';
import { ServService} from 'src/app/services/service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Service } from 'src/app/models/Service';
import { MessageService } from 'primeng/api';
import { Message } from 'src/app/models/Message';
import { SujetService } from 'src/app/services/sujet.service';
import { Sujet } from 'src/app/models/Sujet';

@Component({
  selector: 'app-edit-sujet',
  templateUrl: './edit-sujet.component.html',
  styleUrls: ['./edit-sujet.component.css']
})
export class EditSujetComponent implements OnInit {
currentSujet = null;
message = '';
label = '';
Sujet : Sujet;
firstMessage:Message;

sujetForm: FormGroup = new FormGroup({
  label: new FormControl('', Validators.required),
 
})

  constructor(private route: ActivatedRoute, private router: Router, private SujetService:SujetService) { }

  ngOnInit(): void {
    this.Sujet = <Sujet>history.state;
    if (!this.Sujet._id) {
      this.router.navigate(["/sujet/edit"])
      
    }
    console.log(this.Sujet)
    this.sujetForm.setValue({label:this.Sujet.label})
  }
  modifySujet(){
    let req = <Sujet>{
      id:this.Sujet._id,
      label:this.sujetForm.value.label
    }
    this.SujetService.update(req).subscribe((data)=>{
      console.log(data)
      this.router.navigate(['/service'])
    },(error)=>{
      console.log(error)
    });
    
  }

}
