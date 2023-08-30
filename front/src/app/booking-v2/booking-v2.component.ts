import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SujetBookingService } from 'src/app/services/sujet-booking.service';
import jwt_decode from "jwt-decode";
import { SujetBooking } from 'src/app/models/SujetBooking';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { DialogModule } from 'primeng/dialog';
import { Sujet } from '../models/Sujet';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { SplitterModule } from 'primeng/splitter';



@Component({
  selector: 'app-booking-v2',
  templateUrl: './booking-v2.component.html',
  styleUrls: ['./booking-v2.component.scss']
})
export class BookingV2Component implements OnInit {

  rangeDates: Date[];
  disponibilite: Date[];
  date: Date[] | undefined;
  sujets: SujetBooking[] = [];
  agents: any[] = [];
  formAddSujet: FormGroup;
  showFormAdd: boolean = false;
  formUpdateSujet: FormGroup;
  showFormUpdate: boolean = false;
  token: any;
  showFormAddSujet: boolean = false;
  showFormAddMember: SujetBooking;
  showFormCalendar: SujetBooking
  showSujet: boolean = false;
  showFormUpdateSujet: boolean = false;
  sujetSelected: SujetBooking;
  visibleDetails: boolean = false;
  sujetDetails: SujetBooking = null;
  showDropDownAgent: SujetBooking
  userList: any[] = [];
  AllUsers: User[] = []
  sujetList: any[] = [];
  selectedAgent: any;
  visibleSuspendre: boolean = false;
  sujetSusprendre: SujetBooking = null;
  memberDropdown = []
  memberDic = {}

  showDetails(sujet) {
    this.visibleDetails = true;
    this.sujetDetails = sujet;
}
  showDialogSuspendre(sujet) {
  this.visibleSuspendre = true;
  this.sujetSusprendre = sujet;
}

  canalSujet: any[] = [
    { label: 'WhatsApp', value: "WhatsApp" },
    { label: 'Teams', value: "Teams" },
    { label: 'Zoom', value: "Zoom" },
    { label: 'Appelle télépnhique', value: "Appelle téléphonique" },
    { label: 'Autre', value: "Autre" },
  ];

  dureeSujet: any[] = [
    { label: "15 minutes", value: "15 minutes" },
    { label: "30 minutes", value: "30 minutes" },
    { label: "45 minutes", value: "45 minutes" },
    { label: "1 heure", value: "1 heure" },
    { label: "1 heure et 15 minutes", value: "1 heure et 15 minutes" },
    { label: "1 heure et 30 minutes", value: "1 heure et 30 minutes" },
    { label: "1 heure et 45 minutes", value: "1 heure et 45 minutes" },
    { label: "2 heures", value: "2 heures" },
  ]

  // Chargement des données du tableau de configuration
  loading: boolean = false;

  constructor(private messageService: MessageService, private formBuilder: FormBuilder, private sujetBooking: SujetBookingService, private UserService: AuthService ) { }

  ngOnInit(): void {
    // decoded the token
    this.token = jwt_decode(localStorage.getItem('token'));

    // Initialisation du formulaire d'ajout d'un sujet
    this.formAddSujet = this.formBuilder.group({
      titre_sujet:    ['', Validators.required],
      duree:          [this.dureeSujet[0], Validators.required],
      canal:          new FormControl([], Validators.required),
      description:    ['', Validators.required],
      disponibilite:  new FormControl('', Validators.required), 
    });

    // Initialisation du formulaire de modification d'un sujet 
    this.formUpdateSujet = this.formBuilder.group({
      titre_sujet:    ['', Validators.required],
      duree:          [this.dureeSujet[0], Validators.required],
      canal:          new FormControl([], Validators.required),
      description:    ['', Validators.required],
      disponibilite:  new FormControl('', Validators.required), 
    });

    // Récuperation de la liste des sujets
    this.onGetAllClasses();

    // Récuperation de la liste des agents
    this.UserService.getAllAgentPopulate().subscribe(data => {
      this.agents = data
    })
  }

