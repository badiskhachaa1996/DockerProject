import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ServService } from 'src/app/services/service.service';
import { environment } from 'src/environments/environment';
import { CardModule } from 'primeng/card';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { User } from 'src/app/models/User';
import { UpdateUserComponent } from 'src/app/authentification/update/update.component';
import jwt_decode from "jwt-decode";
import { MenuItem } from 'primeng/api';
import { Router, RouterLink } from '@angular/router';
import { RowToggler } from 'primeng/table';
import { parse } from 'querystring';

import { AccordionModule } from 'primeng/accordion';
import { Service } from 'src/app/models/Service';
@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {

  userupdate:any=[]; 
  items: MenuItem[];
  tabUser = [];

  datasource: User[];
  cols: any[];

  totalRecords: number;
  showFormAdd : boolean =false;
  add : boolean =true;

  serviceDic: Service[]= [];

 public showForm: string = "Ajouter";
  loading: boolean;
 
  selectedUser: User;
  formtype: string = "edit";
  genderMap: any = {'Monsieur': 'Mr.', 'Madame': 'Mme.',undefined:'', 'other': 'Mel.'};
  constructor(private AuthService: AuthService, private router: Router, private ServService:ServService) { }

  ngOnInit(): void {

    

    let token =null
    try{
      token = jwt_decode(localStorage.getItem("token"))
    }catch(e){
      token =null
      console.error(e)
    }
    if (token == null) {
      this.router.navigate(["/login"])
    } else if (token["role"].includes("admin")) {
      
    } else if (token["role"]!="Admin") {
      this.router.navigate(["/ticket/suivi"])
    }

    this.AuthService.getAllAgent().subscribe((users) => {
      this.tabUser = users;
    })

    this.ServService.getAll().subscribe((services)=>{
      services.forEach(serv => {
        this.serviceDic[serv._id]=serv;
      });
    })


    this.loading = true;
  }



  toggleForm() {
    if (this.showForm == "Ajouter") {
      this.formtype = "new";
      this.showForm = "Fermer";
      this.add=!this.add;
    } else {
      this.formtype = "new";
      this.showForm = "Ajouter";
      this.add=this.add;

    }

  }
  toggleType() {
    if (this.formtype == "new") {
      this.formtype = "edit";
      this.showForm = "Fermer";
    } else {
      this.formtype = "edit";
      this.formtype = "edit";

      this.showForm = "Fermer";
    }

  }

  toggleAdd(){
    this.showFormAdd=!this.showFormAdd;
  }

  loadUsersLazy(event: LazyLoadEvent) {
    this.loading = true;


    setTimeout(() => {
      if (this.tabUser) {
        this.tabUser = this.tabUser.slice(event.first, (event.first + event.rows));
        this.loading = true;
      }
    }, 1000);
  }
  modify(rowData: User) {
    console.log(rowData)
    this.selectedUser = rowData;
    this.toggleType()
  }
}

