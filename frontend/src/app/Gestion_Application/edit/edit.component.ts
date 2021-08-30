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
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
currentService = null;
message = '';
label = '';
Service : Service;
firstMessage:Message;

serviceForm: FormGroup = new FormGroup({
  label: new FormControl('', Validators.required),
 
})
  messageService: any;


  constructor(private ServService :ServService,private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // this.message = '';
    this.Service = <Service>history.state;
    if (!this.Service._id) {
      this.router.navigate(["/service/edit"])
      
    }
    this.serviceForm.setValue({label:this.Service.label})

  }
  modifyService(){
    let req = {
      id:this.Service._id,
      id_message:this.firstMessage._id,
    }
    this.ServService.updateNew(req).subscribe((data)=>{
   this.messageService.add({severity:'success', summary:'Modification du Service', detail:'Modification réussie'});
      this.router.navigate(['/service'])
    },(error)=>{
      console.log(error)
    });
    
  }

  

}
