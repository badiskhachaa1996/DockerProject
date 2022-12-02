export class Devoir {

    constructor(
        public _id?: string,
        public libelle?: string,
        public description?: string,
        public groupe_id?: string,
        public formateur_id?: string,
        public date_rendu?: Date,
        public date_debut?: Date,
        public haveFiles?: Number
    ) { }

}