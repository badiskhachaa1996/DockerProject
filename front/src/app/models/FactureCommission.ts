import { Entreprise } from "./Entreprise";
import { Partenaire } from "./Partenaire";
import { User } from "./User";

export class FactureCommission {
    constructor(
        public numero?: string,
        public montant?: Number,
        public tva?: Number,
        public statut?: string,
        public nature?: string,
        public date_paiement?: Date,
        public partenaire_id?: Partenaire,
        public factureUploaded?: Boolean,
        public _id?: string
    ) { }

}