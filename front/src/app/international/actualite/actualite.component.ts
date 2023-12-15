import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import jwt_decode from "jwt-decode";
import { MessageService } from 'primeng/api';
import { ActualiteInt } from 'src/app/models/ActualiteInt';
import { User } from 'src/app/models/User';
import { ActiviteIntService } from 'src/app/services/activite-int.service';
import { AuthService } from 'src/app/services/auth.service';
import { PartenaireService } from 'src/app/services/partenaire.service';
@Component({
  selector: 'app-actualite',
  templateUrl: './actualite.component.html',
  styleUrls: ['./actualite.component.scss']
})
export class ActualiteComponent implements OnInit {
  token;
  constructor(private activiteService: ActiviteIntService, private ToastService: MessageService, private AuthService: AuthService, private route: ActivatedRoute, private PService: PartenaireService) { }
  activites = []
  EditActivite: ActualiteInt
  AddActivite = false
  emailList = []
  partenaireList = []
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
  type = this.route.snapshot.paramMap.get('type');

  AccessLevel = "Spectateur"
  ngOnInit(): void {
    this.token = jwt_decode(localStorage.getItem('token'));
    this.activiteService.getAll().subscribe(data => {
      this.activites = data
    })
    this.PService.getAll().subscribe(data => {
      data.forEach(p => {
        this.partenaireList.push({ label: p.nom, value: p.email })
      })
    })
    this.AuthService.getById(this.token.id).subscribe(user => {
      let data: User = user
      data.roles_list.forEach(val => {
        if (val.module == "Partenaire")
          this.AccessLevel = val.role
      })
      if (user.role == 'Admin')
      this.AccessLevel = 'Admin'
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
      this.ToastService.add({ severity: 'success', summary: 'Suppression de l\'activité avec succès' })
    })
  }

  onSendEmail() {
    this.ToastService.add({ severity: 'info', summary: 'Envoie des mails en cours...' })

    this.activiteService.sendEmail(this.showEmail._id, this.emailList).subscribe(data => {
      this.emailList = []
      this.showEmail = null
      this.ToastService.add({ severity: 'success', summary: 'Envoi du mail avec succès' })
    }, error => {
      console.error(error)
      this.ToastService.add({ severity: 'error', summary: 'Echec de l\'envoi du mail', detail: "Vérifiez que tous les partenaires ont un email, sinon contactez un Admin" })
    })
  }

}
