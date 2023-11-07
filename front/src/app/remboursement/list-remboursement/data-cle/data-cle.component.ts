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

  Motif = environment.motif
  isUpdating = false

  keyDates = [{
    motif: 'Motif',
    date_refus: new Date(),
    date_demande:'Date de demand',
    date_remboursement:'date de remboursement',
    date_estime:'date estimé'
  }]


  constructor(private demandeService: DemandeRemboursementService, private messageService: MessageService, private formBuilder: FormBuilder, )  { }

 

  ngOnInit(): void {
    if (this.demande){
    this.keyDates[0].motif = this.demande?.motif
    this.keyDates[0].date_refus=this.demande?.created_on
    this.keyDates[0].date_demande = this.demande?.created_on
    this.keyDates[0].date_remboursement=this.demande?.refund.date
  }

  }
  updateKeyDates(){
   this.isUpdating = true 


  }
  saveKeyDates(){
    this.demande.motif= this.keyDates[0].motif
    this.demande.created_on=this.keyDates[0].date_refus
    this.demande.created_on= this.keyDates[0].date_demande
    this.demande.refund.date=this.keyDates[0].date_remboursement
    this.updateDemande(this.demande) 
    this.isUpdating=false
  }






  updateDemande(demande) {
    const data = {
      demande: demande,
      message: 'Date clés mis à jours'
    }
    this.saveDemande.emit(data)
  }

  
}
