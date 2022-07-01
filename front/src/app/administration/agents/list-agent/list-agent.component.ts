import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadEvent, MenuItem, MessageService, SortEvent } from 'primeng/api';
import { Service } from 'src/app/models/Service';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { CampusService } from 'src/app/services/campus.service';
import { ClasseService } from 'src/app/services/classe.service';
import { DiplomeService } from 'src/app/services/diplome.service';
import { EntrepriseService } from 'src/app/services/entreprise.service';
import { HistoriqueService } from 'src/app/services/historique.service';
import { ServService } from 'src/app/services/service.service';
import jwt_decode from "jwt-decode";
import { EtudiantService } from 'src/app/services/etudiant.service';

@Component({
  selector: 'app-list-agent',
  templateUrl: './list-agent.component.html',
  styleUrls: ['./list-agent.component.scss']
})
export class ListAgentComponent implements OnInit {
  userupdate: any = [];
  items: MenuItem[];
  tabUser = [];
  filterRole = [{ label: "Tous les roles", value: null }, { label: "Agent", value: "Agent" }, { label: "Responsable", value: "Responsable" }, { label: "Admin", value: "Admin" }]

  datasource: User[];
  cols: any[];

  totalRecords: number;
  public showFormAdd: boolean = false;
  public showFormModify: boolean = false;
  add: boolean = true;

  serviceDic: Service[] = [];
  dropdownService: any[] = [{ label: "Tous les services", value: null }];
  loading: boolean;
  etudiantDic = []
  classeDic = []
  diplomeDic = []
  entrepriseDic = []
  campusDic = []

  selectedUser: User;
  formtype: string = "edit";
  genderMap: any = { 'Monsieur': 'Mr.', 'Madame': 'Mme.', undefined: '', 'other': 'Mel.' };
  constructor(private authService: AuthService, private router: Router, private servService: ServService, private classeService: ClasseService,
    private messageService: MessageService, private entrepriseService: EntrepriseService, private campusService: CampusService, private etudiantService: EtudiantService,
    private diplomeService: DiplomeService, private historiqueService: HistoriqueService) { }

  ngOnInit(): void {

    let token = null
    try {
      token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      token = null
      console.error(e)
    }
    this.authService.getAllAgent().subscribe((users) => {
      this.tabUser = users;
    })
    this.servService.getAll().subscribe((services) => {
      services.forEach(serv => {
        this.dropdownService.push({ label: serv.label, value: serv._id })
        this.serviceDic[serv._id] = serv;
      });
    })
    this.loading = true;

    this.classeService.getAll().subscribe((data) => {
      data.forEach(element => {
        this.classeDic[element._id] = element
      });
    })

    this.entrepriseService.getAll().subscribe(data => {
      data.forEach(element => {
        this.entrepriseDic[element._id] = element
      });
    })
    this.campusService.getAll().subscribe(data => {
      data.forEach(element => {
        this.campusDic[element._id] = element
      });
    })
    this.etudiantService.getAll().subscribe(data => {
      data.forEach(element => {
        this.etudiantDic[element.user_id] = element
      })
    })
    this.diplomeService.getAll().subscribe(data => {
      data.forEach(d => {
        this.diplomeDic[d._id] = d
      })
    })
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

  scrollToTop() {
    var scrollDuration = 250;
    var scrollStep = -window.scrollY / (scrollDuration / 15);

    var scrollInterval = setInterval(function () {
      if (window.scrollY > 120) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }
}

