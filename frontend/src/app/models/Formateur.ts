export class Formateur{

    constructor(
        public _id?:                string,
        public user_id?:            string,
        public statut?:             string,
        public type_contrat?:       string,
        public taux_h?:             number,
        public taux_j?:             number,
        public isInterne?:          boolean,
        public prestataire_id?:     string
    ){}

}