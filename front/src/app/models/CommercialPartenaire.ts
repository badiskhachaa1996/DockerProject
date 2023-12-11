import { Partenaire } from "./Partenaire";

export class CommercialPartenaire {
    constructor(
        public _id?: string,
        public partenaire_id?: any,
        public user_id?: any,
        public code_commercial_partenaire?: string,
        public statut?: string,
        public isAdmin?: boolean,
        public pays?: string,
        public whatsapp?: string,
        public contribution?: string,
        public localisation?: string,
        public pays_prospections?: string[],
        public etat_contrat?: string,
        public commissions?: { description: string, montant: number, _id: string }[],
        public contrat?: string

    ) { }
}