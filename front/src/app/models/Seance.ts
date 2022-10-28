export class Seance {

    constructor(
        public _id?: string,
        public classe_id?: string[],
        public matiere_id?: string,
        public libelle?: string,
        public date_debut?: Date,
        public date_fin?: Date,
        public formateur_id?: string,
        public infos?: string,
        public isPresentiel?: string,
        public salle_name?: string,
        public isPlanified?: Boolean,
        public campus_id?: string,
        public nbseance?: number,
        public fileRight?: any[],
        public remarque?: string,
        public seance_type?: string
    ) { }
}








