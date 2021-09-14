import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../models/User';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-modifier-profil',
  templateUrl: './modifier-profil.component.html',
  styleUrls: ['./modifier-profil.component.css']
})
export class ModifierProfilComponent implements OnInit {
  userForm: FormGroup = new FormGroup({
    lastname: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÀ-ÖØ-öø-ÿ-]+$')]),//Lettre et espace
  });
  User : User;
  users: any = [];
  constructor(private AuthService:AuthService, private messageService: MessageService) { }


  ngOnInit(): void {

  
   }
  editUser(data) {
    this.userForm.patchValue({ lastname: data.lastname })
    this.User = data;
     }

     modifyuser(id) {
    let req = {
      id: this.User._id,
      lastname: this.userForm.value.lastname
    }
    this.AuthService.update(req).subscribe((data) => {
      // this.users.splice(this.users.indexOf(this.User), 1, data)
      this.users.tabUser.splice(this.users.tabUser.indexOf(this.users.selectedUser),1,data)
      this.userForm.reset();
      this.messageService.add({ severity: 'success', summary: 'Modification de user', detail: 'user a bien été modifié' });
    }, (error) => {
      console.log(error)
    });
    this.users.showForm = "Ajouter"
  }
  get lastname() { return this.userForm.get('lastname'); }

}
