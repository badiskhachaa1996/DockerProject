import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DateSejourMI } from 'src/app/models/DateSejourMI';
import { DestinationMI } from 'src/app/models/DestinationMI';
import { FormulaireMIService } from 'src/app/services/formulaire-mi.service';

@Component({
  selector: 'app-configuration-mi',
  templateUrl: './configuration-mi.component.html',
  styleUrls: ['./configuration-mi.component.scss']
})
export class ConfigurationMIComponent implements OnInit {
  destinations: DestinationMI[] = []
  dateSejours: DateSejourMI[] = []
  showFormAddDestination = false
  destinationFormAdd = new FormGroup({
    name: new FormControl('', Validators.required)
  })

  saveDestination() {
    this.FMIService.DEcreate({ ...this.destinationFormAdd.value }).subscribe(d => {
      this.destinations.push(d)
      this.showFormAddDestination = false
      this.destinationFormAdd.reset()
      this.ToastService.add({ severity: 'success', summary: 'Création d\'une destination avec succès' })
    })
  }

  onInitEditDestination(rowData: DestinationMI) {
    this.showFormUpdateDestination = rowData
    this.destinationFormUpdate.patchValue({ ...rowData })
    this.scrollToTop()
  }

  showFormUpdateDestination: DestinationMI
  destinationFormUpdate = new FormGroup({
    _id: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required)
  })
  updateDestination() {
    this.FMIService.DEupdate({ ...this.destinationFormUpdate.value }).subscribe(d => {
      this.loadData()
      this.showFormUpdateDestination = null
      this.destinationFormUpdate.reset()
      this.ToastService.add({ severity: 'success', summary: 'Mis à jour de la destination avec succès' })
    })
  }

  showFormAddDS = false
  DSFormAdd = new FormGroup({
    name: new FormControl('', Validators.required)
  })

  saveDS() {
    this.FMIService.DScreate({ ...this.DSFormAdd.value }).subscribe(d => {
      this.loadData()
      this.showFormAddDS = false
      this.DSFormAdd.reset()
      this.ToastService.add({ severity: 'success', summary: 'Création d\'une date de séjour avec succès' })
    })
  }
  onInitEditDS(rowData: DateSejourMI) {
    this.showFormUpdateDS = rowData
    this.DSFormUpdate.patchValue({ ...rowData })
    this.scrollToTop()
  }
  showFormUpdateDS: DateSejourMI
  DSFormUpdate = new FormGroup({
    _id: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required)
  })
  updateDS() {
    this.FMIService.DSupdate({ ...this.DSFormUpdate.value }).subscribe(d => {
      this.loadData()
      this.showFormUpdateDS = null
      this.DSFormUpdate.reset()
      this.ToastService.add({ severity: 'success', summary: 'Mis à jour d\'une date de séjour avec succès' })
    })
  }
  constructor(private FMIService: FormulaireMIService, private ToastService: MessageService) { }

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this.FMIService.DSgetAll().subscribe(ds => {
      this.dateSejours = ds
    })
    this.FMIService.DEgetAll().subscribe(de => {
      this.destinations = de

    })
  }



  scrollToTop() {
    var scrollDuration = 250;
    var scrollStep = -window.scrollY / (scrollDuration / 15);

    var scrollInterval = setInterval(function () {
      if (window.scrollY > 50) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }

}
