import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatiereService } from 'src/app/services/matiere.service';
import jwt_decode from 'jwt-decode'; import { Devoir } from 'src/app/models/Devoir';
import { Formateur } from 'src/app/models/Formateur';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { Etudiant } from 'src/app/models/Etudiant';
import { DevoirsService } from 'src/app/services/devoirs/devoirs.service';
import { RenduDevoir } from 'src/app/models/RenduDevoir';
import { RenduDevoirService } from 'src/app/services/devoirs/rendu-devoir.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-devoirs-etudiants',
  templateUrl: './devoirs-etudiants.component.html',
  styleUrls: ['./devoirs-etudiants.component.scss']
})
export class DevoirsEtudiantsComponent implements OnInit {

  devoirs: Devoir[] = []
  showDevoir = false
  token;
  rendu: RenduDevoir = null
  isEtudiant: Etudiant = null
  showAddRendu = false
  uploadedFiles: any[] = [];

  formAddRendu: FormGroup = new FormGroup({
    devoir_id: new FormControl('', [Validators.required]),
    description: new FormControl('', Validators.required)
  })

  constructor(private EtudiantService: EtudiantService, private DevoirService: DevoirsService, private RenduDevoirService: RenduDevoirService, private MessageService: MessageService) { }

  ngOnInit(): void {
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    this.EtudiantService.getByUser_id(this.token.id).subscribe(f => {
      if (this.token.type == 'Initial' || this.token.type == 'Etudiant' || this.token.type == 'Alternant')
        this.isEtudiant = f
      if (this.isEtudiant) {
        this.DevoirService.getAllByClasseID(this.isEtudiant.classe_id).subscribe(devoirs => {
          this.devoirs = devoirs
        })
      }
      else {
        this.DevoirService.getAllByClasseID("6322d51cf1eb123425961180").subscribe(devoirs => {
          this.devoirs = devoirs
        })
      }
    })
  }

  loadRendu(devoir: Devoir) {
    this.RenduDevoirService.getByEtudiantDevoir(devoir._id, this.token.id).subscribe(r => {
      this.rendu = r
    })
  }

  addRendu(devoir: Devoir) {
    this.showAddRendu = true
    this.uploadedFiles = []
    this.formAddRendu.patchValue({ devoir_id: devoir._id })
  }

  onAddRendu() {
    this.RenduDevoirService.create(new RenduDevoir(null,
      this.formAddRendu.value.description,
      this.formAddRendu.value.devoir_id,
      this.token.id,
      new Date(),
      this.uploadedFiles.length,
      false
    )).subscribe(r => {
      const formData = new FormData()
      formData.append('rendu_id', r._id)
      formData.append('devoir_id', this.formAddRendu.value.devoir_id)
      for (var i = 0; i < this.uploadedFiles.length; i++) {
        formData.append("myFiles", this.uploadedFiles[i]);
      }
      this.RenduDevoirService.multipleFiles(formData).subscribe(r => {
        this.MessageService.add({ severity: 'success', summary: 'Rendu envoyé' });
      })

    })
  }

  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }


  onRemove(event) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event.file), 1)
  }

}
