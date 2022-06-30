export class Examen {

    constructor(
        public _id?: string,
        public classe_id?: string,
        public matiere_id?: string,
        public formateur_id?: string,
        public date?: string,
        public type?: string,
        public note_max?: string,
        public coef?: string,
        public libelle?: string,
    ){};

}