import { Entreprise } from "./Entreprise";
import { Partenaire } from "./Partenaire";
import { Prospect } from "./Prospect";
import { User } from "./User";

export class Vente {
    constructor(
        public prospect_id?: Prospect,
        public produit?: string,
        public montant?: Number,
        public tva?: Number,
        public statutCommission?: string,
        public date_reglement?: Date,
        public montant_paye?: Number,
        public date_paiement?: Date,
        public modalite_paiement?: string,
        public partenaire_id?: Partenaire,
        public _id?: string
    ) { }

}