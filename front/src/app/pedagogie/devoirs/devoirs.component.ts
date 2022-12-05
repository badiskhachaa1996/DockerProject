import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Devoir } from 'src/app/models/Devoir';
import { MatiereService } from 'src/app/services/matiere.service';
import jwt_decode from 'jwt-decode';
import { ClasseService } from 'src/app/services/classe.service';
import { DevoirsService } from 'src/app/services/devoirs/devoirs.service';
import { MessageService } from 'primeng/api';
import { FormateurService } from 'src/app/services/formateur.service';
import { Formateur } from 'src/app/models/Formateur';
import { RenduDevoirService } from 'src/app/services/devoirs/rendu-devoir.service';
import { RenduDevoir } from 'src/app/models/RenduDevoir';
@Component({
  selector: 'app-devoirs',
  templateUrl: './devoirs.component.html',
  styleUrls: ['./devoirs.component.scss']
})
export class DevoirsComponent implements OnInit {

  devoirs: Devoir[] = []
  showDevoir = false
  token;
  devoirSelected = 0
  isFormateur: Formateur;
  dropdownMatiere = []
  dropdownClasse = []
  formAddDevoir: FormGroup = new FormGroup({
    classe_id: new FormControl('', [Validators.required]),
    matiere: new FormControl('',),
    date_rendu: new FormControl('', [Validators.required]),
    date_debut: new FormControl('', [Validators.required]),
    libelle: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  })
  groupes = {}

  updateLibelle() {
    this.formAddDevoir.patchValue({ libelle: this.formAddDevoir.value.matiere })
  }

  constructor(private MatiereService: MatiereService, private ClasseService: ClasseService,
    private DevoirsService: DevoirsService, private messageService: MessageService,
    private formateurService: FormateurService, private renduDevoirService: RenduDevoirService) { }

  ngOnInit(): void {
    try {
      this.token = jwt_decode(localStorage.getItem("token"))
    } catch (e) {
      this.token = null
    }
    this.formateurService.getByUserId(this.token.id).subscribe(f => {

      if (this.token.role == 'user')
        this.isFormateur = f
      if (this.isFormateur) {
        this.MatiereService.getAllByFormateurID(this.token.id).subscribe(
          (response) => {
            response.matieres.forEach(m => {
              this.dropdownMatiere.push({ label: m.nom, value: m.nom })
            })
            response.groupes.forEach(g => {
              this.dropdownClasse.push({ label: g.abbrv, value: g._id })
              this.groupes[g._id] = g
            })
          }
        )
        this.DevoirsService.getAllByFormateurID(this.token.id).subscribe(devoirs => {
          this.devoirs = devoirs
        })
      }

      else {
        this.MatiereService.getAll().subscribe(resp => {
          resp.forEach(m => {
            this.dropdownMatiere.push({ label: m.nom, value: m.nom })
          })
        })
        this.ClasseService.getAll().subscribe(groupes => {
          groupes.forEach(g => {
            this.dropdownClasse.push({ label: g.abbrv, value: g._id })
            this.groupes[g._id] = g
          })
        })
        this.DevoirsService.getAll().subscribe(devoirs => {
          this.devoirs = devoirs
        })
      }
    })

  }

  filterModule() {
    let classe_id = this.formAddDevoir.get("classe_id")?.value;
    let cids = []
    if (classe_id) {
      classe_id.forEach(c => {
        cids.push(this.groupes[c].diplome_id)
      })
      this.MatiereService.getAllPopulateByFormationID(cids).subscribe(response => {
        this.dropdownMatiere = []
        response.forEach(matiere => {
          if (Array.isArray(matiere.formation_id))
            this.dropdownMatiere.push({ label: matiere.nom, value: matiere.nom });
          else
            this.dropdownMatiere.push({ label: matiere.nom, value: matiere.nom });
        })
      })
    }
  }

  onAddDevoir() {
    this.DevoirsService.create(new Devoir(
      null,
      this.formAddDevoir.value.libelle,
      this.formAddDevoir.value.description,
      this.formAddDevoir.value.classe_id,
      this.token.id,
      this.formAddDevoir.value.date_rendu,
      this.formAddDevoir.value.date_debut
    )).subscribe(devoir => {
      this.devoirs.push(devoir)
      this.messageService.add({ severity: 'success', summary: 'Nouveau devoir crée avec succès' })
    }, err => {
      this.messageService.add({ severity: 'error', summary: 'Une erreur est arrivé à la création', detail: err.message })
    })
  }

  test() {
    this.renduDevoirService.create(new RenduDevoir(
      null,
      "TEST",
      "638a122d58239066e8a59c78",
      "62f35b61fca344641bcb36e1",
      new Date(),
      0
    )).subscribe(devoir => {
      this.messageService.add({ severity: 'success', summary: 'Nouveau devoir crée avec succès' })
    }, err => {
      this.messageService.add({ severity: 'error', summary: 'Une erreur est arrivé à la création', detail: err.message })
    })
  }

  valided(rd: RenduDevoir, indextwo) {
    this.renduDevoirService.valided(rd._id).subscribe(val => {
      this.devoirs[this.devoirSelected].rendu[indextwo].verified = true
      this.messageService.add({ severity: 'success', summary: 'Le devoir a été marqué comme validé' })
    })
  }

}
