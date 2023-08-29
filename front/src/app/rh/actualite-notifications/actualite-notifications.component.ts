import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ActualiteInt } from 'src/app/models/ActualiteInt';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
import jwt_decode from "jwt-decode";
import { ActualiteRHService } from 'src/app/services/actualite-rh.service';
@Component({
  selector: 'app-actualite-notifications',
  templateUrl: './actualite-notifications.component.html',
  styleUrls: ['./actualite-notifications.component.scss']
})
export class ActualiteNotificationsComponent implements OnInit {

  token;
  constructor(private activiteService: ActualiteRHService, private ToastService: MessageService,
    private AuthService: AuthService, private route: ActivatedRoute) { }
  activites = []
  EditActivite: ActualiteInt
  AddActivite = false
  emailList = []
  showEmail: ActualiteInt
  formEdit = new FormGroup({
    _id: new FormControl('', Validators.required),
    titre: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  })
  formAdd = new FormGroup({
    titre: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    date_creation: new FormControl(new Date())
  })
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.activiteService.getAll().subscribe(data => {
      this.activites = data
    })
  }

  onInitUpdate(act: ActualiteInt) {
    this.EditActivite = act
    this.formEdit.patchValue({ ...act })
  }
  onUpdate() {
    this.activiteService.update({ ...this.formEdit.value }).subscribe(data => {
      this.activites.splice(this.activites.indexOf(this.EditActivite), 1, data)
      this.EditActivite = null
      this.ToastService.add({ severity: 'success', summary: 'Mis à jour de l\'activité avec succès' })
    })
  }
  onSave() {
    this.formAdd.patchValue({ date_creation: new Date() })
    this.activiteService.create({ ...this.formAdd.value }).subscribe(data => {
      this.activites.unshift(data)
      this.AddActivite = false
      this.formAdd.reset()
      this.ToastService.add({ severity: 'success', summary: 'Création d\'une activité avec succès' })
    })
  }
  onDelete(act: ActualiteInt) {
    this.activiteService.delete(act._id).subscribe(data => {
      this.activites.splice(this.activites.indexOf(act), 1)
      this.formEdit.reset()
      this.ToastService.add({ severity: 'success', summary: 'Suppresion de l\'activité avec succès' })
    })
  }


}
