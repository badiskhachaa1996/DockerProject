import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Critere } from 'src/app/models/Critere';
import { CritereService } from 'src/app/services/crm/criteres-crm.service';




@Component({
  selector: 'app-criteres',
  templateUrl: './criteres.component.html',
  styleUrls: ['./criteres.component.scss']
})
export class CriteresComponent implements OnInit {
  criteres: Critere[] = []
  selectedCritere: Critere
  constructor(private critereService: CritereService, private MessageService: MessageService) { }

  ngOnInit(): void {
    this.critereService.getAllCriteres().subscribe(data => {
      this.criteres = data
    })
  }

  updateForm: FormGroup = new FormGroup({
    _id: new FormControl('', Validators.required),
    nom: new FormControl('', Validators.required),
    description: new FormControl('')
  })

  initUpdate(etudiant) {
    this.selectedCritere = etudiant
    this.updateForm.patchValue({ ...etudiant })
  }


  createForm: FormGroup = new FormGroup({
    nom: new FormControl('', Validators.required),
    description: new FormControl('',Validators.required),
    
  })

  dateCreationValue: Date = new Date();


  newCritere = false

  initCreate() {
    this.newCritere = true
  }
  alertValidation = false;
  messageValidation = "";
  onCreate() {
    if(this.createForm.valid){

      const formData = { ...this.createForm.value, date_creation: new Date() };


      this.critereService.critereCreate({ ... formData, custom_id: this.generateID({ ...this.createForm.value }) }).subscribe(data => {
        this.criteres.push(data)
        this.newCritere = false,
        this.createForm.reset()
        this.MessageService.add({ severity: "success", summary: `Ajout d'un nouveau critere avec succès` })
        console.log('Form after reset:', this.createForm.value);
      })
    }else{
     
      this.alertValidation = true;
      this.messageValidation ="";
      if (!this.createForm.get('nom').valid) {
        this.messageValidation = 'le Nom est obligatoire';
      }
      
      if (!this.createForm.get('description').valid) {
        if (this.messageValidation) {
          this.messageValidation += '\n'; // Add newline only if there's a previous message
        }
        this.messageValidation += 'la description est obligatoire ';
      }
      


    }

  }

  onUpdate() {
    this.critereService.critereUpdate({ ...this.updateForm.value }).subscribe(data => {
      this.criteres.splice(this.criteres.indexOf(this.selectedCritere), 1, data)
      this.selectedCritere = null
      this.updateForm.reset()
      this.MessageService.add({ severity: "success", summary: `Mis à jour du critere ${data.nom} avec succès` })
    })
  }

  delete(critere: Critere) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette équipe ainsi que les membres de l'équipe ?"))
      this.critereService.critereDelete(critere._id).subscribe(data => {
        this.criteres.splice(this.criteres.indexOf(critere), 1)
        this.MessageService.add({ severity: "success", summary: `Suppression du critere avec succès` })
      })
  }

  /*deleteCommentaire(comment) {
    const index = this.commentaires.findIndex(c => c === comment);
         if (index !== -1) {
        this.commentaires.splice(index, 1);
    }
    this.demande.comments = this.commentaires
    this.updateDemande(this.demande)
  }
*/





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

  generateID(critere: Critere) {
    let ID = critere.nom.substring(0, 2).toUpperCase() + this.pad(Math.floor(Math.random() * (999998)).toString())
    return ID
  }

  pad(number: string) {
    while (number.length < 6)
      number = `0${number}`
    return number
  }


}
