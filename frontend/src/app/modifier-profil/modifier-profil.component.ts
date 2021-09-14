import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../models/User';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { ListUserComponent } from '../authentification/list-user/list-user.component';
@Component({
  selector: 'app-modifier-profil',
  templateUrl: './modifier-profil.component.html',
  styleUrls: ['./modifier-profil.component.css']
})
export class ModifierProfilComponent implements OnInit {
  userupdate?: User ;
  userForm: FormGroup = new FormGroup({
    lastname: new FormControl('', Validators.required),
  });
  currentRoot: String = this.router.url;
  IsAdmin: boolean = false;
  showForm: boolean = true;
  User : User;
  users: any = [];
  
  get lastname() { return this.userForm.get('lastname'); }
  constructor(private AuthService:AuthService, private messageService: MessageService,private router: Router) { }
 

  ngOnInit(): void {
    // console.log( jwt_decode(localStorage.getItem('token')).id);
    // let id_connected =jwt_decode(localStorage.getItem('token')).id;
    //  this.AuthService.getById(id_connected).subscribe((data) => {
    //   this.userupdate=data
     
    //   this.userForm.setValue({lastname: data.lastname })
    


    //  }, (err) => console.log(err) )
    //  if (!this.User._id) {
    //    this.router.navigate(["/listUser/modification"])
    //  }
    
  


   }


     modifyuser(id) {
    let req = {
      id: this.User._id,
      lastname: this.userForm.value.lastname
    }
    this.AuthService.update(req).subscribe((data) => {
      this.users.splice(this.users.indexOf(this.User), 1, data)
      // this.users.tabUser.splice(this.users.tabUser.indexOf(this.users.selectedUser),1,data)
      this.userForm.reset();
      this.messageService.add({ severity: 'success', summary: 'Modification de user', detail: 'user a bien été modifié' });

    }, (error) => {
      console.log(error)
    });
  
  }
  

}
