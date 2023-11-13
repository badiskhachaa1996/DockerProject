import { Component, Input, OnInit , Output , EventEmitter} from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-information-remboursement',
  templateUrl: './information-remboursement.component.html',
  styleUrls: ['./information-remboursement.component.scss']
})
export class InformationRemboursementComponent implements OnInit {
  @Input() demande
  @Output() saveDemande:EventEmitter<any> = new EventEmitter<any>();

infoRefunds=[{
  refund_date:'',
  refund_method:'choisir',
  montant:'',
  payment_attestation:'',
  note:''
}]
refundMethods = environment.paymentType
  constructor() { }
  isUpdating=false
  ngOnInit(): void {
    if (this.demande && this.demande.refund && this.demande.payment) {
      this.infoRefunds[0].refund_date = this.demande.refund.date;
      this.infoRefunds[0].refund_method = this.demande.refund.method;
      this.infoRefunds[0].montant = this.demande.refund.montant;
      this.infoRefunds[0].payment_attestation = this.demande.payment.payment_attestation;
      this.infoRefunds[0].note = this.demande.refund.note;
    }

  }
  updateKeyDates(){
    this.isUpdating = true 

    console.log ( this.demande.refund.note)
   }
   saveKeyDates(){
    this.demande.refund.date=this.infoRefunds[0].refund_date
    this.demande.refund.method=this.infoRefunds[0].refund_method
    this.demande.refund.montant=this.infoRefunds[0].montant
    this.demande.payment.payment_attestation= this.infoRefunds[0].payment_attestation
    this.demande.refund.note=this.infoRefunds[0].note
    this.updateDemande(this.demande) 

    this.isUpdating=false
 
  }
  updateDemande(demande) {
    const data = {
      demande: demande,
      message: 'Informations de remboursement mis à jours'
    }
    this.saveDemande.emit(data)
  }
}
