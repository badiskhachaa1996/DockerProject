export class Formateur {

    constructor(
        public _id?: string,
        public user_id?: string,
        public type_contrat?: string,
        public taux_h?: number,
        public taux_j?: number,
        public prestataire_id?: string,
        public volume_h?: any,
        public volume_h_consomme?: any,
        public monday_available?: any,
        public tuesday_available?: any,
        public wednesday_available?: any,
        public thursday_available?: any,
        public friday_available?: any,
        public remarque?: string,
        public campus_id?: string,
        public nda?: string,
        public IsJury?: any,
    ) { }

}