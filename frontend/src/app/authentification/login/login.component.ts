import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  LoginForm: FormGroup= new FormGroup({
    email:new FormControl('',[Validators.required,Validators.email]),
    password:new FormControl('',[Validators.required,Validators.minLength(5)])
  })

  login(){
    //Connexion
    const ListUser=environment.listUser;
    ListUser.forEach(user => {
      let json = JSON.parse(user)
      if(json.email == this.LoginForm.value.email && json.password == this.LoginForm.value.password){
        //authentified
        environment.User=JSON.stringify(json)
        this.router.navigate(['/listUser']);
      }
    });
  }

  get email() { return this.LoginForm.get('email'); }
  get password() { return this.LoginForm.get('password'); }

  ngOnInit(): void {
  }

}
