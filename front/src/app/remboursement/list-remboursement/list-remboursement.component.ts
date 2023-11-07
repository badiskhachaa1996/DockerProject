import { Component, OnInit,} from '@angular/core';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { DemandeRemboursementService } from '../../services/demande-remboursement.service';
import { Demande } from '../../models/Demande';
import { FormBuilder, FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { saveAs as importedSaveAs } from "file-saver";
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-list-remboursement',
  templateUrl: './list-remboursement.component.html',
  styleUrls: ['./list-remboursement.component.scss']
})

export class ListRemboursementComponent implements OnInit {
  searchQuery: string = '';
  selectedDemande: Demande | null = null; 


  constructor(private userServise:AuthService, private demandeService: DemandeRemboursementService, private messageService: MessageService, private formBuilder: FormBuilder, )  { }

  showUpdateForm = false

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

})



  currentDemande

  refundRequests: Demande[] = [];
  items: any[];
  // selectedDemande

  token:any
  loading = true
  userName=''
  user: any

  
  ngOnInit(): void {
   

    this.getDemandList()

    
    this.token = jwt_decode(localStorage.getItem('token'));
    this.userServise.getInfoById(this.token.id).subscribe((user: any) => {
      this.userName = user.firstname + ' ' + user.lastname
      this.user = user
    });

  }

  onDemandeUpdated() {
    this.getDemandList();
  }

  getDemandList(){
    this.demandeService.getAll() 
    .then((response: Demande[]) => {
      this.refundRequests = response;
      this.loading = false;
    })
    .catch((error) => { console.error(error); })
  }
  
  search() {
    console.log('Before Search:', this.refundRequests);

    if (this.searchQuery) {
      console.log('Search Query:', this.searchQuery);

      this. refundRequests = this. refundRequests.filter((demande) => {
        const searchLower = this.searchQuery.toLowerCase();
        return (
          demande._id.toString().toLowerCase().includes(searchLower) ||
         demande.student.last_name.toLowerCase().includes(searchLower) ||
          demande.student.first_name.toLowerCase().includes(searchLower)
        );
      });

    }console.log('After Search:', this.refundRequests);
 }
  
 showDemande(demande: Demande) {
  this.selectedDemande = this.selectedDemande === demande ? null : demande;
}

deleteDemande(demandeId: string ) {
  this.demandeService.deleteDemande(demandeId).subscribe(
    () => {
      console.log('Demande deleted successfully');
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
showFUpdateForm(demande){
  this.showUpdateForm = true;
  this.currentDemande = demande;
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