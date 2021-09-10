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

 public showForm: string = "Ajouter";
  loading: boolean;
 
  selectedUser: User;
  formtype: string = "edit";
  constructor(private AuthService: AuthService, private router: Router) { }

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
      
    } else if (token["role"].includes("user") || token["role"]=="Agent") {
      this.router.navigate(["/ticket/suivi"])
    }

   
    this.AuthService.getAllAgent().subscribe((data) => {
      this.tabUser = data;
      this.totalRecords = this.tabUser.length;
    })

    this.cols = [
      
      { field: 'role', header: 'Role' },
      { field: 'lastname', header: 'Nom' },
      { field: 'firstname', header: 'Prenom' },
      { field: 'email', header: 'Email' },
      { field: 'phone', header: 'Téléphone' },
      { field: 'adresse', header: 'Adresse' },
      { field:"civilite",header:"Civilité"},
      { field: 'action', header: "Action" }
    ];
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

