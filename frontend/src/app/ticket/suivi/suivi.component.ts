import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from "jwt-decode";
import { Ticket } from 'src/app/models/Ticket';
import { Message } from 'src/app/models/Message';
import { TicketService } from 'src/app/services/ticket.service';
import { SujetService } from 'src/app/services/sujet.service';
import { ServService } from 'src/app/services/service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-suivi',
  templateUrl: './suivi.component.html',
  styleUrls: ['./suivi.component.css']
})
export class SuiviComponent implements OnInit {
  [x: string]: any;

  ticketList: Ticket[];
  token: any;
  tickets: any;
  serviceList = [];
  sujetList = [];

  filterService;
  filterSujet;
  filterStatut;

  first = 0;
  rows = 10;
  showForm: string = "Ajouter";
  showFormAdd: boolean = false;
  showFormUpdate: boolean = false;

  selectedService;
  listServices;
  listSujets: any[] = [];



  Ticket: Ticket;
  firstMessage: Message;
  dicIDServices;
  selectedService1;
  listServices1;
  listSujetSelected = [];
  listSujets1: any = [];




  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.ticketList ? this.first === (this.ticketList.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.ticketList ? this.first === 0 : true;
  }

  constructor(private router: Router, private AuthService: AuthService, private TicketService: TicketService, private SujetService: SujetService, private ServService: ServService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.Ticket = <Ticket>history.state;

    let token = localStorage.getItem("token")
    if (token == null) {
      this.router.navigate(["/login"])
    }
    this.token = jwt_decode(token);
    this.TicketService.getAllByUser(this.token["id"]).subscribe((data) => {
      this.ticketList = data;
    }, (error) => {
      console.log(error)
    })




    this.SujetService.getAll().subscribe((data) => {
      if (!data.message) {
        //{ label: 'Tous les sujets', value: null }
        this.filterSujet = data;
        data.forEach(sujet => {
          this.sujetList[sujet._id] = { "label": sujet.label, "service_id": sujet.service_id };
        });
      }
    })

    this.ServService.getAll().subscribe((data) => {
      if (!data.message) {
        //{ label: 'Tous les services', value: null }
        this.filterService = data;
        data.forEach(service => {
          this.serviceList[service._id] = service.label;
        });
      }
    })

    this.ServService.getAll().subscribe((data) => {
      this.listServices = data;
      data.forEach(service => {
        this.listSujets[service._id] = [];
      });
      this.SujetService.getAll().subscribe((data) => {
        data.forEach(sujet => {
          console.log(this.listSujets)
          console.log(sujet)
          this.listSujets[sujet.service_id].push(sujet);
        });
      })
    }, (error) => {
      console.log(error)
    })

    this.Tickets();
  }

  TicketForm: FormGroup = new FormGroup({
    description: new FormControl('', Validators.required),
    sujet: new FormControl('', Validators.required),
    service: new FormControl('', Validators.required),
  })

  TicketForm1: FormGroup = new FormGroup({
    description: new FormControl('', Validators.required),
    sujet: new FormControl('', Validators.required),
    service: new FormControl('', Validators.required),
  })
  modify(data) {
    this.toggleFormUpdate()
    this.Ticket = data;
    this.ServService.getAll().subscribe((data) => {
      this.listServices1 = data;
      data.forEach(service => {
        this.listSujets1[service._id] = [];
      });

      this.SujetService.getAll().subscribe((data) => {
        data.forEach(sujet => {
          this.listSujets1[sujet.service_id].push(sujet);
          if (sujet._id == this.Ticket.sujet_id) {
            this.listServices1.forEach(serv => {
              console.log(serv)
              console.log(sujet)
              if (serv._id == sujet.service_id) {
                this.TicketForm1.patchValue({ service: serv, sujet: sujet })
              }
            });
          }
        });
      }, (error) => {
        console.log(error)
      })
    }, (error) => {
      console.log(error)
    })

    this.TicketService.getFirstMessage(data._id).subscribe((data) => {
      this.firstMessage = data.dataMessage;
      this.TicketForm1.patchValue({ description: this.firstMessage.description })
    }, (error) => {
      console.log(error)
    })


  }


  Tickets() {
    this.TicketService.getQueue()
      .subscribe(
        data => {
          this.ticketList = data;
          console.log(this.ticketList);

        },
        error => {
          console.log(error);
        });
  }


  modifyTicket() {
    //Modification du Ticket
    let req = {
      id: this.Ticket._id,
      id_message: this.firstMessage._id,
      sujet_id: this.TicketForm1.value.sujet._id,
      description: this.TicketForm1.value.description,
    }

    this.TicketService.updateFirst(req).subscribe((data) => {
      this.ticketList.splice(this.ticketList.indexOf(this.Ticket), 1);
      this.ticketList.push(data);

      this.messageService.add({ severity: 'success', summary: 'Modification du Ticket', detail: 'Modification réussie' });
      this.toggleFormUpdate()
    }, (error) => {
      console.log(error)
    });
  }

  toggleFormAdd() {
    this.showFormAdd = !this.showFormAdd
    this.showFormUpdate = false;


  }

  toggleFormUpdate() {
    this.showFormUpdate = !this.showFormUpdate
    this.showFormAdd = false

  }
   

  



  addTicket() {
    //Enregistrement du Ticket
     

    let req = {
      id: jwt_decode(localStorage.getItem("token"))["id"],
      sujet_id: this.TicketForm.value.sujet._id,
      description: this.TicketForm.value.description,
      //document:this.TicketForm.value//TODO
    }
    this.TicketService.create(req).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Création du ticket', detail: 'Création réussie' });
     
      try{
        this.ticketList.push(data.doc)
      }catch (e){
        this.ticketList = [data.doc]
      }
      this.toggleFormAdd()

    }, (error) => {
      console.log(error)
    });

  }

  onChange() {
    this.TicketForm.patchValue({
      sujet: this.listSujets[this.TicketForm.value.service._id][0]
    })
  }
  onChange2() {
    this.TicketForm1.patchValue({
      sujet: this.listSujets1[this.TicketForm1.value.service._id][0]
    })
  }

  get description() { return this.TicketForm.get('description'); }

}


