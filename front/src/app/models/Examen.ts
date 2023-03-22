export class Examen {

    constructor(
        public _id?: string,
        public classe_id?: string[],
        public matiere_id?: string[],
        public formateur_id?: string,
        public date?: Date[],
        public type?: string,
        public note_max?: number,
        public coef?: number,
        public libelle?: string,
        public niveau?: string,
        public semestre?: string,
        public canEdit?: Boolean,
        public date_fin?: string
    ) { };

}