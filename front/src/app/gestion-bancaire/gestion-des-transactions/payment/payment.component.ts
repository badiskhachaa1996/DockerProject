import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  providers: [MessageService, ConfirmationService],
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  onCardPayment()
  {
    alert('ok');
  }

  onAccountPayment()
  {
    alert('KO');
  }

  onChequePayment()
  {
    alert('stop');
  }
}
