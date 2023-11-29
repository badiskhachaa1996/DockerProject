import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CampusR } from 'src/app/models/CampusRework';
import { EcoleAdmission } from 'src/app/models/EcoleAdmission';
import { CampusRService } from 'src/app/services/administration/campus-r.service';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';

@Component({
  selector: 'app-ecole-admission',
  templateUrl: './ecole-admission.component.html',
  styleUrls: ['./ecole-admission.component.scss']
})
export class EcoleAdmissionComponent implements OnInit {
  seeAction = true
  ecoles: EcoleAdmission[] = []
  langueList = [
    { label: 'Français', value: 'Français' },
    { label: 'English', value: 'English' },
  ]
  selectedEcole: EcoleAdmission
  constructor(private FAService: FormulaireAdmissionService, private MessageService: MessageService, private route: ActivatedRoute, private CampusRService: CampusRService) { }
  dropdownCampus = [
    { label: 'Paris', value: 'Paris' },
    { label: 'Montpellier', value: 'Montpellier' },
    { label: 'Marne', value: 'Marne' },
    { label: 'En ligne', value: 'En ligne' }
  ]
  campusList = []
  campusFilter = [
    { label: 'Tous les campus', value: null },
    { label: 'Paris', value: 'Paris' },
    { label: 'Montpellier', value: 'Montpellier' },
    { label: 'Congo Brazzaville', value: 'Congo Brazzaville' },
    { label: 'Maroc', value: 'Maroc' },
    { label: 'Malte', value: 'Malte' },
    { label: 'Dubai', value: 'Dubai' },
    { label: 'UK', value: 'UK' },
    { label: 'Marne', value: 'Marne' },
    { label: 'En ligne', value: 'En ligne' }
  ]
  ngOnInit(): void {
    this.FAService.EAgetAll().subscribe(data => {
      this.ecoles = data
    })
    this.FAService.FAgetAll().subscribe(data => {
      this.formationsList = data
    })
    this.route.url.subscribe(r => {
      this.seeAction = !(r[0].path == "informations")
    })
    this.CampusRService.getAll().subscribe(data => {
      data.forEach(c => {

        this.campusList.push({ label: c.libelle, value: c })
      })
    })

  }

  updateForm: FormGroup = new FormGroup({
    _id: new FormControl('', Validators.required),
    titre: new FormControl('', Validators.required),
    adresse: new FormControl(''),
    email: new FormControl(''),
    site_web: new FormControl(''),
    url_form: new FormControl('', Validators.required),
    campus: new FormControl([], Validators.required),
    NDA: new FormControl(''),
    UAI: new FormControl(''),
    langue: new FormControl('Français')
  })

  initUpdate(rowData: EcoleAdmission) {
    this.selectedEcole = rowData
    this.updateForm.patchValue({ ...rowData })
  }
  onAddRentreeScolaire() {


    this.selectedEcole.campusinfo.push({ campus: "", adresse: "", UAI: "" })

  }

  onUpdate() {
    this.FAService.EAupdate({ ...this.updateForm.value }).subscribe(data => {
      this.ecoles.splice(this.ecoles.indexOf(this.selectedEcole), 1, data)
      this.selectedEcole = null
      this.updateForm.reset()
      this.MessageService.add({ severity: "success", summary: `Mis à jour de l'école ${data.titre} avec succès` })
    })
  }

  createForm: FormGroup = new FormGroup({
    titre: new FormControl('', Validators.required),
    adresse: new FormControl(''),
    email: new FormControl(''),
    site_web: new FormControl(''),
    url_form: new FormControl('', Validators.required),
    campus: new FormControl([], Validators.required),
    NDA: new FormControl(''),
    UAI: new FormControl(''),
    langue: new FormControl('Français')
  })

  addForm = false



  initCreate() {
    this.addForm = true
  }
  createFormRA: FormGroup = new FormGroup({
    campus: new FormControl(''),
    annee: new FormControl(''),
    UAI: new FormControl(''),
  })
  onCreateRA() {


    if (this.createFormRA.value.campus.length > 3) {
      this.selectedEcole.campus = this.createFormRA.value.campus;
      this.selectedEcole.campus.push(this.createFormRA.value.campus)
    }
    this.FAService.EAupdate(this.selectedEcole).subscribe(data => {
      console.log(data)
    })

  }
  onDeleteRentreeScolaire(id: number): void {
    console.log("*********************");
    this.selectedEcole.campusinfo.splice(id, 1);
    this.FAService.EAupdate(this.selectedEcole);

  }

  onCreate() {
    let campus = []
    this.createForm.value.campus.forEach((element: CampusR) => {
      campus.push(element.libelle)
    });
    this.FAService.EAcreate({ ...this.createForm.value, campus }).subscribe(data => {
      this.ecoles.push(data)
      this.createForm.value.campus.forEach((element: CampusR) => {
        let ecoles = element.ecoles || []
        ecoles.push({ ecole_id: data })
        this.CampusRService.update({ _id: element._id, ecoles }).subscribe(r => { })
      });
      this.addForm = null
      this.createForm.reset()
      this.MessageService.add({ severity: "success", summary: `Ajout d'une nouvelle école avec succès` })
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

  affectedForm: FormGroup = new FormGroup({
    _id: new FormControl(),
    formations: new FormControl()
  })

  affectedFormations: EcoleAdmission = null

  initFormations(rowData: EcoleAdmission) {
    this.affectedFormations = rowData
    this.affectedForm.patchValue({ ...rowData })
  }

  onAffect() {
    this.FAService.EAupdate({ ...this.affectedForm.value }).subscribe(data => {
      this.ecoles.splice(this.ecoles.indexOf(this.affectedFormations), 1, data)
      this.affectedFormations = null
      this.affectedForm.reset()
      this.MessageService.add({ severity: "success", summary: `Mis à jour des formations de l'école ${data.titre} avec succès` })
    })
  }

  onDeleteEcole(id: string): void {
    this.FAService.EAdelete(id)
      .then((response) => {
        this.MessageService.add({ severity: 'success', summary: 'École', detail: response.success });
        this.FAService.EAgetAll().subscribe(data => {
          this.ecoles = data
        })
      })
      .catch((error) => { console.error(error); this.MessageService.add({ severity: 'error', summary: 'École', detail: error.error }); });
  }


  formationsList = []
  showSideBar = false
  selectedEcoleDetails: EcoleAdmission
  showDetails(data: EcoleAdmission) {
    this.selectedEcoleDetails = data
    this.showSideBar = true
    console.log(data)
  }

  convertAdresse(adresse: string) {
    while (adresse.indexOf('\n') != -1)
      adresse = adresse.replace('\n', '<br>')
    return adresse
  }
}
