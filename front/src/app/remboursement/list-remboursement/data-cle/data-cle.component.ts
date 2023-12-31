import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DemandeRemboursementService } from 'src/app/services/demande-remboursement.service';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Demande } from 'src/app/models/Demande';
@Component({
  selector: 'app-data-cle',
  templateUrl: './data-cle.component.html',
  styleUrls: ['./data-cle.component.scss']
})
export class DataCleComponent implements OnInit {

  @Input() demande

  @Output() saveDemande:EventEmitter<any> = new EventEmitter<any>();

  Motif = environment.motif.slice(1)

  keyDates = [
    {
    motif:'',
    date_refus: null,
    date_demande: new Date,
    date_remboursement: null,
    // date_estime:null,
    isUpdating : false

  }
]


  constructor(private demandeService: DemandeRemboursementService, private messageService: MessageService, private formBuilder: FormBuilder, )  { }

  isUpdating =false


  ngOnInit(): void {

    if (this.demande && this.demande.refund){
      this.keyDates=[
        {
        motif :  this.demande?.motif,
        date_refus :this.conersiondate( this.demande?.rejection_date),
        date_demande :this.demande?.created_on,
        date_remboursement : this.demande?.refund?.date,
        isUpdating : false
      }
    ]
    console.log('hello its me',this.demande.rejection_date)

    
  }

  }
  updateKeyDates(keyDates){
   this.isUpdating = true 
  }
  saveKeyDates(keyDate){
    if (!this.demande.refund) {
      this.demande.refund = {}; 
    }
    this.demande.motif= keyDate.motif
    this.demande.rejection_date=keyDate.date_refus
    
    this.demande.created_on= keyDate.date_demande
    this.demande.refund.date = keyDate.date_remboursement;
    this.updateDemande(this.demande) 
    this.isUpdating=false
  }

  // saveKeyDates(infoRefund){


  //   this.demande.refund = {
  //     date : infoRefund.refund_date,
  //     method : infoRefund.refund_method,
  //     montant : infoRefund.montant,
  //     note : infoRefund.note,
  //     doc_number : infoRefund.doc_number
  //   }

  //   this.updateDemande(this.demande) 

  //   this.isUpdating=false
  
  // }


 
  conersiondate(a) {
      const dateObjectl = new Date(a); // Conversion en objet Date
      const year = dateObjectl.getFullYear();
      const month = String(dateObjectl.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
      const day = String(dateObjectl.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`
    }




  updateDemande(demande) {
    const data = {
      demande: demande,
      message: 'Date clés mis à jours'
    }
    this.saveDemande.emit(data)
  }

  
}
