import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Pointeuse } from 'src/app/models/Pointeuse';
import { PointeuseData } from 'src/app/models/PointeuseData';
import { PointeuseService } from 'src/app/services/pointeuse.service';

@Component({
  selector: 'app-configuration-pointeuse',
  templateUrl: './configuration-pointeuse.component.html',
  styleUrls: ['./configuration-pointeuse.component.scss']
})
export class ConfigurationPointeuseComponent implements OnInit {
  pointeuses: Pointeuse[]
  localisationDropdown = [
    { label: 'Paris - Champs sur Marne', value: 'Paris - Champs sur Marne' },
    { label: 'Paris - Louvre', value: 'Paris - Louvre' },
    { label: 'Montpellier', value: 'Montpellier' },
    { label: 'Dubaï', value: 'Dubaï' },
    { label: 'Congo', value: 'Congo' },
    { label: 'Maroc', value: 'Maroc' },
    { label: 'Tunis M1', value: 'Tunis M1' },
    { label: 'Tunis M4', value: 'Tunis M4' },
    { label: 'Autre', value: 'Autre' },
  ]

  typePointageDropdown = [
    { label: 'Face', value: 'Face' },
    { label: 'Finger', value: 'Finger' },
  ]

  serialNumberList = [
    //{ label: 'CLN5210560094', value: 'CLN5210560094' }
  ]

  pointeuseDic = {}
  constructor(private PointeuseService: PointeuseService, private ToastService: MessageService) { }

  ngOnInit(): void {
    this.PointeuseService.getAll().subscribe(data => {
      this.pointeuses = data
    })
    this.PointeuseService.getData().subscribe(data => {
      data.forEach(pd => {
        this.pointeuseDic[pd.serial_number] = pd
        this.serialNumberList.push({ label: pd.serial_number, value: pd.serial_number })
      })
    })
  }

  showAdd = false
  addForm = new FormGroup({
    serial_number: new FormControl('', Validators.required),
    localisation: new FormControl('', Validators.required),
    pointageType: new FormControl([], Validators.required),
    modele: new FormControl('', Validators.required)
  })
  onAdd() {
    this.PointeuseService.create({ ...this.addForm.value }).subscribe(p => {
      this.pointeuses.push(p)
      this.addForm.reset()
      this.showAdd = false
      this.ToastService.add({ severity: 'success', summary: "Ajout de la pointeuse avec succès" })
    })
  }

  showUpdate: Pointeuse = null
  updateForm = new FormGroup({
    serial_number: new FormControl('', Validators.required),
    localisation: new FormControl('', Validators.required),
    pointageType: new FormControl([], Validators.required),
    modele: new FormControl('', Validators.required),
    _id: new FormControl('', Validators.required)
  })
  initUpdate(machine: Pointeuse) {
    this.updateForm.patchValue({
      ...machine
    })
    this.showUpdate = machine
  }

  onUpdate() {
    this.PointeuseService.update({ ...this.updateForm.value }).subscribe(m => {
      this.pointeuses.splice(this.pointeuses.indexOf(this.showUpdate), 1)
      this.showUpdate = null
      this.ToastService.add({ severity: 'success', summary: "Modification de la pointeuse avec succès" })
      this.updateForm.reset()
    })

  }

  onDelete(machine: Pointeuse) {
    this.PointeuseService.delete(machine._id).subscribe(machine => {
      this.pointeuses.splice(this.pointeuses.indexOf(machine), 1)
      this.ToastService.add({ severity: 'success', summary: "Suppresion de la pointeuse avec succès" })
    })
  }


  visiblePopUp = false
  dataPopUp: PointeuseData
  dataMachine: Pointeuse
  seePopUp(machine: Pointeuse) {
    this.visiblePopUp = true
    this.PointeuseService.getDataFromSN(machine.serial_number).subscribe(pd => {
      this.dataPopUp = pd
      this.dataMachine = machine
    })

  }

  visibleUser = false
  dataUser
  seeUsers(machine: Pointeuse) {
    this.visibleUser = true
    this.PointeuseService.getDataFromSN(machine.serial_number).subscribe(pd => {
      this.dataPopUp = pd
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
