import { Component, OnInit } from '@angular/core';
import { ServService} from 'src/app/services/service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Service } from 'src/app/models/Service';
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

serviceForm: FormGroup = new FormGroup({
  label: new FormControl('', Validators.required),
 
})

  constructor(private ServService :ServService,private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.message = '';
  // this.getService(this.route.snapshot.paramMap.get('id'));
  // this.Service = <Service>history.state;
  // if (!this.Service.id) {
  //   this.router.navigate(["/"])
  // }
  // this.Service.getAll().subscribe((data) => {
  //   this.Service = data;
  //   data.forEach(service => {
  //     this.Service[service._id] = [];
  //   });
  // }, (error) => {
  //   console.log(error)
  // })
  }
  // getService(id): void{
  //   this.ServService.getAServiceByid(id)
  //   .subscribe(
  //     data => {
  //       this.currentService = data;
  //       console.log(data);
  //     },
  //     error =>{
  //         console.log(error);
  //     });
  // }

  // updateService(): void {
  //   this.ServService.update(this.currentService.id )
  //   .subscribe(
  //     response => {
  //       console.log(response);
  //       this.message = 'le service a été bien modifier';
  //     },
  //     error => {
  //       console.log(error);
  //     });
  // }

}
