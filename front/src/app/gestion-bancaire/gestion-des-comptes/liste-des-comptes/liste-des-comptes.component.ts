import { Component, OnInit } from '@angular/core';
import { IndividualAccount } from 'src/app/models/lemonway/IndividualAccount';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-liste-des-comptes',
  templateUrl: './liste-des-comptes.component.html',
  styleUrls: ['./liste-des-comptes.component.scss']
})
export class ListeDesComptesComponent implements OnInit {

  loading: boolean = false;
  accounts: IndividualAccount[] = [];

  constructor(private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.onGetAllAccounts();
  }

  //Recupération de la liste des comptes
  onGetAllAccounts(): void 
  {
    this.paymentService.getAllAccountsv2()
                       .subscribe(
                        ((response: any) => { 
                          console.log('ok')
                      }),
                      ((error) => { console.log(error.message); }))
                       
  }

}
