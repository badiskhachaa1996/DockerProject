export class CommercialPartenaire {
    constructor(
        public _id?:                    string,
        public partenaire_id?:          string,
        public user_id?:                string,
        public code_commercial_partenaire?:   string,
        public statut?:                   string,  
        public isAdmin?: boolean
    ){}
}