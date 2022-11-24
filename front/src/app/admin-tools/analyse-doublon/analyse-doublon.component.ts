import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommercialPartenaire } from 'src/app/models/CommercialPartenaire';
import { User } from 'src/app/models/User';
import { AdmissionService } from 'src/app/services/admission.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommercialPartenaireService } from 'src/app/services/commercial-partenaire.service';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { FormateurService } from 'src/app/services/formateur.service';

@Component({
  selector: 'app-analyse-doublon',
  templateUrl: './analyse-doublon.component.html',
  styleUrls: ['./analyse-doublon.component.scss']
})
export class AnalyseDoublonComponent implements OnInit {
  users = []
  doublonEmailIMS: any[] = []
  doublonEmailPerso: any[] = []

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
            if (this.doublonEmailIMS[index].data.length == 1)
              this.MessageService.add({ severity: 'success', summary: 'Bravo! 1 doublon de supprimé' })
            this.doublonEmailIMS.splice(index, 1)
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
            if (this.doublonEmailPerso[index].data.length == 1)
              this.MessageService.add({ severity: 'success', summary: 'Bravo! 1 doublon de supprimé' })
            this.doublonEmailPerso.splice(index, 1)
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
}
