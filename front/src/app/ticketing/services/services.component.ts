import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Service } from 'src/app/models/Service';
import { AuthService } from 'src/app/services/auth.service';
import { ServService } from 'src/app/services/service.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  constructor(private ServService: ServService, private ToastService: MessageService, private UserService: AuthService) { }

  services = []

  ngOnInit(): void {
    this.ServService.getAll().subscribe(services => {
      this.services = services
    })

  }

  showAdd = false
  addForm = new FormGroup({
    label: new FormControl('', Validators.required)
  })
  onAdd() {
    this.ServService.addService({ ...this.addForm.value }).subscribe(s => {
      this.ToastService.add({ severity: 'success', detail: "Nouveau Service crée" })
      this.services.push(s)
      this.showAdd = false
      this.addForm.reset()
    })
  }



  showUpdate = null
  updateForm = new FormGroup({
    _id: new FormControl('', Validators.required),
    label: new FormControl('', Validators.required)
  })
  initUpdate(service: Service) {
    this.showUpdate = service
    this.updateForm.patchValue({ ...service })
  }
  onUpdate() {
    this.ServService.update({ ...this.updateForm.value, id: this.showUpdate._id }).subscribe(s => {
      this.ToastService.add({ severity: 'success', detail: "Mise à jour du service avec succès" })
      this.services.splice(this.services.indexOf(this.showUpdate), 1, { ...this.updateForm.value })
      console.log(s)
      this.showUpdate = null
      this.updateForm.reset()
    })
  }

  onDelete(service: Service) {
    this.ServService.delete(service._id).subscribe(s => {
      this.ToastService.add({ severity: 'success', detail: "Suppression du service avec succès" })
      this.services.splice(this.services.indexOf(service), 1)
    })
  }

  usersList = []
  showUser = false
  showUsers(service: Service) {
    this.UserService.getAllByServiceFromList(service._id).subscribe(s => {
      this.usersList = s
      this.showUser = true
    })
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
