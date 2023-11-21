import { Component, Input, OnInit ,Output ,EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payement-information',
  templateUrl: './payement-information.component.html',
  styleUrls: ['./payement-information.component.scss']
})
export class PayementInformationComponent implements OnInit {
  @Input() demande
  @Output() saveDemande:EventEmitter<any> = new EventEmitter<any>();


 
  infoPays=[{
    date:'',
    montant:'',
    method:'',
    note:'',
    isUpdating : false

  }]
  payementMethods = environment.paymentType.slice(1)

  constructor() {}
  isUpdating=false
  ngOnInit(): void {
    if (this.demande && this.demande.payment ){
      this.infoPays = [
        {
          date: this.demande.payment.date,
          montant:this.demande.payment.montant,
          method:this.demande.payment.method,
          note: this.demande.payment.note,
          isUpdating : false
        }
      ]
      console.log('infoPays:', this.infoPays);
      console.log('demande.payment:', this.demande.payment);
      
 
  }
}
  updateKeyDates(infoPay){
    infoPay.isUpdating = true 

   }
  //  addPay() {
  //   this.infoPays.push(
  //     {
  //     date: '',
  //     montant:'',
  //     method:'',
  //     note:'',
  //     isUpdating : true

  //     }
  //   )
  // }
   saveKeyDates(infoPay){
    this.demande.payment.date=infoPay.date,
    this.demande.payment.method=infoPay.method
    this.demande.payment.note=infoPay.note
    this.demande.payment.montant=infoPay.montant
    this.updateDemande(this.demande) 
    infoPay.isUpdating=false
   }
   
  deletePay(pay) {
    const index = this.infoPays.findIndex(c => c === pay);
         if (index !== -1) {
        this.infoPays.splice(index, 1);

    } 
    this.demande.payment=this.infoPays
    this.updateDemande(this.demande) 
  }
  updateDemande(demande) {
    const data = {
      demande: demande,
      message: 'Informations de paiement mis à jours'
    }
    this.saveDemande.emit(data)
  }
}
