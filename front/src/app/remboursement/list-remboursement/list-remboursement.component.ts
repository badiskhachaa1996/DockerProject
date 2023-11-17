import { Component, OnInit, } from '@angular/core';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { DemandeRemboursementService } from '../../services/demande-remboursement.service';
import { Demande } from '../../models/Demande';
import { FormBuilder, FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from 'jwt-decode';
import { FormulaireAdmissionService } from 'src/app/services/formulaire-admission.service';
import { AdmissionService } from 'src/app/services/admission.service';


@Component({
  selector: 'app-list-remboursement',
  templateUrl: './list-remboursement.component.html',
  styleUrls: ['./list-remboursement.component.scss']
})

export class ListRemboursementComponent implements OnInit {

  
  searchQuery: string = '';
  selectedDemande: Demande | null = null; 
  selectedStatus=[];


  constructor( private formationService: FormulaireAdmissionService, private userServise:AuthService, private demandeService: DemandeRemboursementService, private messageService: MessageService, private formBuilder: FormBuilder, private AService: AdmissionService, )  { }

  showUpdateForm = false
  selectedPays=[]
  motif = environment.motif

  formRembourssement = this.formBuilder.group({
    nom: [''],
    prenom: [''],
    date_naissance: [''],
    nationalite: [''],
    pays_residence: [''],
    paymentType: [''],
    indicatif_phone: [''],
    phone: [''],
    email: [''],
    annee_scolaire: [''],
    ecole: [''],
    formation: [''],
    motif_refus: [''],
    montant: [''],
    modalite_paiement: [''],
    rib: [''],
    attestion_paiement: [''],
    preuve_paiement: [''],
    document_inscription: [''],
    notification_ou_autre_justificatif: [''],
    docs:[''],
    status:[]

})
filterPays = environment.pays
filterStatus = environment.availableStatus

isNewDemande = false

seletedEcoles=[]
modePaiement = environment.paymentType
annesSchols =  []
ecolesList = []
statusList= []
selectedFormation=[]
annesScolaires = []
modesPaiement = []
  currentDemande
  formation = [];
  filterEcole = []
  ecole = [];
  pays = [];
  availableStatus=[]

  refundRequests: Demande[] = [];

  initialDemande: Demande[] = [];
  items: any[];
  // selectedDemande

  token:any
  loading = true
  curentUserObject = {
    userName: '',
    id: ''
  }
  user: any

  
  ngOnInit(): void {
   

    this.getDemandList()

this.formationService.FAgetAll().subscribe(data => {
  this.filterFormation = [];

  data.forEach(d => {
 
    this.filterFormation.push({ label: d.nom, value: d.nom });
  });
  console.log(data, this.filterFormation);
});
this.formationService.EAgetAll().subscribe(data => {
  data.forEach(d => {
    this.filterEcole.push({ label: d.titre, value: d.url_form })
  })
});

this.messageService.add({ severity: 'info', summary: "Chargement des statistiques en cours ..." })
this.AService.getDataForDashboardInternationalBasique().subscribe(r => {

  this.messageService.add({ severity: 'success', summary: "Chargement des statistiques avec succès" })
 
})

    this.modePaiement.forEach(d => {
      this.modesPaiement.push(d)
      this.modesPaiement[d.value] = d.label
    })

    this.formationService.EAgetAll().subscribe(data => {
      data.forEach(d => {
        this.ecolesList.push(d)
        this.ecolesList[d.url_form] = d.titre
      })
      
    }) 
      this.filterStatus.forEach(d => {
        this.statusList.push(d)
        this.statusList[d.value] = d.label
      })
    this.token = jwt_decode(localStorage.getItem('token'));
    this.userServise.getInfoById(this.token.id).subscribe((user: any) => {
      this.curentUserObject.userName = user.firstname + ' ' + user.lastname
      this.curentUserObject.id = user._id
      this.user = user
    });



  }

  updateFilter() {
    
    this.refundRequests = []

    let newFiltered = []
    this.initialDemande.forEach((demande: Demande) => {
      let schoolAdd = true
      let paysAdd = true
      let formationAdd = true
      let statusAdd = true

      // filtre ecole
      if (this.seletedEcoles?.length != 0) {
        schoolAdd = false
        this.seletedEcoles.forEach(d => {
          if (demande?.training?.school == d.value) {
            schoolAdd = true
          }
        })
        }
// filtre pays
        if (this.selectedPays?.length != 0){
          paysAdd = false
          this.selectedPays.forEach(d => {
            if (demande?.student?.country_residence == d.value) {
              paysAdd = true
            }
          })
        } 
        // filtrage par formation 
        
if (this.selectedFormation?.length != 0){
  formationAdd = false
  this.selectedFormation.forEach( d =>{
    if (demande?.training?.name == d.value)
    formationAdd = true
  })
}
//   filtage par status

if (this.selectedStatus?.length != 0){
  statusAdd = false
  this.selectedStatus.forEach(d => {
    if (demande?.status == d.value) {
      statusAdd = true
    }
  })
}   


      if (schoolAdd && paysAdd && formationAdd && statusAdd) {
        newFiltered.push(demande)
      }
    })
    this.refundRequests = newFiltered

  }

//    clearFilter() {
//    this.seletedEcoles = [];
//   this.selectedPays = [];
//   this.selectedFormation = [];
//   this.selectedStatus = [];
//  this.updateFilter();

//   }

  onDemandeUpdated() {
    this.getDemandList();
  }

  getDemandList(){-
    this.demandeService.getAll() 
    .then((response: Demande[]) => {
      this.initialDemande = response
      this.refundRequests = response;

      

      this.refundRequests.forEach(d => {
        d.training.school 
      }  
        )
      this.loading = false;
      this.formationService.RAgetAll().subscribe(data =>{
        data.forEach(d => {
          this.annesScolaires.push( { label: d.nom, id: d._id })
          this.annesSchols.push(d)
        this.annesSchols[d._id] = d.nom
        })
      })
    })
    .catch((error) => { console.error(error); })
  }

  isUpdating = false
filterFormation = [
]



  
 showDemande(demande: Demande) {
  this.selectedDemande = this.selectedDemande === demande ? null : demande;
}

deleteDemande(demandeId: string ) {
  this.demandeService.deleteDemande(demandeId).subscribe(
    () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Demande supprimé avec Succés'
      });
      // Perform any additional actions here, e.g., updating the local data source.
        this.getDemandList()
    },
    (error) => {
      console.error('Error deleting demande:', error);
      if (error instanceof HttpErrorResponse) {
        // Handle HTTP error codes or error response data here.
        console.error('HTTP error status:', error.status);
        console.error('Response body:', error.error);
      } else {
        // Handle non-HTTP errors here.
        console.error('Non-HTTP error:', error);
      }
    }
  );
}
showFUpdateForm(demande) {
  console.log('showFUpdateForm method called');
  console.log('Selected Demande:', demande);
  this.showUpdateForm = true;
  this.currentDemande = demande;
  console.log('currentDemande:', this.currentDemande);
}

updateStatus(demande) {
  this.selectedStatus = demande.status;
  this.isUpdating = true;
}

saveStatus(demande, status) {
  demande.status = status;
  this.isUpdating = true;
  this.updateDemande({ demande, message: 'Status updated successfully.' });
}

closeForm() {
  this.showUpdateForm = false
}

returnToList() {
this.getDemandList()
console.log('we are here')
  this.showUpdateForm = false
}
onMotifChange(event:any) {
  console.log('event')
  console.log(event)
}


updateDemande(data) {
  // Use the service to make the POST request
  this.demandeService.updateRemboursement(data.demande).subscribe(
   (response) => {
     this.messageService.add({
       severity: 'success',
       summary: 'Success',
       detail: data.message
     });
   },
   (error) => {
     const errorMessage = error.error ? error.error.message : 'Echec de mis à jour.';
     this.messageService.add({
       severity: 'error',
       summary: 'Error',
       detail: errorMessage
     });
   }
 );
 
}

}