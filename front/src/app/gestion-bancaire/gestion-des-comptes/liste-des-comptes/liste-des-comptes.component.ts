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
  }

  //Recupération de la liste des comptes
  onGetAllAccounts(): void 
  {
    this.paymentService.getAllAccounts()
                       .then((response: any) => { 
                          response.forEach((account) => {
                            this.accounts.push(account);
                        });
                      })
                       .catch((error) => { console.log(error); })
  }

}
