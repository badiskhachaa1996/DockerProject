import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommercialPartenaire } from 'src/app/models/CommercialPartenaire';
import { User } from 'src/app/models/User';
import { AdmissionService } from 'src/app/services/admission.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { FormateurService } from 'src/app/services/formateur.service';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-analyse-doublon',
  templateUrl: './analyse-doublon.component.html',
  styleUrls: ['./analyse-doublon.component.scss']
})
export class AnalyseDoublonComponent implements OnInit {
  users = []
  doublonEmailIMS: any[] = []
  doublonEmailPerso: any[] = []
  sameEmailPersoIMS: User[] = []

  constructor(private UserService: AuthService, private EtudiantService: EtudiantService, private MessageService: MessageService,
    private FormateurService: FormateurService, private CommercialService: CommercialPartenaireService, private ProspectService: AdmissionService) { }

  ngOnInit(): void {
    this.MessageService.add({ severity: 'info', summary: 'Chargement en cours des doublons', detail: 'Cela prends du temps merci de patienter' })
    this.UserService.findDuplicateIMS().subscribe(r => {
      this.MessageService.add({ severity: 'success', summary: 'Chargement des doublons de IMS', detail: 'Chargement du premier tableau terminé' })
      this.doublonEmailIMS = r
    })
    this.UserService.findDuplicatePerso().subscribe(r => {
      this.MessageService.add({ severity: 'success', summary: 'Chargement des doublons de Email Perso', detail: 'Chargement du second tableau terminé' })
      this.doublonEmailPerso = r
    })
    this.UserService.getAllWithSameEmail().subscribe(r => {
      this.MessageService.add({ severity: 'success', summary: 'Chargement des d\'emails perso et pro similaires', detail: 'Chargement du troisième tableau terminé' })
      this.sameEmailPersoIMS = r
    })
  }
  searchEtudiant(user_id) {
    this.EtudiantService.getByUser_id(user_id).subscribe(r => {
      if (r) {
        this.MessageService.add({ severity: 'success', summary: 'Un étudiant a été trouvé rattacher à cette entité \nMerci de regarder dans la console' })
        console.log(r)
      } else {
        this.MessageService.add({ severity: 'error', summary: 'Aucun étudiant a été trouvé rattacher à cette entité' })
      }
    })
  }

  searchFormateur(user_id) {
    this.FormateurService.getByUserId(user_id).subscribe(r => {
      if (r) {
        this.MessageService.add({ severity: 'success', summary: 'Un formateur a été trouvé rattacher à cette entité \nMerci de regarder dans la console' })
        console.log(r)
      } else {
        this.MessageService.add({ severity: 'error', summary: 'Aucun formateur a été trouvé rattacher à cette entité' })
      }
    })
  }

  searchCommercial(user_id) {
    this.CommercialService.getByUserId(user_id).subscribe(r => {
      if (r) {
        this.MessageService.add({ severity: 'success', summary: 'Un commercial a été trouvé rattacher à cette entité \nMerci de regarder dans la console' })
        console.log(r)
      } else {
        this.MessageService.add({ severity: 'error', summary: 'Aucun commercial a été trouvé rattacher à cette entité' })
      }
    })
  }

  searchProspect(user_id) {
    this.ProspectService.getByUserId(user_id).subscribe(r => {
      if (r) {
        this.MessageService.add({ severity: 'success', summary: 'Un prospect a été trouvé rattacher à cette entité \nMerci de regarder dans la console' })
        console.log(r)
      } else {
        this.MessageService.add({ severity: 'error', summary: 'Aucun prospect a été trouvé rattacher à cette entité' })
      }
    })
  }

  deleteIMS(user_id, doublon_id) {
    this.UserService.delete(user_id).subscribe(r => {
      if (r) {
        this.MessageService.add({ severity: 'success', summary: 'Entité supprimé' })
        this.doublonEmailIMS.forEach((data, index) => {
          if (data._id == doublon_id) {
            this.doublonEmailIMS[index].data.splice(this.customIndexOf(data.data, user_id), 1)
            if (this.doublonEmailIMS[index].data.length == 1) {
              this.MessageService.add({ severity: 'success', summary: 'Bravo! 1 doublon de supprimé plus que ' + this.doublonEmailPerso.length })
              this.doublonEmailIMS.splice(index, 1)
            }
          }
        })
      }
      else
        this.MessageService.add({ severity: 'error', summary: 'Entité pas supprimé' })
    }, error => {
      this.MessageService.add({ severity: 'error', summary: 'Entité pas supprimé', detail: error.message })
    })
  }


