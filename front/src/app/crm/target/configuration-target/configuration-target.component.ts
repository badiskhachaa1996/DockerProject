
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { TargetService } from 'src/app/services/target.service';
import jwt_decode from "jwt-decode";
import { Target } from 'src/app/models/Target';
import { TeamsCrmService } from 'src/app/services/crm/teams-crm.service';
import { TeamsCRM } from 'src/app/models/TeamsCRM';
@Component({
  selector: 'app-configuration-target',
  templateUrl: './configuration-target.component.html',
  styleUrls: ['./configuration-target.component.scss']
})
export class ConfigurationTargetComponent implements OnInit {
  token;
  constructor(private ToastService: MessageService, private AuthService: AuthService, private route: ActivatedRoute, private TargetS: TargetService, private TeamCRMS: TeamsCrmService) { }
  targets = []
  EditTarget: Target
  AddTarget = false
  formEdit = new UntypedFormGroup({
    _id: new FormControl('', Validators.required),
    equipe_id: new FormControl(''),
    member_id: new FormControl(''),
    type: new FormControl(''),
    KPI: new FormControl(''),
    date_commencement: new FormControl(''),
    deadline: new FormControl(''),
    description: new FormControl(''),
  })
  formAdd = new UntypedFormGroup({
    equipe_id: new FormControl(),
    member_id: new FormControl(),
    type: new FormControl(''),
    KPI: new FormControl(''),
    date_commencement: new FormControl(''),
    deadline: new FormControl(''),
    description: new FormControl(''),
  })
  memberCRMDropdown = []
  equipeCRMDropdown = []
  //Acquisation (contact) / Qualification / Ventes / Conversion
  typeDropdown = [
    { label: 'Acquisation (contact)', value: 'Acquisation (contact)' },
    { label: 'Qualification', value: 'Qualification' },
    { label: 'Ventes', value: 'Ventes' },
    { label: 'Conversion', value: 'Conversion' },
  ]

  type2Dropdown = [
    { other: 'Acquisation (contact)' },
    { other: 'Qualification' },
    { other: 'Ventes' },
    { other: 'Conversion' },
  ]

  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.TargetS.getAll().subscribe(data => {
      this.targets = data
    }, error => {
      console.error(error)
    })
    this.TeamCRMS.MIgetAll().subscribe(data => {
      console.log(data)
      data.forEach(val => {
        this.memberCRMDropdown.push({ label: `${val.user_id.lastname} ${val.user_id.firstname}`, value: val._id })
      })
    })
    this.TeamCRMS.TIgetAll().subscribe(data => {
      console.log(data)
      data.forEach(val => {
        this.equipeCRMDropdown.push({ label: val.nom, value: val._id })
      })
    })
  }

  onInitUpdate(target: Target) {
    this.EditTarget = target
    this.formEdit.patchValue({
      ...target, equipe_id: target?.equipe_id?._id, member_id: target?.member_id?._id, date_commencement: this.convertDate(new Date(target?.date_commencement)),
      deadline: this.convertDate(new Date(target.deadline))
    })
  }
  onUpdate() {
    this.TargetS.update({ ...this.formEdit.value }).subscribe(data => {
      this.targets.splice(this.targets.indexOf(this.EditTarget), 1, data)
      this.EditTarget = null
      this.formEdit.reset()
      this.ToastService.add({ severity: 'success', summary: 'Mis à jour de la target avec succès' })
    })
  }
  onSave() {
    this.TargetS.create({ ...this.formAdd.value, date_creation: new Date(), custom_id: this.generateID() }).subscribe(data => {
      this.targets.unshift(data)
      this.AddTarget = false
      this.formAdd.reset()
      this.ToastService.add({ severity: 'success', summary: 'Création d\'une target avec succès' })
    })
  }
  onDelete(target: Target) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette target ?'))
      this.TargetS.delete(target._id).subscribe(data => {
        this.targets.splice(this.targets.indexOf(target), 1)
        this.ToastService.add({ severity: 'success', summary: 'Suppression de la target avec succès' })
      })
  }

  generateID() {
    let type = this.formAdd.value.type.substring(0, 2)
    let dn = new Date()
    let jour = dn.getDate()
    let mois = dn.getMonth() + 1
    let year = dn.getFullYear().toString().substring(2)
    let nb = (this.targets.length + 1).toString()
    nb = nb.substring(nb.length - 3)
    return (type + jour + mois + year + nb).toUpperCase()
  }

  calcDuree(target: Target) {
    //La durée du target = DeadLine - Date de commencement
    let deadline = new Date(target.deadline)
    let date_commencement = new Date(target.date_commencement)
    var diff = {
      sec: 0,
      min: 0,
      hour: 0,
      day: 0
    }							// Initialisation du retour
    var tmp = deadline.getTime() - date_commencement.getTime();

    tmp = Math.floor(tmp / 1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;					// Extraction du nombre de secondes

    tmp = Math.floor((tmp - diff.sec) / 60);	// Nombre de minutes (partie entière)
    diff.min = tmp % 60;					// Extraction du nombre de minutes

    tmp = Math.floor((tmp - diff.min) / 60);	// Nombre d'heures (entières)
    diff.hour = tmp % 24;					// Extraction du nombre d'heures

    tmp = Math.floor((tmp - diff.hour) / 24);	// Nombre de jours restants
    diff.day = tmp;

    return `${diff.day}J ${diff.hour}H${diff.min}`;
  }
  calcAvancement(target: Target) {
    //Avancement = les équations seront définies plus tard mais ils auront deux variable (membre / data set du CRM)
    return "membre / data set du CRM"
  }

  convertDate(date: Date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

}
