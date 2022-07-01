import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdmissionService } from 'src/app/services/admission.service';

@Component({
  selector: 'app-validation-email',
  templateUrl: './validation-email.component.html',
  styleUrls: ['./validation-email.component.scss']
})
export class ValidationEmailComponent implements OnInit {

  
EmailToValidate : string=this.route.snapshot.paramMap.get('mail');

compteStatut:boolean=false;

  constructor(private router: Router, private admissionService: AdmissionService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.admissionService.ValidateEmail(this.EmailToValidate).subscribe((result)=>{
      this.compteStatut=true;
    })
   
   
  }

}
