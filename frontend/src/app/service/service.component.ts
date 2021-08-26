// import { Component, OnInit } from '@angular/core';
// import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { AuthService } from '../services/auth.service';

// @Component({
//   selector: 'app-service',
//   templateUrl: './service.component.html',
//   styleUrls: ['./service.component.css']
// })
// export class ServiceComponent implements OnInit {
//   Services = new FormGroup({
    
//     nom: new FormControl('',Validators.required),
  
//   })
//   allServices = []; 
//   constructor(private ts:AuthService) { }

//   ngOnInit(): void {
//    this.getServices();
//   }
//   getServices(){
//     this.allServices = this.ts.getServices();
//   }

//   masquer_div(id)
//   {
//     if (document.getElementById(id).style.display == 'none')
//     {
//          document.getElementById(id).style.display = 'block';
//     }
//     else
//     {
//       this.ts.createServices(this.Services.value);
//       this.allServices.push((this.Services.value));
//         this.Services.reset();
//          document.getElementById(id).style.display = 'none';  
//     }
//   }

// }
