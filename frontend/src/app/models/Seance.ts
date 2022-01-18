export class Seance {

    constructor(
        public _id?:        string,
        public classe_id?:  string,
        public matiere_id?:  string,
        public libelle?:    string,
        public date_debut?: Date,
        public date_fin?:   Date,
        public formateur_id?: string,
        public infos?: string,
    ){}

}