  // Get all classes we need
  onGetAllClasses(): void
  {
    //Récupération des sujets Booking
  this.sujetBooking.getSujets()
  .then((response) => { this.sujets = response; 
  this.showSujet = true;
  })
  
  .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'Projet', detail: "Impossible de récuperer les projets, veuillez contacter un administrateur" }); });
  }

  // Ajout d'un nouveau sujet
  onAddSujet(): void 
  {
    let formValue = this.formAddSujet.value;
    const sujetBooking = new SujetBooking();

    sujetBooking.titre_sujet = formValue.titre_sujet;
    sujetBooking.duree = formValue.duree;
    sujetBooking.canal = formValue.canal;
    sujetBooking.description = formValue.description;
    sujetBooking.disponibilite = formValue.disponibilite;

    console.log(sujetBooking)

    this.sujetBooking.create(sujetBooking)
    .then((response) => {
      this.messageService.add({severity:'success', summary:'Sujet Booking', detail: response.success});
      this.formAddSujet.reset();
      this.showFormAddSujet = false;
      this.onGetAllClasses();
    })
    .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'Sujet Booking', detail: error.error }); });

  }

  // Méthode de remplissage du formulaire de mise à jour d'une tâche
  onFillFormUpdateSujet(sujetBooking: SujetBooking)
  {
    this.sujetSelected = sujetBooking;

    this.formUpdateSujet.patchValue({
      titre_sujet: sujetBooking.titre_sujet,
      duree: sujetBooking.duree,
      canal: sujetBooking.canal,
      description: sujetBooking.description,
      disponibilite: sujetBooking.disponibilite,
    });
  }
  // Formulaire de modification d'un sujet
  onUpdateSujet(): void
  {
    const formValue = this.formUpdateSujet.value;
    const sujetBooking = new SujetBooking();
    let tempSujet = this.sujetSelected
    this.sujetSelected.titre_sujet = formValue.titre_sujet;
    this.sujetSelected.duree = formValue.duree;
    this.sujetSelected.canal = formValue.canal;
    this.sujetSelected.description = formValue.description;
    this.sujetSelected.disponibilite = formValue.disponibilite;

    this.sujetBooking.put(this.sujetSelected)
    .then((response) => {
      this.sujets.splice(this.sujets.indexOf(tempSujet),1,response.sujet)
      this.messageService.add({severity:'success', summary:'Sujet Booking', detail: response.success});
      this.onGetAllClasses();
      this.formUpdateSujet.reset();
      this.showSujet = false;
      this.showFormUpdateSujet = false;
    })
    .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'Sujet Booking', detail: error.error }); });
  }
  
  // Suppression d'un sujet
  onDeleteSujet(id: string): void 
  {
    this.sujetBooking.deleteSujet(id)
    .then((response) => {
      this.messageService.add({severity:'success', summary:'Sujet', detail: response.success}); 
      this.onGetAllClasses();
      this.showSujet = false;
      this.showFormUpdateSujet = false;
    })
    .catch((error) => { console.log(error); this.messageService.add({ severity: 'error', summary:'Sujet', detail: error.error }); });

  }

  //Susprendre un sujet
  hideSujet(sujet: SujetBooking) {
    this.sujetBooking.hideSujet(sujet._id).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Sujet', detail: sujet.titre_sujet + ' a été suspendu' });
      this.onGetAllClasses();
    }, (error) => {
      console.error(error)
    });
  }

  //Activer un sujet
  activeSujet(sujet: SujetBooking) {
    console.log(sujet)
    this.sujetBooking.showSujet(sujet._id).subscribe((data) => {
      this.messageService.add({ severity: 'success', summary: 'Sujet', detail: sujet.titre_sujet + ' a été activé' });
      this.onGetAllClasses();
    }, (error) => {
      console.error(error)
    });
  }

  // Griser un sujet
  getColor(bol :boolean){
    if(!bol){
      return "gray";
    }
  }

  // Ajout d'un membre à un sujet
  onAddMemberToSujet(agent: User) {
    let tempSujet = this.showFormAddMember
    if(agent.sujet_list)
      agent.sujet_list.push(this.showFormAddMember._id)
    else
      agent.sujet_list = [this.showFormAddMember._id]
    this.UserService.update({ _id: agent._id, sujet_list: agent.sujet_list }).subscribe(data => {
      this.messageService.add({ severity: 'success', summary: "Le membre a été ajouté au sujet avec succès" })
      this.showFormAddMember.membre.push(data)
      this.memberDropdown.splice(this.customIndexOfDropdown(this.memberDropdown, agent), 1)
      //this.addMemberToSujet.membre.push(agent._id)
      this.sujetBooking.put({ _id: this.showFormAddMember._id, membre: this.showFormAddMember.membre }).then(data => {
        this.sujets.splice(this.sujets.indexOf(tempSujet),1,data.sujet)
      })
      if (this.memberDic[this.showFormAddMember._id])
        this.memberDic[this.showFormAddMember._id] = this.memberDic[this.showFormAddMember._id] + ", " + agent.firstname + " " + agent.lastname.toUpperCase()
      else
        this.memberDic[this.showFormAddMember._id] = agent.firstname + " " + agent.lastname.toUpperCase()
    })
  }

  AddMember(sujet: SujetBooking) {
    this.memberDropdown = []
    this.UserService.getAllAgent().subscribe(dataAgent => {
      dataAgent.forEach(agent => {
        if (!this.customIncludes(sujet.membre, agent)) {
          this.memberDropdown.push({ label: `${agent.lastname} ${agent.firstname}`, value: agent })
        }
      })
    })
  } 
  
  customIncludes(listUser: User[], agent: User) {
    let r = false
    listUser.forEach(val => {
      if (val._id.toString() == agent._id.toString())
        r = true
    })
    return r
  }

  customIndexOf(listUser: User[], agent: User) {
    let r = -1
    listUser.forEach((val, idx) => {
      if (val._id.toString() == agent._id.toString())
        r = idx
    })
    return r
  }
  customIndexOfDropdown(listUser: { value: User, label: string }[], agent: User) {
    let r = -1
    listUser.forEach((val, idx) => {
      if (val.value._id.toString() == agent._id.toString())
        r = idx
    })
    return r
  }

  //Supprimer un membres d'un sujet
  removeMember(user: User, ri) {
    let tempSujet = this.showFormAddMember
    user.sujet_list.splice(user.sujet_list.indexOf(this.showFormAddMember._id), 1)
    this.UserService.update({ _id: user._id, sujet_list: user.sujet_list }).subscribe(data => {
      this.messageService.add({ severity: 'success', summary: "Le membre a été supprimé du sujet avec succès" })
      this.showFormAddMember.membre.splice(ri, 1)
      this.sujetBooking.put({ _id: this.showFormAddMember._id, membre: this.showFormAddMember.membre }).then(data => {
        this.sujets.splice(this.sujets.indexOf(tempSujet),1,data.sujet)
      })
      this.memberDropdown.push({ label: `${user.lastname} ${user.firstname}`, value: user })
      this.UserService.getAllAgent().subscribe(data => {
        this.memberDic = {}
        data.forEach(user => {
          if (user.sujet_list)
          user.sujet_list.forEach(sujet => {
            if (this.memberDic[sujet]) this.memberDic[sujet] = this.memberDic[sujet] + ", " + user.firstname + " " + user.lastname.toUpperCase()
            else this.memberDic[sujet] = user.firstname + " " + user.lastname.toUpperCase()
          })
        })
      })
    })  
  }

  formatFrenchDate(date: Date): string {
    const formattedDate = new Date(date); // Créer un nouvel objet Date
    formattedDate.setHours(12, 0, 0, 0); // Définis une heure (12:00:00) pour éviter l'erreur
    return format(formattedDate, 'dd/MM/yyyy', { locale: fr });
  }  

  onDateSelection() {
    console.log('Dates sélectionnées :', this.rangeDates.map(this.formatFrenchDate));
  }

  sauvegarderDisponibilite() {

    let tempSujet = this.showFormCalendar
    this.disponibilite = this.rangeDates;
    console.log(this.disponibilite)
    this.sujetBooking.put({ _id: this.showFormCalendar._id ,disponibilite: this.disponibilite}).then(data => {
      console.log(data)
      this.sujets.splice(this.sujets.indexOf(tempSujet),1,data.sujet)
    })
    this.messageService.add({ severity: 'success', summary: "Disponibilité sauvegarder" })

  }
}






