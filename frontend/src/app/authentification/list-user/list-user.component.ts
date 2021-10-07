import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ServService } from 'src/app/services/service.service';
import { LazyLoadEvent, SortEvent } from 'primeng/api';
import { User } from 'src/app/models/User';
import jwt_decode from "jwt-decode";
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

import { Service } from 'src/app/models/Service';
@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {

  userupdate: any = [];
  items: MenuItem[];
  tabUser = [];

  datasource: User[];
  cols: any[];

  totalRecords: number;
  public showFormAdd: boolean = false;
  public showFormModify: boolean = false;
  add: boolean = true;

  serviceDic: Service[] = [];
  dropdownService: any[] = [{ label: "Tous les services", value: null }];
  filterRole: any[] = [
    { label: "Tous les roles", value: null },
    { label: "Admin", value: "Admin" },
    { label: "Reponsable", value: "Responsable" },
    { label: "Agent", value: "Agent" }
  ]
  loading: boolean;

  selectedUser: User;
  formtype: string = "edit";
  genderMap: any = { 'Monsieur': 'Mr.', 'Madame': 'Mme.', undefined: '', 'other': 'Mel.' };
  constructor(private AuthService: AuthService, private router: Router, private ServService: ServService) { }

  ngOnInit(): void {
    let token = null
    try {
      token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      token = null
      console.error(e)
    }
    if (token == null) {
      this.router.navigate(["/login"])
    } else if (token["role"] != "Admin") {
      this.router.navigate(["/ticket/suivi"])
    }
    this.AuthService.getAllAgent().subscribe((users) => {
      this.tabUser = users;
    })
    this.ServService.getAll().subscribe((services) => {
      services.forEach(serv => {
        this.dropdownService.push({ label: serv.label, value: serv._id })
        this.serviceDic[serv._id] = serv;
      });
    })
    this.loading = true;
  }

  toggleFormAdd() {
    this.showFormAdd = true;
    this.showFormModify = false;
    this.scrollToTop();
  }
  toggleFormUpdate() {
    this.showFormModify = true
    this.showFormAdd = false
    this.scrollToTop();
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
    this.selectedUser = rowData;
    this.showFormModify = false;
    setTimeout(() => { this.toggleFormUpdate() }, 1)
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      if (event.field == "service") {
        value1 = (this.serviceDic[data1.service_id] == undefined) ? null : this.serviceDic[data1.service_id].label
        value2 = (this.serviceDic[data2.service_id] == undefined) ? null : this.serviceDic[data2.service_id].label
      }
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      return (event.order * result);
    });
  }

  scrollToTop(){
    var scrollDuration = 250;
    var scrollStep = -window.scrollY / (scrollDuration / 15);
        
    var scrollInterval = setInterval(function(){  
      if (window.scrollY > 120) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval); 
      }
    },15);	
  }
}