  deletePerso(user_id, doublon_id) {
    this.UserService.delete(user_id).subscribe(r => {
      if (r) {
        this.MessageService.add({ severity: 'success', summary: 'Entité supprimé' })
        this.doublonEmailPerso.forEach((data, index) => {
          if (data._id == doublon_id) {
            this.doublonEmailPerso[index].data.splice(this.customIndexOf(data.data, user_id), 1)
            if (this.doublonEmailPerso[index].data.length == 1) {
              this.MessageService.add({ severity: 'success', summary: 'Bravo! 1 doublon de supprimé plus que ' + this.doublonEmailPerso.length })
              this.doublonEmailPerso.splice(index, 1)
            }
          }
        })
      }
      else
        this.MessageService.add({ severity: 'error', summary: 'Entité pas supprimé' })
    }, error => {
      this.MessageService.add({ severity: 'error', summary: 'Entité pas supprimé', detail: error.message })
    })
  }

  customIndexOf(list: User[], id: string) {
    let r = -1
    list.forEach((u, index) => {
      if (u._id == id)
        r = index
    })
    return r
  }

  deleteDuplicateProspect() {
    this.UserService.deleteDuplicateProspect().subscribe(r => {
      this.MessageService.add({ severity: 'success', summary: 'Les duplicats de prospects ont été supprimés', detail: 'Rechargez la page pour voir le résultat' })
    }, err => {
      this.MessageService.add({ severity: 'error', summary: 'Une erreur est survenu lors de la suppresion des prospects', detail: err.message })
    })
  }

  cleanModel() {
    this.UserService.cleanModel().subscribe(r => {
      this.MessageService.add({ severity: 'success', summary: 'Les models ont été nettoyés', detail: 'Les étudiants, formateurs, commercial, prospects sans user_id ont été supprimés.' })
    }, err => {
      this.MessageService.add({ severity: 'error', summary: 'Une erreur est survenu lors du nettoyage des models', detail: err.message })
    })
  }

  toSupport() {
    this.UserService.toSupport().subscribe(r => {
      this.MessageService.add({ severity: 'success', summary: 'Etudiant transféré avec succès', detail: 'Les étudiants admis et sans email_ims sont envoyés aux supports' })
    }, err => {
      this.MessageService.add({ severity: 'error', summary: 'Une erreur est survenu lors du transferts des étudiants', detail: err.message })
    })
  }

  toAdmin() {
    this.UserService.toAdmin().subscribe(r => {
      this.MessageService.add({ severity: 'success', summary: 'Etudiant transféré avec succès', detail: 'Les étudiants sans classe et sans dossier complet sont envoyés aux admins' })
    }, err => {
      this.MessageService.add({ severity: 'error', summary: 'Une erreur est survenu lors du transferts des étudiants', detail: err.message })
    })
  }

  toPedagogie() {
    this.UserService.toPedagogie().subscribe(r => {
      this.MessageService.add({ severity: 'success', summary: 'Etudiant transféré avec succès', detail: 'Les étudiants sans classe et avec un dossier complet sont envoyés à la pédagogie' })
    }, err => {
      this.MessageService.add({ severity: 'error', summary: 'Une erreur est survenu lors du transferts des étudiants', detail: err.message })
    })
  }

  deleteEmail(user_id, type) {
    this.UserService.deleteEmail(user_id, type).subscribe(r => {
      console.log(r)
      this.MessageService.add({ severity: 'success', summary: 'Le mail ' + type + ' a été supprimé' })
      this.sameEmailPersoIMS.splice(this.customIndexOf(this.sameEmailPersoIMS, r._id), 1)
    }, err => {
      this.MessageService.add({ severity: 'error', summary: 'Le mail n\'a pas pu êtrer supprimé', detail: err.message })
    })
  }

  cleanAllWithSameEmail() {
    this.UserService.cleanAllWithSameEmail().subscribe(r => {
      this.MessageService.add({ severity: 'success', summary: 'Une partie a été supprimé' })
      this.UserService.getAllWithSameEmail().subscribe(r => {
        this.sameEmailPersoIMS = r
      })
    }, err => {
      this.MessageService.add({ severity: 'error', summary: 'Une erreur est survenu', detail: err.message })
    })
  }
}
