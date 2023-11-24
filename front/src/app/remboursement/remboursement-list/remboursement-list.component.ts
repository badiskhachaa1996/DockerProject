import { Component, OnInit,} from '@angular/core';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { DemandeRemboursementService } from '../../services/demande-remboursement.service';
import { Demande } from '../../models/Demande';
import { FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { saveAs as importedSaveAs } from "file-saver";
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-remboursement-list',
  templateUrl: './remboursement-list.component.html',
  styleUrls: ['./remboursement-list.component.scss']
})

export class RemboursementListComponent implements OnInit {
  searchQuery: string = '';
  selectedDemande: Demande | null = null; 


  constructor(private demandeService: DemandeRemboursementService, private messageService: MessageService, private formBuilder: FormBuilder, )  { }
  
  keyDates = {
    motif_refus: "",
    date_refus:"",
    created_on:"",
  
    refund_date_estimated: "",
    refund_date:""
    }  

    commSection = [
       {
        note : "",
        created_by: "",
        created_on:""
      } ]
     PayInfo ={
      student_payment_date:"",
      student_montant:"",
      student_payment_method:"",
      student_note:""
     }
    
  showUpdateForm = false

  payment_method = environment.paymentType

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


formDates = this.formBuilder.group({
  motif_refus: [''],
})

  currentDemande

  refundRequests: Demande[] = [];
  items: any[];
  // selectedDemande

  editKeyDates = true
  editcommSection = true
editPayInfo=true
  loading = true

  
  ngOnInit(): void {
   

    this.getDemandList()

  }
  getDemandList(){
    this.demandeService.getAll()
    .then((response: Demande[]) => {
      this.refundRequests = response;
      this.loading = false;
      console.log(this.refundRequests)
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


updateKeyDates(demande, updates) {
  this.editKeyDates = true
  demande.motif = updates.motif_refus
demande.date_refus=updates.date_refus
demande.created_on=updates.created_on
demande.refund.date_estimated = updates.date_estimated;
demande.refund.date = updates.date_refund;
  console.log(demande.motif)
  console.log(demande.motif_refus)
  console.log(demande.date_refus)
  console.log(demande.created_on)
  console.log(demande.refund.date_estimated)
  console.log(demande.refund.date)
  this.updateDemande(demande)
}
updatecommSection(demande, updates) {
  if (demande.comments && demande.comments.length > 0) {
    demande.comments[0].created_by = updates.created_by;
    demande.comments[0].created_on = updates.created_on;
  }

  this.editcommSection = true
 
demande.comments.note=updates.note
  demande.comments.created_by = updates.created_by;
  demande.comments.created_on = updates.created_on;
 
  console.log( demande.comments.created_by)
  console.log( demande.comments.created_on)
  this.updateDemande(demande)
}
updatePayInfo(demande,updates){

 this.editPayInfo = true
 demande.student.payment_date = updates.payment_date;
 demande.student.montant=updates.montant;
 demande.student.payment_method = updates.payment_method;
 demande.student.note= updates.note
 console.log( demande.student.payment_date)
 console.log( demande.student.montant)
 console.log( demande.student.payment_method)
 console.log( demande.student.note)

}



downloadDoc(id, file) {
this.demandeService.downloadDoc(id, file)  
  .then((response) => {
    const byteArray = new Uint8Array(atob(response.file).split('').map(char => char.charCodeAt(0)));
    importedSaveAs(new Blob([byteArray], { type: response.extension }), file + '.pdf')
  })
  .catch((error) => {
    console.error('Error downloading file:', error);
  });
  }


  updateDemande(demande) {
    this.demandeService.updateRemboursement(demande).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Remboursement added successfully.'
        });
        // this.router.navigate(['remboursement-list']);
      },
      (error) => {
        // Handle error (show an error message)
        console.error('Error adding remboursement:', error);
        // Check if the error response contains a message
        const errorMessage = error.error ? error.error.message : 'Failed to add remboursement.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage
        });
      }
    );
  }

}
