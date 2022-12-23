export class FactureFormateurMensuel {

    constructor(
        public _id?: string,
        public formateur_id?: any,
        public mois?: String,
        public date_creation?: Date,
        public year?: String,
        public remarque?: string,
        public nombre_heure?: Number
    ) { };

}